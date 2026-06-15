import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

interface SourceDownload {
  title: string;
  uris: string[];
  uploadDate: string;
  fileSize: string;
}

function parseDate(raw: string | undefined): string | null {
  if (!raw) return null;
  const d = new Date(raw);
  if (!isNaN(d.getTime())) return d.toISOString();
  return null;
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
    const body = await req.json().catch(() => ({}));
    const source: string = typeof body?.source === "string" && body.source.trim()
      ? body.source.trim().toLowerCase()
      : "fitgirl";
    const replace: boolean = body?.replace === true;

    let items: SourceDownload[] = [];
    if (Array.isArray(body?.items)) items = body.items;
    else if (Array.isArray(body?.downloads)) items = body.downloads;

    const valid = items.filter(
      (d) => d?.title && Array.isArray(d.uris) && d.uris.length > 0,
    );

    if (valid.length === 0) {
      return json({ error: "Nenhum jogo válido encontrado no arquivo." }, 400);
    }

    // De-duplica por título dentro do lote (mantém o primeiro = mais recente)
    const seen = new Set<string>();
    const rows = [];
    for (const d of valid) {
      const key = d.title.trim();
      if (seen.has(key)) continue;
      seen.add(key);
      rows.push({
        source,
        title: key,
        uris: d.uris,
        file_size: d.fileSize || null,
        upload_date: parseDate(d.uploadDate),
      });
    }

    if (replace) {
      await admin.from("source_repacks").delete().eq("source", source);
    }

    // Upsert em lotes
    let saved = 0;
    const chunkSize = 500;
    for (let i = 0; i < rows.length; i += chunkSize) {
      const chunk = rows.slice(i, i + chunkSize);
      const { error } = await admin
        .from("source_repacks")
        .upsert(chunk, { onConflict: "source,title" });
      if (error) throw error;
      saved += chunk.length;
    }

    const { count } = await admin
      .from("source_repacks")
      .select("id", { count: "exact", head: true })
      .eq("source", source);

    return json({ ok: true, salvos: saved, total_na_fonte: source, total: count ?? saved });
  } catch (e) {
    return json({ error: (e as Error).message }, 500);
  }
});
