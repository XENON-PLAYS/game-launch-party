import { Link } from "react-router-dom";
import { Info, Star } from "lucide-react";
import { Database } from "@/integrations/supabase/types";
import { motion } from "framer-motion";
import { optimizeImageUrl } from "@/lib/utils";
import React from "react";

type Game = Database["public"]["Tables"]["games"]["Row"];


interface GameCardProps {
  game: Game;
}

export const GameCard = React.memo(({ game }: GameCardProps) => {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800";
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="group bg-card/40 backdrop-blur-md rounded-2xl overflow-hidden border border-border hover:border-primary/40 transition-all duration-500 relative flex flex-col h-full shadow-lg hover:shadow-primary/10"
    >
      <Link to={`/jogo/${game.slug || game.id}`} className="block relative aspect-[3/4] overflow-hidden shrink-0 rounded-2xl m-2">
        <img 
          src={optimizeImageUrl(game.vertical_image || game.imagem || "https://images.unsplash.com/photo-1550745165-9bc0b252726f", 400)} 
          alt={game.nome} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" 
          loading="lazy"
          decoding="async"
          width={300}
          height={400}
          sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 184px"
          onError={handleImageError}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
        
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {game.preco === 0 && (
            <span className="text-[10px] uppercase font-black px-2.5 py-1 rounded bg-primary text-primary-foreground border border-primary/20 tracking-wider shadow-lg shadow-primary/40 animate-pulse">
              GRÁTIS
            </span>
          )}
          {(game.categorias || []).slice(0, 1).map((cat) => (
            <span 
              key={cat} 
              className="text-[9px] uppercase font-black px-2.5 py-1 rounded-lg bg-black/60 dark:bg-black/40 backdrop-blur-md text-white border border-white/10 tracking-widest"
            >
              {cat}
            </span>
          ))}
          {(game.rating_avg !== null && game.rating_avg > 0) && (
            <span className="text-[10px] uppercase font-bold px-2.5 py-1 rounded bg-yellow-500/80 backdrop-blur-md text-white border border-yellow-500/20 tracking-wider flex items-center gap-1">
              <Star className="w-3 h-3 fill-white" />
              {game.rating_avg}
            </span>
          )}
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
            <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest leading-none mb-1.5 opacity-60">Tesouro</span>
            <span className={`font-black text-base lg:text-lg leading-none flex items-center gap-2 ${game.preco === 0 ? "text-primary" : "text-foreground"}`}>
              {game.preco === 0 && (
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
              )}
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
});

GameCard.displayName = "GameCard";