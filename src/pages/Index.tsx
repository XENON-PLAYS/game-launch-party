import { useState, useMemo, useEffect, useCallback } from "react";
import { Search, SlidersHorizontal, LayoutGrid, X, Target, Sword, Ghost, Shield, Compass, Users, Clock, Zap, Star, Gamepad2, Layers, Trash2, Flame, Rocket, ChevronLeft, ChevronRight } from "lucide-react";
import { GameSection } from "@/components/GameSection";
import { Header } from "@/components/Header";
import { SEO } from "@/components/SEO";
import { HeroCarousel } from "@/components/HeroCarousel";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { Database } from "@/integrations/supabase/types";
import { games as localGamesData } from "@/data/games";
import { RepackCard, Repack } from "@/components/RepackCard";

export type Game = Database["public"]["Tables"]["games"]["Row"];
type SortOption = "nome" | "pesado" | "leve" | "popular" | "alta" | "lancamento";

const categoryIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  "Ação": Target,
  "Aventura": Compass,
  "RPG": Sword,
  "Estratégia": Shield,
  "Simulação": Gamepad2,
  "Esportes": Target,
  "Corrida": Zap,
  "Luta": Target,
  "Terror": Ghost,
  "Mundo Aberto": Compass,
  "FPS": Target,
  "TPS": Target,
  "Sobrevivência": Shield,
  "Sandbox": Layers,
  "Plataforma": Layers,
  "Puzzle": Layers,
  "Casual": Gamepad2,
  "Indie": Rocket,
  "Multijogador": Users,
  "Cooperativo": Users,
  "Single-player": Gamepad2,
  "MMORPG": Users,
  "Farming Sim": Gamepad2,
};

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const searchFromUrl = searchParams.get("search") || "";
  
  const [busca, setBusca] = useState(searchFromUrl);
  const [categoria, setCategoria] = useState("todas");

  useEffect(() => {
    setBusca(searchFromUrl);
  }, [searchFromUrl]);

  // Update URL when search changes (with debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (busca) {
        setSearchParams(prev => {
          const newParams = new URLSearchParams(prev);
          newParams.set("search", busca);
          return newParams;
        }, { replace: true });
      } else {
        setSearchParams(prev => {
          const newParams = new URLSearchParams(prev);
          newParams.delete("search");
          return newParams;
        }, { replace: true });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [busca, setSearchParams]);

  const queryClient = useQueryClient();
  const [ordenacao, setOrdenacao] = useState<SortOption>("nome");
  const [showFilters, setShowFilters] = useState(false);
  const [catalogPage, setCatalogPage] = useState(0);
  const CATALOG_PAGE_SIZE = 50;
  const [sectionsPage, setSectionsPage] = useState(0);
  const SECTIONS_PAGE_SIZE = 12;

  const { data: gamesData, isLoading: gamesLoading, isError: gamesError, refetch } = useQuery({
    queryKey: ["games"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase.from("games").select("*").order("nome");
        if (error || !data || data.length === 0) {
          return localGamesData.map(g => ({
            id: String(g.id),
            nome: g.nome,
            imagem: g.imagem,
            hero_image: g.heroImage || null,
            vertical_image: g.verticalImage || null,
            capsule_image: g.capsuleImage || null,
            download_count: 0,
            lancamento: g.lancamento || "",
            categorias: g.categorias || [],
            tamanho: g.tamanho || "0 GB",
            descricao: g.descricao || "",
            desenvolvedor: g.desenvolvedor || "",
            distribuidor: g.distribuidor || "",
            preco: g.preco || 0,
            requisitos_minimo: typeof g.requisitos?.minimo === 'object' ? g.requisitos.minimo : {},
            requisitos_recomendado: typeof g.requisitos?.recomendado === 'object' ? g.requisitos.recomendado : {},
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            classificacao: g.classificacao || null,
            destaques: g.destaques || [],
            galeria: [],
            idiomas: g.idiomas || [],
            link_demo: null,
            modos: g.modos || [],
            observacoes: null,
            passo_a_passo: null,
            pre_requisitos: null,
            rating_avg: 0,
            rating_count: 0,
            slug: g.nome.toLowerCase().replace(/\s+/g, '-'),
            trailer_url: g.trailer || null,
          })) as Game[];
        }
        return data as Game[];
      } catch (err) {
        return localGamesData.map(g => ({ ...g, id: String(g.id) })) as unknown as Game[];
      }
    },
    initialData: localGamesData.map(g => ({ ...g, id: String(g.id) })) as unknown as Game[],
    staleTime: 1000 * 60 * 5,
  });

  const { data: featuredData, isLoading: featuredLoading } = useQuery({
    queryKey: ["featured-games"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase.from("games").select("*").order("lancamento", { ascending: false }).limit(5);
        if (error || !data || data.length === 0) {
          return localGamesData.slice(0, 5).map(g => ({ ...g, id: String(g.id) })) as unknown as Game[];
        }
        return data as Game[];
      } catch (err) {
        return localGamesData.slice(0, 5).map(g => ({ ...g, id: String(g.id) })) as unknown as Game[];
      }
    },
    initialData: localGamesData.slice(0, 5).map(g => ({ ...g, id: String(g.id) })) as unknown as Game[],
    staleTime: 1000 * 60 * 60,
  });

  // Repacks para a home (catálogo) — carrega em lotes e vai preenchendo o cache
  // a cada lote para que os cards apareçam imediatamente após a 1ª requisição,
  // em vez de esperar todo o dataset (10k+) terminar de carregar.
  const { data: recentRepacks } = useQuery({
    queryKey: ["repacks-home"],
    queryFn: async () => {
      const all: Repack[] = [];
      let from = 0;
      // 1º lote pequeno para os primeiros cards aparecerem quase instantaneamente,
      // depois lotes grandes para completar o catálogo/seções em segundo plano.
      let size = 60;
      for (;;) {
        const { data, error } = await (supabase as any)
          .from("merged_repacks")
          .select("id, title, file_size, upload_date, cover_url, sources")
          .order("upload_date", { ascending: false, nullsFirst: false })
          .range(from, from + size - 1);
        if (error) {
          if (all.length > 0) break; // já temos algo para exibir
          throw error;
        }
        const batch = (data ?? []) as Repack[];
        all.push(...batch);
        // Publica o progresso parcial: assinantes re-renderizam com os cards já disponíveis.
        queryClient.setQueryData(["repacks-home"], [...all]);
        if (batch.length < size) break;
        from += size;
        size = 1000; // lotes maiores para o restante
      }
      return all;
    },
    staleTime: 1000 * 60 * 5,
  });


  // Repacks que batem com a busca atual
  const { data: searchedRepacks } = useQuery({
    queryKey: ["repacks-search", busca],
    queryFn: async () => {
      const term = busca.trim();
      if (!term) return [] as Repack[];
      const { data, error } = await (supabase as any)
        .from("merged_repacks")
        .select("id, title, file_size, upload_date, cover_url")
        .ilike("title", `%${term}%`)
        .order("upload_date", { ascending: false, nullsFirst: false })
        .limit(24);
      if (error) throw error;
      return (data ?? []) as Repack[];
    },
    enabled: !!busca.trim(),
    staleTime: 1000 * 60 * 5,
  });

  const games = useMemo(() => (gamesData || []) as Game[], [gamesData]);
  const featured = useMemo(() => (featuredData || []) as Game[], [featuredData]);
  const homeRepacks = useMemo(() => (recentRepacks || []) as Repack[], [recentRepacks]);
  const matchedRepacks = useMemo(() => (searchedRepacks || []) as Repack[], [searchedRepacks]);

  // Normaliza títulos para casar jogo tradicional <-> repack
  const normalizeTitle = (t: string) =>
    (t || "")
      .toLowerCase()
      .replace(/['’`]/g, "")
      .replace(/\b(free download|digital deluxe edition|deluxe edition|ultimate edition|gold edition|complete edition|goty edition|game of the year edition|definitive edition|premium edition|standard edition|digital edition|enhanced edition|anniversary edition|collectors edition|special edition|edition|crack only|bonus content|all dlcs|dlcs|dlc)\b.*$/g, "")
      .replace(/[^a-z0-9]+/g, "");

  // Mapa game.id -> repack correspondente (traz dados/download do repack)
  const gameRepackMap = useMemo(() => {
    const byNorm = new Map<string, Repack>();
    homeRepacks.forEach((r) => {
      const key = normalizeTitle(r.title);
      if (key && !byNorm.has(key)) byNorm.set(key, r);
    });
    const map: Record<string, Repack> = {};
    games.forEach((g) => {
      const match = byNorm.get(normalizeTitle(g.nome));
      if (match) map[g.id] = match;
    });
    return map;
  }, [games, homeRepacks]);

  // Lista curada de jogos que REALMENTE possuem Denuvo.
  // A comparação é feita por título normalizado/exato para evitar falsos positivos
  // causados por palavras soltas como "wukong", "dead space", "football manager" etc.
  const denuvoGameTitles = useMemo(
    () => [
      "Black Myth: Wukong",
      "Hogwarts Legacy",
      "Star Wars Jedi: Fallen Order",
      "Star Wars Jedi: Survivor",
      "Star Wars Outlaws",
      "Resident Evil 2 Remake",
      "Resident Evil 2 2019",
      "Resident Evil 3 Remake",
      "Resident Evil 3 2020",
      "Resident Evil 4 Remake",
      "Resident Evil 4 2023",
      "Resident Evil 7 Biohazard",
      "Resident Evil Village",
      "Assassin's Creed Origins",
      "Assassin's Creed Odyssey",
      "Assassin's Creed Valhalla",
      "Assassin's Creed Mirage",
      "Assassin's Creed Shadows",
      "Mortal Kombat 1",
      "Mortal Kombat 11",
      "Tekken 7",
      "Tekken 8",
      "Dragon's Dogma 2",
      "Final Fantasy VII Remake",
      "Final Fantasy VII Rebirth",
      "Final Fantasy XV",
      "Final Fantasy XVI",
      "Sonic Frontiers",
      "Sonic Superstars",
      "Sonic X Shadow Generations",
      "Yakuza: Like a Dragon",
      "Like a Dragon: Infinite Wealth",
      "Like a Dragon: Ishin",
      "Like a Dragon Gaiden: The Man Who Erased His Name",
      "Dead Space Remake",
      "Dead Space Remake 2023",
      "Dead Space 2023",
      "Hitman 3",
      "Hitman World of Assassination",
      "EA Sports FC 24",
      "EA Sports FC 25",
      "FIFA 21",
      "FIFA 22",
      "FIFA 23",
      "F1 23",
      "F1 24",
      "F1 25",
      "Need for Speed Unbound",
      "Lords of the Fallen",
      "The Callisto Protocol",
      "Atomic Heart",
      "Returnal",
      "Forspoken",
      "Wo Long: Fallen Dynasty",
      "Street Fighter 6",
      "Tales of Arise",
      "Monster Hunter Rise",
      "Monster Hunter Wilds",
      "Silent Hill 2 Remake",
      "Dragon Age: The Veilguard",
      "Avatar: Frontiers of Pandora",
      "Prince of Persia: The Lost Crown",
      "Warhammer 40000: Space Marine 2",
      "Warhammer 40,000: Space Marine 2",
      "Metaphor: ReFantazio",
      "Persona 3 Reload",
      "Persona 5 Tactica",
    ],
    []
  );

  const denuvoTitleKeys = useMemo(
    () => new Set(denuvoGameTitles.map((title) => normalizeTitle(title))),
    [denuvoGameTitles]
  );

  const isDenuvoRepack = useCallback((r: Repack) => {
    const key = normalizeTitle(r.title || "");
    return [...denuvoTitleKeys].some((denuvoKey) => key === denuvoKey || key.startsWith(denuvoKey));
  }, [denuvoTitleKeys]);


  // Palavras-chave por categoria para filtrar os repacks (que não possuem categorias próprias)
  const categoryKeywords: Record<string, string[]> = {
    "Ação": ["god of war", "devil may cry", "assassin", "batman", "spider-man", "spiderman", "max payne", "just cause", "sleeping dogs", "metal gear", "ninja gaiden", "dmc"],
    "Aventura": ["tomb raider", "uncharted", "indiana", "zelda", "life is strange", "detroit", "heavy rain", "a way out", "brothers"],
    "RPG": ["elden ring", "witcher", "dark souls", "skyrim", "elder scrolls", "fallout", "dragon age", "mass effect", "final fantasy", "persona", "cyberpunk", "baldur", "diablo", "dragon's dogma", "dragons dogma", "kingdom come", "divinity"],
    "Estratégia": ["civilization", "total war", "age of empires", "xcom", "company of heroes", "anno", "crusader kings", "stellaris", "starcraft", "warcraft"],
    "Simulação": ["the sims", "cities skylines", "planet", "farming simulator", "flight simulator", "truck simulator", "house flipper"],
    "Esportes": ["fifa", "ea sports fc", "nba", "pes", "efootball", "madden", "wwe", "tony hawk"],
    "Corrida": ["need for speed", "forza", "dirt", "f1", "gran turismo", "wreckfest", "the crew", "grid", "assetto"],
    "Luta": ["mortal kombat", "tekken", "street fighter", "injustice", "guilty gear", "dragon ball", "naruto", "for honor"],
    "Terror": ["resident evil", "silent hill", "outlast", "dead space", "amnesia", "the evil within", "phasmophobia", "dead by daylight", "alien isolation", "layers of fear"],
    "Mundo Aberto": ["grand theft auto", "gta", "red dead", "far cry", "watch dogs", "saints row", "horizon", "ghost of", "days gone"],
    "FPS": ["call of duty", "battlefield", "doom", "counter-strike", "counter strike", "halo", "wolfenstein", "rainbow six", "borderlands", "titanfall", "metro"],
    "Sobrevivência": ["the forest", "raft", "subnautica", "green hell", "valheim", "rust", "dayz", "grounded", "conan exiles", "state of decay"],
    "Sandbox": ["minecraft", "terraria", "garry", "teardown"],
    "Plataforma": ["mario", "sonic", "crash", "spyro", "ori", "hollow knight", "celeste", "rayman", "little nightmares"],
    "Puzzle": ["portal", "the witness", "talos", "baba is you", "tetris", "limbo", "inside"],
    "Indie": ["hades", "stardew", "cuphead", "undertale", "dead cells"],
    "Multijogador": ["among us", "fall guys", "gang beasts", "overcooked", "it takes two"],
    "MMORPG": ["world of warcraft", "final fantasy xiv", "guild wars", "new world", "black desert", "lost ark"],
  };

  const parseRepackSize = (s: string | null) => {
    if (!s) return 0;
    const match = s.match(/(\d+([.,]\d+)?)\s*(GB|MB|KB|TB)?/i);
    if (!match) return 0;
    const value = parseFloat(match[1].replace(",", "."));
    const unit = (match[3] || "GB").toUpperCase();
    const multipliers: Record<string, number> = { KB: 1 / (1024 * 1024), MB: 1 / 1024, GB: 1, TB: 1024 };
    return value * (multipliers[unit] || 1);
  };

  // Catálogo composto apenas por repacks
  const catalogItems = useMemo(
    () => homeRepacks.map((r) => ({ type: "repack" as const, id: r.id, data: r })),
    [homeRepacks]
  );

  const catalogTotalPages = Math.max(1, Math.ceil(catalogItems.length / CATALOG_PAGE_SIZE));
  const catalogPageItems = useMemo(
    () => catalogItems.slice(catalogPage * CATALOG_PAGE_SIZE, catalogPage * CATALOG_PAGE_SIZE + CATALOG_PAGE_SIZE),
    [catalogItems, catalogPage]
  );

  useEffect(() => {
    if (catalogPage > catalogTotalPages - 1) setCatalogPage(0);
  }, [catalogTotalPages, catalogPage]);

  // Categorias (fixas) + filtro "Denuvo", agora funcionais sobre repacks
  const allCategories = useMemo(
    () => ["Denuvo", ...Object.keys(categoryKeywords).sort((a, b) => a.localeCompare(b))],
    []
  );

  // ------- Seções da Home (somente repacks) -------
  const denuvoRepacks = useMemo(() => {
    const matches = homeRepacks.filter(isDenuvoRepack);
    return matches.slice(0, 48);
  }, [homeRepacks, isDenuvoRepack]);
  // Mais Baixados: repacks maiores primeiro
  const emAlta = useMemo(
    () => [...homeRepacks].sort((a, b) => parseRepackSize(b.file_size) - parseRepackSize(a.file_size)).slice(0, 48),
    [homeRepacks]
  );
  // Nova Geração: apenas jogos lançados entre 2025 e 2026
  const recentes = useMemo(
    () =>
      homeRepacks
        .filter((r) => {
          const year = r.upload_date ? new Date(r.upload_date).getFullYear() : NaN;
          return year >= 2025 && year <= 2026;
        })
        .sort((a, b) => {
          const da = a.upload_date ? new Date(a.upload_date).getTime() : 0;
          const db = b.upload_date ? new Date(b.upload_date).getTime() : 0;
          if (db !== da) return db - da; // mais recente primeiro
          return parseRepackSize(b.file_size) - parseRepackSize(a.file_size); // relevância (tamanho)
        })
        .slice(0, 48),
    [homeRepacks]
  );


  const isLoading = gamesLoading;
  const isError = gamesError;

  const isSearching = busca || categoria !== "todas";

  // Jogos populares/mais jogados da Steam (para ranquear a busca por relevância)
  const popularKeywords = useMemo(
    () => [
      "counter-strike", "cs2", "dota", "pubg", "gta", "grand theft auto", "red dead",
      "elden ring", "cyberpunk", "the witcher", "baldur", "hogwarts", "black myth", "wukong",
      "god of war", "spider-man", "spiderman", "call of duty", "battlefield", "far cry",
      "assassin", "resident evil", "monster hunter", "fifa", "ea sports fc", "minecraft",
      "terraria", "stardew", "rust", "ark", "palworld", "helldivers", "hades", "dark souls",
      "sekiro", "hollow knight", "forza", "need for speed", "mortal kombat", "tekken",
      "street fighter", "dragon ball", "naruto", "silent hill", "dead space", "starfield",
      "diablo", "path of exile", "the sims", "cities skylines", "valheim", "dave the diver",
    ],
    []
  );

  // Pontua a relevância de um repack em relação ao termo buscado
  const relevanceScore = (r: Repack, term: string) => {
    const title = (r.title || "").toLowerCase();
    let score = 0;
    if (title === term) score += 1000; // título exato
    else if (title.startsWith(term)) score += 500; // começa com o termo
    else if (title.includes(` ${term}`)) score += 250; // termo como palavra
    else if (title.includes(term)) score += 100; // contém o termo
    if (popularKeywords.some((k) => title.includes(k))) score += 300; // jogo popular/Steam
    // Quanto mais curto o título em relação ao termo, mais provável ser o jogo base
    score += Math.max(0, 60 - Math.abs(title.length - term.length));
    return score;
  };

  const filteredRepacks = useMemo(() => {
    let result = busca.trim() ? matchedRepacks : homeRepacks;
    if (busca) {
      const term = busca.toLowerCase();
      result = result.filter((r) => (r.title || "").toLowerCase().includes(term));
    }
    if (categoria === "Denuvo") {
      result = result.filter(isDenuvoRepack);
    } else if (categoria !== "todas") {
      const kws = categoryKeywords[categoria] || [];
      result = result.filter((r) => kws.some((k) => (r.title || "").toLowerCase().includes(k)));
    }
    const sorted = [...result];
    if (ordenacao === "pesado") {
      sorted.sort((a, b) => parseRepackSize(b.file_size) - parseRepackSize(a.file_size));
    } else if (ordenacao === "leve") {
      sorted.sort((a, b) => parseRepackSize(a.file_size) - parseRepackSize(b.file_size));
    } else if (ordenacao === "lancamento") {
      sorted.sort((a, b) => (b.upload_date || "").localeCompare(a.upload_date || ""));
    } else if (busca.trim()) {
      // Busca ativa sem ordenação explícita: ranquear por relevância + popularidade
      const term = busca.toLowerCase();
      sorted.sort((a, b) => relevanceScore(b, term) - relevanceScore(a, term));
    } else if (ordenacao === "nome") {
      sorted.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
    }
    return sorted;
  }, [busca, categoria, ordenacao, homeRepacks, matchedRepacks, popularKeywords, isDenuvoRepack]);


  // Resultados (somente repacks) para a busca/filtro
  const filteredItems = useMemo(
    () => filteredRepacks.map((r) => ({ type: "repack" as const, id: r.id, data: r })),
    [filteredRepacks]
  );


  const firstHeroImage = featured && featured.length > 0 ? (featured[0].hero_image || featured[0].imagem) : undefined;
  const firstHeroPoster = featured && featured.length > 0 ? (featured[0].vertical_image || featured[0].imagem) : undefined;

  return (
    <div className="min-h-screen bg-background/20 text-foreground antialiased selection:bg-primary selection:text-primary-foreground">
      <SEO preloadImage={firstHeroImage} preloadPoster={firstHeroPoster} />
      <Header />
      
      {!isSearching && <HeroCarousel initialFeatured={featured} isLoadingInitial={featuredLoading} />}

      <section className="bg-background/80 backdrop-blur-2xl sticky top-[60px] md:top-[72px] z-[90] border-b border-border py-4 md:py-6 transition-all duration-300">
        <div className="container mx-auto px-4 md:px-12">
          <div className="flex flex-col md:flex-row gap-4 items-center max-w-7xl mx-auto">
            {/* Unified Search Input */}
            <div className="flex-1 w-full relative group">
              <div className="absolute inset-0 bg-primary/5 rounded-2xl blur-lg opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
              <div className="relative flex items-center">
                <Search className="absolute left-5 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors duration-300" />
                <input 
                  type="text" 
                  placeholder="Pesquisar jogos, categorias ou desenvolvedoras..." 
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="w-full pl-14 pr-12 py-4 bg-muted/30 border border-border rounded-2xl text-sm md:text-base focus:outline-none focus:bg-muted/50 focus:border-primary/30 transition-all placeholder:text-muted-foreground/50 font-medium" 
                />
                <AnimatePresence>
                  {busca && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      onClick={() => setBusca("")}
                      className="absolute right-4 p-1.5 rounded-lg bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
                    >
                      <X className="w-4 h-4" />
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Filter Toggle Button */}
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`w-full md:w-auto px-6 py-4 rounded-2xl border transition-all flex items-center justify-center gap-3 font-black text-xs tracking-widest uppercase group ${
                showFilters 
                ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20" 
                : "bg-muted/50 border-border hover:bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              <SlidersHorizontal className={`w-4 h-4 transition-transform duration-500 ${showFilters ? "rotate-180" : ""}`} />
              <span>Filtros</span>
              {(categoria !== "todas" || ordenacao !== "nome") && (
                <span className={`flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-black ${showFilters ? "bg-white text-primary" : "bg-primary text-white"}`}>
                  {(categoria !== "todas" ? 1 : 0) + (ordenacao !== "nome" ? 1 : 0)}
                </span>
              )}
            </button>
          </div>
          
          <AnimatePresence>
            {!busca && !showFilters && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-3 flex flex-wrap items-center gap-3 px-2"
              >
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Buscas Populares:</span>
                {["GTA V", "Minecraft", "Red Dead", "Elden Ring", "Marvel"].map((sug) => (
                  <button 
                    key={sug}
                    onClick={() => setBusca(sug)}
                    className="text-[9px] font-black uppercase tracking-[0.1em] text-muted-foreground hover:text-primary transition-all bg-muted/20 hover:bg-muted/40 border border-border px-2 py-1 rounded-md"
                  >
                    {sug}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

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
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3">
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

      <main className="container-responsive py-8 md:py-20 space-y-12 md:space-y-24">
        <h1 className="sr-only">Catálogo de Jogos PC Grátis para Download</h1>



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
        ) : isError ? (
          <div className="text-center py-20 space-y-6">
            <h3 className="text-2xl font-bold text-destructive">Erro ao carregar o catálogo</h3>
            <p className="text-muted-foreground">Verifique sua conexão e tente novamente.</p>
            <button 
              onClick={() => refetch()}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-full font-bold"
            >
              Tentar Novamente
            </button>
          </div>
        ) : isSearching ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-10 md:space-y-16"
          >
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-10 pb-10 border-b border-white/5">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-8 bg-primary rounded-full shadow-lg shadow-primary/20" />
                  <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase italic">
                    <span className="text-white">Catálogo</span>{" "}
                    <span className="text-primary">Filtrado</span>
                  </h2>
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-sm md:text-base font-bold text-gray-500 uppercase tracking-widest">
                    {filteredItems.length} RESULTADO{filteredItems.length !== 1 ? "S" : ""} ENCONTRADO{filteredItems.length !== 1 ? "S" : ""}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {categoria !== "todas" && (
                  <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-2 rounded-xl">
                    <span className="text-[10px] font-black uppercase text-primary tracking-widest">{categoria}</span>
                    <button onClick={() => setCategoria("todas")} className="text-primary hover:text-white transition-colors">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
                {busca && (
                  <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-xl">
                    <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">"{busca}"</span>
                    <button onClick={() => setBusca("")} className="text-gray-400 hover:text-white transition-colors">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {filteredItems.length === 0 ? (
              <div className="text-center py-32 space-y-8 bg-white/5 rounded-[3rem] border border-dashed border-white/10 max-w-2xl mx-auto px-10">
                <div className="relative w-24 h-24 mx-auto">
                  <Gamepad2 className="w-24 h-24 text-gray-800" />
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 border-2 border-dashed border-primary/20 rounded-full"
                  />
                </div>
                <div className="space-y-4">
                  <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tighter italic">Nenhum tesouro <span className="text-primary">encontrado</span></h3>
                  <p className="text-gray-500 font-medium italic">
                    Nossa frota não localizou jogos com esses critérios. Tente termos menos específicos ou explore nosso catálogo completo.
                  </p>
                </div>
                <button 
                  onClick={() => { setBusca(""); setCategoria("todas"); setOrdenacao("nome"); }}
                  className="px-10 py-4 bg-primary text-white hover:bg-primary/90 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-primary/20"
                >
                  Limpar Busca
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6 md:gap-8">
                {filteredItems.map((item) => (
                  <RepackCard key={`r-${item.id}`} repack={item.data} />
                ))}
              </div>
            )}
          </motion.div>
        ) : (
          <div className="space-y-16 md:space-y-32">
            <GameSection title="JOGOS COM DENUVO" games={[]} repacks={denuvoRepacks} page={sectionsPage} pageSize={SECTIONS_PAGE_SIZE} repackMap={gameRepackMap} />
            <GameSection title="Jogos Mais Baixados" games={[]} repacks={emAlta} page={sectionsPage} pageSize={SECTIONS_PAGE_SIZE} repackMap={gameRepackMap} />
            <GameSection title="Jogos da Nova Geração" games={[]} repacks={recentes} page={sectionsPage} pageSize={SECTIONS_PAGE_SIZE} repackMap={gameRepackMap} />

            {(() => {
              const sectionsTotalPages = Math.max(
                1,
                Math.ceil(denuvoRepacks.length / SECTIONS_PAGE_SIZE),
                Math.ceil(emAlta.length / SECTIONS_PAGE_SIZE),
                Math.ceil(recentes.length / SECTIONS_PAGE_SIZE)
              );
              if (sectionsTotalPages <= 1) return null;
              return (
                <div className="flex items-center justify-center gap-4 md:gap-6">
                  <button
                    onClick={() => setSectionsPage((p) => Math.max(0, p - 1))}
                    disabled={sectionsPage === 0}
                    aria-label="Página anterior das seções"
                    className="p-3 md:p-4 rounded-xl md:rounded-2xl bg-card border border-border/50 hover:border-primary/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-xl shadow-black/10"
                  >
                    <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
                  </button>
                  <span className="text-xs md:text-sm font-bold uppercase tracking-widest text-muted-foreground min-w-[80px] text-center">
                    {sectionsPage + 1} / {sectionsTotalPages}
                  </span>
                  <button
                    onClick={() => setSectionsPage((p) => Math.min(sectionsTotalPages - 1, p + 1))}
                    disabled={sectionsPage >= sectionsTotalPages - 1}
                    aria-label="Próxima página das seções"
                    className="p-3 md:p-4 rounded-xl md:rounded-2xl bg-card border border-border/50 hover:border-primary/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-xl shadow-black/10"
                  >
                    <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
                  </button>
                </div>
              );
            })()}

            <section className="space-y-12 md:space-y-16">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-10 border-b-2 border-primary/20 pb-8 md:pb-16">
                <div className="space-y-4">
                  <h2 className="text-responsive-h2 leading-none font-extrabold"><span className="text-primary">Explore</span> <span className="text-foreground">o Catálogo</span></h2>
                  <div className="flex items-center gap-4 md:gap-8">
                    <span className="w-20 md:w-32 h-1.5 md:h-2 bg-primary rounded-full shadow-2xl shadow-primary/30" />
                    <span className="text-sm md:text-responsive-body font-medium">{catalogItems.length} experiências de alto nível</span>
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

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6 md:gap-8">
                {catalogPageItems.map((item) => (
                  <RepackCard key={`r-${item.id}`} repack={item.data} />
                ))}
              </div>

              {catalogTotalPages > 1 && (
                <div className="flex items-center justify-center gap-4 md:gap-6 pt-4">
                  <button
                    onClick={() => {
                      setCatalogPage((p) => Math.max(0, p - 1));
                      window.scrollTo({ top: window.scrollY - 200, behavior: "smooth" });
                    }}
                    disabled={catalogPage === 0}
                    aria-label="Página anterior"
                    className="p-3 md:p-4 rounded-xl md:rounded-2xl bg-card border border-border/50 hover:border-primary/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-xl shadow-black/10"
                  >
                    <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
                  </button>

                  <span className="text-xs md:text-sm font-bold uppercase tracking-widest text-muted-foreground min-w-[80px] text-center">
                    {catalogPage + 1} / {catalogTotalPages}
                  </span>

                  <button
                    onClick={() => {
                      setCatalogPage((p) => Math.min(catalogTotalPages - 1, p + 1));
                      window.scrollTo({ top: window.scrollY - 200, behavior: "smooth" });
                    }}
                    disabled={catalogPage >= catalogTotalPages - 1}
                    aria-label="Próxima página"
                    className="p-3 md:p-4 rounded-xl md:rounded-2xl bg-card border border-border/50 hover:border-primary/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-xl shadow-black/10"
                  >
                    <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
                  </button>
                </div>
              )}
            </section>
          </div>
        )}
      </main>

      <footer className="border-t border-border/50 bg-card py-12 md:py-24 mt-12 md:mt-24">
        <div className="container-responsive">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-24 mb-16 md:mb-32">
            <div className="space-y-6 md:space-y-12">
              <Link to="/" className="flex flex-col text-left group">
                <span className="font-black text-2xl md:text-4xl tracking-tighter leading-none group-hover:text-primary transition-colors">JOGOS</span>
                <span className="font-black text-2xl md:text-4xl tracking-tighter leading-none text-primary group-hover:text-foreground transition-colors">GRATIS</span>
              </Link>
              <p className="text-sm md:text-responsive-body max-w-sm">
                A maior comunidade de compartilhamento de jogos. Descubra os melhores jogos da nova geração, jogue com seus amigos e compartilhe suas experiências épicas.
              </p>
            </div>
            
            <div className="space-y-6 md:space-y-12">
              <h4 className="text-responsive-small text-foreground font-extrabold">Plataforma</h4>
              <ul className="space-y-3 md:space-y-6 text-base md:text-lg font-medium">
                <li><button onClick={() => navigate("/")} className="hover:text-primary transition-colors">Início</button></li>
                <li><button onClick={() => navigate("/")} className="hover:text-primary transition-colors">Catálogo</button></li>
                <li><button onClick={() => navigate("/novidades")} className="hover:text-primary transition-colors">Novidades</button></li>
                <li><button onClick={() => navigate("/dmca")} className="hover:text-primary transition-colors">DMCA</button></li>
                <li><button onClick={() => navigate("/privacidade")} className="hover:text-primary transition-colors">POLÍTICA DE PRIVACIDADE</button></li>
                <li><button onClick={() => navigate("/pedir-jogo")} className="hover:text-primary transition-colors uppercase">Pedir Jogos</button></li>
              </ul>
            </div>
            
            <div className="space-y-6 md:space-y-12">
              <h4 className="text-responsive-small text-foreground font-extrabold">Suporte</h4>
              <ul className="space-y-3 md:space-y-6 text-base md:text-lg font-medium">
                <li><button className="hover:text-primary transition-colors">Central de Ajuda</button></li>
                <li><button onClick={() => navigate("/dmca")} className="hover:text-primary transition-colors">Termos de Uso</button></li>
                <li><button onClick={() => navigate("/privacidade")} className="hover:text-primary transition-colors">Privacidade</button></li>
                <li><button onClick={() => navigate("/pedir-jogo")} className="hover:text-primary transition-colors">Pedir Jogos</button></li>
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
            <p>© 2025. Navegação segura e eficiente.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;