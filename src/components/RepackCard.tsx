import { Info, Download } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import React, { useState } from "react";
import { randomCover, useRepackCover } from "@/lib/repackCovers";

export interface Repack {
  id: string;
  title: string;
  uris?: string[];
  file_size: string | null;
  upload_date: string | null;
  cover_url?: string | null;
  sources?: string[] | null;
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
      className="group bg-card/80 rounded-2xl overflow-hidden border border-border hover:border-primary/40 transition-all duration-500 relative flex flex-col h-full shadow-lg hover:shadow-primary/20"
    >
      <Link to={`/repack/${repack.id}`} className="block relative aspect-[3/4] overflow-hidden shrink-0 rounded-2xl m-2">
        <img
          src={cover}
          alt={repack.title}
          onError={() => setCover(randomCover(repack.id))}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          loading="lazy"
          decoding="async"
          width={300}
          height={400}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300" />

        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span className="text-[10px] uppercase font-black px-2.5 py-1 rounded bg-primary text-primary-foreground border border-primary/20 tracking-wider shadow-lg shadow-primary/40">
            GRÁTIS
          </span>
          <span className="text-[9px] uppercase font-black px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white border border-white/10 tracking-widest">
            Repack
          </span>
        </div>

        {repack.file_size && (
          <span className="absolute top-3 right-3 text-[9px] uppercase font-black px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md text-white border border-white/10 tracking-widest">
            {repack.file_size}
          </span>
        )}

        <div className="absolute inset-x-0 bottom-0 p-3 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <div className="flex items-center justify-center gap-2 w-full text-[11px] font-black uppercase tracking-widest py-2.5 rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/40">
            <Download className="w-3.5 h-3.5" /> Baixar
          </div>
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
            <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest leading-none mb-1.5 opacity-60">
              {repack.file_size ? "Tamanho" : "Tesouro"}
            </span>
            <span className="font-black text-base lg:text-lg leading-none flex items-center gap-2 text-primary">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              {repack.file_size ? repack.file_size : "GRÁTIS"}
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
