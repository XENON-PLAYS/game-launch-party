import { useState } from "react";
import { Star } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

interface StarRatingProps {
  gameId: string;
}

export function StarRating({ gameId }: StarRatingProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { slug } = useParams();
  const queryClient = useQueryClient();
  const [hover, setHover] = useState(0);

  const { data: userRating } = useQuery({
    queryKey: ["user-rating", gameId, user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data } = await supabase
        .from("game_ratings")
        .select("rating")
        .eq("user_id", user.id)
        .eq("game_id", gameId)
        .maybeSingle();
      return data?.rating ?? null;
    },
    enabled: !!user,
  });

  const mutation = useMutation({
    mutationFn: async (rating: number) => {
      if (!user) return;
      const { data: existing } = await supabase
        .from("game_ratings")
        .select("id")
        .eq("user_id", user.id)
        .eq("game_id", gameId)
        .maybeSingle();

      if (existing) {
        await supabase.from("game_ratings").update({ rating }).eq("id", existing.id);
      } else {
        await supabase.from("game_ratings").insert({ user_id: user.id, game_id: gameId, rating });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-rating", gameId] });
      queryClient.invalidateQueries({ queryKey: ["avg-rating", gameId] });
      queryClient.invalidateQueries({ queryKey: ["game", slug] });
      toast.success("Avaliação enviada!");
    },
    onError: (err: any) => {
      toast.error("Erro ao enviar avaliação: " + err.message);
    }
  });

  const handleRate = (rating: number) => {
    if (!user) return navigate("/login");
    mutation.mutate(rating);
  };

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-bold">Sua Avaliação</h2>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((s) => (
          <button
            key={s}
            onClick={() => handleRate(s)}
            onMouseEnter={() => setHover(s)}
            onMouseLeave={() => setHover(0)}
            className="p-1 transition-transform hover:scale-110"
          >
            <Star
              className={`w-8 h-8 transition-colors ${
                s <= (hover || userRating || 0)
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-muted-foreground/30"
              }`}
            />
          </button>
        ))}
        {userRating && <span className="ml-2 text-sm text-muted-foreground">Você avaliou: {userRating}/5</span>}
      </div>
    </div>
  );
}
