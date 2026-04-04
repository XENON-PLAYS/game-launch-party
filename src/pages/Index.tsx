import { useState, useMemo } from "react";
import { Search, SlidersHorizontal, LayoutGrid, X, Target, Sword, Ghost, Shield, Compass, Users, Clock, Zap, Star, Gamepad2, Layers, Trash2 } from "lucide-react";
import { GameCard } from "@/components/GameCard";
import { GameSection } from "@/components/GameSection";
import { Header } from "@/components/Header";
import { SEO } from "@/components/SEO";
import { HeroCarousel } from "@/components/HeroCarousel";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";

type SortOption = "nome" | "pesado" | "leve" | "popular" | "alta" | "lancamento";

const categoryIconMap: Record<string, any> = {
  "FPS": Target,
  "RPG": Shield,
  "Ação": Sword,
  "Terror": Ghost,
  "Aventura": Compass,
  "Multiplayer": Users,
  "Estratégia": Layers,
  "Simulação": Gamepad2,
  "Sobrevivência": Shield,
  "Mundo Aberto": Compass,
  "Battle Royale": Target,
  "Soulslike": Sword,
  "Plataforma": Layers,
  "Casual": Gamepad2,
  "Puzzle": Gamepad2,
  "Sandbox": Gamepad2,
  "Indie": Gamepad2,
  "Tático": Target,
  "Hack and Slash": Sword,
  "MMORPG": Users,
  "Farming Sim": Gamepad2,
};

