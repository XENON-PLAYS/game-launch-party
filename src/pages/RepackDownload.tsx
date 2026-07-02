import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { SEO } from "@/components/SEO";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { Download, Loader2, Shield, Clock, CheckCircle2, RefreshCw, HardDrive, Copy } from "lucide-react";
import { toast } from "sonner";
import { GoogleAd } from "@/components/GoogleAd";
import { randomCover } from "@/components/RepackCard";

const TORRENT_STEPS = [
  {
    title: "Instale um cliente de Torrent",
    description:
      "Baixe e instale um programa como qBittorrent (gratuito e sem anúncios) ou uTorrent. Ele será responsável por baixar os arquivos do jogo.",
  },
  {
    title: "Abra o link Magnet",
    description:
      "Clique em \"Baixar Agora\" ou copie o link magnet e cole no seu cliente de torrent. O download dos arquivos será iniciado automaticamente.",
  },
  {
    title: "Aguarde o download completar",
    description:
      "Deixe o cliente de torrent baixar 100% dos arquivos. A velocidade depende da sua internet e da quantidade de seeds disponíveis.",
  },
  {
    title: "Extraia e instale",
    description:
      "Abra a pasta baixada, execute o instalador (setup.exe) e siga os passos. Repacks FitGirl podem levar mais tempo instalando por conta da compressão.",
  },
  {
    title: "Jogue!",
    description:
      "Após a instalação, abra o jogo pelo atalho criado na área de trabalho. Se o antivírus bloquear, adicione uma exceção para a pasta do jogo.",
  },
];

const RepackDownload = () => {
  const { id } = useParams();
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10);
  const [ready, setReady] = useState(false);
  const [downloadStarted, setDownloadStarted] = useState(false);

  const isVip = profile?.is_vip ?? false;

  const { data: repack, isLoading } = useQuery({
    queryKey: ["repack", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("source_repacks")
        .select("id, title, uris, file_size, upload_date")
        .eq("id", id!)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
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

  const handleDownload = () => {
    if (!repack?.uris?.[0]) return;
    setDownloadStarted(true);
    toast.success("Download iniciado! Abrindo no seu cliente de torrent.");
    window.location.href = repack.uris[0];
  };

  const copyMagnet = async () => {
    if (!repack?.uris?.[0]) return;
    try {
      await navigator.clipboard.writeText(repack.uris[0]);
      toast.success("Link magnet copiado!");
    } catch {
      toast.error("Não foi possível copiar.");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  const cover = repack ? randomCover(repack.id) : "";

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500">
      <SEO
        title={repack?.title ? `Download ${repack.title}` : "Download seguro"}
        description={repack?.title ? `Download via torrent de ${repack.title} para PC. Aguarde a verificação e inicie o download.` : "Página de download seguro de repacks para PC."}
      />

      <Header />
      <main className="container-responsive py-8 sm:py-16 lg:py-24">
        <div className="max-w-5xl mx-auto space-y-12 lg:space-y-24">

          <div className="text-center space-y-8 animate-in fade-in slide-in-from-top-4 duration-1000">
            <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-widest">
              <Shield className="w-4 h-4" />
              Conexão Segura e Criptografada
            </div>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tighter leading-none">
              {repack?.title ? (
                <>Download de <span className="text-primary italic">{repack.title}</span></>
              ) : (
                <>Portal de <span className="text-primary italic">Download</span></>
              )}
            </h1>
          </div>

          <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-start">
            {/* Sidebar info */}
            <div className="lg:col-span-4 space-y-10 order-2 lg:order-1">
              {repack && (
                <div className="bg-card border-2 border-border rounded-[2.5rem] p-8 space-y-8 shadow-2xl relative overflow-hidden group">
                  <div className="aspect-[3/4] max-w-[200px] lg:max-w-none mx-auto rounded-2xl overflow-hidden border border-border/50">
                    <img
                      src={cover}
                      alt={repack.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div className="space-y-4">
                    <h2 className="text-xl font-black uppercase leading-tight">{repack.title}</h2>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-widest">Repack</span>
                      {repack.file_size && (
                        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                          <HardDrive className="w-3 h-3" /> {repack.file_size}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground px-4">Recursos Úteis</p>
                <div className="grid gap-2">
                  <button onClick={copyMagnet} className="w-full flex items-center justify-between p-4 rounded-2xl bg-muted border border-border text-muted-foreground hover:text-foreground transition-colors text-sm font-bold">
                    Copiar link Magnet
                    <Copy className="w-4 h-4" />
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
                <div className="bg-card border-2 border-border rounded-[2.5rem] sm:rounded-[3rem] p-6 sm:p-12 md:p-20 space-y-10 sm:space-y-16 shadow-3xl relative overflow-hidden">
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

                      {/* Espaço reservado para anúncio */}
                      <div className="pt-4">
                        <GoogleAd className="min-h-[100px] w-full bg-muted/20 rounded-2xl flex items-center justify-center border border-border/30 overflow-hidden" />
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
                        Fonte: FitGirl Repack • Download via Torrent Magnet
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-12">
                  {/* Guia de instalação via Torrent */}
                  <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                    <div className="flex items-center justify-between px-2">
                      <h3 className="text-2xl font-black uppercase tracking-tighter">Como Instalar via Torrent</h3>
                    </div>

                    <div className="space-y-4">
                      {TORRENT_STEPS.map((step, i) => (
                        <div key={i} className="flex gap-4 p-5 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-300">
                          <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black text-sm shrink-0 border border-primary/20">
                            {i + 1}
                          </div>
                          <div className="space-y-1">
                            <p className="font-bold text-sm">{step.title}</p>
                            <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10 flex gap-3">
                      <Shield className="w-5 h-5 text-amber-500 shrink-0" />
                      <p className="text-xs text-amber-200/70">
                        <strong>Nota:</strong> Repacks podem ser detectados como falsos-positivos por antivírus. Recomendamos desativar temporariamente durante a instalação.
                      </p>
                    </div>
                  </div>

                  <div className="pt-8 border-t border-border/40">
                    <div className="flex items-center gap-3 text-primary mb-6">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Anúncio Patrocinado</h4>
                    </div>
                    <GoogleAd className="min-h-[100px] w-full bg-muted/20 rounded-2xl flex items-center justify-center border border-border/30 overflow-hidden" />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-center gap-6">
            <button
              onClick={() => navigate("/")}
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

export default RepackDownload;
