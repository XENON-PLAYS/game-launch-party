import { Info } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import React, { useState } from "react";
import { randomCover, useRepackCover } from "@/lib/repackCovers";

export interface Repack {
  id: string;
  title: string;
  uris: string[];
  file_size: string | null;
  upload_date: string | null;
  cover_url?: string | null;
}

export { randomCover };

interface RepackCardProps {
  repack: Repack;
}

export const RepackCard = React.memo(({ repack }: RepackCardProps) => {
  const resolved = useRepackCover(repack);
  const [cover, setCover] = useState(resolved);

  // Mantém a capa sincronizada quando a resolução chega depois do primeiro render.
  React.useEffect(() => {
    setCover(resolved);
  }, [resolved]);

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="group bg-card/80 rounded-2xl overflow-hidden border border-border hover:border-primary/40 transition-all duration-500 relative flex flex-col h-full shadow-lg hover:shadow-primary/10"
    >
      <Link to={`/repack/${repack.id}`} className="block relative aspect-[3/4] overflow-hidden shrink-0 rounded-2xl m-2">
        <img
          src={cover}
          alt={repack.title}
          onError={() => setCover(randomCover(repack.id))}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
          decoding="async"
          width={300}
          height={400}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span className="text-[10px] uppercase font-black px-2.5 py-1 rounded bg-primary text-primary-foreground border border-primary/20 tracking-wider shadow-lg shadow-primary/40 animate-pulse">
            GRÁTIS
          </span>
          <span className="text-[9px] uppercase font-black px-2.5 py-1 rounded-lg bg-black/60 dark:bg-black/40 backdrop-blur-md text-white border border-white/10 tracking-widest">
            Repack
          </span>
        </div>
      </Link>

      <div className="p-4 flex flex-col flex-grow">
        <Link to={`/repack/${repack.id}`} className="block group/title mb-2">
          <h3 className="font-bold text-sm lg:text-base line-clamp-2 group-hover/title:text-primary transition-colors duration-200 leading-tight">
            {repack.title}
          </h3>
        </Link>

        <div className="mt-auto pt-3 border-t border-border/30 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest leading-none mb-1.5 opacity-60">Tesouro</span>
            <span className="font-black text-base lg:text-lg leading-none flex items-center gap-2 text-primary">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              GRÁTIS
            </span>
          </div>

          <Link
            to={`/repack/${repack.id}`}
            className="p-2.5 rounded-lg bg-secondary/80 hover:bg-primary hover:text-primary-foreground transition-all duration-300"
          >
            <Info className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
});

RepackCard.displayName = "RepackCard";
