import { Tables } from "@/integrations/supabase/types";
import { GameCard } from "./GameCard";
import { Flame, Star, Clock, ChevronRight } from "lucide-react";


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
    <section className="space-y-6 md:space-y-8 py-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 md:gap-4 group">
          <div className={`p-2.5 md:p-3 rounded-2xl ${config.bg} ${config.border} border group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-black/20`}>
            <Icon className={`w-5 h-5 md:w-6 md:h-6 ${config.color}`} />
          </div>
          <div className="space-y-0.5">
            <h2 className="text-2xl md:text-3xl lg:text-4xl 2xl:text-5xl font-bold tracking-tighter uppercase leading-none">{title}</h2>
            <div className="flex items-center gap-2">
              <span className="w-8 md:w-12 h-1 bg-primary rounded-full" />
              <span className="text-[9px] md:text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em]">{games.length} títulos</span>
            </div>
          </div>
        </div>
        
        <button className="flex items-center gap-2 text-[10px] md:text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors duration-300 group">
          Ver todos
          <ChevronRight className="w-3.5 h-3.5 md:w-4 md:h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
        {games.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </section>
  );
}
