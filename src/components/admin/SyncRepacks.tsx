import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, UploadCloud, ExternalLink, Zap } from "lucide-react";

const SOURCES = [
  { id: "fitgirl", label: "FitGirl Repacks" },
  { id: "onlinefix", label: "Online Fix" },
  { id: "steamrip", label: "SteamRIP" },
  { id: "dodi", label: "DODI Repacks" },
  { id: "xatab", label: "Xatab" },
  { id: "gog", label: "GOG" },
  { id: "empress", label: "EMPRESS" },
] as const;

const sourceUrl = (id: string) => `https://hydralinks.cloud/sources/${id}.json`;

interface SourceDownload {
  title: string;
  uris: string[];
  uploadDate: string;
  fileSize: string;
}

export function SyncRepacks() {
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [replace, setReplace] = useState(true);
  const [savedCount, setSavedCount] = useState<number | null>(null);
  const [source, setSource] = useState<string>("fitgirl");

  const handleFile = async (file: File) => {
    setFileName(file.name);
    setSavedCount(null);
    let items: SourceDownload[] = [];
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      items = parsed?.downloads || (Array.isArray(parsed) ? parsed : []);
    } catch {
      toast.error(`Arquivo inválido. Envie o ${source}.json original.`);
      return;
    }

    const valid = items.filter(
      (d) => d?.title && Array.isArray(d.uris) && d.uris.length > 0,
    );
    if (!valid.length) {
      toast.error("Nenhum jogo encontrado no arquivo.");
      return;
    }

    // Envia em lotes no cliente para não estourar o tempo/limite da função
    // com listas grandes (10k+ jogos). O primeiro lote respeita "substituir";
    // os seguintes sempre acrescentam.
    const BATCH_SIZE = 1000;
    const totalBatches = Math.ceil(valid.length / BATCH_SIZE);

    setIsLoading(true);
    const toastId = toast.loading(`Salvando lote 1/${totalBatches}...`);
    let saved = 0;
    let total = 0;
    try {
      for (let i = 0; i < totalBatches; i++) {
        const chunk = valid.slice(i * BATCH_SIZE, (i + 1) * BATCH_SIZE);
        toast.loading(
          `Salvando lote ${i + 1}/${totalBatches} (${saved.toLocaleString("pt-BR")} salvos)...`,
          { id: toastId },
        );
        const { data, error } = await supabase.functions.invoke("sync-repacks", {
          body: { items: chunk, replace: replace && i === 0, source },
        });
        if (error) throw error;
        if (data?.error) throw new Error(data.error);
        saved += data.salvos ?? chunk.length;
        total = data.total ?? saved;
      }
      setSavedCount(total || saved);
      toast.success(
        `Lista atualizada! ${(total || saved).toLocaleString("pt-BR")} jogos de ${source} salvos.`,
        { id: toastId },
      );
    } catch (e: any) {
      toast.error(
        `Falha ao salvar (${saved.toLocaleString("pt-BR")} salvos antes do erro): ${e.message}`,
        { id: toastId },
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight flex items-center gap-2">
          <Zap className="h-7 w-7 text-primary" /> Lista de Repacks (estilo Hydra)
        </h2>
        <p className="text-sm text-muted-foreground mt-2">
          Salva a lista completa de cada fonte (título, link magnet, tamanho e data) para mostrar
          bem rápido na página pública de Repacks. Não busca capas nem descrições — é instantâneo.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card/40 p-6 space-y-4">
        <h3 className="font-black uppercase tracking-wider text-sm flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">1</span>
          Escolha a fonte
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {SOURCES.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => { setSource(s.id); setFileName(null); setSavedCount(null); }}
              className={`rounded-xl border px-4 py-3 text-left text-sm font-bold transition-colors ${
                source === s.id
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-card/40 text-muted-foreground hover:border-primary/50"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card/40 p-6 space-y-4">
        <h3 className="font-black uppercase tracking-wider text-sm flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">2</span>
          Baixe o arquivo da fonte
        </h3>
        <p className="text-sm text-muted-foreground">
          A fonte é protegida por Cloudflare, então abra o link no navegador e salve o arquivo
          <strong> {source}.json</strong>.
        </p>
        <a href={sourceUrl(source)} target="_blank" rel="noopener noreferrer">
          <Button variant="outline" className="rounded-xl gap-2">
            <ExternalLink className="h-4 w-4" /> Abrir fonte {source}.json
          </Button>
        </a>
      </div>

      <div className="rounded-2xl border border-border bg-card/40 p-6 space-y-6">
        <h3 className="font-black uppercase tracking-wider text-sm flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">3</span>
          Enviar e salvar
        </h3>

        <div className="flex items-center gap-3">
          <Switch id="replace" checked={replace} onCheckedChange={setReplace} />
          <Label htmlFor="replace" className="text-xs font-bold uppercase tracking-widest cursor-pointer">
            Substituir lista anterior desta fonte (recomendado)
          </Label>
        </div>

        <label className={`flex flex-col items-center justify-center gap-3 border-2 border-dashed border-border rounded-2xl p-8 cursor-pointer hover:border-primary/60 transition-colors ${isLoading ? "opacity-50 pointer-events-none" : ""}`}>
          {isLoading ? (
            <Loader2 className="h-10 w-10 text-primary animate-spin" />
          ) : (
            <UploadCloud className="h-10 w-10 text-muted-foreground" />
          )}
          <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
            {fileName ? fileName : `Clique para enviar o ${source}.json`}
          </span>
          <input
            type="file"
            accept=".json,application/json"
            className="hidden"
            disabled={isLoading}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
            }}
          />
        </label>
      </div>

      {savedCount !== null && (
        <div className="rounded-2xl border border-primary/40 bg-primary/5 p-6 text-center">
          <div className="text-3xl font-black text-primary">{savedCount.toLocaleString("pt-BR")}</div>
          <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1">
            jogos de {source} na lista pública de Repacks
          </div>
        </div>
      )}
    </div>
  );
}
