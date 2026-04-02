import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { MessageSquare, ThumbsUp, ThumbsDown, Reply, Trash2, Send, ShieldAlert, Flag } from "lucide-react";
import { toast } from "sonner";

import { motion } from "framer-motion";

interface GameCommentsProps {
  gameId: string;
}

export function GameComments({ gameId }: GameCommentsProps) {
  const { user, profile, isAdmin } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [content, setContent] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [lastPostTime, setLastPostTime] = useState(0);

  const { data: comments = [] } = useQuery({
    queryKey: ["comments", gameId],
    queryFn: async () => {
      const { data } = await supabase
        .from("game_comments")
        .select(`
          *,
          profiles:user_id(display_name, avatar_url, is_vip, badges),
          reactions:comment_reactions(user_id, reaction_type)
        `)
        .eq("game_id", gameId)
        .is("parent_id", null)
        .order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const { data: replies = [] } = useQuery({
    queryKey: ["replies", gameId],
    queryFn: async () => {
      const { data } = await supabase
        .from("game_comments")
        .select(`
          *,
          profiles:user_id(display_name, avatar_url, is_vip, badges),
          reactions:comment_reactions(user_id, reaction_type)
        `)
        .eq("game_id", gameId)
        .not("parent_id", "is", null)
        .order("created_at", { ascending: true });
      return data ?? [];
    },
  });

  const postComment = useMutation({
    mutationFn: async ({ text, parentId }: { text: string; parentId?: string }) => {
      if (!user) return;
      
      // Anti-spam check (5 seconds)
      const now = Date.now();
      if (now - lastPostTime < 5000) {
        throw new Error("Aguarde um pouco antes de postar novamente.");
      }

      const { error } = await supabase.from("game_comments").insert({
        user_id: user.id,
        game_id: gameId,
        content: text,
        parent_id: parentId || null,
      });
      if (error) throw error;
      setLastPostTime(now);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", gameId] });
      queryClient.invalidateQueries({ queryKey: ["replies", gameId] });
      setContent("");
      setReplyContent("");
      setReplyTo(null);
      toast.success("Comentário enviado!");
    },
    onError: (err: any) => {
      toast.error(err.message);
    }
  });

  const toggleReaction = useMutation({
    mutationFn: async ({ commentId, type }: { commentId: string; type: 'like' | 'dislike' }) => {
      if (!user) return navigate("/login");

      const { data: existing } = await supabase
        .from("comment_reactions")
        .select("*")
        .eq("user_id", user.id)
        .eq("comment_id", commentId)
        .maybeSingle();

      if (existing) {
        if (existing.reaction_type === type) {
          // Remove if clicking same type
          await supabase.from("comment_reactions").delete().eq("id", existing.id);
        } else {
          // Update if clicking different type
          await supabase.from("comment_reactions").update({ reaction_type: type }).eq("id", existing.id);
        }
      } else {
        // Insert new
        await supabase.from("comment_reactions").insert({
          user_id: user.id,
          comment_id: commentId,
          reaction_type: type
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", gameId] });
      queryClient.invalidateQueries({ queryKey: ["replies", gameId] });
    }
  });

  const deleteComment = useMutation({
    mutationFn: async (commentId: string) => {
      await supabase.from("game_comments").delete().eq("id", commentId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", gameId] });
      queryClient.invalidateQueries({ queryKey: ["replies", gameId] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return navigate("/login");
    if (!content.trim()) return;
    postComment.mutate({ text: content.trim() });
  };

  const handleReply = (parentId: string) => {
    if (!user) return navigate("/login");
    if (!replyContent.trim()) return;
    postComment.mutate({ text: replyContent.trim(), parentId });
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20">
            <MessageSquare className="w-6 h-6 text-primary" />
          </div>
          <div className="flex flex-col">
            <h2 className="text-2xl font-black uppercase tracking-tight">Taberna de Discussão</h2>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest opacity-60">{comments.length + replies.length} Mensagens na Garrafa</p>
          </div>
        </div>
      </div>

      {/* Post comment */}
      <motion.form 
        onSubmit={handleSubmit} 
        className="flex flex-col gap-4 p-6 bg-card border-2 border-border rounded-[2rem] shadow-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={user ? "O que você achou desse tesouro?" : "Faça login para compartilhar sua opinião..."}
          className="w-full px-6 py-4 bg-muted/30 border border-border rounded-2xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all min-h-[120px] resize-none"
          disabled={!user}
        />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-50">
            <ShieldAlert className="w-3 h-3" />
            <span>Respeite a tripulação. Evite spam.</span>
          </div>
          <button
            type="submit"
            disabled={!user || !content.trim() || postComment.isPending}
            className="px-10 py-4 rounded-xl bg-primary text-primary-foreground font-black uppercase tracking-[0.2em] text-xs hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-3 shadow-lg shadow-primary/20 hover:-translate-y-1 active:scale-95"
          >
            {postComment.isPending ? "Postando..." : (
              <>
                <span>Lançar Comentário</span>
                <Send className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </motion.form>

      {/* Comments list */}
      <div className="space-y-6">
        {comments.map((comment: any) => {
          const commentReplies = replies.filter((r: any) => r.parent_id === comment.id);
          const profileData = comment.profiles as any;
          return (
            <div key={comment.id} className="bg-card border border-border rounded-xl p-5 space-y-4 shadow-sm hover:border-primary/20 transition-all group">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl overflow-hidden bg-primary/10 border border-primary/20 flex items-center justify-center relative">
                    {profileData?.avatar_url ? (
                      <img src={profileData.avatar_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-primary font-black uppercase text-lg">{(profileData?.display_name || "U")[0]}</span>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-sm uppercase tracking-tight">{profileData?.display_name || "Jogador Anônimo"}</span>
                      {profileData?.is_vip && (
                        <span className="bg-yellow-500/10 text-yellow-500 text-[8px] font-black px-1.5 py-0.5 rounded border border-yellow-500/20 uppercase tracking-widest">VIP</span>
                      )}
                      {profileData?.badges?.slice(0, 1).map((b: string, i: number) => (
                        <span key={i} className="bg-primary/10 text-primary text-[8px] font-black px-1.5 py-0.5 rounded border border-primary/20 uppercase tracking-widest">{b}</span>
                      ))}
                    </div>
                    <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest opacity-60">{formatDate(comment.created_at)}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {(comment.user_id === user?.id || isAdmin) && (
                    <button 
                      onClick={() => {
                        if (confirm("Deseja apagar este comentário?")) deleteComment.mutate(comment.id);
                      }} 
                      className="p-2 rounded-xl hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all"
                      title="Excluir"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  <button className="p-2 rounded-xl hover:bg-muted text-muted-foreground hover:text-orange-500 transition-all" title="Denunciar">
                    <Flag className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-sm leading-relaxed text-foreground/90 pl-[52px]">
                {comment.content}
              </p>

              <div className="flex items-center gap-4 pl-[52px] pt-2">
                <div className="flex items-center gap-1 border border-border rounded-lg p-0.5">
                  <button 
                    onClick={() => toggleReaction.mutate({ commentId: comment.id, type: 'like' })}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${comment.reactions?.some((r: any) => r.user_id === user?.id && r.reaction_type === 'like') ? 'bg-primary/10 text-primary' : 'hover:bg-muted text-muted-foreground'}`}
                  >
                    <ThumbsUp className={`w-3.5 h-3.5 ${comment.reactions?.some((r: any) => r.user_id === user?.id && r.reaction_type === 'like') ? 'fill-primary' : ''}`} />
                    <span className="text-[10px] font-black">{comment.likes || 0}</span>
                  </button>
                  <div className="w-px h-4 bg-border" />
                  <button 
                    onClick={() => toggleReaction.mutate({ commentId: comment.id, type: 'dislike' })}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${comment.reactions?.some((r: any) => r.user_id === user?.id && r.reaction_type === 'dislike') ? 'bg-destructive/10 text-destructive' : 'hover:bg-muted text-muted-foreground'}`}
                  >
                    <ThumbsDown className={`w-3.5 h-3.5 ${comment.reactions?.some((r: any) => r.user_id === user?.id && r.reaction_type === 'dislike') ? 'fill-destructive' : ''}`} />
                    <span className="text-[10px] font-black">{comment.dislikes || 0}</span>
                  </button>
                </div>

                <button 
                  onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)} 
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border text-[10px] font-black uppercase tracking-widest transition-all ${replyTo === comment.id ? 'bg-primary text-primary-foreground border-primary' : 'hover:bg-muted text-muted-foreground'}`}
                >
                  <Reply className="w-3.5 h-3.5" />
                  Responder
                </button>
              </div>

              {/* Replies */}
              {commentReplies.length > 0 && (
                <div className="ml-[52px] space-y-4 border-l-2 border-border/50 pl-6 mt-6">
                  {commentReplies.map((reply: any) => {
                    const replyProfile = reply.profiles as any;
                    return (
                      <div key={reply.id} className="space-y-2 group/reply">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-black text-xs uppercase tracking-tight">{replyProfile?.display_name || "Pirata"}</span>
                            {replyProfile?.is_vip && (
                              <span className="bg-yellow-500/10 text-yellow-500 text-[8px] font-black px-1.5 py-0.5 rounded border border-yellow-500/20 uppercase tracking-widest">VIP</span>
                            )}
                            <span className="text-[10px] text-muted-foreground opacity-60">• {formatDate(reply.created_at)}</span>
                          </div>
                          {(reply.user_id === user?.id || isAdmin) && (
                            <button onClick={() => deleteComment.mutate(reply.id)} className="p-1 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive opacity-0 group-hover/reply:opacity-100 transition-opacity">
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">{reply.content}</p>
                        
                        <div className="flex items-center gap-3 pt-1">
                          <button onClick={() => toggleReaction.mutate({ commentId: reply.id, type: 'like' })} className={`flex items-center gap-1 text-[10px] font-bold ${reply.reactions?.some((r: any) => r.user_id === user?.id && r.reaction_type === 'like') ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}>
                            <ThumbsUp className="w-3 h-3" /> {reply.likes || 0}
                          </button>
                          <button onClick={() => toggleReaction.mutate({ commentId: reply.id, type: 'dislike' })} className={`flex items-center gap-1 text-[10px] font-bold ${reply.reactions?.some((r: any) => r.user_id === user?.id && r.reaction_type === 'dislike') ? 'text-destructive' : 'text-muted-foreground hover:text-destructive'}`}>
                            <ThumbsDown className="w-3 h-3" /> {reply.dislikes || 0}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Reply form */}
              {replyTo === comment.id && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="ml-[52px] flex flex-col gap-3 p-4 bg-muted/30 rounded-2xl border border-border"
                >
                  <textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Escreva sua resposta para a tripulação..."
                    className="w-full px-4 py-3 bg-card border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[80px] resize-none"
                    autoFocus
                  />
                  <div className="flex justify-end gap-2">
                    <button onClick={() => setReplyTo(null)} className="px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest text-muted-foreground hover:bg-muted transition-all">Cancelar</button>
                    <button 
                      onClick={() => handleReply(comment.id)} 
                      disabled={!replyContent.trim() || postComment.isPending} 
                      className="px-6 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-black uppercase tracking-widest hover:bg-primary/90 disabled:opacity-50 transition-all shadow-lg shadow-primary/20"
                    >
                      {postComment.isPending ? "Enviando..." : "Responder"}
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          );
        })}
        {comments.length === 0 && (
          <p className="text-center text-muted-foreground py-8">Nenhum comentário ainda. Seja o primeiro!</p>
        )}
      </div>
    </div>
  );
}
