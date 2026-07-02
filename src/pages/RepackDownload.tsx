import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { SEO } from "@/components/SEO";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { Download, Loader2, Shield, CheckCircle, CheckCircle2, RefreshCw, HardDrive, Copy, ChevronRight, Monitor } from "lucide-react";
import { toast } from "sonner";
import { GoogleAd } from "@/components/GoogleAd";
import { randomCover } from "@/components/RepackCard";
import { getDownloadOptions } from "@/lib/downloadLinks";

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
      const { data, error } = await (supabase as any)
        .from("merged_repacks")
        .select("id, title, uris, file_size, upload_date")
        .eq("id", id!)
        .maybeSingle();
      if (error) throw error;
      return data as { id: string; title: string; uris: string[]; file_size: string | null; upload_date: string | null } | null;
    },
    enabled: !!id,
  });

  const downloadOptions = getDownloadOptions(repack?.uris);

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

  const handleDownload = (option?: { url: string; kind: string }) => {
    const target = option ?? downloadOptions[0];
    if (!target?.url) return;
    setDownloadStarted(true);
    toast.success(
      target.kind === "torrent"
        ? "Download iniciado! Abrindo no seu cliente de torrent."
        : "Download iniciado! Abrindo o link em uma nova aba.",
    );
    if (target.kind === "torrent") {
      window.location.href = target.url;
    } else {
      window.open(target.url, "_blank", "noopener,noreferrer");
    }
  };

  const copyLink = async (url?: string) => {
    const target = url ?? downloadOptions[0]?.url;
    if (!target) return;
    try {
      await navigator.clipboard.writeText(target);
      toast.success("Link copiado!");
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
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      <SEO
        title={repack?.title ? `Download ${repack.title}` : "Download seguro"}
        description={repack?.title ? `Download via torrent de ${repack.title} para PC. Aguarde a verificação e inicie o download.` : "Página de download seguro de repacks para PC."}
      />

      <Header />

      {/* Hero Section */}
      <section className="bg-card border-b border-border py-8 sm:py-16 lg:py-24">
        <div className="container-responsive">
          <div className="mb-6 sm:mb-16">
            <Breadcrumbs
              items={[
                { label: "Catálogo", path: "/" },
                { label: repack?.title || "Repack" },
              ]}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-20 items-start">
            {/* Visuals */}
            <div className="lg:col-span-5 xl:col-span-4">
              <div className="rounded-2xl sm:rounded-3xl overflow-hidden border border-border shadow-3xl aspect-[3/4] bg-muted group/hero-image relative">
                <img
                  src={cover}
                  alt={repack?.title || "Repack"}
                  className="w-full h-full object-cover transition-all duration-700 group-hover/hero-image:scale-110"
                  fetchPriority="high"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/hero-image:opacity-100 transition-opacity duration-500" />
              </div>
            </div>

            <div className="lg:col-span-7 xl:col-span-8 space-y-8 sm:space-y-16">
              <div className="space-y-6 sm:space-y-8">
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  <span className="text-[10px] sm:text-responsive-small px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-primary/10 text-primary border border-primary/20 shadow-sm">
                    Repack
                  </span>
                  {repack?.file_size && (
                    <span className="text-[10px] sm:text-responsive-small px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-muted text-muted-foreground border border-border flex items-center gap-1.5">
                      <HardDrive className="w-3.5 h-3.5" /> {repack.file_size}
                    </span>
                  )}
                </div>

                <h1 className="text-3xl sm:text-responsive-h1 leading-none uppercase">
                  {repack?.title}
                </h1>
              </div>

              {/* Quick Actions Bar */}
              <div className="flex flex-col sm:flex-row sm:items-end gap-6 sm:gap-12 pt-4 sm:pt-6">
                <div className="space-y-2 sm:space-y-3">
                  <span className="text-[10px] sm:text-responsive-small text-muted-foreground opacity-70">Preço do Tesouro</span>
                  <div className="text-2xl sm:text-responsive-h2 text-primary flex items-center gap-3 sm:gap-4">
                    <span className="relative flex h-3 w-3 sm:h-4 sm:w-4">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 sm:h-4 sm:w-4 bg-primary"></span>
                    </span>
                    GRÁTIS
                  </div>
                </div>

                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <button
                    onClick={() => {
                      const element = document.getElementById("download-section");
                      element?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-4 px-10 sm:px-16 py-4 sm:py-6 bg-primary text-primary-foreground rounded-2xl font-black uppercase tracking-[0.2em] text-xs sm:text-sm lg:text-base hover:bg-primary/90 transition-all duration-500 shadow-3xl shadow-primary/30 hover:-translate-y-2 active:scale-95"
                  >
                    <span>Baixar Tesouro</span>
                    <Download className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="container-responsive py-12 sm:py-24 lg:py-32 space-y-16 sm:space-y-32">
        {/* Download & Requirements Section */}
        <section id="download-section" className="grid lg:grid-cols-2 gap-12 sm:gap-24">
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

          <div className="w-full">
            {!downloadStarted ? (
              <div className="bg-card border-2 border-border rounded-[2.5rem] sm:rounded-[3rem] p-6 sm:p-12 md:p-16 space-y-10 sm:space-y-14 shadow-2xl shadow-black/5 relative overflow-hidden">
                <div className="flex justify-end">
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
                  <div className="space-y-12 text-center">
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
                      className="w-full py-8 sm:py-10 rounded-[2.5rem] bg-primary text-primary-foreground font-black text-2xl sm:text-4xl uppercase tracking-[0.2em] hover:bg-primary/90 hover:scale-[1.02] active:scale-95 transition-all shadow-[0_30px_90px_-20px_rgba(249,115,22,0.6)] flex items-center justify-center gap-8 group"
                    >
                      <Download className="w-10 h-10 group-hover:animate-bounce" />
                      Baixar Agora
                    </button>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                      <button onClick={copyMagnet} className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 bg-muted border border-border text-muted-foreground rounded-xl font-bold uppercase tracking-widest text-[10px] hover:text-foreground transition-all">
                        Copiar link Magnet <Copy className="w-4 h-4" />
                      </button>
                      <button onClick={() => { setCountdown(10); setReady(false); }} className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 bg-muted border border-border text-muted-foreground rounded-xl font-bold uppercase tracking-widest text-[10px] hover:text-foreground transition-all">
                        Reiniciar Contagem <RefreshCw className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-center text-xs text-muted-foreground uppercase tracking-widest font-bold opacity-60">
                      Fonte: FitGirl Repack • Download via Torrent Magnet
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-12 sm:p-20 text-center rounded-[2.5rem] sm:rounded-[3rem] bg-emerald-500/5 border-2 border-emerald-500/20 space-y-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-400" />
                </div>
                <div className="space-y-2">
                  <p className="text-lg font-black uppercase tracking-widest text-emerald-400">Download iniciado</p>
                  <p className="text-sm text-muted-foreground">Abra seu cliente de torrent para acompanhar o progresso. Siga o guia abaixo para instalar.</p>
                </div>
                <button onClick={copyMagnet} className="inline-flex items-center gap-2 px-8 py-3 bg-muted border border-border text-muted-foreground rounded-xl font-bold uppercase tracking-widest text-[10px] hover:text-foreground transition-all">
                  Copiar link Magnet <Copy className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
          </div>

          {/* Requirements Area */}
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
              {
                label: "Mínimos",
                data: {
                  processador: "Intel Core i3 / AMD Ryzen 3",
                  memoria: "8 GB de RAM",
                  placa: "NVIDIA GTX 750 Ti / AMD equivalente",
                  armazenamento: repack?.file_size || "Espaço livre suficiente para o repack",
                },
              },
              {
                label: "Recomendados",
                data: {
                  processador: "Intel Core i5 / AMD Ryzen 5",
                  memoria: "16 GB de RAM",
                  placa: "NVIDIA GTX 1060 / AMD equivalente",
                  armazenamento: "SSD para melhor desempenho",
                },
              },
            ].map(({ label, data }) => (
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
            ))}
          </div>
          </div>
        </section>

        {/* Installation Section */}
        <section className="space-y-16 relative py-16 px-6 sm:px-12 rounded-[3.5rem] bg-card/30 border border-border/50 overflow-hidden shadow-inner">
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
                <span className="text-responsive-small text-muted-foreground opacity-80">Como Instalar via Torrent</span>
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
                    "Verificar drivers de vídeo (Nvidia/AMD)",
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm font-bold text-muted-foreground/80">
                      <CheckCircle className="w-4 h-4 text-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="lg:col-span-8 space-y-10">
              <div className="bg-gradient-to-br from-card via-card/95 to-muted/10 border-2 border-border/50 rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-14 space-y-10 shadow-2xl backdrop-blur-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[80px] -mr-32 -mt-32 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 blur-[80px] -ml-32 -mb-32 pointer-events-none" />
                <div className="relative z-10">
                  <div className="flex items-center justify-between border-b border-border pb-8">
                    <div className="flex items-center gap-4 text-primary">
                      <Download className="w-6 h-6" />
                      <h3 className="text-xl font-black uppercase tracking-widest">Fluxo de Instalação</h3>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-4 py-2 bg-muted rounded-full">Torrent</span>
                  </div>
                </div>

                <div className="grid gap-6">
                  {TORRENT_STEPS.map((step, i) => (
                    <div key={i} className="flex gap-6 group">
                      <div className="w-12 h-12 rounded-2xl bg-muted border border-border text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 flex items-center justify-center font-black text-lg shrink-0">
                        {i + 1}
                      </div>
                      <div className="space-y-1 self-center">
                        <p className="font-bold text-sm">{step.title}</p>
                        <p className="text-muted-foreground group-hover:text-foreground transition-colors text-sm leading-relaxed">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {!isVip && (
                  <div className="mt-8 border-t border-border pt-8">
                    <div className="flex items-center gap-3 text-primary mb-6">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Conteúdo Patrocinado</h4>
                    </div>
                    <GoogleAd className="min-h-[100px] w-full bg-muted/20 rounded-2xl flex items-center justify-center border border-border/30 overflow-hidden" />
                  </div>
                )}

                <div className="mt-10 p-8 rounded-3xl bg-amber-500/5 border border-amber-500/10 flex gap-3">
                  <Shield className="w-5 h-5 text-amber-500 shrink-0" />
                  <p className="text-xs text-amber-200/70">
                    <strong>Nota:</strong> Repacks podem ser detectados como falsos-positivos por antivírus. Recomendamos desativar temporariamente durante a instalação.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="flex items-center justify-center gap-6">
          <button
            onClick={() => navigate("/")}
            className="px-10 py-5 rounded-2xl bg-muted/50 border border-border text-muted-foreground hover:text-primary hover:border-primary/30 transition-all flex items-center gap-3 font-black uppercase tracking-widest text-xs"
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
            Retornar à Navegação
          </button>
        </div>
      </main>
    </div>
  );
};

export default RepackDownload;
