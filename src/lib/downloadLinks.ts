// Detecta o tipo/host de um link de download para exibir todas as opções
// disponíveis (torrent, gofile, mediafire, etc.) de forma amigável.

export type DownloadKind = "torrent" | "direct";

export interface DownloadOption {
  url: string;
  label: string;
  kind: DownloadKind;
}

interface HostRule {
  match: RegExp;
  label: string;
  kind: DownloadKind;
}

const HOST_RULES: HostRule[] = [
  { match: /^magnet:/i, label: "Torrent (Magnet)", kind: "torrent" },
  { match: /\.torrent(\?|$)/i, label: "Torrent", kind: "torrent" },
  { match: /gofile\.io/i, label: "Gofile", kind: "direct" },
  { match: /mediafire\.com/i, label: "MediaFire", kind: "direct" },
  { match: /datanodes\.to/i, label: "DataNodes", kind: "direct" },
  { match: /1fichier\.com/i, label: "1Fichier", kind: "direct" },
  { match: /pixeldrain\.com/i, label: "PixelDrain", kind: "direct" },
  { match: /(mega\.nz|mega\.co\.nz|megadb)/i, label: "MEGA", kind: "direct" },
  { match: /buzzheavier\.com/i, label: "BuzzHeavier", kind: "direct" },
  { match: /(qiwi|filecrypt|frdl|fastupload)/i, label: "Download Direto", kind: "direct" },
  { match: /torrent/i, label: "Torrent", kind: "torrent" },
];

export function classifyLink(url: string): DownloadOption {
  const clean = (url || "").trim();
  for (const rule of HOST_RULES) {
    if (rule.match.test(clean)) {
      return { url: clean, label: rule.label, kind: rule.kind };
    }
  }
  return { url: clean, label: "Download Direto", kind: "direct" };
}

// Recebe a lista bruta de uris e devolve opções únicas classificadas.
export function getDownloadOptions(uris: string[] | null | undefined): DownloadOption[] {
  if (!uris?.length) return [];
  const seen = new Set<string>();
  const options: DownloadOption[] = [];
  for (const uri of uris) {
    const opt = classifyLink(uri);
    if (!opt.url || seen.has(opt.url)) continue;
    seen.add(opt.url);
    options.push(opt);
  }
  // Torrents primeiro, depois downloads diretos
  return options.sort((a, b) => (a.kind === b.kind ? 0 : a.kind === "torrent" ? -1 : 1));
}
