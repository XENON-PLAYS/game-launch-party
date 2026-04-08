import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { Download, Loader2, Shield, Clock, AlertCircle, CheckCircle2, RefreshCw } from "lucide-react";
import { InstallationWizard } from "@/components/InstallationWizard";
import { toast } from "sonner";
import { GoogleAd } from "@/components/GoogleAd";
import { optimizeImageUrl } from "@/lib/utils";

const DownloadPage = () => {
  const { gameId, linkId } = useParams();
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10);
  const [ready, setReady] = useState(false);
  const [downloadStarted, setDownloadStarted] = useState(false);

  const isVip = profile?.is_vip ?? false;

  const { data: game, isLoading: gameLoading } = useQuery({
    queryKey: ["game", gameId],
    queryFn: async () => {
      try {
        const { data, error } = await supabase.from("games").select("*").eq("id", gameId!).maybeSingle();
        if (error || !data) {
          const { games: localGames } = await import("@/data/games");
          const localGame = localGames.find(g => String(g.id) === gameId);
          if (localGame) {
            return {
              id: String(localGame.id),
              nome: localGame.nome,
              imagem: localGame.imagem,
              categorias: localGame.categorias,
            } as any;
          }
          return null;
        }
        return data;
      } catch (err) {
        return null;
      }
    },
    enabled: !!gameId,
  });

  const { data: link, isLoading: linkLoading } = useQuery({
    queryKey: ["download-link", linkId],
    queryFn: async () => {
      const { data, error } = await supabase.from("download_links").select("*").eq("id", linkId!).single();
      if (error) throw error;
      return data;
    },
    enabled: !!linkId,
  });

  useEffect(() => {
    if (isVip) {
      setCountdown(0);
      setReady(true);
      return;
    }
    if (countdown <= 0) {
      setReady(true);
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, isVip]);

  const handleDownload = async () => {
    if (!link) return;
    
    setDownloadStarted(true);
    toast.success("Download iniciado com sucesso!");
    
    try {
      // Record download history
      await supabase.from("download_history").insert({
        user_id: user?.id || null,
        game_id: gameId!,
        download_link_id: linkId!,
      });
      
      // Increment counts via RPC
      await Promise.all([
        supabase.rpc('increment_link_clicks', { link_id: linkId! }),
        supabase.rpc('increment_game_downloads', { game_id: gameId! })
      ]);
      
      // Open the link
      window.open(link.url, "_blank");
    } catch (error) {
      console.error("Error during download tracking:", error);
      window.open(link.url, "_blank");
    }
  };

  const reportError = async () => {
    if (!user) {
      toast.error("Você precisa estar logado para reportar um erro.");
      navigate("/login?redirect=" + encodeURIComponent(window.location.pathname));
      return;
    }

    try {
      const { error: reportError } = await supabase.from("bug_reports").insert({
        user_id: user.id,
        game_id: game?.id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(game.id) ? game.id : null,
        report_type: "link_broken",
        description: `Link de download não funciona na página de download do jogo ${game?.nome || 'desconhecido'}. Link ID: ${linkId}`,
        status: 'new'
      });

      if (reportError) throw reportError;
      toast.success("Relatório enviado para a equipe técnica.");
    } catch (error: any) {
      console.error("Error reporting bug:", error);
      toast.error("Erro ao enviar relatório.");
    }
  };

  if (gameLoading || linkLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500">
      <Header />
      <main className="container-responsive py-12 sm:py-24 lg:py-32">
        <div className="max-w-5xl mx-auto space-y-20 lg:space-y-32">
          
          {/* Status Header */}
          <div className="text-center space-y-8 animate-in fade-in slide-in-from-top-4 duration-1000">
            <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-widest">
              <Shield className="w-4 h-4" />
              Conexão Segura e Criptografada
            </div>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tighter leading-none">
              Portal de <span className="text-primary italic">Download</span>
            </h1>
          </div>

          <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-start">
            {/* Sidebar info */}
            <div className="lg:col-span-4 space-y-10 order-2 lg:order-1">
              {game && (
                <div className="bg-card border-2 border-border rounded-[2.5rem] p-8 space-y-8 shadow-2xl relative overflow-hidden group">
                  <div className="aspect-[3/4] max-w-[200px] lg:max-w-none mx-auto rounded-2xl overflow-hidden border border-border/50">
                    <img 
                      src={optimizeImageUrl(game.imagem || "", 400)} 
                      alt={game.nome} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div className="space-y-4">
                    <h2 className="text-2xl font-black uppercase leading-tight">{game.nome}</h2>
                    <div className="flex flex-wrap gap-2">
                      {game.categorias?.slice(0, 3).map(cat => (
                        <span key={cat} className="px-3 py-1 rounded-full bg-muted text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{cat}</span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Troubleshooting quick links */}
              <div className="space-y-4">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground px-4">Recursos Úteis</p>
                <div className="grid gap-2">
                  <button onClick={reportError} className="w-full flex items-center justify-between p-4 rounded-2xl bg-red-500/5 border border-red-500/10 text-red-400 hover:bg-red-500/10 transition-colors text-sm font-bold">
                    Link não funciona?
                    <AlertCircle className="w-4 h-4" />
                  </button>
                  <button onClick={() => setCountdown(10)} className="w-full flex items-center justify-between p-4 rounded-2xl bg-muted border border-border text-muted-foreground hover:text-foreground transition-colors text-sm font-bold">
                    Reiniciar Contagem
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-8 order-1 lg:order-2">
              {!downloadStarted ? (
                <div className="bg-card border-2 border-border rounded-[3rem] p-10 sm:p-20 space-y-12 sm:space-y-16 shadow-3xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8">
                    {isVip ? (
                      <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-yellow-500 text-black font-black uppercase tracking-widest text-xs shadow-xl shadow-yellow-500/20">
                        <Shield className="w-4 h-4" />
                        VIP Instantâneo
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-muted border border-border text-muted-foreground font-black uppercase tracking-widest text-xs">
                        Acesso Gratuito
                      </div>
                    )}
                  </div>

                  {!ready ? (
                    <div className="space-y-12 text-center py-10">
                      <div className="relative w-40 h-40 sm:w-56 sm:h-56 mx-auto">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="4" fill="none" className="text-border/30" />
                          <circle
                            cx="50" cy="50" r="45"
                            stroke="currentColor"
                            strokeWidth="6"
                            fill="none"
                            strokeLinecap="round"
                            strokeDasharray={`${(1 - countdown / 10) * 283} 283`}
                            className="text-primary transition-all duration-1000 drop-shadow-[0_0_15px_rgba(249,115,22,0.4)]"
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-6xl sm:text-8xl font-black text-primary">{countdown}</span>
                          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Segundos</span>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <h3 className="text-2xl font-black uppercase tracking-widest">Validando Arquivos</h3>
                        <p className="text-muted-foreground max-w-sm mx-auto">Aguarde enquanto nossa frota verifica a integridade dos links de download.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-12 animate-in zoom-in-95 duration-500">
                      <div className="p-10 rounded-[2.5rem] bg-emerald-500/5 border-2 border-emerald-500/20 text-center space-y-6">
                        <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto">
                          <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-3xl font-black uppercase tracking-tighter text-emerald-400">PRONTO PARA DOWNLOAD</h3>
                          <p className="text-muted-foreground">O link foi verificado e está pronto para transferência.</p>
                        </div>
                      </div>
                      
                      <button
                        onClick={handleDownload}
                        className="w-full py-10 rounded-[2.5rem] bg-primary text-primary-foreground font-black text-2xl sm:text-4xl uppercase tracking-[0.2em] hover:bg-primary/90 hover:scale-[1.02] active:scale-95 transition-all shadow-[0_30px_90px_-20px_rgba(249,115,22,0.6)] flex items-center justify-center gap-8 group"
                      >
                        <Download className="w-10 h-10 group-hover:animate-bounce" />
                        Baixar Agora
                      </button>

                      <p className="text-center text-xs text-muted-foreground uppercase tracking-widest font-bold opacity-60">
                        Servidor: {link?.label || "Padrão"} • Latência: 24ms • Integridade: 100%
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                game && (
                  <div className="space-y-12">
                    <InstallationWizard game={game} />
                    <div className="pt-8 border-t border-border/40">
                      <div className="flex items-center gap-3 text-primary mb-6">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Anúncio Patrocinado</h4>
                      </div>
                      <GoogleAd className="min-h-[100px] w-full bg-muted/20 rounded-2xl flex items-center justify-center border border-border/30 overflow-hidden" />
                    </div>
                  </div>
                )
              )}
            </div>
          </div>

          <div className="flex items-center justify-center gap-6">
            <button 
              onClick={() => navigate(`/jogo/${gameId}`)} 
              className="px-10 py-5 rounded-2xl bg-muted/50 border border-border text-muted-foreground hover:text-primary hover:border-primary/30 transition-all flex items-center gap-3 font-black uppercase tracking-widest text-xs"
            >
              <Clock className="w-4 h-4" />
              Retornar à Navegação
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DownloadPage;
