import { Link } from "react-router-dom";
import { Info } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";

type Game = Tables<"games">;

interface GameCardProps {
  game: Game;
}

export function GameCard({ game }: GameCardProps) {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800";
  };

  return (
    <div className="group bg-card rounded-xl overflow-hidden border border-border hover:border-primary transition-all duration-300 relative flex flex-col h-full">
      <Link to={`/jogo/${game.slug || game.id}`} className="block relative aspect-[3/4] overflow-hidden shrink-0">
        <img 
          src={game.imagem || "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800"} 
          alt={game.nome} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1500ms]" 
          loading="lazy" 
          onError={handleImageError}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute top-2 left-2 md:top-3 md:left-3 flex flex-wrap gap-1.5">
          {game.categorias.slice(0, 2).map((cat) => (
            <Link 
              key={cat} 
              to={`/categoria/${cat}`}
              className="text-[8px] md:text-[10px] uppercase font-bold px-2 md:px-2.5 py-0.5 md:py-1 rounded bg-black/80 backdrop-blur-md text-white/90 border border-white/10 tracking-wider hover:bg-primary/20 transition-colors"
            >
              {cat}
            </Link>
          ))}
        </div>
      </Link>
      
      <div className="p-3 md:p-4 flex flex-col flex-grow space-y-2 md:space-y-3">
        <Link to={`/jogo/${game.slug || game.id}`} className="block">
          <h3 className="font-bold text-xs sm:text-sm md:text-base line-clamp-2 group-hover:text-primary transition-colors duration-300 leading-tight h-8 md:h-10">
            {game.nome}
          </h3>
        </Link>
        
        <div className="mt-auto space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex flex-col">
              <span className="text-[8px] md:text-[10px] text-muted-foreground uppercase font-bold tracking-widest leading-none mb-1">Preço</span>
              <span className="text-primary font-bold text-base md:text-xl leading-none">
                {game.preco === 0 ? "GRÁTIS" : `R$ ${Number(game.preco).toFixed(2).replace(".", ",")}`}
              </span>
            </div>
          </div>
          
          <Link 
            to={`/jogo/${game.slug || game.id}`} 
            className="flex items-center justify-center gap-2 w-full py-2 md:py-2.5 rounded-xl font-bold text-[10px] md:text-xs bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 shadow-lg shadow-primary/20 active:scale-95"
          >
            <Info className="w-3 md:w-3.5 h-3 md:h-3.5" />
            <span>VER DETALHES</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
