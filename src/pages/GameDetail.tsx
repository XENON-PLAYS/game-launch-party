import { useParams, Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";

import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Download, ArrowLeft, Monitor, HardDrive, Calendar, Building2, Tag, Globe, Shield, Star, Heart, MessageSquare, ChevronRight, Loader2, Share2, Play } from "lucide-react";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { GameComments } from "@/components/GameComments";
import { StarRating } from "@/components/StarRating";



const GameDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const { data: game, isLoading } = useQuery({
    queryKey: ["game", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("games")
        .select("*")
        .eq("id", id!)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const { data: downloadLinks } = useQuery({
    queryKey: ["download-links", id],
    queryFn: async () => {
      const { data } = await supabase
        .from("download_links")
        .select("*")
        .eq("game_id", id!);
      return data ?? [];
    },
    enabled: !!id,
  });

  const { data: avgRating } = useQuery({
    queryKey: ["avg-rating", id],
    queryFn: async () => {
      const { data } = await supabase
        .from("game_ratings")
        .select("rating")
        .eq("game_id", id!);
      if (!data || data.length === 0) return { avg: 0, count: 0 };
      const avg = data.reduce((s, r) => s + r.rating, 0) / data.length;
      return { avg: Math.round(avg * 10) / 10, count: data.length };
    },
    enabled: !!id,
  });

  const { data: isFavorited, refetch: refetchFav } = useQuery({
    queryKey: ["favorite", id, user?.id],
    queryFn: async () => {
      if (!user) return false;
      const { data } = await supabase
        .from("favorites")
        .select("id")
        .eq("user_id", user.id)
        .eq("game_id", id!)
        .maybeSingle();
      return !!data;
    },
    enabled: !!id,
  });

  const toggleFavorite = async () => {
    if (!user) return navigate("/login");
    if (isFavorited) {
      await supabase.from("favorites").delete().eq("user_id", user.id).eq("game_id", id!);
    } else {
      await supabase.from("favorites").insert({ user_id: user.id, game_id: id! });
    }
    refetchFav();
  };

  const handleDownload = (linkId: string, url: string) => {
    navigate(`/download/${id}/${linkId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-[400px_1fr] gap-12">
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
      <Header />
      <CartPopup />

      {/* Hero Section */}
      <section className="bg-card border-b border-border py-12">
        <div className="container mx-auto px-4">
          <Link to="/" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors mb-8 group">
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar ao Catálogo</span>
          </Link>

          <div className="grid lg:grid-cols-[400px_1fr] gap-12 lg:items-start">
            {/* Visuals */}
            <div className="space-y-4">
              <div className="rounded-2xl overflow-hidden border border-border shadow-2xl aspect-[3/4]">
                <img 
                  src={selectedImage || game.imagem || ""} 
                  alt={game.nome} 
                  className="w-full h-full object-cover" 
                />
              </div>

              {/* Gallery thumbnails */}
              {game.galeria && game.galeria.length > 0 && (
                <div className="grid grid-cols-4 gap-3">
                  <button 
                    onClick={() => setSelectedImage(null)} 
                    className={`rounded-xl overflow-hidden border-2 transition-all aspect-video ${!selectedImage ? "border-primary" : "border-border hover:border-primary/40 opacity-70 hover:opacity-100"}`}
                  >
                    <img src={game.imagem || ""} alt="Main" className="w-full h-full object-cover" />
                  </button>
                  {game.galeria.map((img, i) => (
                    <button 
                      key={i} 
                      onClick={() => setSelectedImage(img)} 
                      className={`rounded-xl overflow-hidden border-2 transition-all aspect-video ${selectedImage === img ? "border-primary" : "border-border hover:border-primary/40 opacity-70 hover:opacity-100"}`}
                    >
                      <img src={img} alt={`Screenshot ${i + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Content Info */}
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {game.categorias.map((c) => (
                    <span key={c} className="text-[10px] uppercase font-bold tracking-widest px-4 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                      {c}
                    </span>
                  ))}
                </div>
                
                <h1 className="text-4xl md:text-6xl font-bold tracking-tighter uppercase leading-tight">
                  {game.nome}
                </h1>

                {/* Rating summary */}
                <div className="flex items-center gap-4 py-2 border-y border-border">
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className={`w-4 h-4 ${s <= Math.round(avgRating?.avg ?? 0) ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground/30"}`} />
                    ))}
                  </div>
                  <div className="h-4 w-px bg-border" />
                  <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    {avgRating?.avg ?? 0} <span className="opacity-50">/ 5.0</span>
                  </span>
                </div>
              </div>

              <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl">
                {game.descricao}
              </p>

              {/* Quick Actions Bar */}
              <div className="flex flex-wrap items-center gap-6 pt-4">
                <div className="flex flex-col">
                  <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-1">Preço Atual</span>
                  <span className="text-4xl font-bold text-primary">
                    {game.preco === 0 ? "GRÁTIS" : `R$ ${Number(game.preco).toFixed(2).replace(".", ",")}`}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => addItem(game)}
                    className="flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-primary/90 transition-all duration-300"
                  >
                    <span>Adicionar ao Carrinho</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={toggleFavorite}
                    className={`p-4 rounded-2xl border transition-all duration-300 ${isFavorited ? "bg-primary/10 border-primary text-primary" : "bg-background border-border text-muted-foreground hover:text-primary"}`}
                  >
                    <Heart className={`w-6 h-6 ${isFavorited ? "fill-primary" : ""}`} />
                  </button>
                </div>
              </div>

              {/* Attributes Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 border-t border-border">
                {[
                  { icon: Building2, label: "Desenvolvedor", value: game.desenvolvedor },
                  { icon: Calendar, label: "Lançamento", value: game.lancamento },
                  { icon: Shield, label: "Classificação", value: game.classificacao },
                  { icon: HardDrive, label: "Tamanho", value: game.tamanho }
                ].map((item, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex items-center gap-2 text-primary">
                      <item.icon className="w-4 h-4" />
                      <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">{item.label}</span>
                    </div>
                    <p className="text-sm font-bold truncate">{item.value || "—"}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-20 space-y-24">
        {/* Gallery / Trailer Section */}
        {game.trailer_url && (
          <section className="space-y-10">
            <div className="flex items-center gap-6">
              <div className="p-4 rounded-[2rem] bg-primary/10 border border-primary/20">
                <Play className="w-8 h-8 text-primary" />
              </div>
              <div className="space-y-1">
                <h2 className="text-4xl font-bold tracking-tighter uppercase leading-none">Trailer Oficial</h2>
                <div className="flex items-center gap-3">
                  <span className="w-16 h-1 bg-primary rounded-full" />
                  <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em]">Cinemática em 4K</span>
                </div>
              </div>
            </div>

            <div className="aspect-video rounded-[3rem] overflow-hidden border border-white/10 shadow-3xl bg-black relative group">
              <iframe
                src={game.trailer_url}
                title={`${game.nome} Trailer`}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </section>
        )}

        {/* Requirements & Download Section */}
        <section className="grid lg:grid-cols-2 gap-16">
          {/* Download Area */}
          <div className="space-y-10">
            <div className="flex items-center gap-6">
              <div className="p-4 rounded-[2rem] bg-primary/10 border border-primary/20">
                <Download className="w-8 h-8 text-primary" />
              </div>
              <div className="space-y-1">
                <h2 className="text-4xl font-bold tracking-tighter uppercase leading-none">Download</h2>
                <div className="flex items-center gap-3">
                  <span className="w-16 h-1 bg-primary rounded-full" />
                  <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em]">Links Verificados</span>
                </div>
              </div>
            </div>

            {downloadLinks && downloadLinks.length > 0 ? (
              <div className="grid gap-4">
                {downloadLinks.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => handleDownload(link.id, link.url)}
                    className={`group flex items-center justify-between px-8 py-6 rounded-3xl border transition-all duration-300 ${
                      link.status === "online"
                        ? "bg-white/5 border-white/10 hover:border-primary/50 hover:bg-primary/5"
                        : "bg-white/5 border-white/5 opacity-40 cursor-not-allowed"
                    }`}
                    disabled={link.status !== "online"}
                  >
                    <div className="flex items-center gap-5">
                      <div className={`p-3 rounded-2xl bg-white/5 border border-white/10 group-hover:bg-primary group-hover:text-primary-foreground transition-all`}>
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
              <div className="p-12 text-center rounded-[3rem] bg-white/5 border border-dashed border-white/10">
                <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs">Nenhum link disponível no momento</p>
              </div>
            )}
          </div>

          {/* System Requirements */}
          <div className="space-y-10">
            <div className="flex items-center gap-6">
              <div className="p-4 rounded-[2rem] bg-primary/10 border border-primary/20">
                <Monitor className="w-8 h-8 text-primary" />
              </div>
              <div className="space-y-1">
                <h2 className="text-4xl font-bold tracking-tighter uppercase leading-none">Requisitos</h2>
                <div className="flex items-center gap-3">
                  <span className="w-16 h-1 bg-primary rounded-full" />
                  <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em]">Especificações Técnicas</span>
                </div>
              </div>
            </div>

            <div className="grid gap-8">
              {[{ label: "Mínimos", data: reqMin }, { label: "Recomendados", data: reqRec }].map(({ label, data }) =>
                data ? (
                  <div key={label} className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-bold tracking-tighter uppercase">{label}</h3>
                      <div className={`px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${label === "Mínimos" ? "bg-orange-500/10 text-orange-400" : "bg-emerald-500/10 text-emerald-400"}`}>
                        {label === "Mínimos" ? "Básico" : "Ideal"}
                      </div>
                    </div>
                    <div className="space-y-3">
                      {Object.entries(data).map(([key, val]) => (
                        <div key={key} className="flex justify-between items-center py-3 border-b border-white/5 last:border-0 group">
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
        <section className="grid lg:grid-cols-2 gap-16 pt-12">
          <div className="space-y-8">
            <div className="flex items-center gap-6">
              <div className="p-4 rounded-[2rem] bg-primary/10 border border-primary/20">
                <Star className="w-8 h-8 text-primary" />
              </div>
              <div className="space-y-1">
                <h2 className="text-4xl font-bold tracking-tighter uppercase leading-none">Avaliar</h2>
                <div className="flex items-center gap-3">
                  <span className="w-16 h-1 bg-primary rounded-full" />
                  <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em]">Sua opinião importa</span>
                </div>
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-[3rem] p-10">
              <StarRating gameId={game.id} />
            </div>
          </div>

          <div className="space-y-8">
            <div className="flex items-center gap-6">
              <div className="p-4 rounded-[2rem] bg-primary/10 border border-primary/20">
                <MessageSquare className="w-8 h-8 text-primary" />
              </div>
              <div className="space-y-1">
                <h2 className="text-4xl font-bold tracking-tighter uppercase leading-none">Comentários</h2>
                <div className="flex items-center gap-3">
                  <span className="w-16 h-1 bg-primary rounded-full" />
                  <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em]">Comunidade Pirata</span>
                </div>
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-[3rem] p-10">
              <GameComments gameId={game.id} />
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/5 bg-background py-16 mt-20">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-[0.4em]">© 2025 Jogos Piratas — Navegando pelos Sete Mares dos Games</p>
        </div>
      </footer>
    </div>
  );
};

export default GameDetail;
