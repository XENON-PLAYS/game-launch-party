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

  const emAlta = useMemo(() => games.filter((g) => ["Elden Ring", "God of War Ragnarök", "Cyberpunk 2077"].includes(g.nome)), [games]);
  const recomendados = useMemo(() => games.filter((g) => ["Red Dead Redemption 2", "The Witcher 3: Wild Hunt", "Hogwarts Legacy"].includes(g.nome)), [games]);
  const recentes = useMemo(() => [...games].sort((a, b) => (b.lancamento || "").localeCompare(a.lancamento || "")).slice(0, 5), [games]);

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
      <section className="bg-card border-b border-border py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="w-full md:max-w-xl relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Qual jogo você está procurando?" 
                value={busca} 
                onChange={(e) => setBusca(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-background border border-input rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" 
              />
            </div>
            
            <div className="flex gap-2 w-full md:w-auto">
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className={`flex-1 md:flex-none px-4 py-3 rounded-xl border transition-all flex items-center justify-center gap-2 font-bold text-xs uppercase tracking-wider ${
                  showFilters ? "bg-primary text-primary-foreground border-primary" : "bg-background border-input hover:border-primary/50"
                }`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Filtros</span>
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
              <div className="space-y-2">
                <label className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Categorias</label>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => setCategoria("todas")} className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${categoria === "todas" ? "bg-primary text-primary-foreground border-primary" : "bg-background border-input"}`}>Todas</button>
                  {allCategories.map((cat) => (
                    <button key={cat} onClick={() => setCategoria(cat)} className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${categoria === cat ? "bg-primary text-primary-foreground border-primary" : "bg-background border-input"}`}>{cat}</button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Ordenar Por</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: "nome", label: "Nome" },
                    { id: "preco_asc", label: "Menor Preço" },
                    { id: "preco_desc", label: "Maior Preço" },
                    { id: "lancamento", label: "Lançamento" }
                  ].map((opt) => (
                    <button key={opt.id} onClick={() => setOrdenacao(opt.id as SortOption)} className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${ordenacao === opt.id ? "bg-primary text-primary-foreground border-primary" : "bg-background border-input"}`}>{opt.label}</button>
                  ))}
                </div>
              </div>

              <div className="flex items-end">
                <button 
                  onClick={() => { setBusca(""); setCategoria("todas"); setOrdenacao("nome"); }}
                  className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest hover:text-primary transition-colors flex items-center gap-2 underline"
                >
                  Limpar filtros
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      <main className="container mx-auto px-4 py-12 space-y-24">
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="bg-white/5 rounded-2xl overflow-hidden border border-white/5 p-1">
                <Skeleton className="aspect-[3/4] w-full rounded-xl" />
                <div className="p-4 space-y-3">
                  <Skeleton className="h-5 w-3/4" />
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : isSearching ? (
          <div className="space-y-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-8">
              <div>
                <h2 className="text-4xl font-bold tracking-tighter uppercase mb-2">Resultados da busca</h2>
                <p className="text-muted-foreground text-sm font-bold uppercase tracking-widest">
                  {filteredGames.length} jogo{filteredGames.length !== 1 ? "s" : ""} encontrado{filteredGames.length !== 1 ? "s" : ""}
                </p>
              </div>
              <div className="flex gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                <span>Ativo:</span>
                {categoria !== "todas" && <span className="text-primary">{categoria}</span>}
                {busca && <span className="text-primary">"{busca}"</span>}
              </div>
            </div>

            {filteredGames.length === 0 ? (
              <div className="text-center py-32 space-y-6">
                <div className="inline-flex p-6 rounded-full bg-white/5 border border-white/10 mb-4">
                  <Search className="w-12 h-12 text-muted-foreground/30" />
                </div>
                <h3 className="text-3xl font-bold tracking-tighter uppercase">Nenhum tesouro encontrado</h3>
                <p className="text-muted-foreground max-w-sm mx-auto">
                  Não encontramos nenhum jogo com esses critérios. Tente navegar pelas categorias ou usar termos mais genéricos.
                </p>
                <button 
                  onClick={() => { setBusca(""); setCategoria("todas"); }}
                  className="px-8 py-3 bg-primary text-primary-foreground rounded-xl font-bold uppercase tracking-widest text-xs hover:scale-105 transition-transform"
                >
                  Ver todo o catálogo
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {filteredGames.map((game) => <GameCard key={game.id} game={game} />)}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-24">
            <GameSection title="🔥 Em Alta" icon="flame" games={emAlta} />
            <GameSection title="⭐ Recomendados" icon="star" games={recomendados} />
            <GameSection title="🕐 Recentes" icon="clock" games={recentes} />
            
            <section className="space-y-10">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                  <h2 className="text-4xl font-bold tracking-tighter uppercase leading-none">Catálogo Completo</h2>
                  <div className="flex items-center gap-3">
                    <span className="w-16 h-1 bg-primary rounded-full" />
                    <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em]">{games.length} jogos disponíveis</span>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <select 
                    value={ordenacao} 
                    onChange={(e) => setOrdenacao(e.target.value as SortOption)}
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs font-bold uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="nome">Nome (A-Z)</option>
                    <option value="preco_asc">Menor Preço</option>
                    <option value="preco_desc">Maior Preço</option>
                    <option value="lancamento">Novidades</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {games.map((game) => <GameCard key={game.id} game={game} />)}
              </div>
            </section>
          </div>
        )}
      </main>

      <footer className="border-t border-white/5 bg-background py-16 mt-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="space-y-6">
              <Link to="/" className="flex items-center gap-4 group">
                <img src={logo} alt="Jogos Piratas" className="w-12 h-12" />
                <div className="flex flex-col">
                  <span className="font-bold text-xl tracking-tighter leading-none">JOGOS</span>
                  <span className="font-bold text-xl tracking-tighter leading-none text-primary">PIRATAS</span>
                </div>
              </Link>
              <p className="text-muted-foreground text-sm leading-relaxed">
                A maior comunidade de compartilhamento de jogos. Descubra, jogue e compartilhe suas experiências.
              </p>
            </div>
            
            <div className="space-y-6">
              <h4 className="text-xs font-bold uppercase tracking-widest">Navegação</h4>
              <ul className="space-y-4 text-sm text-muted-foreground">
                <li><Link to="/" className="hover:text-primary transition-colors">Catálogo</Link></li>
                <li><Link to="/" className="hover:text-primary transition-colors">Novidades</Link></li>
                <li><Link to="/" className="hover:text-primary transition-colors">Em Alta</Link></li>
              </ul>
            </div>
            
            <div className="space-y-6">
              <h4 className="text-xs font-bold uppercase tracking-widest">Suporte</h4>
              <ul className="space-y-4 text-sm text-muted-foreground">
                <li><Link to="/" className="hover:text-primary transition-colors">FAQ</Link></li>
                <li><Link to="/" className="hover:text-primary transition-colors">Termos de Uso</Link></li>
                <li><Link to="/" className="hover:text-primary transition-colors">Privacidade</Link></li>
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="text-xs font-bold uppercase tracking-widest">Newsletter</h4>
              <p className="text-sm text-muted-foreground">Receba avisos de novos tesouros no seu e-mail.</p>
              <div className="flex gap-2">
                <input type="email" placeholder="Seu e-mail..." className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-primary/50" />
                <button className="bg-primary text-primary-foreground px-4 py-2 rounded-xl font-bold uppercase text-[10px] tracking-widest">OK</button>
              </div>
            </div>
          </div>
          
          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-muted-foreground text-[10px] font-bold uppercase tracking-[0.2em]">
            <p>© 2025 Jogos Piratas. Todos os tesouros reservados.</p>
            <div className="flex gap-8">
              <span>Desenvolvido por Richard, Bruno e Isabela</span>
              <span className="text-primary">v1.0.0</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
