import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { MessageSquare, ThumbsUp, ThumbsDown, Reply, Trash2, Send, ShieldAlert, Flag } from "lucide-react";
import { toast } from "sonner";

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
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <MessageSquare className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-bold">Comentários ({comments.length})</h2>
      </div>

      {/* Post comment */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={user ? "Escreva um comentário..." : "Faça login para comentar"}
          className="flex-1 px-4 py-3 bg-card border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          disabled={!user}
        />
        <button
          type="submit"
          disabled={!user || !content.trim()}
          className="px-4 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

      {/* Comments list */}
      <div className="space-y-4">
        {comments.map((comment: any) => {
          const commentReplies = replies.filter((r: any) => r.parent_id === comment.id);
          const profileData = comment.profiles as any;
          return (
            <div key={comment.id} className="bg-card border border-border rounded-xl p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                    {(profileData?.display_name || "U")[0].toUpperCase()}
                  </div>
                  <div>
                    <span className="font-bold text-sm">{profileData?.display_name || "Usuário"}</span>
                    <span className="text-xs text-muted-foreground ml-2">{formatDate(comment.created_at)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)} className="p-1.5 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground">
                    <Reply className="w-4 h-4" />
                  </button>
                  {(comment.user_id === user?.id || isAdmin) && (
                    <button onClick={() => deleteComment.mutate(comment.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
              <p className="text-sm leading-relaxed">{comment.content}</p>

              {/* Replies */}
              {commentReplies.length > 0 && (
                <div className="ml-6 space-y-3 border-l-2 border-border pl-4">
                  {commentReplies.map((reply: any) => {
                    const replyProfile = reply.profiles as any;
                    return (
                      <div key={reply.id} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs">{replyProfile?.display_name || "Usuário"}</span>
                            <span className="text-xs text-muted-foreground">{formatDate(reply.created_at)}</span>
                          </div>
                          {(reply.user_id === user?.id || isAdmin) && (
                            <button onClick={() => deleteComment.mutate(reply.id)} className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive">
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{reply.content}</p>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Reply form */}
              {replyTo === comment.id && (
                <div className="ml-6 flex gap-2">
                  <input
                    type="text"
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Escreva uma resposta..."
                    className="flex-1 px-3 py-2 bg-secondary border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    autoFocus
                  />
                  <button onClick={() => handleReply(comment.id)} disabled={!replyContent.trim()} className="px-3 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 disabled:opacity-50">
                    Responder
                  </button>
                </div>
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
