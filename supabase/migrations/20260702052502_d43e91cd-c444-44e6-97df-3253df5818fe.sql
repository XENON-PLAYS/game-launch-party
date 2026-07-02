
-- Índice de expressão para acelerar a deduplicação por título base
CREATE INDEX IF NOT EXISTS idx_source_repacks_base_title
  ON public.source_repacks (public.repack_base_title(title));

-- Substitui a view lenta por uma materialized view pré-calculada
DROP VIEW IF EXISTS public.merged_repacks;

CREATE MATERIALIZED VIEW public.merged_repacks AS
SELECT base_key,
    (array_agg(id ORDER BY (upload_date IS NULL), s.upload_date DESC))[1] AS id,
    (array_agg(title ORDER BY (upload_date IS NULL), s.upload_date DESC))[1] AS title,
    (array_agg(file_size ORDER BY (file_size IS NULL), (upload_date IS NULL), s.upload_date DESC))[1] AS file_size,
    max(upload_date) AS upload_date,
    (array_agg(cover_url ORDER BY (cover_url IS NULL), (upload_date IS NULL), s.upload_date DESC))[1] AS cover_url,
    array_agg(DISTINCT uri) AS uris,
    array_agg(DISTINCT source) AS sources,
    (array_agg(banner_url ORDER BY (banner_url IS NULL), (upload_date IS NULL), s.upload_date DESC))[1] AS banner_url,
    (array_agg(description ORDER BY (description IS NULL), (upload_date IS NULL), s.upload_date DESC))[1] AS description,
    (array_agg(trailer_url ORDER BY (trailer_url IS NULL), (upload_date IS NULL), s.upload_date DESC))[1] AS trailer_url,
    ( SELECT sr.screenshots
           FROM source_repacks sr
          WHERE repack_base_title(sr.title) = s.base_key AND sr.screenshots IS NOT NULL
          ORDER BY (sr.upload_date IS NULL), sr.upload_date DESC
         LIMIT 1) AS screenshots,
    (array_agg(steam_appid ORDER BY (steam_appid IS NULL), (upload_date IS NULL), s.upload_date DESC))[1] AS steam_appid
   FROM ( SELECT source_repacks.id,
            source_repacks.title,
            source_repacks.source,
            source_repacks.file_size,
            source_repacks.upload_date,
            source_repacks.cover_url,
            source_repacks.banner_url,
            source_repacks.description,
            source_repacks.trailer_url,
            source_repacks.steam_appid,
            repack_base_title(source_repacks.title) AS base_key,
            unnest(source_repacks.uris) AS uri
           FROM source_repacks) s
  WHERE base_key <> ''::text
  GROUP BY base_key;

-- Índice único (permite refresh concorrente) + índices de leitura
CREATE UNIQUE INDEX idx_merged_repacks_base_key ON public.merged_repacks (base_key);
CREATE INDEX idx_merged_repacks_upload_date ON public.merged_repacks (upload_date DESC NULLS LAST);
CREATE INDEX idx_merged_repacks_id ON public.merged_repacks (id);

-- Acesso público de leitura (catálogo é público)
GRANT SELECT ON public.merged_repacks TO anon, authenticated;
GRANT ALL ON public.merged_repacks TO service_role;

-- Função para atualizar a lista após novas importações
CREATE OR REPLACE FUNCTION public.refresh_merged_repacks()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Not allowed';
  END IF;
  REFRESH MATERIALIZED VIEW CONCURRENTLY public.merged_repacks;
END;
$$;

GRANT EXECUTE ON FUNCTION public.refresh_merged_repacks() TO authenticated;
