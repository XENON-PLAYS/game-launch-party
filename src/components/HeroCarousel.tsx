import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Download } from "lucide-react";
import { games, Game } from "@/data/games";
import { useCart } from "@/context/CartContext";

const featured = games.slice(0, 5);

export function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { addItem, isInCart } = useCart();

  const goTo = useCallback((index: number) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrent(index);
      setIsTransitioning(false);
    }, 300);
  }, []);

  const next = useCallback(() => goTo((current + 1) % featured.length), [current, goTo]);
  const prev = useCallback(() => goTo((current - 1 + featured.length) % featured.length), [current, goTo]);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  const game = featured[current];
  const inCart = isInCart(game.id);

  return (
    <section className="relative overflow-hidden border-b border-border bg-gradient-to-br from-card via-background to-card">
      {/* Background blur image */}
      <div
        className="absolute inset-0 opacity-10 blur-3xl scale-110 transition-all duration-700"
        style={{ backgroundImage: `url(${game.imagem})`, backgroundSize: "cover", backgroundPosition: "center" }}
      />

      <div className="container mx-auto px-4 py-8 md:py-14 relative">
        <div className={`grid md:grid-cols-[1fr_300px] gap-8 items-center min-h-[320px] transition-all duration-500 ${isTransitioning ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"}`}>
          {/* Info */}
          <div className="space-y-4">
            <div className="flex gap-2 flex-wrap">
              {game.categorias.map((c) => (
                <span key={c} className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">{c}</span>
              ))}
            </div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight">
              {game.nome}
            </h2>
            <p className="text-muted-foreground text-sm md:text-base max-w-xl line-clamp-3">{game.descricao}</p>
            <div className="flex items-center gap-4 pt-2">
              <span className="text-2xl font-bold text-primary">
                {game.preco === 0 ? "Grátis" : `R$ ${game.preco.toFixed(2).replace(".", ",")}`}
              </span>
              <button
                onClick={() => !inCart && addItem(game)}
                disabled={inCart}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${inCart ? "bg-secondary text-muted-foreground" : "bg-primary hover:bg-primary/90 text-primary-foreground hover:scale-105 hover:shadow-lg hover:shadow-primary/25"}`}
              >
                <Download className="w-4 h-4" />
                {inCart ? "No carrinho" : "Baixar"}
              </button>
              <Link to={`/jogo/${game.id}`} className="text-sm text-muted-foreground hover:text-primary transition-colors underline-offset-4 hover:underline">
                Ver detalhes →
              </Link>
            </div>
          </div>

          {/* Image */}
          <Link to={`/jogo/${game.id}`} className="hidden md:block rounded-xl overflow-hidden border border-border shadow-2xl shadow-primary/5 hover:scale-[1.02] transition-transform duration-500">
            <img src={game.imagem} alt={game.nome} className="w-full aspect-[3/4] object-cover" />
          </Link>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between mt-6">
          <div className="flex gap-2">
            {featured.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`h-1.5 rounded-full transition-all duration-500 ${i === current ? "w-10 bg-primary shadow-lg shadow-primary/30" : "w-4 bg-muted-foreground/30 hover:bg-muted-foreground/50"}`}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={prev} className="p-2 rounded-lg bg-secondary hover:bg-primary/20 hover:text-primary transition-all duration-300">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={next} className="p-2 rounded-lg bg-secondary hover:bg-primary/20 hover:text-primary transition-all duration-300">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
