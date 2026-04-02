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
    <section className="relative overflow-hidden border-b border-border bg-card group/hero">
      <div className="absolute inset-0 opacity-10 md:opacity-20 pointer-events-none transition-opacity duration-1000">
        <img 
          src={game.imagem || "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800"} 
          alt="" 
          className="w-full h-full object-cover blur-3xl scale-110" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-background/10" />
      </div>

      <div className="container-responsive py-8 md:py-12 lg:py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_350px] lg:grid-cols-[1fr_450px] 2xl:grid-cols-[1fr_550px] gap-8 md:gap-12 lg:gap-20 items-center">
          <div className="space-y-4 md:space-y-6">
            <div className="flex gap-2 flex-wrap">
              {game.categorias.map((c) => (
                <Link 
                  key={c} 
                  to={`/categoria/${c}`}
                  className="text-[10px] sm:text-xs uppercase tracking-widest font-bold px-3 py-1.5 rounded bg-primary/10 text-primary border border-primary/20 hover:bg-primary/30 transition-colors"
                >
                  {c}
                </Link>
              ))}
            </div>
            
            <h2 className="text-responsive-h1 animate-fade-in uppercase">
              {game.nome}
            </h2>
            
            <p className="text-responsive-body text-muted-foreground max-w-4xl line-clamp-3 md:line-clamp-none">
              {game.descricao}
            </p>
            
            <div className="flex flex-wrap items-center gap-6 md:gap-10 pt-4 md:pt-8">
              <div className="space-y-1">
                <span className="text-responsive-small text-muted-foreground">Preço</span>
                <div className="text-responsive-h2 text-primary flex items-baseline gap-1">
                  {game.preco === 0 ? "GRÁTIS" : <><span className="text-xl md:text-2xl lg:text-3xl xl:text-4xl">R$</span> {Number(game.preco).toFixed(2).replace(".", ",")}</>}
                </div>
              </div>
              <Link 
                to={`/jogo/${game.slug || game.id}`} 
                className="flex items-center gap-3 px-8 sm:px-12 py-3.5 sm:py-5 rounded-2xl font-bold text-sm sm:text-base lg:text-lg xl:text-xl bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 shadow-2xl shadow-primary/30 hover:-translate-y-1 active:scale-95"
              >
                <span>VER DETALHES</span>
                <Info className="w-5 h-5 lg:w-6 lg:h-6" />
              </Link>
            </div>
          </div>

          <div className="hidden md:block group/image">
            <Link to={`/jogo/${game.slug || game.id}`} className="block rounded-2xl overflow-hidden border border-border shadow-2xl aspect-[3/4] relative">
              <img 
                src={game.imagem || "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800"} 
                alt={game.nome} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover/image:scale-110" 
                onError={handleImageError}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity" />
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
