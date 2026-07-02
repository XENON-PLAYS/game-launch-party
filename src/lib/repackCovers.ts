import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Repack } from "@/components/RepackCard";

// Pool de capas genéricas usado enquanto não há imagem real do jogo.
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

// ---- Resolução de capas reais (estilo Steam) por título ----
const cache = new Map<string, string>();
const pending = new Set<string>();
let queue = new Set<string>();
let timer: ReturnType<typeof setTimeout> | null = null;
const listeners = new Set<() => void>();

async function flush() {
  const ids = Array.from(queue);
  queue = new Set();
  timer = null;
  if (ids.length === 0) return;

  ids.forEach((id) => pending.add(id));
  try {
    const { data } = await supabase.functions.invoke("repack-covers", {
      body: { ids },
    });
    const covers = (data?.covers ?? {}) as Record<string, string | null>;
    for (const id of ids) {
      const url = covers[id];
      if (url) cache.set(id, url);
    }
  } catch {
    // silencioso: mantém fallback
  } finally {
    ids.forEach((id) => pending.delete(id));
    listeners.forEach((l) => l());
  }
}

function requestCover(id: string) {
  if (cache.has(id) || pending.has(id)) return;
  queue.add(id);
  if (timer == null) timer = setTimeout(flush, 150);
}

export function useRepackCover(repack: Repack): string {
  const resolve = () => repack.cover_url || cache.get(repack.id) || randomCover(repack.id);
  const [cover, setCover] = useState<string>(resolve);

  useEffect(() => {
    if (repack.cover_url) {
      setCover(repack.cover_url);
      return;
    }
    const cached = cache.get(repack.id);
    if (cached) {
      setCover(cached);
      return;
    }
    const update = () => {
      const c = cache.get(repack.id);
      if (c) setCover(c);
    };
    listeners.add(update);
    requestCover(repack.id);
    return () => {
      listeners.delete(update);
    };
  }, [repack.id, repack.cover_url]);

  return cover;
}
