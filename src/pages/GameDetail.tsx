import { useParams, Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { SEO } from "@/components/SEO";
import { Breadcrumbs } from "@/components/Breadcrumbs";

import { GoogleAd } from "@/components/GoogleAd";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Download, ArrowLeft, Monitor, Globe, Shield, Star, Heart, MessageSquare, ChevronRight, Play, CheckCircle, Info, ExternalLink, Bug } from "lucide-react";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { GameComments } from "@/components/GameComments";
import { StarRating } from "@/components/StarRating";
import { BugReportModal } from "@/components/BugReportModal";
import logo from "@/assets/logo.png";
import pirateLogo from "@/assets/logo-pirate.png";



const GameDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isBugReportModalOpen, setIsBugReportModalOpen] = useState(false);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800";
  };

  const { data: game, isLoading } = useQuery({
    queryKey: ["game", slug],
    queryFn: async () => {
      try {
        let query = supabase.from("games").select("*");
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug!);
        
        if (isUUID) {
          query = query.eq("id", slug!);
        } else {
          query = query.eq("slug", slug!);
        }

        const { data, error } = await query.maybeSingle();
        if (error || !data) {
          const { games: localGames } = await import("@/data/games");
          // Find game by slug (normalized name) or ID
          const localGame = localGames.find(g => 
            g.nome.toLowerCase().replace(/\s+/g, '-') === slug || String(g.id) === slug
          );
          
          if (localGame) {
            return {
              id: String(localGame.id),
              nome: localGame.nome,
              imagem: localGame.imagem,
              hero_image: localGame.heroImage,
              vertical_image: localGame.verticalImage,
              capsule_image: localGame.capsuleImage,
              descricao: localGame.descricao,
              desenvolvedor: localGame.desenvolvedor,
              distribuidor: localGame.distribuidor,
              lancamento: localGame.lancamento,
              categorias: localGame.categorias,
              preco: localGame.preco,
              requisitos_minimo: localGame.requisitos?.minimo,
              requisitos_recomendado: localGame.requisitos?.recomendado,
              galeria: [], // Local data doesn't have gallery yet
              trailer_url: localGame.trailer || null,
              rating_avg: 0,
              rating_count: 0,
            } as any;
          }
          return null;
        }
        return data;
      } catch (err) {
        console.error("Error fetching game detail:", err);
        return null;
      }
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
        .from("games")
        .select("rating_avg, rating_count")
        .eq("id", gameId!)
        .maybeSingle();
      
      return { 
        avg: Number(data?.rating_avg || 0), 
        count: Number(data?.rating_count || 0) 
      };
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

  const reqMin = game.requisitos_minimo;
  const reqRec = game.requisitos_recomendado;

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      <SEO 
        title={game.nome}
        description={game.descricao?.substring(0, 160) + (game.descricao?.length > 160 ? "..." : "")}
        image={game.imagem}
        keywords={`${game.nome}, download ${game.nome}, baixar ${game.nome}, ${(game.categorias || []).join(", ")}, pc games`}
      />
      <Header />
      

      {/* Hero Section */}
      <section className="bg-card border-b border-border py-8 sm:py-20 lg:py-32">
        <div className="container-responsive">
          <div className="mb-6 sm:mb-16">
            <Breadcrumbs 
              items={[
                { label: "Catálogo", path: "/" },
                { label: game.nome }
              ]} 
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-20 items-start">
            {/* Visuals */}
            <div className="lg:col-span-5 xl:col-span-4 space-y-6 sm:space-y-10">
              <div className="rounded-2xl sm:rounded-3xl overflow-hidden border border-border shadow-3xl aspect-[3/4] bg-muted group/hero-image relative">
                <img 
                  src={selectedImage || game.imagem || ""} 
                  alt={game.nome} 
                  className="w-full h-full object-cover transition-all duration-700 group-hover/hero-image:scale-110" 
                  fetchPriority="high"
                  onError={handleImageError}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/hero-image:opacity-100 transition-opacity duration-500" />
              </div>

              {/* Gallery thumbnails */}
              {game.galeria && game.galeria.length > 0 && (
                <div className="grid grid-cols-4 gap-2 sm:gap-6">
                  <button 
                    onClick={() => setSelectedImage(null)} 
                    className={`rounded-xl sm:rounded-2xl overflow-hidden border-2 sm:border-4 transition-all aspect-video ${!selectedImage ? "border-primary shadow-lg shadow-primary/20 scale-105" : "border-border hover:border-primary/40 opacity-70 hover:opacity-100"}`}
                  >
                    <img src={game.imagem || ""} alt="Main" className="w-full h-full object-cover" onError={handleImageError} />
                  </button>
                  {game.galeria.map((img, i) => (
                    <button 
                      key={i} 
                      onClick={() => setSelectedImage(img)} 
                      className={`rounded-xl sm:rounded-2xl overflow-hidden border-2 sm:border-4 transition-all aspect-video ${selectedImage === img ? "border-primary shadow-lg shadow-primary/20 scale-105" : "border-border hover:border-primary/40 opacity-70 hover:opacity-100"}`}
                    >
                      <img src={img} alt={`Screenshot ${i + 1}`} className="w-full h-full object-cover" onError={handleImageError} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="lg:col-span-7 xl:col-span-8 space-y-8 sm:space-y-16">
              <div className="space-y-6 sm:space-y-8">
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {(game.categorias || []).map((c) => (
                    <Link 
                      key={c} 
                      to={`/categoria/${c}`}
                      className="text-[10px] sm:text-responsive-small px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-primary/10 text-primary border border-primary/20 hover:bg-primary/30 transition-all shadow-sm"
                    >
                      {c}
                    </Link>
                  ))}
                </div>
                
                <h1 className="text-3xl sm:text-responsive-h1 leading-none uppercase">
                  {game.nome}
                </h1>

                {/* Rating summary */}
                <div className="flex items-center gap-4 sm:gap-6 py-4 border-y border-border w-fit">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className={`w-4 h-4 sm:w-6 sm:h-6 ${s <= Math.round(avgRating?.avg ?? 0) ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground/30"}`} />
                    ))}
                  </div>
                  <div className="h-4 sm:h-6 w-px bg-border" />
                  <span className="text-xs sm:text-base lg:text-lg font-black uppercase tracking-widest text-muted-foreground">
                    {avgRating?.avg?.toFixed(1) ?? "0.0"} <span className="opacity-40">/ 5.0</span>
                    <span className="text-[10px] sm:text-xs opacity-60 ml-2">({avgRating?.count ?? 0} {avgRating?.count === 1 ? 'voto' : 'votos'})</span>
                  </span>
                </div>
              </div>

              <p className="text-sm sm:text-responsive-body text-muted-foreground opacity-90 max-w-4xl">
                {game.descricao}
              </p>

              {/* Quick Actions Bar */}
              <div className="flex flex-col sm:flex-row sm:items-end gap-6 sm:gap-12 pt-4 sm:pt-6">
                <div className="space-y-2 sm:space-y-3">
                  <span className="text-[10px] sm:text-responsive-small text-muted-foreground opacity-70">Preço do Tesouro</span>
                  <div className="text-2xl sm:text-responsive-h2 text-primary flex items-center gap-3 sm:gap-4">
                    {game.preco === 0 && (
                      <span className="relative flex h-3 w-3 sm:h-4 sm:w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 sm:h-4 sm:w-4 bg-primary"></span>
                      </span>
                    )}
                    {game.preco === 0 ? "GRÁTIS" : <><span className="text-xl sm:text-3xl lg:text-4xl">R$</span> {Number(game.preco).toFixed(2).replace(".", ",")}</>}
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

            </div>
          </div>
        </div>
      </section>

      <main className="container-responsive py-16 sm:py-32 lg:py-48 space-y-24 sm:space-y-48">
        {/* Gallery / Trailer Section */}
        {game.trailer_url && (
          <section className="space-y-12 sm:space-y-16">
            <div className="flex items-center gap-6 sm:gap-10">
              <div className="p-4 sm:p-6 rounded-3xl bg-primary/10 border border-primary/20 shadow-2xl shadow-primary/5">
                <Play className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-primary" />
              </div>
              <div className="space-y-3">
                <h2 className="text-responsive-h2 leading-none uppercase">Trailer Oficial</h2>
                <div className="flex items-center gap-6">
                  <span className="w-16 sm:w-32 h-2 bg-primary rounded-full shadow-lg shadow-primary/20" />
                  <span className="text-responsive-small text-muted-foreground opacity-80">Cinemática em 4K disponível</span>
                </div>
              </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-0">
              <div className="aspect-video rounded-3xl sm:rounded-[3rem] overflow-hidden border-8 border-card shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] bg-black relative group/trailer hover:scale-[1.02] transition-transform duration-700">
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
        <section id="download-section" className="grid lg:grid-cols-2 gap-20 sm:gap-32">
          {/* Download Area */}
          <div className="space-y-12 sm:space-y-16">
            <div className="flex items-center gap-6 sm:gap-8">
              <div className="p-4 sm:p-6 rounded-3xl bg-primary/10 border border-primary/20 shadow-2xl shadow-primary/5">
                <Download className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
              </div>
              <div className="space-y-3">
                <h2 className="text-responsive-h2 leading-none uppercase">Baixar o Tesouro</h2>
                <div className="flex items-center gap-6">
                  <span className="w-16 sm:w-24 h-2 bg-primary rounded-full shadow-lg shadow-primary/20" />
                  <span className="text-responsive-small text-muted-foreground opacity-80">Links Verificados pela Frota</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button 
                onClick={() => user ? setIsBugReportModalOpen(true) : navigate("/login")}
                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-destructive transition-colors group"
              >
                <Bug className="w-3.5 h-3.5 group-hover:animate-bounce" />
                Reportar Erro / Link Offline
              </button>
            </div>

            {downloadLinks && downloadLinks.length > 0 ? (
              <div className="grid gap-6">
                {downloadLinks.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => handleDownload(link.id, link.url)}
                    className={`group flex flex-col sm:flex-row sm:items-center justify-between p-6 sm:px-10 sm:py-8 rounded-3xl border-2 transition-all duration-500 gap-6 ${
                      link.status === "online"
                        ? "bg-card border-border hover:border-primary/50 hover:bg-primary/5 shadow-2xl shadow-black/5 hover:-translate-y-1"
                        : "bg-muted border-border opacity-40 cursor-not-allowed"
                    }`}
                    disabled={link.status !== "online"}
                  >
                    <div className="flex items-center gap-6 sm:gap-8">
                      <div className={`p-4 sm:p-5 rounded-2xl bg-muted border border-border group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 shadow-xl`}>
                        <Download className="w-6 h-6 sm:w-8 sm:h-8" />
                      </div>
                      <div className="text-left space-y-1">
                        <p className="font-black text-lg sm:text-xl lg:text-2xl uppercase tracking-widest leading-none">{link.label}</p>
                        <p className="text-responsive-small text-muted-foreground opacity-70 group-hover:text-primary transition-colors">Servidor Dedicado de Alta Performance</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className={`flex items-center gap-3 px-6 py-2 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-widest ${
                        link.status === "online" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"
                      }`}>
                        <div className={`w-2 h-2 rounded-full animate-pulse ${link.status === "online" ? "bg-emerald-400" : "bg-red-400"}`} />
                        {link.status === "online" ? "Operante" : "Inoperante"}
                      </div>
                      <ChevronRight className="w-6 h-6 text-muted-foreground group-hover:translate-x-2 transition-transform" />
                    </div>
                  </button>
                ))}
                
              </div>
            ) : (
              <div className="space-y-6">
                <div className="p-12 sm:p-20 text-center rounded-[2.5rem] sm:rounded-[3rem] bg-muted/20 border-4 border-dashed border-border space-y-6">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-muted/50 rounded-full flex items-center justify-center mx-auto opacity-40">
                    <Shield className="w-8 h-8 sm:w-10 sm:h-10" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm sm:text-lg font-black uppercase tracking-widest text-muted-foreground opacity-60">Nenhum porto seguro disponível no momento</p>
                    <p className="text-xs sm:text-sm text-muted-foreground opacity-40 uppercase tracking-widest">Nossa frota ainda não localizou um link verificado para este tesouro.</p>
                  </div>
                  <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link to="/pedir-jogo" className="w-full sm:w-auto px-8 py-3 bg-primary/10 text-primary border border-primary/20 rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-primary/20 transition-all">
                      Pedir este Jogo
                    </Link>
                    <button onClick={() => user ? setIsBugReportModalOpen(true) : navigate("/login")} className="w-full sm:w-auto px-8 py-3 bg-muted border border-border text-muted-foreground rounded-xl font-bold uppercase tracking-widest text-[10px] hover:text-foreground transition-all">
                      Informar Falha
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* System Requirements */}
          <div className="space-y-12 sm:space-y-16">
            <div className="flex items-center gap-6 sm:gap-10">
              <div className="p-4 sm:p-6 rounded-3xl bg-primary/10 border border-primary/20 shadow-2xl shadow-primary/5">
                <Monitor className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
              </div>
              <div className="space-y-3">
                <h2 className="text-responsive-h2 leading-none uppercase">Requisitos</h2>
                <div className="flex items-center gap-6">
                  <span className="w-16 sm:w-32 h-2 bg-primary rounded-full shadow-lg shadow-primary/20" />
                  <span className="text-responsive-small text-muted-foreground opacity-80">Especificações da Frota</span>
                </div>
              </div>
            </div>

            <div className="grid gap-10 sm:gap-12">
              {[
                { label: "Mínimos", data: reqMin },
                { label: "Recomendados", data: reqRec }
              ].map(({ label, data }) =>
                data ? (
                  <div key={label} className="bg-card border-2 border-border rounded-[2.5rem] p-10 sm:p-14 space-y-10 shadow-2xl shadow-black/5 hover:border-primary/20 transition-all duration-500">
                    <div className="flex items-center justify-between border-b border-border pb-8">
                      <h3 className="text-responsive-h3 text-primary uppercase leading-none">{label}</h3>
                      <div className={`px-6 py-2 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-widest ${label === "Mínimos" ? "bg-orange-500/10 text-orange-400 border border-orange-500/20" : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"}`}>
                        {label === "Mínimos" ? "Essencial" : "Optimizado"}
                      </div>
                    </div>
                    <div className={typeof data === 'string' ? "space-y-4" : "grid sm:grid-cols-2 gap-x-12 gap-y-8"}>
                      {typeof data === 'string' ? (
                        <div 
                          className="prose prose-invert max-w-none text-muted-foreground prose-strong:text-primary prose-ul:list-disc prose-li:mb-2 [&_ul]:pl-5"
                          dangerouslySetInnerHTML={{ __html: data }} 
                        />
                      ) : (
                        Object.entries(data as Record<string, any>).map(([key, val]) => (
                          <div key={key} className="space-y-2 group">
                            <span className="text-responsive-small text-muted-foreground opacity-60 group-hover:text-primary transition-all duration-300">
                              {key === "placa" ? "GPU / Placa de Vídeo" : key === "armazenamento" ? "Espaço em Disco" : key === "memoria" ? "Memória RAM" : key === "processador" ? "Processador CPU" : key}
                            </span>
                            <p className="text-sm sm:text-base lg:text-lg font-black group-hover:text-foreground transition-all duration-300 leading-snug">{String(val)}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                ) : null
              )}
            </div>
          </div>
        </section>

        {/* Installation Section */}
        <section className="space-y-16 relative py-16 px-6 sm:px-12 rounded-[3.5rem] bg-card/30 border border-border/50 overflow-hidden shadow-inner">
          {/* Decorative background for the section */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -z-10 translate-x-1/3 -translate-y-1/3" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -z-10 -translate-x-1/3 translate-y-1/3" />
          
          <div className="flex items-center gap-6 sm:gap-10">
            <div className="p-4 sm:p-6 rounded-3xl bg-primary/10 border border-primary/20 shadow-2xl shadow-primary/5">
              <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
            </div>
            <div className="space-y-3">
              <h2 className="text-responsive-h2 leading-none uppercase">Instalar o jogo</h2>
              <div className="flex items-center gap-6">
                <span className="w-16 sm:w-32 h-2 bg-primary rounded-full shadow-lg shadow-primary/20" />
                <span className="text-responsive-small text-muted-foreground opacity-80">Guia da Frota para uma Navegação Segura</span>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-10 sm:gap-16">
            <div className="lg:col-span-4 space-y-10">
              <div className="bg-primary/5 border-2 border-primary/20 rounded-[2.5rem] p-10 space-y-8 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 opacity-20">
                  <Shield className="w-12 h-12 text-primary" />
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-black uppercase tracking-widest text-primary">Checklist de Segurança</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">Siga estas recomendações para garantir que o tesouro seja instalado corretamente em seu porto.</p>
                </div>
                <ul className="space-y-4">
                  {[
                    "Desativar Antivírus temporariamente",
                    "Executar instaladores como Administrador",
                    "Ter WinRAR ou 7-Zip instalado",
                    "Verificar drivers de vídeo (Nvidia/AMD)"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm font-bold text-muted-foreground/80">
                      <CheckCircle className="w-4 h-4 text-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {game.pre_requisitos && (
                <div className="bg-card border-2 border-border rounded-[2.5rem] p-10 space-y-8 shadow-2xl">
                  <div className="flex items-center gap-4 text-primary">
                    <Info className="w-6 h-6" />
                    <h3 className="text-xl font-black uppercase tracking-widest">Prerrequisitos</h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed italic">{game.pre_requisitos}</p>
                </div>
              )}
            </div>

            <div className="lg:col-span-8 space-y-10">
              <div className="bg-gradient-to-br from-card via-card/95 to-muted/10 border-2 border-border/50 rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-14 space-y-10 shadow-2xl backdrop-blur-sm relative overflow-hidden group/installation">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[80px] -mr-32 -mt-32 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 blur-[80px] -ml-32 -mb-32 pointer-events-none" />
                <div className="relative z-10">
                  <div className="flex items-center justify-between border-b border-border pb-8">
                    <div className="flex items-center gap-4 text-primary">
                      <Download className="w-6 h-6" />
                      <h3 className="text-xl font-black uppercase tracking-widest">Fluxo de Instalação</h3>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-4 py-2 bg-muted rounded-full">Automático & Guiado</span>
                  </div>
                </div>
                
                <div className="grid gap-6">
                  {game.passo_a_passo ? (
                    game.passo_a_passo.split(';').map((step, i) => (
                      <div key={i} className="flex gap-6 group">
                        <div className="w-12 h-12 rounded-2xl bg-muted border border-border text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 flex items-center justify-center font-black text-lg shrink-0">
                          {i + 1}
                        </div>
                        <div className="space-y-1 self-center">
                          <p className="text-muted-foreground group-hover:text-foreground transition-colors font-medium">{step.trim()}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-12 text-center border-2 border-dashed border-border rounded-3xl">
                      <p className="text-muted-foreground">O guia padrão de instalação se aplica a este título.</p>
                    </div>
                  )}
                </div>
                
                {/* Google Ad in Installation Section */}
                <div className="mt-8 border-t border-border pt-8">
                  <div className="flex items-center gap-3 text-primary mb-6">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Conteúdo Patrocinado</h4>
                  </div>
                  <GoogleAd className="min-h-[100px] w-full bg-muted/20 rounded-2xl flex items-center justify-center border border-border/30 overflow-hidden" />
                </div>

                {game.observacoes && (
                  <div className="mt-10 p-8 rounded-3xl bg-muted/30 border border-border space-y-6">
                    <div className="flex items-center gap-3 text-primary">
                      <Shield className="w-5 h-5" />
                      <h4 className="text-xs font-black uppercase tracking-widest">Observações da Frota</h4>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {game.observacoes.split(';').map((obs, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                          <p className="text-muted-foreground text-xs leading-relaxed">{obs.trim()}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Social / Community Section */}
        <section className="grid lg:grid-cols-2 gap-20 sm:gap-32">
          <div className="space-y-12 sm:space-y-16">
            <div className="flex items-center gap-6 sm:gap-8">
              <div className="p-4 sm:p-6 rounded-3xl bg-primary/10 border border-primary/20 shadow-2xl shadow-primary/5">
                <Star className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
              </div>
              <div className="space-y-3">
                <h2 className="text-responsive-h2 leading-none uppercase">Avaliar</h2>
                <div className="flex items-center gap-6">
                  <span className="w-16 sm:w-24 h-2 bg-primary rounded-full shadow-lg shadow-primary/20" />
                  <span className="text-responsive-small text-muted-foreground opacity-80">Seu Voto de Jogador</span>
                </div>
              </div>
            </div>
            <div className="bg-card border-2 border-border rounded-[2.5rem] p-10 sm:p-14 shadow-2xl shadow-black/5">
              <StarRating gameId={game.id} />
            </div>
          </div>

          <div className="space-y-12 sm:space-y-16">
            <div className="flex items-center gap-6 sm:gap-8">
              <div className="p-4 sm:p-6 rounded-3xl bg-primary/10 border border-primary/20 shadow-2xl shadow-primary/5">
                <MessageSquare className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
              </div>
              <div className="space-y-3">
                <h2 className="text-responsive-h2 leading-none uppercase">Chat</h2>
                <div className="flex items-center gap-6">
                  <span className="w-16 sm:w-24 h-2 bg-primary rounded-full shadow-lg shadow-primary/20" />
                  <span className="text-responsive-small text-muted-foreground opacity-80">Conversa da Tripulação</span>
                </div>
              </div>
            </div>
            <div className="bg-card border-2 border-border rounded-[2.5rem] p-10 sm:p-14 shadow-2xl shadow-black/5">
              <GameComments gameId={game.id} />
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-card py-20 sm:py-32 lg:py-48 mt-32 sm:mt-48 lg:mt-60">
        <div className="container-responsive text-center space-y-10">
          <Link to="/" className="inline-flex items-center gap-5 group mx-auto">
            <img src="/logo-pirate.png" alt="Logo" className="w-16 h-16 sm:w-20 sm:h-20 object-contain transition-transform group-hover:scale-110 duration-300" />
            <div className="flex flex-col text-left">
              <span className="font-black text-2xl sm:text-3xl tracking-tighter leading-none">JOGOS</span>
              <span className="font-black text-2xl sm:text-3xl tracking-tighter leading-none text-primary">GRATIS</span>
            </div>
          </Link>
          <div className="pt-16 border-t border-border flex flex-col md:flex-row justify-between items-center gap-10 text-responsive-small text-muted-foreground opacity-60">
            <p>© 2025 JOGOS GRATIS — A melhor experiência gamer.</p>
            <div className="flex gap-8">
              <Link to="/dmca" className="hover:text-primary transition-colors">DMCA</Link>
              <Link to="/privacidade" className="hover:text-primary transition-colors">Privacidade</Link>
              <Link to="/pedir-jogo" className="hover:text-primary transition-colors">Pedir Jogos</Link>
            </div>
          </div>
        </div>
      </footer>

      {game && (
        <BugReportModal 
          isOpen={isBugReportModalOpen} 
          onClose={() => setIsBugReportModalOpen(false)} 
          gameId={game.id} 
          gameName={game.nome} 
        />
      )}
    </div>
  );
};

export default GameDetail;
