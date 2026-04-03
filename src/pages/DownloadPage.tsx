import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { Download, Loader2, Shield, Clock } from "lucide-react";

const DownloadPage = () => {
  const { gameId, linkId } = useParams();
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);
  const [ready, setReady] = useState(false);

  const isVip = profile?.is_vip ?? false;

  const { data: game } = useQuery({
    queryKey: ["game", gameId],
    queryFn: async () => {
      const { data } = await supabase.from("games").select("nome, imagem").eq("id", gameId!).single();
      return data;
    },
    enabled: !!gameId,
  });

  const { data: link } = useQuery({
    queryKey: ["download-link", linkId],
    queryFn: async () => {
      const { data } = await supabase.from("download_links").select("*").eq("id", linkId!).single();
      return data;
    },
    enabled: !!linkId,
  });

  useEffect(() => {
    if (isVip) {
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
    
    try {
      // Record download history
      await supabase.from("download_history").insert({
        user_id: user?.id || null,
        game_id: gameId!,
        download_link_id: linkId!,
      });
      
      // Increment counts via RPC (bypass RLS and avoid NaN issues)
      await Promise.all([
        supabase.rpc('increment_link_clicks', { link_id: linkId! }),
        supabase.rpc('increment_game_downloads', { game_id: gameId! })
      ]);
      
      // Open the link in a new tab
      window.open(link.url, "_blank");
    } catch (error) {
      console.error("Error during download tracking:", error);
      // Still open the link even if tracking fails, to not block the user
      window.open(link.url, "_blank");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500">
      <Header />
      <main className="container-responsive py-12 sm:py-24 lg:py-32">
        <div className="max-w-3xl mx-auto text-center space-y-12 sm:space-y-20 lg:space-y-32">
          {/* Game info */}
          {game && (
            <div className="space-y-8 sm:space-y-12 animate-fade-in">
              <div className="relative group mx-auto w-40 sm:w-56 lg:w-72 aspect-[3/4]">
                <img 
                  src={game.imagem || ""} 
                  alt={game.nome} 
                  className="w-full h-full object-cover rounded-[2rem] sm:rounded-[3rem] mx-auto border-4 border-card shadow-3xl group-hover:scale-105 transition-transform duration-700" 
                />
                <div className="absolute inset-0 rounded-[2rem] sm:rounded-[3rem] shadow-[0_0_80px_rgba(249,115,22,0.1)] group-hover:shadow-[0_0_100px_rgba(249,115,22,0.2)] transition-shadow duration-700" />
              </div>
              <div className="space-y-4">
                <h1 className="text-responsive-h2 leading-none uppercase">{game.nome}</h1>
                {link && (
                  <div className="flex items-center justify-center gap-4">
                    <span className="w-12 h-1.5 bg-primary rounded-full shadow-lg shadow-primary/20" />
                    <p className="text-responsive-small text-muted-foreground opacity-80">{link.label}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* VIP badge */}
          {isVip && (
            <div className="inline-flex items-center gap-4 px-8 py-4 rounded-2xl bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 shadow-2xl shadow-yellow-500/5 animate-bounce">
              <Shield className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="text-sm sm:text-base font-black uppercase tracking-widest">VIP — Download Instantâneo</span>
            </div>
          )}

          {/* Countdown or ready */}
          <div className="bg-card border-2 border-border rounded-[2.5rem] sm:rounded-[4rem] p-10 sm:p-20 space-y-12 sm:space-y-16 shadow-3xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            
            {!ready ? (
              <div className="relative z-10 space-y-12 sm:space-y-16">
                <div className="flex items-center justify-center gap-4 text-primary animate-pulse">
                  <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 animate-spin" />
                  <span className="text-responsive-h3 uppercase leading-none">Preparando Escotilha…</span>
                </div>
                <div className="relative w-32 h-32 sm:w-48 sm:h-48 mx-auto">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" stroke="hsl(var(--border))" strokeWidth="4" fill="none" className="opacity-20" />
                    <circle
                      cx="50" cy="50" r="45"
                      stroke="hsl(var(--primary))"
                      strokeWidth="6"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={`${(1 - countdown / 5) * 283} 283`}
                      className="transition-all duration-1000 shadow-[0_0_20px_rgba(249,115,22,0.5)]"
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-4xl sm:text-6xl font-black text-primary drop-shadow-2xl">{countdown}</span>
                </div>
                <p className="text-responsive-body text-muted-foreground opacity-70">Aguarde o vento favorável para liberar o tesouro em seu porto.</p>
              </div>
            ) : (
              <div className="relative z-10 space-y-12 sm:space-y-16 animate-fade-in">
                <div className="flex items-center justify-center gap-4 text-emerald-400">
                  <Download className="w-8 h-8 sm:w-10 sm:h-10" />
                  <span className="text-responsive-h3 uppercase leading-none">Porto Liberado!</span>
                </div>
                <button
                  onClick={handleDownload}
                  className="w-full py-6 sm:py-8 rounded-[1.5rem] sm:rounded-[2.5rem] bg-primary text-primary-foreground font-black text-xl sm:text-2xl lg:text-3xl uppercase tracking-[0.2em] hover:bg-primary/90 hover:scale-[1.03] active:scale-95 transition-all shadow-[0_20px_60px_-15px_rgba(249,115,22,0.5)] flex items-center justify-center gap-6"
                >
                  <Download className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12" />
                  Baixar Agora
                </button>
              </div>
            )}
          </div>

          {/* Ad space placeholder */}
          {!isVip && (
            <div className="bg-muted/30 border-2 border-dashed border-border rounded-[2rem] p-10 sm:p-16 text-center space-y-4">
              <p className="text-responsive-small text-muted-foreground opacity-40">Espaço Reservado para a Frota</p>
              <p className="text-responsive-body text-muted-foreground opacity-80">Torne-se um <strong>Capitão VIP</strong> para remover todos os obstáculos e navegar sem espera.</p>
            </div>
          )}

          <button 
            onClick={() => navigate(`/jogo/${gameId}`)} 
            className="text-responsive-small text-muted-foreground hover:text-primary transition-all flex items-center justify-center gap-3 mx-auto font-black"
          >
            <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>RETORNAR AO CHAT DO JOGO</span>
          </button>
        </div>
      </main>

      <footer className="border-t border-border bg-card py-20 sm:py-32 mt-20">
        <div className="container-responsive text-center text-responsive-small text-muted-foreground opacity-60">
          <p>© 2025 JOGOS GRATIS — Sua bússola para os melhores tesouros digitais.</p>
        </div>
      </footer>
    </div>
  );
};

export default DownloadPage;
