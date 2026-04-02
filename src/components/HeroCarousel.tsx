import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Info } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";

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

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  return (
    <section className="relative overflow-hidden border-b border-border min-h-[400px] md:min-h-[500px] flex items-center">
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={current}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 }
          }}
          className="absolute inset-0"
        >
          {/* Background Image with blur */}
          <div 
            className="absolute inset-0 bg-cover bg-center scale-110 blur-2xl opacity-20 transition-transform duration-[10000ms]"
            style={{ backgroundImage: `url(${game.imagem})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          
          <div className="container mx-auto px-4 h-full relative flex items-center">
            <div className="grid md:grid-cols-[1fr_350px] gap-12 items-center w-full">
              <div className="space-y-6">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex gap-2 flex-wrap"
                >
                  {game.categorias.map((c) => (
                    <span key={c} className="text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-md bg-primary/20 text-primary border border-primary/30 backdrop-blur-sm">
                      {c}
                    </span>
                  ))}
                </motion.div>
                
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-[0.9] text-shadow-md"
                >
                  {game.nome}
                </motion.h2>
                
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-muted-foreground text-base md:text-lg max-w-xl line-clamp-3 leading-relaxed"
                >
                  {game.descricao}
                </motion.p>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-center gap-6 pt-4"
                >
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground uppercase tracking-widest font-bold mb-1">Preço</span>
                    <span className="text-3xl font-bold text-primary">
                      {game.preco === 0 ? "GRÁTIS" : `R$ ${Number(game.preco).toFixed(2).replace(".", ",")}`}
                    </span>
                  </div>
                  <Link 
                    to={`/jogo/${game.id}`} 
                    className="flex items-center gap-3 px-8 py-4 rounded-xl font-bold text-base bg-primary hover:bg-primary/90 text-primary-foreground hover:scale-105 hover:shadow-2xl hover:shadow-primary/40 transition-all duration-300 group"
                  >
                    <span>VER DETALHES</span>
                    <Info className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  </Link>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ delay: 0.4, type: "spring" }}
                className="hidden md:block"
              >
                <Link to={`/jogo/${game.id}`} className="block rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-primary/20 hover:scale-[1.02] transition-transform duration-700 aspect-[3/4] relative group">
                  <img src={game.imagem || ""} alt={game.nome} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2000ms]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Controls Overlay */}
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
