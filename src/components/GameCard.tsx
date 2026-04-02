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
    <div className="group bg-card rounded-2xl overflow-hidden border border-border hover:border-primary transition-all duration-500 relative flex flex-col h-full shadow-lg hover:shadow-primary/10">
      <Link to={`/jogo/${game.slug || game.id}`} className="block relative aspect-[3/4] overflow-hidden shrink-0">
        <img 
          src={game.imagem || "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800"} 
          alt={game.nome} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2000ms] ease-out" 
          loading="lazy" 
          onError={handleImageError}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-700" />
        <div className="absolute top-2 left-2 md:top-4 md:left-4 flex flex-wrap gap-1.5 md:gap-2">
          {game.categorias.slice(0, 2).map((cat) => (
            <Link 
              key={cat} 
              to={`/categoria/${cat}`}
              className="text-[8px] md:text-[10px] lg:text-xs uppercase font-extrabold px-2 md:px-3 py-1 md:py-1.5 rounded-lg bg-black/80 backdrop-blur-md text-white/95 border border-white/20 tracking-widest hover:bg-primary hover:text-white transition-all"
            >
              {cat}
            </Link>
          ))}
        </div>
      </Link>
      
      <div className="p-3.5 md:p-5 lg:p-6 flex flex-col flex-grow space-y-3 md:space-y-4 lg:space-y-5">
        <Link to={`/jogo/${game.slug || game.id}`} className="block group/title">
          <h3 className="font-bold text-xs sm:text-sm md:text-base lg:text-lg 2xl:text-xl line-clamp-2 group-hover:text-primary transition-colors duration-300 leading-snug h-10 md:h-12 lg:h-14">
            {game.nome}
          </h3>
        </Link>
        
        <div className="mt-auto space-y-4 md:space-y-5">
          <div className="flex items-center justify-between gap-2 border-t border-border pt-4">
            <div className="flex flex-col">
              <span className="text-[8px] md:text-[10px] lg:text-xs text-muted-foreground uppercase font-black tracking-[0.2em] leading-none mb-1.5">Preço</span>
              <span className="text-primary font-black text-base md:text-xl lg:text-2xl 2xl:text-3xl leading-none">
                {game.preco === 0 ? "GRÁTIS" : `R$ ${Number(game.preco).toFixed(2).replace(".", ",")}`}
              </span>
            </div>
          </div>
          
          <Link 
            to={`/jogo/${game.slug || game.id}`} 
            className="flex items-center justify-center gap-2 w-full py-2.5 md:py-3.5 lg:py-4 rounded-2xl font-bold text-[10px] md:text-xs lg:text-sm bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 shadow-xl shadow-primary/20 active:scale-95 group-hover:translate-y-[-2px]"
          >
            <Info className="w-3.5 md:w-4 lg:w-5 h-3.5 md:h-4 lg:h-5" />
            <span className="tracking-widest uppercase">DETALHES</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
