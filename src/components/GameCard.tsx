import { Link } from "react-router-dom";
import { Download, ShoppingCart } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";

type Game = Tables<"games">;

interface GameCardProps {
  game: Game;
}

export function GameCard({ game }: GameCardProps) {
  const { addItem } = useCart();

  return (
    <div className="group bg-card rounded-xl overflow-hidden border border-border hover:border-primary transition-all duration-300 relative">
      <Link to={`/jogo/${game.id}`} className="block relative aspect-[3/4] overflow-hidden">
        <img 
          src={game.imagem || ""} 
          alt={game.nome} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1500ms]" 
          loading="lazy" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          {game.categorias.slice(0, 2).map((cat) => (
            <span key={cat} className="text-[10px] uppercase font-bold px-2.5 py-1 rounded bg-black/80 backdrop-blur-md text-white/90 border border-white/10 tracking-wider">
              {cat}
            </span>
          ))}
        </div>
      </Link>
      
      <div className="p-4 space-y-3">
        <Link to={`/jogo/${game.id}`}>
          <h3 className="font-bold text-sm md:text-base line-clamp-1 group-hover:text-primary transition-colors duration-300 leading-tight">
            {game.nome}
          </h3>
        </Link>
        
        <div className="flex items-center justify-between gap-2 pt-1">
          <div className="flex flex-col">
            <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest leading-none mb-1">Preço</span>
            <span className="text-primary font-bold text-lg md:text-xl leading-none">
              {game.preco === 0 ? "GRÁTIS" : `R$ ${Number(game.preco).toFixed(2).replace(".", ",")}`}
            </span>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={(e) => {
                e.preventDefault();
                addItem(game);
              }}
              className="p-2 rounded-xl bg-secondary/50 hover:bg-primary hover:text-primary-foreground transition-all duration-300 border border-white/5"
              title="Adicionar ao carrinho"
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
            <Link 
              to={`/jogo/${game.id}`} 
              className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 shadow-lg shadow-primary/20"
            >
              <Download className="w-3.5 h-3.5" />
              <span>VER</span>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
