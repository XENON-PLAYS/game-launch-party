import { useParams, Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { CartPopup } from "@/components/CartPopup";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Download, ArrowLeft, Monitor, HardDrive, Calendar, Building2, Tag, Globe, Shield, Star, Heart, MessageSquare, ChevronRight, Loader2 } from "lucide-react";
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
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-[320px_1fr] gap-8">
            <Skeleton className="aspect-[3/4] rounded-xl" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        </div>
      </div>
    );
  }

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

  const reqMin = game.requisitos_minimo as Record<string, string> | null;
  const reqRec = game.requisitos_recomendado as Record<string, string> | null;

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
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
          <div className="space-y-3">
            <div className="rounded-xl overflow-hidden border border-border shadow-2xl shadow-primary/5">
              <img src={selectedImage || game.imagem || ""} alt={game.nome} className="w-full aspect-[3/4] object-cover" />
            </div>
            {/* Gallery thumbnails */}
            {game.galeria && game.galeria.length > 0 && (
              <div className="grid grid-cols-4 gap-2">
                <button onClick={() => setSelectedImage(null)} className={`rounded-lg overflow-hidden border-2 transition-all ${!selectedImage ? "border-primary" : "border-border hover:border-primary/40"}`}>
                  <img src={game.imagem || ""} alt="Main" className="w-full aspect-video object-cover" />
                </button>
                {game.galeria.map((img, i) => (
                  <button key={i} onClick={() => setSelectedImage(img)} className={`rounded-lg overflow-hidden border-2 transition-all ${selectedImage === img ? "border-primary" : "border-border hover:border-primary/40"}`}>
                    <img src={img} alt={`Screenshot ${i + 1}`} className="w-full aspect-video object-cover" />
                  </button>
                ))}
              </div>
            )}
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

              {/* Rating summary */}
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className={`w-4 h-4 ${s <= Math.round(avgRating?.avg ?? 0) ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground/30"}`} />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {avgRating?.avg ?? 0} ({avgRating?.count ?? 0} avaliações)
                </span>
              </div>

              <p className="text-muted-foreground leading-relaxed">{game.descricao}</p>
            </div>

            {/* Destaques */}
            {game.destaques && game.destaques.length > 0 && (
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
                <div className="flex items-center gap-2 text-muted-foreground"><Building2 className="w-4 h-4 text-primary" /><span>{game.desenvolvedor}</span></div>
              )}
              {game.lancamento && (
                <div className="flex items-center gap-2 text-muted-foreground"><Calendar className="w-4 h-4 text-primary" /><span>{game.lancamento}</span></div>
              )}
              {game.classificacao && (
                <div className="flex items-center gap-2 text-muted-foreground"><Shield className="w-4 h-4 text-primary" /><span>{game.classificacao}</span></div>
              )}
              {game.tamanho && (
                <div className="flex items-center gap-2 text-muted-foreground"><HardDrive className="w-4 h-4 text-primary" /><span>{game.tamanho}</span></div>
              )}
            </div>

            {/* Languages */}
            {game.idiomas.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <Globe className="w-4 h-4 text-primary" />
                {game.idiomas.map((i) => (
                  <span key={i} className="text-xs px-2 py-1 rounded bg-secondary text-secondary-foreground">{i}</span>
                ))}
              </div>
            )}

            {/* Modes */}
            {game.modos.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <Tag className="w-4 h-4 text-primary" />
                {game.modos.map((m) => (
                  <span key={m} className="text-xs px-3 py-1 rounded-full bg-secondary text-secondary-foreground">{m}</span>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              <span className="text-3xl font-bold text-primary">
                {game.preco === 0 ? "Grátis" : `R$ ${Number(game.preco).toFixed(2).replace(".", ",")}`}
              </span>
              <button
                onClick={toggleFavorite}
                className={`p-3 rounded-xl border transition-all ${isFavorited ? "bg-primary/10 border-primary text-primary" : "border-border hover:border-primary/40 text-muted-foreground hover:text-primary"}`}
              >
                <Heart className={`w-5 h-5 ${isFavorited ? "fill-primary" : ""}`} />
              </button>
            </div>

            {/* Download Links */}
            {downloadLinks && downloadLinks.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Links de Download</h3>
                <div className="space-y-2">
                  {downloadLinks.map((link) => (
                    <button
                      key={link.id}
                      onClick={() => handleDownload(link.id, link.url)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all ${
                        link.status === "online"
                          ? "border-primary/30 bg-primary/5 hover:bg-primary/10 hover:border-primary"
                          : "border-border bg-muted/50 opacity-50 cursor-not-allowed"
                      }`}
                      disabled={link.status !== "online"}
                    >
                      <div className="flex items-center gap-3">
                        <Download className="w-4 h-4 text-primary" />
                        <span className="font-medium text-sm">{link.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${link.status === "online" ? "bg-green-500/10 text-green-400" : "bg-destructive/10 text-destructive"}`}>
                          {link.status === "online" ? "● Online" : "● Offline"}
                        </span>
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Trailer */}
        {game.trailer_url && (
          <div className="mt-12 space-y-4">
            <h2 className="text-xl font-bold">Trailer</h2>
            <div className="aspect-video rounded-xl overflow-hidden border border-border">
              <iframe
                src={game.trailer_url}
                title={`${game.nome} Trailer`}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        )}

        {/* Requirements */}
        {(reqMin || reqRec) && (
          <div className="mt-12 space-y-4">
            <h2 className="text-xl font-bold">Requisitos do Sistema</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {[{ label: "Mínimos", data: reqMin }, { label: "Recomendados", data: reqRec }].map(({ label, data }) =>
                data ? (
                  <div key={label} className="bg-card border border-border rounded-xl p-5 space-y-3">
                    <h3 className="font-bold text-primary">{label}</h3>
                    {Object.entries(data).map(([key, val]) => (
                      <div key={key} className="flex justify-between text-sm border-b border-border/50 pb-2 last:border-0">
                        <span className="text-muted-foreground capitalize">{key === "placa" ? "Placa de Vídeo" : key}</span>
                        <span className="font-medium">{String(val)}</span>
                      </div>
                    ))}
                  </div>
                ) : null
              )}
            </div>
          </div>
        )}

        {/* Star Rating */}
        <div className="mt-12">
          <StarRating gameId={game.id} />
        </div>

        {/* Comments */}
        <div className="mt-12">
          <GameComments gameId={game.id} />
        </div>
      </div>

      <footer className="border-t border-border bg-card/50 py-8 mt-16">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          <p>© 2025 Jogos Piratas — Todos os direitos reservados</p>
        </div>
      </footer>
    </div>
  );
};

export default GameDetail;
