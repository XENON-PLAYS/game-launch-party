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
    <section className="space-y-8 sm:space-y-12 md:space-y-16 py-8 sm:py-12">
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-8 border-b border-border pb-8 sm:pb-12">
        <div className="flex items-center gap-4 sm:gap-6 group">
          <div className={`p-4 sm:p-5 rounded-2xl ${config.bg} ${config.border} border group-hover:scale-110 transition-transform duration-500 shadow-2xl shadow-black/20`}>
            <Icon className={`w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 ${config.color}`} />
          </div>
          <div className="space-y-2 sm:space-y-3">
            <h2 className="text-responsive-h2 leading-none">{title}</h2>
            <div className="flex items-center gap-4">
              <span className="w-12 sm:w-20 h-1.5 bg-primary rounded-full shadow-lg shadow-primary/20" />
              <span className="text-responsive-small text-muted-foreground opacity-80">{games.length} títulos épicos</span>
            </div>
          </div>
        </div>
        
        <button className="flex items-center gap-3 text-responsive-small text-muted-foreground hover:text-primary transition-all duration-300 group hover:translate-x-1">
          <span>Ver toda a frota</span>
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 3xl:grid-cols-8 gap-4 sm:gap-6 lg:gap-8 xl:gap-10">
        {games.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </section>
  );
}
