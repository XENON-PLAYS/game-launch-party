import { useMemo, useState, useEffect } from "react";
import { Tables } from "@/integrations/supabase/types";
import { GameCard } from "./GameCard";
import { RepackCard, Repack } from "./RepackCard";
import { ChevronLeft, ChevronRight, LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

type Game = Tables<"games">;

interface GameSectionProps {
  title: string;
  icon: LucideIcon;
  games: Game[];
  repacks?: Repack[];
  pageSize?: number;
}

export function GameSection({ title, icon: Icon, games, repacks = [], pageSize = 12 }: GameSectionProps) {
  const [page, setPage] = useState(0);

  const items = useMemo(
    () => [
      ...games.map((g) => ({ type: "game" as const, id: g.id, data: g })),
      ...repacks.map((r) => ({ type: "repack" as const, id: r.id, data: r })),
    ],
    [games, repacks]
  );

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));

  useEffect(() => {
    if (page > totalPages - 1) setPage(0);
  }, [totalPages, page]);

  const pageItems = useMemo(
    () => items.slice(page * pageSize, page * pageSize + pageSize),
    [items, page, pageSize]
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
          <div className={`p-3 md:p-4 rounded-xl md:rounded-2xl ${config.bg} ${config.border} border group-hover:scale-105 transition-transform duration-500 shadow-sm`}>
            <Icon className={`w-5 h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 ${config.color}`} />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">{title}</h2>
            <div className="flex items-center gap-2 md:gap-3">
              <span className="w-8 md:w-12 h-1 bg-primary/40 rounded-full" />
              <span className="text-[9px] sm:text-xs font-bold uppercase tracking-[0.2em] opacity-50">{items.length} Títulos</span>
            </div>
          </div>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center gap-3 md:gap-4">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              aria-label={`Página anterior de ${title}`}
              className="p-2.5 md:p-3 rounded-xl md:rounded-2xl bg-card border border-border/50 hover:border-primary/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-lg shadow-black/10"
            >
              <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
            </button>
            <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-muted-foreground min-w-[60px] text-center">
              {page + 1} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              aria-label={`Próxima página de ${title}`}
              className="p-2.5 md:p-3 rounded-xl md:rounded-2xl bg-card border border-border/50 hover:border-primary/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-lg shadow-black/10"
            >
              <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          </div>
        )}
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
