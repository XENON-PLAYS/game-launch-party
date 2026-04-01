import { useState, useMemo } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { games, allCategories } from "@/data/games";
import { GameCard } from "@/components/GameCard";
import { GameSection } from "@/components/GameSection";
import { Header } from "@/components/Header";
import { CartPopup } from "@/components/CartPopup";
import { HeroCarousel } from "@/components/HeroCarousel";

type SortOption = "nome" | "preco_asc" | "preco_desc";

const Index = () => {
  const [busca, setBusca] = useState("");
  const [categoria, setCategoria] = useState("todas");
  const [ordenacao, setOrdenacao] = useState<SortOption>("nome");
  const [showFilters, setShowFilters] = useState(false);

  // Seções curadas
  const emAlta = useMemo(() => games.filter((g) => ["Elden Ring", "God of War Ragnarök", "Cyberpunk 2077"].includes(g.nome)), []);
  const recomendados = useMemo(() => games.filter((g) => ["Red Dead Redemption 2", "The Witcher 3: Wild Hunt", "Hogwarts Legacy"].includes(g.nome)), []);
  const recentes = useMemo(() => [...games].sort((a, b) => (b.lancamento || "").localeCompare(a.lancamento || "")).slice(0, 5), []);

  const isSearching = busca || categoria !== "todas";

  const filteredGames = useMemo(() => {
    let result = games;
    if (busca) result = result.filter((g) => g.nome.toLowerCase().includes(busca.toLowerCase()));
    if (categoria !== "todas") result = result.filter((g) => g.categorias.includes(categoria));
    result = [...result].sort((a, b) => {
      if (ordenacao === "preco_asc") return a.preco - b.preco;
      if (ordenacao === "preco_desc") return b.preco - a.preco;
      return a.nome.localeCompare(b.nome);
    });
    return result;
  }, [busca, categoria, ordenacao]);

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <Header />
      <CartPopup />

      {/* Hero Carousel */}
      <HeroCarousel />

      {/* Search & Filters */}
      <section className="border-b border-border bg-card/30">
        <div className="container mx-auto px-4 py-5">
          <div className="flex gap-2 max-w-xl">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar jogos..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 rounded-xl border transition-all flex items-center gap-2 ${showFilters ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border hover:border-primary/40"}`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="hidden sm:inline text-sm">Filtros</span>
            </button>
          </div>

          {showFilters && (
            <div className="flex flex-wrap gap-4 mt-4 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground uppercase tracking-wider">Categoria</label>
                <select value={categoria} onChange={(e) => setCategoria(e.target.value)} className="block bg-card border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
                  <option value="todas">Todas</option>
                  {allCategories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground uppercase tracking-wider">Ordenar</label>
                <select value={ordenacao} onChange={(e) => setOrdenacao(e.target.value as SortOption)} className="block bg-card border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
                  <option value="nome">Nome (A-Z)</option>
                  <option value="preco_asc">Preço ↑</option>
                  <option value="preco_desc">Preço ↓</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Content */}
      <main className="container mx-auto px-4 py-8 space-y-12">
        {isSearching ? (
          /* Search results */
          <>
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground text-sm">
                {filteredGames.length} jogo{filteredGames.length !== 1 ? "s" : ""} encontrado{filteredGames.length !== 1 ? "s" : ""}
              </p>
            </div>
            {filteredGames.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground">
                <p className="text-xl mb-2">Nenhum jogo encontrado</p>
                <p className="text-sm">Tente ajustar os filtros ou a busca</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {filteredGames.map((game) => <GameCard key={game.id} game={game} />)}
              </div>
            )}
          </>
        ) : (
          /* Curated sections */
          <>
            <GameSection title="🔥 Em Alta" icon="flame" games={emAlta} />
            <GameSection title="⭐ Recomendados" icon="star" games={recomendados} />
            <GameSection title="🕐 Recentes" icon="clock" games={recentes} />

            {/* Full catalog */}
            <section className="space-y-5">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold tracking-tight">Catálogo Completo</h2>
                <div className="flex-1 h-px bg-border ml-2" />
                <span className="text-sm text-muted-foreground">{games.length} jogos</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {games.map((game) => <GameCard key={game.id} game={game} />)}
              </div>
            </section>
          </>
        )}
      </main>

      <footer className="border-t border-border bg-card/50 py-6">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row justify-between text-muted-foreground text-xs gap-2">
          <p>© 2025 Richard, Bruno e Isabela. Todos os direitos reservados.</p>
          <p>Desenvolvido por Richard, Bruno e Isabela</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
