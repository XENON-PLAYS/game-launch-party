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
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="space-y-12 py-12"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-8 border-b border-border/50 pb-12">
        <div className="flex items-center gap-6 group">
          <div className={`p-5 rounded-3xl ${config.bg} ${config.border} border group-hover:scale-110 transition-transform duration-700 shadow-xl shadow-black/10`}>
            <Icon className={`w-8 h-8 lg:w-10 lg:h-10 ${config.color}`} />
          </div>
          <div className="space-y-3">
            <h2 className="text-responsive-h2 leading-none font-extrabold">{title}</h2>
            <div className="flex items-center gap-4">
              <span className="w-20 h-1.5 bg-primary rounded-full shadow-lg shadow-primary/20 opacity-80" />
              <span className="text-responsive-small font-bold opacity-70">{games.length} Títulos de Elite</span>
            </div>
          </div>
        </div>
        
        <button className="flex items-center gap-3 text-responsive-small text-muted-foreground hover:text-primary transition-all duration-500 group hover:translate-x-1 font-bold">
          <span>VER COLEÇÃO COMPLETA</span>
          <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 3xl:grid-cols-8 gap-6 lg:gap-8 xl:gap-10">
        {games.map((game, index) => (
          <motion.div
            key={game.id}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
          >
            <GameCard game={game} />
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}