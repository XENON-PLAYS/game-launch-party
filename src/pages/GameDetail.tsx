import { useParams, Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { SEO } from "@/components/SEO";
import { Breadcrumbs } from "@/components/Breadcrumbs";

import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Download, ArrowLeft, Monitor, HardDrive, Calendar, Building2, Globe, Shield, Star, Heart, MessageSquare, ChevronRight, Play } from "lucide-react";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { GameComments } from "@/components/GameComments";
import { StarRating } from "@/components/StarRating";



const GameDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800";
  };

  const { data: game, isLoading } = useQuery({
    queryKey: ["game", slug],
    queryFn: async () => {
      // Tenta buscar por slug, se não encontrar (ou se o slug parecer um UUID), tenta por ID para manter compatibilidade
      let query = supabase.from("games").select("*");
      
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug!);
      
      if (isUUID) {
        query = query.eq("id", slug!);
      } else {
        query = query.eq("slug", slug!);
      }

      const { data, error } = await query.maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  const gameId = game?.id;

  const { data: downloadLinks } = useQuery({
    queryKey: ["download-links", gameId],
    queryFn: async () => {
      const { data } = await supabase
        .from("download_links")
        .select("*")
        .eq("game_id", gameId!);
      return data ?? [];
    },
    enabled: !!gameId,
  });

  const { data: avgRating } = useQuery({
    queryKey: ["avg-rating", gameId],
    queryFn: async () => {
      const { data } = await supabase
        .from("game_ratings")
        .select("rating")
        .eq("game_id", gameId!);
      if (!data || data.length === 0) return { avg: 0, count: 0 };
      const avg = data.reduce((s, r) => s + r.rating, 0) / data.length;
      return { avg: Math.round(avg * 10) / 10, count: data.length };
    },
    enabled: !!gameId,
  });

  const { data: isFavorited, refetch: refetchFav } = useQuery({
    queryKey: ["favorite", gameId, user?.id],
    queryFn: async () => {
      if (!user) return false;
      const { data } = await supabase
        .from("favorites")
        .select("id")
        .eq("user_id", user.id)
        .eq("game_id", gameId!)
        .maybeSingle();
      return !!data;
    },
    enabled: !!gameId && !!user?.id,
  });

  const toggleFavorite = async () => {
    if (!user) return navigate("/login");
    if (!gameId) return;

    if (isFavorited) {
      await supabase.from("favorites").delete().eq("user_id", user.id).eq("game_id", gameId);
    } else {
      await supabase.from("favorites").insert({ user_id: user.id, game_id: gameId });
    }
    refetchFav();
  };

  const handleDownload = (linkId: string, url: string) => {
    if (!gameId) return;
    navigate(`/download/${gameId}/${linkId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container-responsive py-8 md:py-12">
          <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] lg:grid-cols-[400px_1fr] gap-8 md:gap-12">
            <Skeleton className="aspect-[3/4] rounded-3xl" />
            <div className="space-y-6">
              <Skeleton className="h-10 w-64" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-32 w-full" />
              <div className="flex gap-4">
                <Skeleton className="h-14 w-40" />
                <Skeleton className="h-14 w-14" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center container mx-auto px-4 py-20 text-center space-y-6">
          <div className="p-6 rounded-full bg-white/5 border border-white/10">
            <Globe className="w-16 h-16 text-muted-foreground/30" />
          </div>
          <h1 className="text-4xl font-bold tracking-tighter uppercase">Jogo não encontrado</h1>
          <p className="text-muted-foreground max-w-md">O tesouro que você procura parece ter sido movido ou nunca existiu.</p>
          <Link to="/" className="px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-bold uppercase tracking-widest text-xs hover:scale-105 transition-transform shadow-xl shadow-primary/20">
            Voltar ao catálogo
          </Link>
        </div>
      </div>
    );
  }

  const reqMin = game.requisitos_minimo as Record<string, string> | null;
  const reqRec = game.requisitos_recomendado as Record<string, string> | null;

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      <SEO 
        title={game.nome}
        description={game.descricao?.substring(0, 160) + (game.descricao?.length > 160 ? "..." : "")}
        image={game.imagem}
        keywords={`${game.nome}, download ${game.nome}, baixar ${game.nome}, ${game.categorias.join(", ")}, pc games`}
      />
      <Header />
      

      {/* Hero Section */}
      <section className="bg-card border-b border-border py-12 sm:py-20 lg:py-32">
        <div className="container-responsive">
          <div className="mb-10 sm:mb-16">
            <Breadcrumbs 
              items={[
                { label: "Catálogo", path: "/" },
                { label: game.nome }
              ]} 
            />
          </div>

          <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-start">
            {/* Visuals */}
            <div className="lg:col-span-5 xl:col-span-4 space-y-8 sm:space-y-10">
              <div className="rounded-3xl overflow-hidden border border-border shadow-3xl aspect-[3/4] bg-muted group/hero-image relative">
                <img 
                  src={selectedImage || game.imagem || ""} 
                  alt={game.nome} 
                  className="w-full h-full object-cover transition-all duration-700 group-hover/hero-image:scale-110" 
                  onError={handleImageError}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/hero-image:opacity-100 transition-opacity duration-500" />
              </div>

              {/* Gallery thumbnails */}
              {game.galeria && game.galeria.length > 0 && (
                <div className="grid grid-cols-4 gap-4 sm:gap-6">
                  <button 
                    onClick={() => setSelectedImage(null)} 
                    className={`rounded-2xl overflow-hidden border-4 transition-all aspect-video ${!selectedImage ? "border-primary shadow-lg shadow-primary/20 scale-105" : "border-border hover:border-primary/40 opacity-70 hover:opacity-100"}`}
                  >
                    <img src={game.imagem || ""} alt="Main" className="w-full h-full object-cover" onError={handleImageError} />
                  </button>
                  {game.galeria.map((img, i) => (
                    <button 
                      key={i} 
                      onClick={() => setSelectedImage(img)} 
                      className={`rounded-2xl overflow-hidden border-4 transition-all aspect-video ${selectedImage === img ? "border-primary shadow-lg shadow-primary/20 scale-105" : "border-border hover:border-primary/40 opacity-70 hover:opacity-100"}`}
                    >
                      <img src={img} alt={`Screenshot ${i + 1}`} className="w-full h-full object-cover" onError={handleImageError} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="lg:col-span-7 xl:col-span-8 space-y-10 sm:space-y-16">
              <div className="space-y-6 sm:space-y-8">
                <div className="flex flex-wrap gap-3">
                  {game.categorias.map((c) => (
                    <Link 
                      key={c} 
                      to={`/categoria/${c}`}
                      className="text-responsive-small px-4 py-2 rounded-xl bg-primary/10 text-primary border border-primary/20 hover:bg-primary/30 transition-all shadow-sm"
                    >
                      {c}
                    </Link>
                  ))}
                </div>
                
                <h1 className="text-responsive-h1 leading-none uppercase">
                  {game.nome}
                </h1>

                {/* Rating summary */}
                <div className="flex items-center gap-6 py-4 border-y border-border w-fit">
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className={`w-5 h-5 sm:w-6 sm:h-6 ${s <= Math.round(avgRating?.avg ?? 0) ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground/30"}`} />
                    ))}
                  </div>
                  <div className="h-6 w-px bg-border" />
                  <span className="text-sm sm:text-base lg:text-lg font-black uppercase tracking-widest text-muted-foreground">
                    {avgRating?.avg ?? 0} <span className="opacity-40">/ 5.0</span>
                  </span>
                </div>
              </div>

              <p className="text-responsive-body text-muted-foreground opacity-90 max-w-4xl">
                {game.descricao}
              </p>

              {/* Quick Actions Bar */}
              <div className="flex flex-col sm:flex-row sm:items-end gap-10 sm:gap-12 pt-6">
                <div className="space-y-3">
                  <span className="text-responsive-small text-muted-foreground opacity-70">Preço do Tesouro</span>
                  <div className="text-responsive-h2 text-primary flex items-baseline gap-2">
                    {game.preco === 0 ? "GRÁTIS" : <><span className="text-2xl sm:text-3xl lg:text-4xl">R$</span> {Number(game.preco).toFixed(2).replace(".", ",")}</>}
                  </div>
                </div>

                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <button 
                    onClick={() => {
                      const element = document.getElementById('download-section');
                      element?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-4 px-10 sm:px-16 py-4 sm:py-6 bg-primary text-primary-foreground rounded-2xl font-black uppercase tracking-[0.2em] text-xs sm:text-sm lg:text-base hover:bg-primary/90 transition-all duration-500 shadow-3xl shadow-primary/30 hover:-translate-y-2 active:scale-95"
                  >
                    <span>Baixar Tesouro</span>
                    <Download className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                  
                  <button
                    onClick={toggleFavorite}
                    className={`p-4 sm:p-6 rounded-2xl border-2 transition-all duration-500 ${isFavorited ? "bg-primary/10 border-primary text-primary shadow-xl shadow-primary/10" : "bg-background border-border text-muted-foreground hover:text-primary hover:border-primary/50 shadow-2xl shadow-black/5"} active:scale-90 hover:-translate-y-1`}
                  >
                    <Heart className={`w-6 h-6 sm:w-8 sm:h-8 ${isFavorited ? "fill-primary" : ""}`} />
                  </button>
                </div>
              </div>

              {/* Attributes Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-10 sm:gap-16 pt-12 border-t border-border">
                {[
                  { icon: Building2, label: "Desenvolvedor", value: game.desenvolvedor },
                  { icon: Calendar, label: "Lançamento", value: game.lancamento },
                  { icon: Shield, label: "Classificação", value: game.classificacao },
                  { icon: HardDrive, label: "Tamanho", value: game.tamanho }
                ].map((item, i) => (
                  <div key={i} className="space-y-3 group cursor-default">
                    <div className="flex items-center gap-3 text-primary/60 group-hover:text-primary transition-all duration-300">
                      <item.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="text-responsive-small text-muted-foreground opacity-70">{item.label}</span>
                    </div>
                    <p className="text-sm sm:text-base lg:text-lg font-black truncate group-hover:text-foreground transition-all duration-300">{item.value || "—"}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="container-responsive py-12 md:py-16 lg:py-24 space-y-16 md:space-y-24">
        {/* Gallery / Trailer Section */}
        {game.trailer_url && (
          <section className="space-y-10">
            <div className="flex items-center gap-6">
              <div className="p-3.5 rounded-2xl bg-primary/10 border border-primary/20">
                <Play className="w-6 h-6 text-primary" />
              </div>
              <div className="space-y-1">
                <h2 className="text-3xl font-bold tracking-tighter uppercase leading-none">Trailer Oficial</h2>
                <div className="flex items-center gap-3">
                  <span className="w-12 h-1 bg-primary rounded-full" />
                  <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em]">Cinemática em 4K</span>
                </div>
              </div>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="aspect-video rounded-3xl overflow-hidden border border-border shadow-3xl bg-black relative group">
                <iframe
                  src={game.trailer_url}
                  title={`${game.nome} Trailer`}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </section>
        )}

        {/* Requirements & Download Section */}
        <section id="download-section" className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Download Area */}
          <div className="space-y-10">
            <div className="flex items-center gap-4 md:gap-6">
              <div className="p-3 md:p-3.5 rounded-2xl bg-primary/10 border border-primary/20">
                <Download className="w-5 h-5 md:w-6 md:h-6 text-primary" />
              </div>
              <div className="space-y-1">
                <h2 className="text-2xl md:text-3xl font-bold tracking-tighter uppercase leading-none">Download</h2>
                <div className="flex items-center gap-3">
                  <span className="w-10 md:w-12 h-1 bg-primary rounded-full" />
                  <span className="text-[9px] md:text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em]">Links Verificados</span>
                </div>
              </div>
            </div>

            {downloadLinks && downloadLinks.length > 0 ? (
              <div className="grid gap-4">
                {downloadLinks.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => handleDownload(link.id, link.url)}
                    className={`group flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:px-8 sm:py-6 rounded-2xl border transition-all duration-300 gap-4 ${
                      link.status === "online"
                        ? "bg-card border-border hover:border-primary/50 hover:bg-primary/5"
                        : "bg-muted border-border opacity-40 cursor-not-allowed"
                    }`}
                    disabled={link.status !== "online"}
                  >
                    <div className="flex items-center gap-4 sm:gap-5">
                      <div className={`p-3 rounded-xl bg-muted border border-border group-hover:bg-primary group-hover:text-primary-foreground transition-all`}>
                        <Download className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-lg uppercase tracking-wider">{link.label}</p>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest group-hover:text-primary transition-colors">Servidor Dedicado</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                        link.status === "online" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"
                      }`}>
                        <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${link.status === "online" ? "bg-emerald-400" : "bg-red-400"}`} />
                        {link.status === "online" ? "Online" : "Offline"}
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center rounded-3xl bg-muted/30 border border-dashed border-border">
                <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs">Nenhum link disponível no momento</p>
              </div>
            )}
          </div>

          {/* System Requirements */}
          <div className="space-y-10">
            <div className="flex items-center gap-6">
              <div className="p-3.5 rounded-2xl bg-primary/10 border border-primary/20">
                <Monitor className="w-6 h-6 text-primary" />
              </div>
              <div className="space-y-1">
                <h2 className="text-3xl font-bold tracking-tighter uppercase leading-none">Requisitos</h2>
                <div className="flex items-center gap-3">
                  <span className="w-12 h-1 bg-primary rounded-full" />
                  <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em]">Especificações Técnicas</span>
                </div>
              </div>
            </div>

            <div className="grid gap-8">
              {[{ label: "Mínimos", data: reqMin }, { label: "Recomendados", data: reqRec }].map(({ label, data }) =>
                data ? (
                  <div key={label} className="bg-card border border-border rounded-3xl p-8 space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-bold tracking-tighter uppercase">{label}</h3>
                      <div className={`px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${label === "Mínimos" ? "bg-orange-500/10 text-orange-400" : "bg-emerald-500/10 text-emerald-400"}`}>
                        {label === "Mínimos" ? "Básico" : "Ideal"}
                      </div>
                    </div>
                    <div className="space-y-3">
                      {Object.entries(data).map(([key, val]) => (
                        <div key={key} className="flex justify-between items-center py-3 border-b border-border last:border-0 group">
                          <span className="text-xs text-muted-foreground uppercase font-bold tracking-widest group-hover:text-primary transition-colors">
                            {key === "placa" ? "GPU" : key === "armazenamento" ? "Disk" : key === "memoria" ? "RAM" : key === "processador" ? "CPU" : key}
                          </span>
                          <span className="text-sm font-bold">{String(val)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null
              )}
            </div>
          </div>
        </section>

        {/* Social / Community Section */}
        <section className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          <div className="space-y-6">
            <div className="flex items-center gap-6">
              <div className="p-3.5 rounded-2xl bg-primary/10 border border-primary/20">
                <Star className="w-6 h-6 text-primary" />
              </div>
              <div className="space-y-1">
                <h2 className="text-3xl font-bold tracking-tighter uppercase leading-none">Avaliar</h2>
                <div className="flex items-center gap-3">
                  <span className="w-12 h-1 bg-primary rounded-full" />
                  <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em]">Sua opinião importa</span>
                </div>
              </div>
            </div>
            <div className="bg-card border border-border rounded-3xl p-6">
              <StarRating gameId={game.id} />
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-6">
              <div className="p-3.5 rounded-2xl bg-primary/10 border border-primary/20">
                <MessageSquare className="w-6 h-6 text-primary" />
              </div>
              <div className="space-y-1">
                <h2 className="text-3xl font-bold tracking-tighter uppercase leading-none">Comentários</h2>
                <div className="flex items-center gap-3">
                  <span className="w-12 h-1 bg-primary rounded-full" />
                  <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em]">Comunidade Pirata</span>
                </div>
              </div>
            </div>
            <div className="bg-card border border-border rounded-3xl p-6">
              <GameComments gameId={game.id} />
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-card py-16 mt-20">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-[0.4em]">© 2025 Jogos Piratas — Navegando pelos Sete Mares dos Games</p>
        </div>
      </footer>
    </div>
  );
};

export default GameDetail;
