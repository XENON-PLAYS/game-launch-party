import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Info } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

export function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  const { data: featured = [] } = useQuery({
    queryKey: ["featured-games"],
    queryFn: async () => {
      const { data } = await supabase.from("games").select("*").order("lancamento", { ascending: false }).limit(5);
      return data ?? [];
    },
  });

  const next = useCallback(() => {
    if (featured.length === 0) return;
    setDirection(1);
    setCurrent((prev) => (prev + 1) % featured.length);
  }, [featured.length]);

  const prev = useCallback(() => {
    if (featured.length === 0) return;
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + featured.length) % featured.length);
  }, [featured.length]);

  const goTo = useCallback((index: number) => {
    setDirection(index > current ? 1 : -1);
    setCurrent(index);
  }, [current]);

  useEffect(() => {
    if (featured.length === 0) return;
    const timer = setInterval(next, 8000);
    return () => clearInterval(timer);
  }, [next, featured.length]);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800";
  };

  if (featured.length === 0) {
    return (
      <section className="border-b border-border bg-gradient-to-br from-card via-background to-card">
        <div className="container mx-auto px-4 py-8 md:py-14">
          <div className="grid md:grid-cols-[1fr_300px] gap-8 items-center min-h-[320px]">
            <div className="space-y-4">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-16 w-full" />
            </div>
            <Skeleton className="hidden md:block rounded-xl aspect-[3/4]" />
          </div>
        </div>
      </section>
    );
  }

  const game = featured[current];

  return (
    <section className="relative overflow-hidden border-b border-border bg-card">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-[1fr_350px] gap-12 items-center">
          <div className="space-y-6">
            <div className="flex gap-2 flex-wrap">
              {game.categorias.map((c) => (
                <Link 
                  key={c} 
                  to={`/categoria/${c}`}
                  className="text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded bg-primary/10 text-primary border border-primary/20 hover:bg-primary/30 transition-colors"
                >
                  {c}
                </Link>
              ))}
            </div>
            
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter leading-tight">
              {game.nome}
            </h2>
            
            <p className="text-muted-foreground text-lg max-w-xl line-clamp-3">
              {game.descricao}
            </p>
            
            <div className="flex flex-wrap items-end gap-8 pt-4">
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Preço</span>
                <div className="text-4xl font-bold text-primary flex items-baseline gap-1">
                  {game.preco === 0 ? "GRÁTIS" : <><span className="text-xl">R$</span> {Number(game.preco).toFixed(2).replace(".", ",")}</>}
                </div>
              </div>
              <Link 
                to={`/jogo/${game.slug || game.id}`} 
                className="flex items-center gap-3 px-10 py-4 rounded-xl font-bold bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 shadow-xl shadow-primary/20 hover:-translate-y-1"
              >
                <span>VER DETALHES</span>
                <Info className="w-5 h-5" />
              </Link>
            </div>
          </div>

          <div className="hidden md:block">
            <Link to={`/jogo/${game.slug || game.id}`} className="block rounded-2xl overflow-hidden border border-border shadow-2xl aspect-[3/4]">
              <img 
                src={game.imagem || "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800"} 
                alt={game.nome} 
                className="w-full h-full object-cover" 
                onError={handleImageError}
              />
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 left-0 w-full z-10">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex gap-3">
            {featured.map((_, i) => (
              <button 
                key={i} 
                onClick={() => goTo(i)}
                className={`h-1.5 rounded-full transition-all duration-500 ${i === current ? "w-12 bg-primary" : "w-4 bg-white/20 hover:bg-white/40"}`} 
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
          <div className="flex gap-3">
            <button 
              onClick={prev} 
              className="p-3 rounded-full bg-white/5 hover:bg-primary/20 border border-white/10 hover:border-primary/50 text-white transition-all duration-300 backdrop-blur-sm"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button 
              onClick={next} 
              className="p-3 rounded-full bg-white/5 hover:bg-primary/20 border border-white/10 hover:border-primary/50 text-white transition-all duration-300 backdrop-blur-sm"
              aria-label="Next slide"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
