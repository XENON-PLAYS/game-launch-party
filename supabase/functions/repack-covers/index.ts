import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

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

async function resolveCover(title: string): Promise<string | null> {
  const term = cleanTitle(title);
  try {
    const url = `https://store.steampowered.com/api/storesearch/?term=${encodeURIComponent(term)}&cc=us&l=en`;
    const res = await fetch(url, {
      headers: { "Accept": "application/json", "User-Agent": "Mozilla/5.0" },
    });
    if (!res.ok) return null;
    const json = await res.json();
    const items = Array.isArray(json?.items) ? json.items : [];
    if (items.length === 0) return null;
    const appid = items[0]?.id;
    if (!appid) return null;
    // capa vertical estilo Steam (600x900)
    return `https://cdn.cloudflare.steamstatic.com/steam/apps/${appid}/library_600x900.jpg`;
  } catch {
    return null;
  }
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

    if (ids.length === 0) return json({ covers: {} });

    const { data: rows, error } = await admin
      .from("source_repacks")
      .select("id, title, cover_url")
      .in("id", ids);
    if (error) throw error;

    const covers: Record<string, string | null> = {};
    const toResolve: { id: string; title: string }[] = [];

    for (const r of rows ?? []) {
      if (r.cover_url) {
        covers[r.id] = r.cover_url;
      } else {
        toResolve.push({ id: r.id, title: r.title });
      }
    }

    // Resolve em pequenos lotes para não sobrecarregar
    const batchSize = 6;
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
