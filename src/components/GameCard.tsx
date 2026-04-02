import { Link } from "react-router-dom";
import { Info } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";
import { motion } from "framer-motion";

type Game = Tables<"games">;

interface GameCardProps {
  game: Game;
}

export function GameCard({ game }: GameCardProps) {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800";
  };

  return (
    <motion.div 
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="group bg-card/60 backdrop-blur-sm rounded-xl overflow-hidden border border-primary/10 hover:border-primary/60 transition-all duration-300 relative flex flex-col h-full shadow-md hover:shadow-xl"
    >
      <Link to={`/jogo/${game.slug || game.id}`} className="block relative aspect-[3/4] overflow-hidden shrink-0">
        <img 
          src={game.imagem || "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800"} 
          alt={game.nome} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" 
          loading="lazy" 
          onError={handleImageError}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
        
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {(game.categorias || []).slice(0, 1).map((cat) => (
            <span 
              key={cat} 
              className="text-[10px] uppercase font-bold px-2.5 py-1 rounded bg-black/70 backdrop-blur-md text-white border border-white/10 tracking-wider"
            >
              {cat}
            </span>
          ))}
        </div>
      </Link>
      
      <div className="p-4 flex flex-col flex-grow">
        <Link to={`/jogo/${game.slug || game.id}`} className="block group/title mb-2">
          <h3 className="font-bold text-sm lg:text-base line-clamp-2 group-hover/title:text-primary transition-colors duration-200 leading-tight">
            {game.nome}
          </h3>
        </Link>
        
        <div className="mt-auto pt-3 border-t border-border/30 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest leading-none mb-1.5 opacity-60">Valor</span>
            <span className={`font-black text-base lg:text-lg leading-none ${game.preco === 0 ? "text-primary" : "text-foreground"}`}>
              {game.preco === 0 ? "GRÁTIS" : `R$ ${Number(game.preco).toFixed(2).replace(".", ",")}`}
            </span>
          </div>
          
          <Link 
            to={`/jogo/${game.slug || game.id}`} 
            className="p-2.5 rounded-lg bg-secondary/80 hover:bg-primary hover:text-primary-foreground transition-all duration-300"
          >
            <Info className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
