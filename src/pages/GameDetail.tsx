import { useParams, Link } from "react-router-dom";
import { games } from "@/data/games";
import { Header } from "@/components/Header";
import { CartPopup } from "@/components/CartPopup";
import { useCart } from "@/context/CartContext";
import { Download, ArrowLeft, Monitor, Cpu, HardDrive, MemoryStick, Calendar, Building2, Tag, Globe, Shield } from "lucide-react";

const GameDetail = () => {
  const { id } = useParams();
  const game = games.find((g) => g.id === Number(id));
  const { addItem, isInCart } = useCart();

  if (!game) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Jogo não encontrado</h1>
          <Link to="/" className="text-primary hover:underline">Voltar ao catálogo</Link>
        </div>
      </div>
    );
  }

  const inCart = isInCart(game.id);
  const formatPreco = (v: number) => (v === 0 ? "Grátis" : v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }));

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <CartPopup />

      {/* Back */}
      <div className="container mx-auto px-4 pt-6">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm transition-colors">
          <ArrowLeft className="w-4 h-4" /> Voltar ao catálogo
        </Link>
      </div>

      {/* Hero */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-[320px_1fr] gap-8">
          {/* Image */}
          <div className="rounded-xl overflow-hidden border border-border">
            <img src={game.imagem} alt={game.nome} className="w-full aspect-[3/4] object-cover" />
          </div>

          {/* Info */}
          <div className="space-y-6">
            <div>
              <div className="flex flex-wrap gap-2 mb-3">
                {game.categorias.map((c) => (
                  <span key={c} className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">{c}</span>
                ))}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{game.nome}</h1>
              <p className="text-muted-foreground leading-relaxed">{game.descricao}</p>
            </div>

            {/* Destaques */}
            {game.destaques && (
              <div className="space-y-2">
                <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Destaques</h3>
                <ul className="space-y-1">
                  {game.destaques.map((d, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Meta */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              {game.desenvolvedor && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Building2 className="w-4 h-4 text-primary" />
                  <span>{game.desenvolvedor}</span>
                </div>
              )}
              {game.lancamento && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span>{game.lancamento}</span>
                </div>
              )}
              {game.classificacao && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Shield className="w-4 h-4 text-primary" />
                  <span>{game.classificacao}</span>
                </div>
              )}
              {game.tamanho && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <HardDrive className="w-4 h-4 text-primary" />
                  <span>{game.tamanho}</span>
                </div>
              )}
            </div>

            {/* Languages */}
            {game.idiomas.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <Globe className="w-4 h-4 text-primary" />
                {game.idiomas.map((i) => (
                  <span key={i} className="text-xs px-2 py-1 rounded bg-secondary text-muted-foreground">{i}</span>
                ))}
              </div>
            )}

            {/* Price & Download */}
            <div className="flex items-center gap-4 pt-2">
              <span className="text-3xl font-bold text-primary">{formatPreco(game.preco)}</span>
              <button
                onClick={() => !inCart && addItem(game)}
                disabled={inCart}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${
                  inCart
                    ? "bg-secondary text-muted-foreground"
                    : "bg-primary hover:bg-primary/90 text-primary-foreground hover:scale-105"
                }`}
              >
                <Download className="w-5 h-5" />
                {inCart ? "No carrinho" : "Baixar via Torrent"}
              </button>
            </div>
          </div>
        </div>

        {/* Requirements */}
        {game.requisitos && (
          <div className="mt-12 space-y-4">
            <h2 className="text-xl font-bold">Requisitos do Sistema</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {(["minimo", "recomendado"] as const).map((tipo) => (
                <div key={tipo} className="bg-card border border-border rounded-xl p-5 space-y-3">
                  <h3 className="font-bold text-primary capitalize">{tipo === "minimo" ? "Mínimos" : "Recomendados"}</h3>
                  {Object.entries(game.requisitos![tipo]).map(([key, val]) => (
                    <div key={key} className="flex justify-between text-sm border-b border-border/50 pb-2 last:border-0">
                      <span className="text-muted-foreground capitalize">{key === "placa" ? "Placa de Vídeo" : key}</span>
                      <span className="font-medium">{val}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Game Modes */}
        {game.modos.length > 0 && (
          <div className="mt-8 flex items-center gap-2 flex-wrap">
            <Tag className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground mr-1">Modos:</span>
            {game.modos.map((m) => (
              <span key={m} className="text-xs px-3 py-1 rounded-full bg-secondary">{m}</span>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 py-8 mt-16">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          <p>© 2024 Jogos Piratas — Todos os direitos reservados</p>
        </div>
      </footer>
    </div>
  );
};

export default GameDetail;
