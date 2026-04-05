import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Info, Play } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";

export function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  const { data: featuredData, isLoading, isError } = useQuery({
    queryKey: ["featured-games"],
    queryFn: async () => {
      const { data, error } = await supabase.from("games").select("*").order("lancamento", { ascending: false }).limit(5);
      if (error) {
        console.error("Error fetching featured games:", error);
        throw error;
      }
      return data || [];
    },
    staleTime: 1000 * 60 * 60, // 1 hour - critical for LCP
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
  });

  const featured = featuredData || [];

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

  if (isLoading || isError || featured.length === 0) {
    return (
      <section className="bg-background relative h-[850px] sm:h-[650px] md:h-[700px] lg:h-[800px] overflow-hidden">
        {/* Skeleton should resemble the layout to reduce shift */}
        <div className="container-responsive h-full flex flex-col justify-center py-12 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr] gap-12 items-center">
            <div className="space-y-6">
              <Skeleton className="h-6 w-32 bg-primary/10" />
              <Skeleton className="h-20 w-3/4 bg-primary/5" />
              <Skeleton className="h-32 w-full bg-white/5" />
              <div className="flex gap-4">
                <Skeleton className="h-16 w-48 rounded-full bg-primary/20" />
              </div>
            </div>
            <Skeleton className="mx-auto md:mr-0 rounded-3xl aspect-[3/4] w-full max-w-[240px] md:max-w-[380px] bg-white/5 shadow-2xl" />
          </div>
        </div>
      </section>
    );
  }

  const game = featured[current];

  return (
    <section className="relative h-[850px] sm:h-[650px] md:h-[700px] lg:h-[800px] overflow-hidden bg-background">
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={current}
          custom={direction}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="absolute inset-0"
        >
          {/* Background Image with optimized loading */}
          <div className="absolute inset-0">
            <img 
              src={(game as any).hero_image || game.imagem || "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800"} 
              alt="" 
              className="w-full h-full object-cover brightness-[0.35] blur-[1px] opacity-80" 
              fetchPriority={current === 0 ? "high" : "auto"}
              loading={current === 0 ? "eager" : "lazy"}
              onError={handleImageError}
            />
            {/* Elegant Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
          </div>


          <div className="container-responsive h-full flex flex-col justify-center relative z-10 pt-12 sm:pt-16 md:pt-0">
            <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr] gap-6 sm:gap-8 md:gap-12 items-center">
              <div className="space-y-3 sm:space-y-4 md:space-y-6 max-w-2xl">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  className="flex gap-2 flex-wrap"
                >
                  {(game.categorias || []).map((c) => (
                    <span 
                      key={c} 
                      className="text-responsive-small"
                    >
                      {c}
                    </span>
                  ))}
                </motion.div>
                
                <motion.h2 
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 0.8, type: "spring" }}
                  className="text-responsive-h1 uppercase"
                >
                  {game.nome}
                </motion.h2>
                
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.8 }}
                  className="text-responsive-body line-clamp-2 sm:line-clamp-3 md:line-clamp-none max-w-xl"
                >
                  {game.descricao}
                </motion.p>
                
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.9, duration: 0.8 }}
                  className="flex flex-wrap items-center gap-4 sm:gap-8 pt-4 sm:pt-8"
                >
                  <div className="flex flex-col">
                    <span className="text-[9px] uppercase tracking-widest text-muted-foreground mb-1 font-bold">Investimento</span>
                    <div className="text-2xl sm:text-3xl md:text-4xl font-black text-primary flex items-center gap-2 sm:gap-3">
                      {game.preco === 0 && (
                        <span className="relative flex h-2 w-2 sm:h-3 sm:w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 sm:h-3 sm:w-3 bg-primary"></span>
                        </span>
                      )}
                      {game.preco === 0 ? "GRÁTIS" : `R$ ${Number(game.preco).toFixed(2).replace(".", ",")}`}
                    </div>
                  </div>
                  
                  <Link 
                    to={`/jogo/${game.slug || game.id}`} 
                    className="flex items-center gap-2 sm:gap-3 px-6 sm:px-10 py-3 sm:py-5 rounded-full font-bold text-xs sm:text-base bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1"
                  >
                    <span>EXPLORAR JOGO</span>
                    <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
                  </Link>
                </motion.div>
              </div>

              <motion.div 
                initial={{ opacity: 0, scale: 0.8, rotate: 2 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ delay: 0.6, duration: 1, type: "spring" }}
                className="flex justify-center items-center mt-4 sm:mt-6 md:mt-0"
              >
                <div className="relative group/poster w-full max-w-[180px] sm:max-w-[280px] md:max-w-[320px] lg:max-w-[400px]">
                  <div className="absolute -inset-4 bg-primary/20 rounded-[2.5rem] blur-2xl group-hover:bg-primary/30 transition-all duration-700" />
                  <Link to={`/jogo/${game.slug || game.id}`} className="block rounded-3xl overflow-hidden border border-white/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] aspect-[3/4] relative">
                    <img 
                      src={(game as any).vertical_image || game.imagem || "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800"} 
                      alt={game.nome} 
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover/poster:scale-105" 
                      width={400}
                      height={533}
                      fetchPriority={current === 0 ? "high" : "auto"}
                      loading={current === 0 ? "eager" : "lazy"}
                      onError={handleImageError}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/poster:opacity-100 transition-opacity" />
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Modern Controls */}
      <div className="absolute bottom-6 sm:bottom-12 left-0 w-full z-20">
        <div className="container-responsive flex items-center justify-between gap-4">
          <div className="flex gap-2 sm:gap-4">
            {featured.map((_, i) => (
              <button 
                key={i} 
                onClick={() => goTo(i)}
                className={`relative h-1 group focus:outline-none transition-all duration-300 ${i === current ? 'w-10 sm:w-[60px]' : 'w-5 sm:w-[30px]'}`}
              >
                <div className="absolute inset-0 bg-white/20 rounded-full overflow-hidden">
                  <motion.div 
                    initial={false}
                    animate={{ width: i === current ? "100%" : "0%" }}
                    transition={{ duration: i === current ? 8 : 0.3, ease: "linear" }}
                    className="h-full bg-primary"
                  />
                </div>
              </button>
            ))}
          </div>
          
          <div className="flex gap-3">
            <button 
              onClick={prev} 
              className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all flex items-center justify-center backdrop-blur-sm group"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-6 h-6 group-active:scale-90 transition-transform" />
            </button>
            <button 
              onClick={next} 
              className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all flex items-center justify-center backdrop-blur-sm group"
              aria-label="Next slide"
            >
              <ChevronRight className="w-6 h-6 group-active:scale-90 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}