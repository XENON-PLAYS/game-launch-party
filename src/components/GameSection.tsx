import { Game } from "@/data/games";
import { GameCard } from "./GameCard";
import { Flame, Star, Clock } from "lucide-react";

interface GameSectionProps {
  title: string;
  icon: "flame" | "star" | "clock";
  games: Game[];
}

const icons = {
  flame: Flame,
  star: Star,
  clock: Clock,
};

export function GameSection({ title, icon, games }: GameSectionProps) {
  const Icon = icons[icon];

  if (games.length === 0) return null;

  return (
    <section className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        <div className="flex-1 h-px bg-border ml-2" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {games.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </section>
  );
}
