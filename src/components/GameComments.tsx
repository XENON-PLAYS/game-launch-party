import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router-dom";
import { MessageSquare, Send, Trash2, Flag, ShieldAlert, Loader2, User } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface GameCommentsProps {
  gameId: string;
}

export function GameComments({ gameId }: GameCommentsProps) {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [content, setContent] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Fetch initial comments
  const { data: comments = [], isLoading, isError } = useQuery({
    queryKey: ["comments", gameId],
    queryFn: async () => {
      // Primeiro busca os comentários
      const { data: comments, error: commentsError } = await supabase
        .from("game_comments")
        .select("*")
        .eq("game_id", gameId)
        .order("created_at", { ascending: true })
        .limit(100);
      
      if (commentsError) throw commentsError;
      if (!comments || comments.length === 0) return [];

      // Depois busca os perfis relacionados separadamente (abordagem alternativa sem join)
      const userIds = [...new Set(comments.map(c => c.user_id))];
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("user_id, display_name, avatar_url, is_vip, badges, status")
        .in("user_id", userIds);

      if (profilesError) {
        console.error("Erro ao carregar perfis:", profilesError);
        return comments;
      }

      // Une os dados
      return comments.map(comment => ({
        ...comment,
        profiles: profiles.find(p => p.user_id === comment.user_id)
      }));
    },
  });

  // Real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel(`game_comments_${gameId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "game_comments",
          filter: `game_id=eq.${gameId}`,
        },
        () => {
          // Re-fetch comments when anything changes
          queryClient.invalidateQueries({ queryKey: ["comments", gameId] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [gameId, queryClient]);

  // Scroll to bottom when comments change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [comments]);

  const postComment = useMutation({
    mutationFn: async (text: string) => {
      if (!user) throw new Error("Você precisa estar logado para enviar mensagens.");
      
      const { error } = await supabase.from("game_comments").insert({
        user_id: user.id,
        game_id: gameId,
        content: text.trim(),
      });
      
      if (error) throw error;
    },
    onSuccess: () => {
      setContent("");
      // Success is handled by real-time subscription auto-refetch
    },
    onError: (err: any) => {
      toast.error(err.message || "Erro ao enviar mensagem");
    }
  });

  const deleteComment = useMutation({
    mutationFn: async (commentId: string) => {
      const { error } = await supabase.from("game_comments").delete().eq("id", commentId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Mensagem removida");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return navigate("/login");
    if (!content.trim() || postComment.isPending) return;
    postComment.mutate(content.trim());
  };

  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), "HH:mm", { locale: ptBR });
    } catch (e) {
      return "";
    }
  };

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
        <div className="p-4 rounded-full bg-destructive/10 text-destructive">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <p className="text-muted-foreground font-medium">Erro ao carregar o chat. Tente novamente.</p>
        <button 
          onClick={() => queryClient.invalidateQueries({ queryKey: ["comments", gameId] })}
          className="text-primary hover:underline text-sm font-bold uppercase tracking-widest"
        >
          Recarregar
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[600px] bg-card/50 backdrop-blur-sm border border-border rounded-3xl overflow-hidden shadow-2xl relative">
      {/* Chat Header */}
      <div className="p-6 border-b border-border bg-card flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20">
            <MessageSquare className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-black uppercase tracking-tight text-sm">Chat da Tripulação</h3>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Tempo Real Ativado</span>
            </div>
          </div>
        </div>
        <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest bg-muted/50 px-3 py-1.5 rounded-lg border border-border">
          {comments.length} Mensagens
        </div>
      </div>

      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent hover:scrollbar-thumb-primary/40 transition-colors"
      >
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full space-y-3 opacity-50">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-xs font-bold uppercase tracking-[0.2em]">Sincronizando com a frota...</p>
          </div>
        ) : comments.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-40">
            <div className="p-6 rounded-full bg-muted border-2 border-dashed border-border">
              <MessageSquare className="w-12 h-12" />
            </div>
            <div className="space-y-1">
              <p className="font-black uppercase tracking-widest text-xs">Nenhum sussurro no mar</p>
              <p className="text-[10px] font-bold uppercase tracking-widest">Seja o primeiro a enviar uma mensagem!</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <AnimatePresence initial={false}>
              {comments.map((comment: any) => {
                const isMe = comment.user_id === user?.id;
                const profile = comment.profiles;
                
                return (
                  <motion.div
                    key={comment.id}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className={`flex items-start gap-3 ${isMe ? "flex-row-reverse" : "flex-row"}`}
                  >
                    {/* Avatar */}
                    <Link 
                      to={profile?.user_id ? `/perfil/${profile.user_id}` : "#"}
                      className={`shrink-0 w-8 h-8 rounded-lg border-2 overflow-hidden flex items-center justify-center bg-muted transition-all duration-300 hover:scale-110 active:scale-95 ${isMe ? "border-primary/50" : "border-border hover:border-primary/50"}`}
                    >
                      {profile?.avatar_url ? (
                        <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <User className={`w-4 h-4 ${isMe ? "text-primary" : "text-muted-foreground"}`} />
                      )}
                    </Link>

                    {/* Content */}
                    <div className={`flex flex-col max-w-[80%] space-y-1 ${isMe ? "items-end" : "items-start"}`}>
                      {/* Name and Date */}
                      <div className={`flex items-center gap-2 px-1 ${isMe ? "flex-row-reverse" : "flex-row"}`}>
                        <Link 
                          to={profile?.user_id ? `/perfil/${profile.user_id}` : "#"}
                          className={`text-[10px] font-black uppercase tracking-widest hover:underline ${isMe ? "text-primary" : "text-muted-foreground hover:text-primary transition-colors"}`}
                        >
                          {profile?.display_name || "Anônimo"}
                        </Link>
                        {profile?.is_vip && (
                          <span className="bg-yellow-500/10 text-yellow-500 text-[8px] font-black px-1 py-0.5 rounded border border-yellow-500/20 uppercase">VIP</span>
                        )}
                        <span className="text-[9px] font-bold text-muted-foreground/50 uppercase">
                          {formatDate(comment.created_at)}
                        </span>
                      </div>

                      {/* Bubble */}
                      <div className={`relative group p-4 rounded-2xl text-sm leading-relaxed shadow-sm transition-all duration-300 border ${
                        isMe 
                          ? "bg-primary text-primary-foreground border-primary rounded-tr-none shadow-lg shadow-primary/10" 
                          : "bg-muted/50 text-foreground border-border rounded-tl-none hover:bg-muted/80"
                      }`}>
                        {comment.content}

                        {/* Actions overlay for own messages or admin */}
                        {(isMe || isAdmin) && (
                          <button 
                            onClick={() => {
                              if (window.confirm("Remover esta mensagem?")) deleteComment.mutate(comment.id);
                            }}
                            className={`absolute -top-2 ${isMe ? "-left-2" : "-right-2"} p-1.5 rounded-lg bg-card border border-border text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-all shadow-xl active:scale-90`}
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-6 bg-card border-t border-border">
        <form onSubmit={handleSubmit} className="relative">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder={user ? "Escreva seu sussurro aqui..." : "Faça login para participar da conversa"}
            disabled={!user || postComment.isPending}
            className="w-full px-6 py-4 bg-muted/30 border border-border rounded-2xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all min-h-[60px] max-h-[120px] resize-none pr-16"
          />
          <button
            type="submit"
            disabled={!user || !content.trim() || postComment.isPending}
            className="absolute right-3 bottom-3 p-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5 active:scale-90"
          >
            {postComment.isPending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </form>
        <div className="mt-3 flex items-center justify-between px-2">
          <div className="flex items-center gap-1.5 opacity-50">
            <ShieldAlert className="w-3 h-3 text-muted-foreground" />
            <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Chat moderado pela frota</span>
          </div>
          {!user && (
            <button 
              onClick={() => navigate("/login")}
              className="text-[9px] font-black text-primary uppercase tracking-widest hover:underline"
            >
              Fazer Login agora
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
