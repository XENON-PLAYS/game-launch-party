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
  s = s.replace(/\[[^\]]*\]/g, " ");
  s = s.replace(/\([^)]*\)/g, " ");
  s = s.replace(
    /[\s:–—-]+(deluxe|gold|ultimate|complete|goty|game of the year|definitive|enhanced|premium|collectors?|anniversary|remastered|repack|edition|build|update|dlc|multi\d*|v\d).*/i,
    " ",
  );
  s = s.replace(/[™®©]/g, " ");
  s = s.replace(/\s+/g, " ").trim();
  return s || raw.trim();
}

function similarity(a: string, b: string): number {
  const ta = new Set(normalize(a).split(" ").filter(Boolean));
  const tb = new Set(normalize(b).split(" ").filter(Boolean));
  if (ta.size === 0 || tb.size === 0) return 0;
  let inter = 0;
  for (const t of ta) if (tb.has(t)) inter++;
  const union = new Set([...ta, ...tb]).size;
  return inter / union;
}

async function searchSteam(term: string): Promise<Array<{ id: number; name: string }>> {
  try {
    const url = `https://store.steampowered.com/api/storesearch/?term=${encodeURIComponent(term)}&cc=us&l=en`;
    const res = await fetch(url, { headers: { "Accept": "application/json", "User-Agent": "Mozilla/5.0" } });
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

async function suggestSteam(term: string): Promise<Array<{ id: number; name: string }>> {
  try {
    const url =
      `https://store.steampowered.com/search/suggest?term=${encodeURIComponent(term)}&f=games&cc=us&l=english&use_store_query=1`;
    const res = await fetch(url, { headers: { "Accept": "text/html", "User-Agent": "Mozilla/5.0" } });
    if (!res.ok) return [];
    const html = await res.text();
    const results: Array<{ id: number; name: string }> = [];
    const re = /data-ds-appid="(\d+)"[^>]*>[\s\S]*?<div class="match_name[^"]*">([^<]*)<\/div>/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(html)) !== null) results.push({ id: Number(m[1]), name: m[2].trim() });
    return results;
  } catch {
    return [];
  }
}

async function resolveAppId(title: string): Promise<number | null> {
  const cleaned = cleanTitle(title);
  const words = cleaned.split(" ");
  const attempts = Array.from(
    new Set([cleaned, words.slice(0, 4).join(" "), words.slice(0, 2).join(" ")].filter((t) => t.length >= 2)),
  );
  let bestId: number | null = null;
  let bestScore = 0;
  for (const term of attempts) {
    const [a, b] = await Promise.all([searchSteam(term), suggestSteam(term)]);
    for (const it of [...a, ...b].slice(0, 16)) {
      const score = similarity(cleaned, it.name);
      if (score > bestScore) {
        bestScore = score;
        bestId = it.id;
      }
    }
    if (bestScore >= 0.6) break;
  }
  if (bestId == null || bestScore < 0.34) return null;
  return bestId;
}

interface Details {
  steam_appid: number;
  description: string | null;
  trailer_url: string | null;
  screenshots: string[];
  banner_url: string | null;
  cover_url: string | null;
}

function httpsify(u: string | undefined | null): string | null {
  if (!u) return null;
  return u.replace(/^http:\/\//i, "https://");
}

async function fetchDetails(appid: number): Promise<Details | null> {
  try {
    const res = await fetch(
      `https://store.steampowered.com/api/appdetails?appids=${appid}&cc=us&l=en`,
      { headers: { "Accept": "application/json", "User-Agent": "Mozilla/5.0" } },
    );
    if (!res.ok) return null;
    const j = await res.json();
    const entry = j?.[String(appid)];
    if (!entry?.success || !entry.data) return null;
    const d = entry.data;

    // Trailer: prioriza mp4 (melhor compatibilidade), depois webm
    let trailer: string | null = null;
    if (Array.isArray(d.movies) && d.movies.length > 0) {
      const mv = d.movies[0];
      trailer = httpsify(mv?.mp4?.max || mv?.mp4?.["480"] || mv?.webm?.max || mv?.webm?.["480"]);
    }

    const screenshots: string[] = Array.isArray(d.screenshots)
      ? d.screenshots.map((s: { path_full?: string }) => httpsify(s?.path_full)).filter(Boolean).slice(0, 8) as string[]
      : [];

    const banner = httpsify(
      `https://cdn.cloudflare.steamstatic.com/steam/apps/${appid}/library_hero.jpg`,
    ) || httpsify(d.header_image);

    const cover = httpsify(
      `https://cdn.cloudflare.steamstatic.com/steam/apps/${appid}/library_600x900.jpg`,
    );

    const description: string | null =
      (typeof d.short_description === "string" && d.short_description.trim()) || null;

    return { steam_appid: appid, description, trailer_url: trailer, screenshots, banner_url: banner, cover_url: cover };
  } catch {
    return null;
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

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
      ? body.ids.filter((x: unknown) => typeof x === "string").slice(0, 40)
      : [];
    const force = body?.force === true;

    if (ids.length === 0) return json({ details: {} });

    const { data: rows, error } = await admin
      .from("source_repacks")
      .select("id, title, description, trailer_url, screenshots, banner_url, steam_appid")
      .in("id", ids);
    if (error) throw error;

    const details: Record<string, Details | null> = {};
    const toResolve: { id: string; title: string; appid: number | null }[] = [];

    for (const r of rows ?? []) {
      const hasData = r.description || r.trailer_url || (r.screenshots && r.screenshots.length > 0);
      if (hasData && !force) {
        details[r.id] = {
          steam_appid: r.steam_appid,
          description: r.description,
          trailer_url: r.trailer_url,
          screenshots: r.screenshots ?? [],
          banner_url: r.banner_url,
          cover_url: null,
        };
      } else {
        toResolve.push({ id: r.id, title: r.title, appid: r.steam_appid ?? null });
      }
    }

    const batchSize = 4;
    for (let i = 0; i < toResolve.length; i += batchSize) {
      const batch = toResolve.slice(i, i + batchSize);
      const results = await Promise.all(
        batch.map(async (item) => {
          const appid = item.appid ?? (await resolveAppId(item.title));
          if (!appid) return { id: item.id, det: null };
          const det = await fetchDetails(appid);
          return { id: item.id, det };
        }),
      );
      for (const r of results) {
        if (r.det) {
          details[r.id] = r.det;
          const update: Record<string, unknown> = {
            steam_appid: r.det.steam_appid,
            description: r.det.description,
            trailer_url: r.det.trailer_url,
            screenshots: r.det.screenshots,
            banner_url: r.det.banner_url,
          };
          if (r.det.cover_url) update.cover_url = r.det.cover_url;
          await admin.from("source_repacks").update(update).eq("id", r.id);
        }
      }
    }

    return json({ details });
  } catch (e) {
    return json({ error: (e as Error).message, details: {} }, 200);
  }
});
