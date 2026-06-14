import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const SOURCE_URL = "https://hydralinks.cloud/sources/fitgirl.json";

interface SourceDownload {
  title: string;
  uris: string[];
  uploadDate: string;
  fileSize: string;
}

// Limpa o título do repack para algo pesquisável na Steam
function cleanTitle(raw: string): string {
  let t = raw;
  // Remove tudo a partir do primeiro "(" ou "[" (versão, DLCs, "FitGirl Repack", etc.)
  t = t.split("(")[0].split("[")[0];
  // Remove sufixos comuns de edição que atrapalham a busca
  t = t.replace(/\b(Repack|FitGirl|MULTi\d+|GOG|Build \d+)\b/gi, "");
  // Normaliza traços e espaços
  t = t.replace(/[–—]/g, "-").replace(/\s+/g, " ").trim();
  // Remove traço/dois-pontos finais soltos
  t = t.replace(/[-:]\s*$/, "").trim();
  return t;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

async function steamSearch(term: string): Promise<{ appid: string; name: string } | null> {
  try {
    const res = await fetch(
      `https://steamcommunity.com/actions/SearchApps/${encodeURIComponent(term)}`,
    );
    if (!res.ok) return null;
    const arr = await res.json();
    if (Array.isArray(arr) && arr.length > 0) {
      return { appid: String(arr[0].appid), name: arr[0].name };
    }
  } catch (_) { /* ignore */ }
  return null;
}

async function steamDetails(appid: string): Promise<any | null> {
  try {
    const res = await fetch(
      `https://store.steampowered.com/api/appdetails?appids=${appid}&l=portuguese&cc=br`,
    );
    if (!res.ok) return null;
    const json = await res.json();
    const entry = json?.[appid];
    if (entry?.success) return entry.data;
  } catch (_) { /* ignore */ }
  return null;
}

function stripHtml(html: string): string {
  return (html || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

  const json = (data: unknown, status = 200) =>
    new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status,
    });

  try {
    // ---- Autenticação: somente admin ----
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return json({ error: "Não autenticado" }, 401);

    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData } = await userClient.auth.getUser();
    const user = userData?.user;
    if (!user) return json({ error: "Não autenticado" }, 401);

    const admin = createClient(supabaseUrl, serviceKey);
    const { data: roles } = await admin
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin");
    if (!roles || roles.length === 0) {
      return json({ error: "Acesso negado: apenas administradores" }, 403);
    }

    // ---- Parâmetros ----
    let limit = 50;
    let withMetadata = true;
    try {
      const body = await req.json();
      if (typeof body?.limit === "number") limit = Math.min(Math.max(body.limit, 1), 300);
      if (typeof body?.withMetadata === "boolean") withMetadata = body.withMetadata;
    } catch (_) { /* sem body */ }

    // ---- Baixar a fonte (tentando contornar proteções básicas) ----
    const srcRes = await fetch(SOURCE_URL, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
        "Accept": "application/json,text/plain,*/*",
        "Accept-Language": "pt-BR,pt;q=0.9,en;q=0.8",
      },
    });

    if (!srcRes.ok) {
      return json(
        { error: `Falha ao baixar a fonte (HTTP ${srcRes.status}). A fonte pode estar protegida por Cloudflare.` },
        502,
      );
    }

    const contentType = srcRes.headers.get("content-type") || "";
    const rawText = await srcRes.text();
    if (contentType.includes("text/html") || rawText.trim().startsWith("<")) {
      return json(
        { error: "A fonte respondeu com uma página de verificação (Cloudflare), não com o JSON. Tente o envio manual do arquivo." },
        502,
      );
    }

    let source: { downloads?: SourceDownload[] };
    try {
      source = JSON.parse(rawText);
    } catch (_) {
      return json({ error: "Não foi possível ler o JSON da fonte." }, 502);
    }

    const downloads = (source.downloads || []).filter((d) => d.title && d.uris?.length);
    // Mais recentes primeiro
    downloads.sort(
      (a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime(),
    );
    const recent = downloads.slice(0, limit);

    let imported = 0;
    let skipped = 0;
    let matched = 0;
    const results: { title: string; status: string }[] = [];

    for (const d of recent) {
      const name = cleanTitle(d.title);
      if (!name) { skipped++; continue; }
      const slug = slugify(name);

      // Já existe?
      const { data: existing } = await admin
        .from("games")
        .select("id")
        .eq("slug", slug)
        .maybeSingle();

      if (existing) {
        skipped++;
        results.push({ title: name, status: "já existe" });
        continue;
      }

      // Metadados Steam
      let gameRow: Record<string, unknown> = {
        nome: name,
        preco: 0,
        tamanho: d.fileSize || null,
        categorias: [],
        modos: [],
        idiomas: [],
        destaques: [],
        galeria: [],
      };

      if (withMetadata) {
        const match = await steamSearch(name);
        if (match) {
          const details = await steamDetails(match.appid);
          const appid = match.appid;
          gameRow = {
            ...gameRow,
            nome: details?.name || name,
            imagem: `https://cdn.cloudflare.steamstatic.com/steam/apps/${appid}/library_600x900.jpg`,
            vertical_image: `https://cdn.cloudflare.steamstatic.com/steam/apps/${appid}/library_600x900.jpg`,
            hero_image: `https://cdn.cloudflare.steamstatic.com/steam/apps/${appid}/library_hero.jpg`,
            capsule_image: `https://cdn.cloudflare.steamstatic.com/steam/apps/${appid}/capsule_616x353.jpg`,
          };
          if (details) {
            matched++;
            gameRow.descricao = stripHtml(details.short_description || details.detailed_description || "");
            gameRow.desenvolvedor = (details.developers || []).join(", ") || null;
            gameRow.distribuidor = (details.publishers || []).join(", ") || null;
            gameRow.lancamento = details.release_date?.date || null;
            gameRow.categorias = (details.genres || []).map((g: any) => g.description).slice(0, 6);
            gameRow.galeria = (details.screenshots || []).slice(0, 6).map((s: any) => s.path_full);
            if (details.movies?.length) {
              gameRow.trailer_url = details.movies[0]?.mp4?.max || details.movies[0]?.webm?.max || null;
            }
            const modos: string[] = [];
            const cats = (details.categories || []).map((c: any) => c.description.toLowerCase());
            if (cats.some((c: string) => c.includes("single"))) modos.push("Singleplayer");
            if (cats.some((c: string) => c.includes("multi") || c.includes("co-op") || c.includes("pvp"))) modos.push("Multiplayer");
            gameRow.modos = modos;
          }
        }
      }

      // Inserir jogo
      const { data: inserted, error: insErr } = await admin
        .from("games")
        .insert(gameRow)
        .select("id")
        .single();

      if (insErr || !inserted) {
        skipped++;
        results.push({ title: name, status: `erro: ${insErr?.message || "insert"}` });
        continue;
      }

      // Inserir links de download (torrent/magnet)
      const links = d.uris.slice(0, 5).map((uri, i) => ({
        game_id: inserted.id,
        label: i === 0 ? "Torrent (FitGirl)" : `Espelho ${i + 1}`,
        url: uri,
        status: "online",
      }));
      await admin.from("download_links").insert(links);

      imported++;
      results.push({ title: name, status: "importado" });
    }

    return json({
      ok: true,
      total_na_fonte: downloads.length,
      analisados: recent.length,
      importados: imported,
      ignorados: skipped,
      com_metadados: matched,
      detalhes: results,
    });
  } catch (e) {
    return json({ error: String((e as Error).message || e) }, 500);
  }
});