const Index = () => {
  const [busca, setBusca] = useState("");
  const [categoria, setCategoria] = useState("todas");
  const [ordenacao, setOrdenacao] = useState<SortOption>("nome");
  const [showFilters, setShowFilters] = useState(false);

  const { data: games = [], isLoading } = useQuery({
    queryKey: ["games"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("games")
        .select("id, nome, preco, imagem, slug, download_count, categorias, vertical_image, capsule_image, lancamento, destaques, rating_avg")
        .order("nome");
      if (error) throw error;
      return data;
    },
  });

  const allCategories = useMemo(() => {
    return Array.from(new Set(games.flatMap((g) => g.categorias || []))).sort();
  }, [games]);

  const emAlta = useMemo(() => [...games].sort((a, b) => b.download_count - a.download_count).slice(0, 10), [games]);
  const recomendados = useMemo(() => games.filter((g) => (g as any).rating_avg >= 4 || (g.destaques && (g.destaques as string[]).length > 0)).slice(0, 10), [games]);
  const recentes = useMemo(() => [...games].sort((a, b) => (b.lancamento || "").localeCompare(a.lancamento || "")).slice(0, 10), [games]);

  const isSearching = busca || categoria !== "todas";

  const filteredGames = useMemo(() => {
    let result = games;
    if (busca) result = result.filter((g) => g.nome.toLowerCase().includes(busca.toLowerCase()));
    if (categoria !== "todas") result = result.filter((g) => g.categorias && g.categorias.includes(categoria));
    
    result = [...result].sort((a, b) => {
      if (ordenacao === "pesado") {
        const parseSize = (s: string | null) => {
          if (!s) return 0;
          const match = s.match(/(\d+(\.\d+)?)/);
          return match ? parseFloat(match[1]) : 0;
        };
        return parseSize(b.tamanho) - parseSize(a.tamanho);
      }
      if (ordenacao === "leve") {
        const parseSize = (s: string | null) => {
          if (!s) return Infinity;
          const match = s.match(/(\d+(\.\d+)?)/);
          return match ? parseFloat(match[1]) : Infinity;
        };
        return parseSize(a.tamanho) - parseSize(b.tamanho);
      }
      if (ordenacao === "popular" || ordenacao === "alta") return (b.download_count || 0) - (a.download_count || 0);
      if (ordenacao === "lancamento") return (b.lancamento || "").localeCompare(a.lancamento || "");
      return a.nome.localeCompare(b.nome);
    });
    return result;
  }, [busca, categoria, ordenacao, games]);

  return (
    <div className="min-h-screen bg-background/20 text-foreground antialiased selection:bg-primary selection:text-primary-foreground">
      <SEO />
      <Header />
      
      {!isSearching && <HeroCarousel />}

      <section className="bg-background/50 backdrop-blur-3xl sticky top-[60px] sm:top-20 z-30 border-b border-border/40 py-4 sm:py-6">
        <div className="container-responsive">
          <div className="flex flex-col md:flex-row gap-4 sm:gap-6 items-center justify-between">
            <div className="w-full md:max-w-2xl relative group">
              <Search className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                placeholder="Qual obra-prima você está procurando?" 
                value={busca} 
                onChange={(e) => setBusca(e.target.value)}
                className="w-full pl-10 sm:pl-16 pr-6 py-3 sm:py-4 bg-card border border-primary/20 rounded-xl sm:rounded-2xl text-sm sm:text-lg focus:outline-none focus:ring-4 focus:ring-primary/20 transition-all shadow-xl shadow-black/5 placeholder:text-muted-foreground/50" 
              />
              {busca && (
                <button 
                  onClick={() => setBusca("")}
                  className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 transition-colors"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              )}
            </div>
            
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`w-full md:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl border transition-all flex items-center justify-center gap-3 font-bold text-xs sm:text-sm tracking-[0.1em] uppercase group ${
                showFilters ? "bg-primary text-primary-foreground border-primary shadow-2xl shadow-primary/20" : "bg-card border-border/50 hover:border-primary/30"
              }`}
            >
              <SlidersHorizontal className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-500 ${showFilters ? "rotate-180" : ""}`} />
              <span>Filtros Refinados</span>
              {(categoria !== "todas" || ordenacao !== "nome") && (
                <span className={`flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-black animate-in zoom-in duration-300 ${showFilters ? "bg-white text-primary" : "bg-primary text-white"}`}>
                  {(categoria !== "todas" ? 1 : 0) + (ordenacao !== "nome" ? 1 : 0)}
                </span>
              )}
            </button>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.5, ease: "circOut" }}
                className="overflow-hidden"
              >
                <div className="pt-8 border-t border-border/40 mt-8 pb-12">
                  <div className="flex flex-col lg:flex-row gap-12">
                    {/* Categorias Section */}
                    <div className="flex-1 space-y-6">
                      <div className="flex items-center gap-3">
                        <div className="w-1.5 h-6 bg-primary rounded-full shadow-lg shadow-primary/20" />
                        <h3 className="text-sm font-black uppercase tracking-widest text-foreground/80">Filtrar por Categoria</h3>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                        <button 
                          onClick={() => setCategoria("todas")} 
                          className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-black transition-all border ${
                            categoria === "todas" 
                            ? "bg-primary text-primary-foreground border-primary shadow-xl shadow-primary/20 scale-105" 
                            : "bg-card/50 border-border/50 hover:border-primary/30 hover:bg-card/80 text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          <LayoutGrid className="w-4 h-4" />
                          <span>TODAS</span>
                        </button>
                        {allCategories.map((cat) => {
                          const Icon = categoryIconMap[cat] || Gamepad2;
                          return (
                            <button 
                              key={cat} 
                              onClick={() => setCategoria(cat)} 
                              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black transition-all border ${
                                categoria === cat 
                                ? "bg-primary text-primary-foreground border-primary shadow-xl shadow-primary/20 scale-105" 
                                : "bg-card/50 border-border/50 hover:border-primary/30 hover:bg-card/80 text-muted-foreground hover:text-foreground"
                              }`}
                            >
                              <Icon className="w-4 h-4" />
                              <span className="uppercase">{cat}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Ordenação Section */}
                    <div className="lg:w-80 space-y-6">
                      <div className="flex items-center gap-3">
                        <div className="w-1.5 h-6 bg-primary rounded-full shadow-lg shadow-primary/20" />
                        <h3 className="text-sm font-black uppercase tracking-widest text-foreground/80">Ordenar Catálogo</h3>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
                        {[
                          { id: "nome", label: "Alfabética", icon: LayoutGrid },
                          { id: "popular", label: "Popular", icon: Star },
                          { id: "alta", label: "Em Alta", icon: Zap },
                          { id: "pesado", label: "Mais Pesado", icon: Layers },
                          { id: "leve", label: "Mais Leve", icon: Zap },
                          { id: "lancamento", label: "Lançamentos", icon: Clock }
                        ].map((opt) => (
                          <button 
                            key={opt.id} 
                            onClick={() => setOrdenacao(opt.id as SortOption)} 
                            className={`flex items-center gap-3 px-6 py-4 rounded-xl text-xs font-black transition-all border ${
                              ordenacao === opt.id 
                              ? "bg-primary text-primary-foreground border-primary shadow-xl shadow-primary/20" 
                              : "bg-card/50 border-border/50 hover:border-primary/30 hover:bg-card/80 text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            <opt.icon className="w-4 h-4" />
                            <span className="uppercase">{opt.label}</span>
                          </button>
                        ))}
                      </div>

                      <div className="pt-6 border-t border-border/20">
                        <button 
                          onClick={() => { setBusca(""); setCategoria("todas"); setOrdenacao("nome"); }}
                          className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl text-xs font-black text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-all border border-dashed border-border/50 hover:border-destructive/30 uppercase tracking-widest"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Redefinir Filtros</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <main className="container-responsive py-12 md:py-24 space-y-20 md:space-y-40">
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 sm:gap-8">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="bg-card rounded-2xl overflow-hidden border border-border/50 p-2">
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
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-10 md:space-y-16"
          >
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-10 border-b-2 border-primary/20 pb-10 md:pb-16">
              <div className="space-y-4">
                <h2 className="text-responsive-h2"><span className="text-primary">Catálogo</span> <span className="text-foreground">Filtrado</span></h2>
                <div className="flex items-center gap-4">
                  <span className="w-16 md:w-24 h-1.5 bg-primary rounded-full shadow-lg shadow-primary/20" />
                  <p className="text-sm md:text-responsive-body font-medium">
                    {filteredGames.length} jogo{filteredGames.length !== 1 ? "s" : ""} encontrado{filteredGames.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 md:gap-3">
                <span className="text-[10px] md:text-xs font-bold text-muted-foreground opacity-60 self-center uppercase tracking-widest">Filtros:</span>
                {categoria !== "todas" && <span className="text-primary bg-primary/10 px-3 md:px-4 py-1.5 md:py-2 rounded-full text-[9px] md:text-[10px] font-black border border-primary/20 uppercase tracking-widest">{categoria}</span>}
                {busca && <span className="text-primary bg-primary/10 px-3 md:px-4 py-1.5 md:py-2 rounded-full text-[9px] md:text-[10px] font-black border border-primary/20 uppercase tracking-widest">"{busca}"</span>}
              </div>
            </div>

            {filteredGames.length === 0 ? (
              <div className="text-center py-20 md:py-40 space-y-8 md:space-y-10 max-w-2xl mx-auto">
                <div className="inline-flex p-8 md:p-12 rounded-full bg-primary/5 border border-primary/10 mb-4 md:mb-8">
                  <LayoutGrid className="w-16 h-16 md:w-24 md:h-24 text-primary/30" />
                </div>
                <h3 className="text-xl md:text-responsive-h3 uppercase font-extrabold tracking-tight">Nenhum tesouro encontrado</h3>
                <p className="text-sm md:text-responsive-body">
                  Não encontramos nenhum título com esses critérios. Tente navegar pelas categorias para descobrir os melhores jogos da nova geração.
                </p>
                <button 
                  onClick={() => { setBusca(""); setCategoria("todas"); }}
                  className="px-8 md:px-12 py-4 md:py-6 bg-primary text-primary-foreground rounded-full font-black uppercase tracking-[0.2em] text-[10px] md:text-xs hover:scale-105 transition-all shadow-2xl shadow-primary/30"
                >
                  Catálogo Completo
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6 md:gap-8">
                {filteredGames.map((game, i) => (
                  <motion.div 
                    key={game.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                  >
                    <GameCard game={game} />
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        ) : (
          <div className="space-y-32 md:space-y-60">
            <GameSection title="Mais Jogados" icon="flame" games={emAlta} />
            <GameSection title="⭐ Seleção de Elite" icon="star" games={recomendados} />
            <GameSection title="Jogos da Nova Geração" icon="rocket" games={recentes} />
            
            <section className="space-y-12 md:space-y-16">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 md:gap-10 border-b-2 border-primary/20 pb-12 md:pb-20">
                <div className="space-y-4">
                  <h2 className="text-responsive-h2 leading-none font-extrabold"><span className="text-primary">Jogos</span> <span className="text-foreground">Mais Baixados</span></h2>
                  <div className="flex items-center gap-4 md:gap-8">
                    <span className="w-20 md:w-32 h-1.5 md:h-2 bg-primary rounded-full shadow-2xl shadow-primary/30" />
                    <span className="text-sm md:text-responsive-body font-medium">{games.length} experiências de alto nível</span>
                  </div>
                </div>
                
                <select 
                  value={ordenacao} 
                  onChange={(e) => setOrdenacao(e.target.value as SortOption)}
                  className="bg-card border border-border/50 rounded-xl sm:rounded-2xl px-6 md:px-8 py-3.5 md:py-5 text-xs md:text-sm font-bold uppercase tracking-widest focus:outline-none focus:ring-8 focus:ring-primary/5 transition-all hover:border-primary/30 cursor-pointer shadow-xl shadow-black/10"
                >
                  <option value="nome">Ordem Alfabética</option>
                  <option value="preco_asc">Melhor Investimento</option>
                  <option value="preco_desc">Experiência Premium</option>
                  <option value="lancamento">Novidades da Frota</option>
                </select>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6 md:gap-8">
                {games.map((game) => <GameCard key={game.id} game={game} />)}
              </div>
            </section>
          </div>
        )}
      </main>

      <footer className="border-t border-border/50 bg-card py-16 md:py-48 mt-20 md:mt-60">
        <div className="container-responsive">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-24 mb-16 md:mb-32">
            <div className="space-y-6 md:space-y-12">
              <div className="flex flex-col">
                <span className="font-black text-3xl md:text-4xl tracking-tighter leading-none">JOGOS</span>
                <span className="font-black text-3xl md:text-4xl tracking-tighter leading-none text-primary">GRATIS</span>
              </div>
              <p className="text-sm md:text-responsive-body max-w-sm">
                A maior comunidade de compartilhamento de jogos. Descubra os melhores jogos da nova geração, jogue com seus amigos e compartilhe suas experiências épicas.
              </p>
            </div>
            
            <div className="space-y-6 md:space-y-12">
              <h4 className="text-responsive-small text-foreground font-extrabold">Plataforma</h4>
              <ul className="space-y-3 md:space-y-6 text-base md:text-lg font-medium">
                <li><button className="hover:text-primary transition-colors">Início</button></li>
                <li><button className="hover:text-primary transition-colors">Catálogo</button></li>
                <li><button className="hover:text-primary transition-colors">Novidades</button></li>
              </ul>
            </div>
            
            <div className="space-y-6 md:space-y-12">
              <h4 className="text-responsive-small text-foreground font-extrabold">Suporte</h4>
              <ul className="space-y-3 md:space-y-6 text-base md:text-lg font-medium">
                <li><button className="hover:text-primary transition-colors">Central de Ajuda</button></li>
                <li><button className="hover:text-primary transition-colors">Termos de Uso</button></li>
                <li><button className="hover:text-primary transition-colors">Privacidade</button></li>
              </ul>
            </div>

            <div className="space-y-6 md:space-y-12">
              <h4 className="text-responsive-small text-foreground font-extrabold">Informativo</h4>
              <p className="text-sm md:text-responsive-body">Receba avisos de novos tesouros diretamente no seu e-mail.</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <input type="email" placeholder="Seu e-mail..." className="bg-background border border-border/50 rounded-xl px-4 md:px-6 py-3 md:py-5 text-xs md:text-sm w-full focus:outline-none focus:ring-4 focus:ring-primary/10 shadow-xl shadow-black/5" />
                <button className="bg-primary text-primary-foreground px-6 md:px-10 py-3 md:py-5 rounded-xl font-black uppercase text-[10px] md:text-xs tracking-widest shadow-2xl shadow-primary/20 hover:scale-105 transition-all">OK</button>
              </div>
            </div>
          </div>
          
          <div className="pt-8 md:pt-16 border-t border-border/40 flex flex-col md:flex-row justify-between items-center gap-6 md:gap-10 text-[10px] md:text-sm font-bold opacity-40 uppercase tracking-widest text-center md:text-left">
            <p>© 2025 JOGOS GRATIS. Navegação segura e eficiente.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;