import { Link } from "react-router-dom";
import { Download } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";

type Game = Tables<"games">;

interface GameCardProps {
  game: Game;
}

export function GameCard({ game }: GameCardProps) {
  return (
    <div className="group bg-card rounded-xl overflow-hidden border border-border hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
      <Link to={`/jogo/${game.id}`} className="block relative aspect-[3/4] overflow-hidden">
        <img src={game.imagem || ""} alt={game.nome} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute top-2 left-2 flex flex-wrap gap-1">
          {game.categorias.slice(0, 2).map((cat) => (
            <span key={cat} className="text-[10px] px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm text-white/90 border border-white/10">{cat}</span>
          ))}
        </div>
      </Link>
      <div className="p-3 space-y-2">
        <Link to={`/jogo/${game.id}`}>
          <h3 className="font-bold text-sm truncate hover:text-primary transition-colors">{game.nome}</h3>
        </Link>
        <div className="flex items-center justify-between">
          <span className="text-primary font-bold text-sm">
            {game.preco === 0 ? "Grátis" : `R$ ${Number(game.preco).toFixed(2).replace(".", ",")}`}
          </span>
          <Link to={`/jogo/${game.id}`} className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg font-medium bg-primary hover:bg-primary/90 text-primary-foreground transition-all">
            <Download className="w-3 h-3" /> Ver
          </Link>
        </div>
      </div>
    </div>
  );
}
