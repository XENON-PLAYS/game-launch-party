import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { Download, Loader2, UploadCloud, ExternalLink, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";

const SOURCE_URL = "https://hydralinks.cloud/sources/fitgirl.json";

interface SourceDownload {
  title: string;
  uris: string[];
  uploadDate: string;
  fileSize: string;
}

interface ImportResult {
  ok: boolean;
  total_na_fonte: number;
  analisados: number;
  importados: number;
  ignorados: number;
  com_metadados: number;
  detalhes: { title: string; status: string }[];
}

export function ImportGames() {
  const queryClient = useQueryClient();
  const [limit, setLimit] = useState(50);
  const [withMetadata, setWithMetadata] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [result, setResult] = useState<ImportResult | null>(null);

  const processItems = async (items: SourceDownload[]) => {
    const valid = items.filter((d) => d?.title && Array.isArray(d.uris) && d.uris.length > 0);
    if (valid.length === 0) {
      toast.error("Nenhum jogo válido encontrado no arquivo.");
      return;
    }
    // Mais recentes primeiro e limita no cliente para enviar um lote menor
    valid.sort(
      (a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime(),
    );
    const batch = valid.slice(0, limit);

    setIsLoading(true);
    setResult(null);
    const toastId = toast.loading(
      `Importando ${batch.length} jogos e buscando dados na Steam... isso pode levar um tempo.`,
    );
    try {
      const { data, error } = await supabase.functions.invoke("import-games", {
        body: { items: batch, limit, withMetadata },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setResult(data as ImportResult);
      toast.success(`${data.importados} jogos importados, ${data.ignorados} ignorados.`, { id: toastId });
      queryClient.invalidateQueries({ queryKey: ["admin-games"] });
      queryClient.invalidateQueries({ queryKey: ["games"] });
    } catch (e: any) {
      toast.error(`Falha na importação: ${e.message}`, { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFile = async (file: File) => {
    setFileName(file.name);
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      const items: SourceDownload[] = parsed?.downloads || (Array.isArray(parsed) ? parsed : []);
      await processItems(items);
    } catch (_) {
      toast.error("Arquivo inválido. Envie o fitgirl.json original.");
    }
  };

  const handleTryDirect = async () => {
    setIsLoading(true);
    setResult(null);
    const toastId = toast.loading("Tentando baixar a fonte automaticamente...");
    try {
      const res = await fetch(SOURCE_URL);
      if (!res.ok) throw new Error("bloqueado");
      const parsed = await res.json();
      toast.dismiss(toastId);
      await processItems(parsed?.downloads || []);
    } catch (_) {
      toast.error(
        "A fonte está protegida (Cloudflare) e não pode ser baixada automaticamente. Use o envio do arquivo abaixo.",
        { id: toastId, duration: 6000 },
      );
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight">Importar da FitGirl</h2>
        <p className="text-sm text-muted-foreground mt-2">
          Importa os lançamentos mais recentes da fonte FitGirl Repacks, buscando capas e descrições
          automaticamente na Steam. Jogos já existentes são ignorados.
        </p>
      </div>

      {/* Passo 1 */}
      <div className="rounded-2xl border border-border bg-card/40 p-6 space-y-4">
        <h3 className="font-black uppercase tracking-wider text-sm flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">1</span>
          Baixe o arquivo da fonte
        </h3>
        <p className="text-sm text-muted-foreground">
          A fonte é protegida por Cloudflare, então abra o link no navegador e salve o arquivo
          <strong> fitgirl.json</strong>.
        </p>
        <a href={SOURCE_URL} target="_blank" rel="noopener noreferrer">
          <Button variant="outline" className="rounded-xl gap-2">
            <ExternalLink className="h-4 w-4" /> Abrir fonte fitgirl.json
          </Button>
        </a>
      </div>

      {/* Configurações */}
      <div className="rounded-2xl border border-border bg-card/40 p-6 space-y-6">
        <h3 className="font-black uppercase tracking-wider text-sm flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">2</span>
          Configurações
        </h3>
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="space-y-2">
            <Label htmlFor="limit" className="text-xs font-bold uppercase tracking-widest">Quantidade (mais recentes)</Label>
            <Input
              id="limit"
              type="number"
              min={1}
              max={300}
              value={limit}
              onChange={(e) => setLimit(Math.min(Math.max(Number(e.target.value) || 1, 1), 300))}
              className="w-40 rounded-xl"
            />
          </div>
          <div className="flex items-center gap-3 pt-6">
            <Switch id="meta" checked={withMetadata} onCheckedChange={setWithMetadata} />
            <Label htmlFor="meta" className="text-xs font-bold uppercase tracking-widest cursor-pointer">
              Buscar capas/descrição na Steam
            </Label>
          </div>
        </div>
      </div>

      {/* Passo 3 */}
      <div className="rounded-2xl border border-border bg-card/40 p-6 space-y-4">
        <h3 className="font-black uppercase tracking-wider text-sm flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">3</span>
          Enviar e importar
        </h3>

        <label className={`flex flex-col items-center justify-center gap-3 border-2 border-dashed border-border rounded-2xl p-8 cursor-pointer hover:border-primary/60 transition-colors ${isLoading ? "opacity-50 pointer-events-none" : ""}`}>
          <UploadCloud className="h-10 w-10 text-muted-foreground" />
          <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
            {fileName ? fileName : "Clique para enviar o fitgirl.json"}
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

        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">ou</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <Button onClick={handleTryDirect} disabled={isLoading} variant="secondary" className="rounded-xl gap-2 w-full">
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
          Tentar baixar automaticamente
        </Button>
      </div>

      {/* Resultado */}
      {result && (
        <div className="rounded-2xl border border-border bg-card/40 p-6 space-y-4">
          <h3 className="font-black uppercase tracking-wider text-sm">Resultado</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Stat label="Importados" value={result.importados} tone="ok" />
            <Stat label="Ignorados" value={result.ignorados} tone="muted" />
            <Stat label="Com metadados" value={result.com_metadados} tone="ok" />
            <Stat label="Analisados" value={result.analisados} tone="muted" />
          </div>
          <div className="max-h-72 overflow-y-auto rounded-xl border border-border divide-y divide-border">
            {result.detalhes.map((d, i) => (
              <div key={i} className="flex items-center justify-between gap-3 px-4 py-2 text-sm">
                <span className="truncate">{d.title}</span>
                <span className="flex items-center gap-1.5 text-xs whitespace-nowrap">
                  {d.status === "importado" ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                  ) : d.status === "já existe" ? (
                    <AlertTriangle className="h-3.5 w-3.5 text-yellow-500" />
                  ) : (
                    <XCircle className="h-3.5 w-3.5 text-destructive" />
                  )}
                  <span className="text-muted-foreground">{d.status}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: number; tone: "ok" | "muted" }) {
  return (
    <div className="rounded-xl border border-border bg-background/40 p-4 text-center">
      <div className={`text-2xl font-black ${tone === "ok" ? "text-primary" : "text-foreground"}`}>{value}</div>
      <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1">{label}</div>
    </div>
  );
}
