import { useMemo } from "react";
import { Tables } from "@/integrations/supabase/types";
import { GameCard } from "./GameCard";
import { RepackCard, Repack } from "./RepackCard";
import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

type Game = Tables<"games">;

interface GameSectionProps {
  title: string;
  icon?: LucideIcon;
  games: Game[];
  repacks?: Repack[];
  page?: number;
  pageSize?: number;
  /** Mapa game.id -> repack correspondente, para os cards usarem dados do repack. */
  repackMap?: Record<string, Repack>;
}

export function GameSection({ title, icon: Icon, games, repacks = [], page = 0, pageSize = 12, repackMap }: GameSectionProps) {
  const items = useMemo(
    () => [
      ...games.map((g) => ({ type: "game" as const, id: g.id, data: g })),
      ...repacks.map((r) => ({ type: "repack" as const, id: r.id, data: r })),
    ],
    [games, repacks]
  );

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const safePage = Math.min(page, totalPages - 1);

  const pageItems = useMemo(
    () => items.slice(safePage * pageSize, safePage * pageSize + pageSize),
    [items, safePage, pageSize]
  );

  if (items.length === 0) return null;

  const config = {
    color: "text-primary",
    bg: "bg-primary/10",
    border: "border-primary/20",
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "100px" }}
      transition={{ duration: 0.4 }}
      className="space-y-8 py-8 md:py-12"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 border-b border-border/30 pb-6 md:pb-10">
        <div className="flex items-center gap-4 md:gap-5 group">
          {Icon && (
            <div className={`p-3 md:p-4 rounded-xl md:rounded-2xl ${config.bg} ${config.border} border group-hover:scale-105 transition-transform duration-500 shadow-sm`}>
              <Icon className={`w-5 h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 ${config.color}`} />
            </div>
          )}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="hidden sm:block w-1.5 h-7 lg:h-9 bg-primary rounded-full" />
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tighter leading-none text-foreground">{title}</h2>
            </div>
            <div className="flex items-center gap-2 md:gap-3 pl-0 sm:pl-4">
              <span className="w-8 md:w-12 h-0.5 bg-primary rounded-full" />
              <span className="text-[9px] sm:text-xs font-bold uppercase tracking-[0.25em] text-muted-foreground">{items.length} Títulos</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
        {pageItems.map((item, index) => (
          <motion.div
            key={`${item.type}-${item.id}`}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.25), ease: "easeOut" }}
          >
            {item.type === "game" ? (
              <GameCard game={item.data} />
            ) : (
              <RepackCard repack={item.data} />
            )}
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
