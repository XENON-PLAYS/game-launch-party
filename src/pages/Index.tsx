import { useState, useMemo } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { Link } from "react-router-dom";
import { GameCard } from "@/components/GameCard";
import { GameSection } from "@/components/GameSection";
import { Header } from "@/components/Header";
import { SEO } from "@/components/SEO";

import { HeroCarousel } from "@/components/HeroCarousel";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

import logo from "@/assets/logo.png";

type SortOption = "nome" | "preco_asc" | "preco_desc" | "lancamento";

const Index = () => {
  const [busca, setBusca] = useState("");
  const [categoria, setCategoria] = useState("todas");
  const [ordenacao, setOrdenacao] = useState<SortOption>("nome");
  const [showFilters, setShowFilters] = useState(false);

  const { data: games = [], isLoading } = useQuery({
    queryKey: ["games"],
    queryFn: async () => {
      const { data, error } = await supabase.from("games").select("*").order("nome");
      if (error) throw error;
      return data;
    },
  });

  const allCategories = useMemo(() => {
    return Array.from(new Set(games.flatMap((g) => g.categorias))).sort();
  }, [games]);

  const emAlta = useMemo(() => [...games].sort((a, b) => b.download_count - a.download_count).slice(0, 10), [games]);
  const recomendados = useMemo(() => games.filter((g) => (g as any).avg_rating >= 4 || g.destaques.length > 0).slice(0, 10), [games]);
  const recentes = useMemo(() => [...games].sort((a, b) => (b.lancamento || "").localeCompare(a.lancamento || "")).slice(0, 10), [games]);

  const isSearching = busca || categoria !== "todas";

  const filteredGames = useMemo(() => {
    let result = games;
    if (busca) result = result.filter((g) => g.nome.toLowerCase().includes(busca.toLowerCase()));
    if (categoria !== "todas") result = result.filter((g) => g.categorias.includes(categoria));
    
    result = [...result].sort((a, b) => {
      if (ordenacao === "preco_asc") return a.preco - b.preco;
      if (ordenacao === "preco_desc") return b.preco - a.preco;
      if (ordenacao === "lancamento") return (b.lancamento || "").localeCompare(a.lancamento || "");
      return a.nome.localeCompare(b.nome);
    });
    return result;
  }, [busca, categoria, ordenacao, games]);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500">
      <SEO />
      <Header />
      
      {!isSearching && <HeroCarousel />}

      {/* Search & Filters Area */}
      <section className="bg-card border-b border-border py-4 sm:py-6 md:py-8 lg:py-10">
        <div className="container-responsive">
          <div className="flex flex-col md:flex-row gap-4 sm:gap-6 items-center justify-between">
            <div className="w-full md:max-w-xl lg:max-w-2xl relative group">
              <Search className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                placeholder="Qual jogo você está procurando?" 
                value={busca} 
                onChange={(e) => setBusca(e.target.value)}
                className="w-full pl-12 sm:pl-16 pr-6 py-3.5 sm:py-5 bg-background border border-input rounded-2xl text-sm sm:text-base lg:text-lg focus:outline-none focus:ring-4 focus:ring-primary/20 transition-all shadow-xl shadow-black/5" 
              />
            </div>
            
            <div className="flex gap-3 w-full md:w-auto">
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className={`flex-1 md:flex-none px-6 sm:px-8 py-3.5 sm:py-5 rounded-2xl border transition-all flex items-center justify-center gap-3 font-black text-xs sm:text-sm uppercase tracking-widest ${
                  showFilters ? "bg-primary text-primary-foreground border-primary shadow-2xl shadow-primary/30" : "bg-background border-input hover:border-primary/50 shadow-xl shadow-black/5"
                }`}
              >
                <SlidersHorizontal className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Filtros</span>
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 pt-8 sm:pt-12 border-t border-border mt-8">
              <div className="space-y-4">
                <label className="text-responsive-small text-muted-foreground opacity-70">Categorias</label>
                <div className="flex flex-wrap gap-2 md:gap-3">
                  <button onClick={() => setCategoria("todas")} className={`px-4 py-2 sm:px-6 sm:py-3 rounded-xl text-xs sm:text-sm font-bold border transition-all ${categoria === "todas" ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20" : "bg-background border-input hover:border-primary/30"}`}>Todas</button>
                  {allCategories.map((cat) => (
                    <button key={cat} onClick={() => setCategoria(cat)} className={`px-4 py-2 sm:px-6 sm:py-3 rounded-xl text-xs sm:text-sm font-bold border transition-all ${categoria === cat ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20" : "bg-background border-input hover:border-primary/30"}`}>{cat}</button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-responsive-small text-muted-foreground opacity-70">Ordenar Por</label>
                <div className="flex flex-wrap gap-2 md:gap-3">
                  {[
                    { id: "nome", label: "Nome" },
                    { id: "preco_asc", label: "Menor Preço" },
                    { id: "preco_desc", label: "Maior Preço" },
                    { id: "lancamento", label: "Lançamento" }
                  ].map((opt) => (
                    <button key={opt.id} onClick={() => setOrdenacao(opt.id as SortOption)} className={`px-4 py-2 sm:px-6 sm:py-3 rounded-xl text-xs sm:text-sm font-bold border transition-all ${ordenacao === opt.id ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20" : "bg-background border-input hover:border-primary/30"}`}>{opt.label}</button>
                  ))}
                </div>
              </div>

              <div className="flex items-end">
                <button 
                  onClick={() => { setBusca(""); setCategoria("todas"); setOrdenacao("nome"); }}
                  className="text-responsive-small text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 underline decoration-2 underline-offset-4"
                >
                  Limpar todos os filtros
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      <main className="container-responsive py-8 sm:py-12 md:py-20 lg:py-32 space-y-20 md:space-y-32 lg:space-y-48">
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 3xl:grid-cols-8 gap-4 sm:gap-6 lg:gap-8">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="bg-card rounded-2xl overflow-hidden border border-border p-1">
                <Skeleton className="aspect-[3/4] w-full rounded-xl" />
                <div className="p-4 space-y-3">
                  <Skeleton className="h-4 w-3/4" />
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-8 w-12" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : isSearching ? (
          <div className="space-y-10 sm:space-y-16 lg:space-y-24">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-border pb-10 sm:pb-16">
              <div className="space-y-4">
                <h2 className="text-responsive-h2">Resultados da Busca</h2>
                <div className="flex items-center gap-4">
                  <span className="w-16 md:w-24 h-1.5 bg-primary rounded-full" />
                  <p className="text-responsive-small text-muted-foreground opacity-80">
                    {filteredGames.length} jogo{filteredGames.length !== 1 ? "s" : ""} encontrado{filteredGames.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <span className="text-responsive-small text-muted-foreground opacity-50 self-center">Filtros Ativos:</span>
                {categoria !== "todas" && <span className="text-primary bg-primary/10 px-4 py-1.5 rounded-xl text-xs font-black border border-primary/20">{categoria}</span>}
                {busca && <span className="text-primary bg-primary/10 px-4 py-1.5 rounded-xl text-xs font-black border border-primary/20">"{busca}"</span>}
              </div>
            </div>

            {filteredGames.length === 0 ? (
              <div className="text-center py-20 sm:py-40 space-y-8 max-w-2xl mx-auto">
                <div className="inline-flex p-8 sm:p-12 rounded-full bg-primary/5 border border-primary/10 mb-6">
                  <Search className="w-16 h-16 sm:w-24 sm:h-24 text-primary/30" />
                </div>
                <h3 className="text-responsive-h3 uppercase">Nenhum tesouro encontrado</h3>
                <p className="text-responsive-body text-muted-foreground">
                  Não encontramos nenhum jogo com esses critérios. Tente navegar pelas categorias ou usar termos mais genéricos para descobrir novos horizontes.
                </p>
                <button 
                  onClick={() => { setBusca(""); setCategoria("todas"); }}
                  className="px-10 py-5 bg-primary text-primary-foreground rounded-2xl font-black uppercase tracking-[0.2em] text-xs sm:text-sm hover:scale-105 transition-all shadow-2xl shadow-primary/20"
                >
                  Ver todo o catálogo
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 3xl:grid-cols-8 gap-4 sm:gap-6 lg:gap-8">
                {filteredGames.map((game) => <GameCard key={game.id} game={game} />)}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-24 md:space-y-40 lg:space-y-60">
            <GameSection title="🔥 Em Alta" icon="flame" games={emAlta} />
            <GameSection title="⭐ Recomendados" icon="star" games={recomendados} />
            <GameSection title="🕐 Recentes" icon="clock" games={recentes} />
            
            <section className="space-y-12 md:space-y-20 lg:space-y-32">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 border-b border-border pb-12 sm:pb-20">
                <div className="space-y-4">
                  <h2 className="text-responsive-h2 leading-none">Catálogo Completo</h2>
                  <div className="flex items-center gap-6">
                    <span className="w-20 md:w-32 h-2 bg-primary rounded-full shadow-2xl shadow-primary/30" />
                    <span className="text-responsive-small text-muted-foreground opacity-80">{games.length} jogos disponíveis na frota</span>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <select 
                    value={ordenacao} 
                    onChange={(e) => setOrdenacao(e.target.value as SortOption)}
                    className="bg-card border border-border rounded-2xl px-8 py-5 text-xs sm:text-sm lg:text-base font-black uppercase tracking-widest focus:outline-none focus:ring-8 focus:ring-primary/10 transition-all hover:border-primary/50 cursor-pointer shadow-2xl shadow-black/10"
                  >
                    <option value="nome">Nome (A-Z)</option>
                    <option value="preco_asc">Menor Preço</option>
                    <option value="preco_desc">Maior Preço</option>
                    <option value="lancamento">Novidades da Frota</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 3xl:grid-cols-8 gap-4 sm:gap-6 lg:gap-8">
                {games.map((game) => <GameCard key={game.id} game={game} />)}
              </div>
            </section>
          </div>
        )}
      </main>

      <footer className="border-t border-border bg-card py-20 sm:py-32 md:py-48 mt-32 md:mt-60">
        <div className="container-responsive">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-16 sm:gap-20 lg:gap-12 mb-20 sm:mb-32">
            <div className="space-y-10">
              <Link to="/" className="flex items-center gap-5 group">
                <img src={logo} alt="Jogos Piratas" className="w-16 h-16 sm:w-20 sm:h-20" />
                <div className="flex flex-col">
                  <span className="font-black text-2xl sm:text-3xl tracking-tighter leading-none">JOGOS</span>
                  <span className="font-black text-2xl sm:text-3xl tracking-tighter leading-none text-primary">PIRATAS</span>
                </div>
              </Link>
              <p className="text-responsive-body text-muted-foreground opacity-80 max-w-sm">
                A maior comunidade de compartilhamento de jogos. Descubra novos horizontes, jogue com seus amigos e compartilhe suas experiências épicas nos sete mares.
              </p>
            </div>
            
            <div className="space-y-10">
              <h4 className="text-responsive-small text-foreground">Navegação</h4>
              <ul className="space-y-6 text-sm sm:text-base lg:text-lg text-muted-foreground">
                <li><Link to="/" className="hover:text-primary transition-colors font-bold">Catálogo Completo</Link></li>
                <li><Link to="/" className="hover:text-primary transition-colors font-bold">Novidades da Frota</Link></li>
                <li><Link to="/" className="hover:text-primary transition-colors font-bold">Jogos em Alta</Link></li>
              </ul>
            </div>
            
            <div className="space-y-10">
              <h4 className="text-responsive-small text-foreground">Suporte</h4>
              <ul className="space-y-6 text-sm sm:text-base lg:text-lg text-muted-foreground">
                <li><Link to="/" className="hover:text-primary transition-colors font-bold">Perguntas Frequentes</Link></li>
                <li><Link to="/" className="hover:text-primary transition-colors font-bold">Termos de Navegação</Link></li>
                <li><Link to="/" className="hover:text-primary transition-colors font-bold">Política de Privacidade</Link></li>
              </ul>
            </div>

            <div className="space-y-10">
              <h4 className="text-responsive-small text-foreground">Newsletter</h4>
              <p className="text-responsive-body text-muted-foreground opacity-80">Receba avisos de novos tesouros diretamente no seu pombo correio.</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <input type="email" placeholder="Seu e-mail..." className="bg-background border border-border rounded-2xl px-6 py-4 text-sm sm:text-base w-full focus:outline-none focus:ring-4 focus:ring-primary/20 shadow-xl shadow-black/5" />
                <button className="bg-primary text-primary-foreground px-8 py-4 rounded-2xl font-black uppercase text-xs sm:text-sm tracking-[0.2em] shadow-2xl shadow-primary/20 hover:scale-105 transition-all">OK</button>
              </div>
            </div>
          </div>
          
          <div className="pt-16 border-t border-border flex flex-col md:flex-row justify-between items-center gap-10 text-responsive-small text-muted-foreground opacity-60">
            <p>© 2025 Jogos Piratas. Todos os tesouros protegidos por canhões.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;