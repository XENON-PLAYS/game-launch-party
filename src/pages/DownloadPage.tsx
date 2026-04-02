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
    // Record download
    await supabase.from("download_history").insert({
      user_id: user?.id || null,
      game_id: gameId!,
      download_link_id: linkId!,
    });
    // Increment click count — we use RPC or direct (admin only), so just open the link
    window.open(link.url, "_blank");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container-responsive py-8 md:py-16">
        <div className="max-w-xl mx-auto text-center space-y-8 md:space-y-12">
          {/* Game info */}
          {game && (
            <div className="space-y-4">
              <img src={game.imagem || ""} alt={game.nome} className="w-32 h-44 object-cover rounded-xl mx-auto border border-border shadow-xl" />
              <h1 className="text-2xl font-bold">{game.nome}</h1>
              {link && <p className="text-muted-foreground text-sm">{link.label}</p>}
            </div>
          )}

          {/* VIP badge */}
          {isVip && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
              <Shield className="w-4 h-4" />
              <span className="text-sm font-bold">VIP — Download Direto</span>
            </div>
          )}

          {/* Countdown or ready */}
          <div className="bg-card border border-border rounded-2xl p-8 space-y-6">
            {!ready ? (
              <>
                <div className="flex items-center justify-center gap-3">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  <span className="text-lg font-bold">Preparando download…</span>
                </div>
                <div className="relative w-24 h-24 mx-auto">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" stroke="hsl(var(--border))" strokeWidth="6" fill="none" />
                    <circle
                      cx="50" cy="50" r="45"
                      stroke="hsl(var(--primary))"
                      strokeWidth="6"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={`${(1 - countdown / 5) * 283} 283`}
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-3xl font-bold text-primary">{countdown}</span>
                </div>
                <p className="text-sm text-muted-foreground">Aguarde o tempo para liberar o download</p>
              </>
            ) : (
              <>
                <div className="flex items-center justify-center gap-2 text-green-400">
                  <Download className="w-6 h-6" />
                  <span className="text-lg font-bold">Download Pronto!</span>
                </div>
                <button
                  onClick={handleDownload}
                  className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-bold text-lg hover:bg-primary/90 hover:scale-[1.02] transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Baixar Agora
                </button>
              </>
            )}
          </div>

          {/* Ad space placeholder */}
          {!isVip && (
            <div className="bg-muted border border-border rounded-xl p-8 text-center">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Espaço para Anúncios</p>
              <p className="text-sm text-muted-foreground mt-2">Assine VIP para remover anúncios e pular a espera</p>
            </div>
          )}

          <button onClick={() => navigate(`/jogo/${gameId}`)} className="text-sm text-muted-foreground hover:text-primary transition-colors">
            ← Voltar para o jogo
          </button>
        </div>
      </div>
    </div>
  );
};

export default DownloadPage;
