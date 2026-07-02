import { Info } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import React from "react";

export interface Repack {
  id: string;
  title: string;
  uris: string[];
  file_size: string | null;
  upload_date: string | null;
}

// Pool de capas genéricas usado enquanto não há imagem real do jogo.
// A escolha é determinística (baseada no id) para a capa não mudar a cada render.
const COVER_POOL = [
  "photo-1542751371-adc38448a05e",
  "photo-1538481199705-c710c4e965fc",
  "photo-1511512578047-dfb367046420",
  "photo-1493711662062-fa541adb3fc8",
  "photo-1550745165-9bc0b252726f",
  "photo-1552820728-8b83bb6b773f",
  "photo-1556438064-2d7646166914",
  "photo-1493858340000-c1d4d2e1a85d",
  "photo-1535223289827-42f1e9919769",
  "photo-1542753938-8f4520f3a0e0",
  "photo-1605901309584-818e25960a8f",
  "photo-1614680376573-df3480f0c6ff",
];

function hashString(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

export function randomCover(id: string): string {
  const photo = COVER_POOL[hashString(id) % COVER_POOL.length];
  return `https://images.unsplash.com/${photo}?auto=format&fit=crop&q=80&w=400`;
}

interface RepackCardProps {
  repack: Repack;
}

export const RepackCard = React.memo(({ repack }: RepackCardProps) => {
  const cover = randomCover(repack.id);

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
