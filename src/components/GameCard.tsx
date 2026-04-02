import { Link } from "react-router-dom";
import { Info, Plus } from "lucide-react";
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
      whileHover={{ y: -12 }}
      transition={{ duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
      className="group bg-card rounded-[2rem] overflow-hidden border border-border/50 hover:border-primary/50 transition-all duration-700 relative flex flex-col h-full shadow-2xl shadow-black/20 hover:shadow-primary/10"
    >
      <Link to={`/jogo/${game.slug || game.id}`} className="block relative aspect-[3/4] overflow-hidden shrink-0 m-2 rounded-[1.5rem]">
        <img 
          src={game.imagem || "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800"} 
          alt={game.nome} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[3000ms] ease-out" 
          loading="lazy" 
          onError={handleImageError}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-700" />
        
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          {(game.categorias || []).slice(0, 1).map((cat) => (
            <span 
              key={cat} 
              className="text-[10px] uppercase font-bold px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-xl text-white border border-white/10 tracking-widest"
            >
              {cat}
            </span>
          ))}
        </div>

        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
          <div className="bg-primary p-3 rounded-2xl shadow-2xl shadow-primary/40">
            <Plus className="w-5 h-5 text-white" />
          </div>
        </div>
      </Link>
      
      <div className="p-6 flex flex-col flex-grow">
        <Link to={`/jogo/${game.slug || game.id}`} className="block group/title mb-4">
          <h3 className="font-extrabold text-base lg:text-lg line-clamp-2 group-hover/title:text-primary transition-colors duration-300 leading-tight">
            {game.nome}
          </h3>
        </Link>
        
        <div className="mt-auto pt-4 border-t border-border/40 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest leading-none mb-2 opacity-60">Investimento</span>
            <span className="text-primary font-black text-xl lg:text-2xl leading-none">
              {game.preco === 0 ? "GRÁTIS" : `R$ ${Number(game.preco).toFixed(2).replace(".", ",")}`}
            </span>
          </div>
          
          <Link 
            to={`/jogo/${game.slug || game.id}`} 
            className="p-3 rounded-2xl bg-secondary hover:bg-primary hover:text-primary-foreground transition-all duration-500"
          >
            <Info className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}