import { Tables } from "@/integrations/supabase/types";
import { GameCard } from "./GameCard";
import { Flame, Star, Clock, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

type Game = Tables<"games">;

interface GameSectionProps {
  title: string;
  icon: "flame" | "star" | "clock";
  games: Game[];
}

const icons = { 
  flame: { icon: Flame, color: "text-orange-500", bg: "bg-orange-500/10", border: "border-orange-500/20" }, 
  star: { icon: Star, color: "text-yellow-500", bg: "bg-yellow-500/10", border: "border-yellow-500/20" }, 
  clock: { icon: Clock, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20" } 
};

export function GameSection({ title, icon, games }: GameSectionProps) {
  const config = icons[icon];
  const Icon = config.icon;
  
  if (games.length === 0) return null;

  return (
    <motion.section 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="space-y-8 py-8 md:py-12"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 border-b border-border/30 pb-10">
        <div className="flex items-center gap-5 group">
          <div className={`p-4 rounded-2xl ${config.bg} ${config.border} border group-hover:scale-105 transition-transform duration-500 shadow-sm`}>
            <Icon className={`w-6 h-6 lg:w-8 lg:h-8 ${config.color}`} />
          </div>
          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">{title}</h2>
            <div className="flex items-center gap-3">
              <span className="w-12 h-1 bg-primary/40 rounded-full" />
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] opacity-50">{games.length} Títulos Disponíveis</span>
            </div>
          </div>
        </div>
        
        <button className="flex items-center gap-2 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-all duration-300 group">
          <span>VER TUDO</span>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6 lg:gap-8">
        {games.map((game, index) => (
          <motion.div
            key={game.id}
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
          >
            <GameCard game={game} />
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
