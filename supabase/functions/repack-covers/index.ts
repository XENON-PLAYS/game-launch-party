import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

// Normaliza texto para comparação (sem acentos, símbolos, minúsculo)
function normalize(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

// Limpa o título do repack para melhorar a busca na Steam
function cleanTitle(raw: string): string {
  let s = raw;
  s = s.replace(/\[[^\]]*\]/g, " "); // remove [FitGirl Repack] etc
  s = s.replace(/\([^)]*\)/g, " "); // remove (v1.2) etc
  // corta a partir de termos de edição/versão
  s = s.replace(
    /[\s:–—-]+(deluxe|gold|ultimate|complete|goty|game of the year|definitive|enhanced|premium|collectors?|anniversary|remastered|repack|edition|build|update|dlc|multi\d*|v\d).*/i,
    " ",
  );
  s = s.replace(/[™®©]/g, " ");
  s = s.replace(/\s+/g, " ").trim();
  return s || raw.trim();
}

// Similaridade simples baseada em tokens compartilhados (Jaccard-ish)
function similarity(a: string, b: string): number {
  const ta = new Set(normalize(a).split(" ").filter(Boolean));
  const tb = new Set(normalize(b).split(" ").filter(Boolean));
  if (ta.size === 0 || tb.size === 0) return 0;
  let inter = 0;
  for (const t of ta) if (tb.has(t)) inter++;
  const union = new Set([...ta, ...tb]).size;
  return inter / union;
}

async function exists(url: string): Promise<boolean> {
  try {
    const res = await fetch(url, { method: "GET", headers: { "User-Agent": "Mozilla/5.0" } });
    if (!res.ok) return false;
    const type = res.headers.get("content-type") || "";
    const len = Number(res.headers.get("content-length") || "0");
    // imagens de placeholder da Steam costumam ser muito pequenas
    return type.startsWith("image/") && (len === 0 || len > 1500);
  } catch {
    return false;
  }
}

// Retorna a melhor URL de arte que exista de fato para um appid
async function bestArt(appid: number): Promise<string | null> {
  const candidates = [
    `https://cdn.cloudflare.steamstatic.com/steam/apps/${appid}/library_600x900.jpg`,
    `https://cdn.cloudflare.steamstatic.com/steam/apps/${appid}/library_600x900_2x.jpg`,
    `https://cdn.cloudflare.steamstatic.com/steam/apps/${appid}/header.jpg`,
    `https://cdn.cloudflare.steamstatic.com/steam/apps/${appid}/capsule_616x353.jpg`,
  ];
  for (const url of candidates) {
    if (await exists(url)) return url;
  }
  // Fallback para jogos novos: caminhos fixos falham porque a Steam usa
  // URLs com hash. Buscamos a arte real via appdetails.
  try {
    const res = await fetch(
      `https://store.steampowered.com/api/appdetails?appids=${appid}&cc=us&l=en`,
      { headers: { "Accept": "application/json", "User-Agent": "Mozilla/5.0" } },
    );
    if (res.ok) {
      const j = await res.json();
      const d = j?.[String(appid)]?.data;
      const art = d?.header_image || d?.capsule_image;
      if (typeof art === "string" && art.length > 0) return art;
    }
  } catch {
    // ignora
  }
  return null;
}

async function searchSteam(term: string): Promise<Array<{ id: number; name: string }>> {
  try {
    const url = `https://store.steampowered.com/api/storesearch/?term=${encodeURIComponent(term)}&cc=us&l=en`;
    const res = await fetch(url, {
      headers: { "Accept": "application/json", "User-Agent": "Mozilla/5.0" },
    });
    if (!res.ok) return [];
    const j = await res.json();
    const items = Array.isArray(j?.items) ? j.items : [];
    return items
      .filter((it: unknown) => it && typeof (it as { id: unknown }).id === "number")
      .map((it: { id: number; name: string }) => ({ id: it.id, name: it.name ?? "" }));
  } catch {
    return [];
  }
}

async function resolveCover(title: string): Promise<string | null> {
  const cleaned = cleanTitle(title);
  // Tenta o título limpo e, se falhar, uma versão ainda mais curta (primeiras palavras)
  const words = cleaned.split(" ");
  const attempts = Array.from(
    new Set([
      cleaned,
      words.slice(0, 4).join(" "),
      words.slice(0, 2).join(" "),
    ].filter((t) => t.length >= 2)),
  );

  let bestId: number | null = null;
  let bestScore = 0;

  for (const term of attempts) {
    const items = await searchSteam(term);
    for (const it of items.slice(0, 8)) {
      const score = similarity(cleaned, it.name);
      if (score > bestScore) {
        bestScore = score;
        bestId = it.id;
      }
    }
    // match forte encontrado, não precisa continuar tentando
    if (bestScore >= 0.6) break;
  }

  // aceita apenas matches razoáveis para evitar capa de jogo errado
  if (bestId == null || bestScore < 0.34) return null;
  return await bestArt(bestId);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const json = (data: unknown, status = 200) =>
    new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status,
    });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const admin = createClient(supabaseUrl, serviceKey);

    const body = await req.json().catch(() => ({}));
    const ids: string[] = Array.isArray(body?.ids)
      ? body.ids.filter((x: unknown) => typeof x === "string").slice(0, 60)
      : [];
    // Permite reprocessar capas já salvas (para corrigir capas genéricas/erradas)
    const force = body?.force === true;

    if (ids.length === 0) return json({ covers: {} });

    const { data: rows, error } = await admin
      .from("source_repacks")
      .select("id, title, cover_url")
      .in("id", ids);
    if (error) throw error;

    const covers: Record<string, string | null> = {};
    const toResolve: { id: string; title: string }[] = [];

    for (const r of rows ?? []) {
      if (r.cover_url && !force) {
        covers[r.id] = r.cover_url;
      } else {
        toResolve.push({ id: r.id, title: r.title });
      }
    }

    // Resolve em pequenos lotes para não sobrecarregar
    const batchSize = 5;
    for (let i = 0; i < toResolve.length; i += batchSize) {
      const batch = toResolve.slice(i, i + batchSize);
      const results = await Promise.all(
        batch.map(async (item) => ({
          id: item.id,
          url: await resolveCover(item.title),
        })),
      );
      for (const r of results) {
        if (r.url) {
          covers[r.id] = r.url;
          await admin
            .from("source_repacks")
            .update({ cover_url: r.url })
            .eq("id", r.id);
        }
      }
    }

    return json({ covers });
  } catch (e) {
    return json({ error: (e as Error).message, covers: {} }, 200);
  }
});
