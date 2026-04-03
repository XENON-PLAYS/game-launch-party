import { useParams, Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { SEO } from "@/components/SEO";
import { Breadcrumbs } from "@/components/Breadcrumbs";

import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Download, ArrowLeft, Monitor, HardDrive, Calendar, Building2, Globe, Shield, Star, Heart, MessageSquare, ChevronRight, Play, CheckCircle, Info, ExternalLink } from "lucide-react";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { GameComments } from "@/components/GameComments";
import { StarRating } from "@/components/StarRating";
import logo from "@/assets/logo.png";



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
                    {avgRating?.avg ?? 0} <span className="opacity-40">/ 5.0</span>
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
              <div className="p-20 text-center rounded-[3rem] bg-muted/20 border-4 border-dashed border-border">
                <p className="text-responsive-small text-muted-foreground opacity-60">Nenhum porto seguro disponível no momento</p>
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
                    <div className="grid sm:grid-cols-2 gap-x-12 gap-y-8">
                      {Object.entries(data).map(([key, val]) => (
                        <div key={key} className="space-y-2 group">
                          <span className="text-responsive-small text-muted-foreground opacity-60 group-hover:text-primary transition-all duration-300">
                            {key === "placa" ? "GPU / Placa de Vídeo" : key === "armazenamento" ? "Espaço em Disco" : key === "memoria" ? "Memória RAM" : key === "processador" ? "Processador CPU" : key}
                          </span>
                          <p className="text-sm sm:text-base lg:text-lg font-black group-hover:text-foreground transition-all duration-300 leading-snug">{String(val)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null
              )}
            </div>
          </div>
        </section>

        {/* Installation Section */}
        {(game.pre_requisitos || game.passo_a_passo || game.link_demo || game.observacoes) && (
          <section className="space-y-16">
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

            <div className="grid lg:grid-cols-2 gap-10 sm:gap-16">
              <div className="space-y-10">
                {game.pre_requisitos && (
                  <div className="bg-card border-2 border-border rounded-[2.5rem] p-10 sm:p-14 space-y-8 shadow-2xl shadow-black/5">
                    <div className="flex items-center gap-4 text-primary">
                      <Info className="w-6 h-6" />
                      <h3 className="text-xl font-black uppercase tracking-widest">Pré-requisitos</h3>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">{game.pre_requisitos}</p>
                  </div>
                )}

                {game.passo_a_passo && (
                  <div className="bg-card border-2 border-border rounded-[2.5rem] p-10 sm:p-14 space-y-8 shadow-2xl shadow-black/5">
                    <div className="flex items-center gap-4 text-primary">
                      <CheckCircle className="w-6 h-6" />
                      <h3 className="text-xl font-black uppercase tracking-widest">Passo a Passo</h3>
                    </div>
                    <div className="space-y-4">
                      {game.passo_a_passo.split(';').map((step, i) => (
                        <div key={i} className="flex gap-4">
                          <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black text-sm">{i + 1}</span>
                          <p className="text-muted-foreground">{step.trim()}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-10">
                {game.link_demo && (
                  <div className="bg-card border-2 border-border rounded-[2.5rem] p-10 sm:p-14 space-y-8 shadow-2xl shadow-black/5">
                    <div className="flex items-center gap-4 text-primary">
                      <ExternalLink className="w-6 h-6" />
                      <h3 className="text-xl font-black uppercase tracking-widest">Teste / Demo</h3>
                    </div>
                    <p className="text-muted-foreground">Experimente a versão oficial de avaliação antes de içar as velas.</p>
                    <a 
                      href={game.link_demo} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 text-primary hover:text-primary/80 font-black uppercase tracking-widest text-sm transition-colors"
                    >
                      <span>Acessar Link Oficial</span>
                      <ChevronRight className="w-4 h-4" />
                    </a>
                  </div>
                )}

                {game.observacoes && (
                  <div className="bg-card border-2 border-border rounded-[2.5rem] p-10 sm:p-14 space-y-8 shadow-2xl shadow-black/5">
                    <div className="flex items-center gap-4 text-primary">
                      <Shield className="w-6 h-6" />
                      <h3 className="text-xl font-black uppercase tracking-widest">Observações</h3>
                    </div>
                    <div className="grid gap-4">
                      {game.observacoes.split(';').map((obs, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                          <p className="text-muted-foreground text-sm">{obs.trim()}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

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
                <h2 className="text-responsive-h2 leading-none uppercase">Taberna</h2>
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
            <img src={logo} alt="JOGOS GRATIS" className="w-16 h-16 sm:w-20 sm:h-20" />
            <div className="flex flex-col text-left">
              <span className="font-black text-2xl sm:text-3xl tracking-tighter leading-none">JOGOS</span>
              <span className="font-black text-2xl sm:text-3xl tracking-tighter leading-none text-primary">GRATIS</span>
            </div>
          </Link>
          <div className="pt-16 border-t border-border flex flex-col md:flex-row justify-between items-center gap-10 text-responsive-small text-muted-foreground opacity-60">
            <p>© 2025 JOGOS GRATIS — Navegando pelos Sete Mares dos Games desde 1715.</p>
            <div className="flex gap-8">
              <Link to="/" className="hover:text-primary transition-colors">Termos</Link>
              <Link to="/" className="hover:text-primary transition-colors">Privacidade</Link>
              <Link to="/" className="hover:text-primary transition-colors">Cookies</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default GameDetail;
