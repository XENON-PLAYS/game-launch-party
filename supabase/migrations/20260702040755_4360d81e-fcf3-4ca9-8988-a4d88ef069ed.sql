
CREATE OR REPLACE FUNCTION public.repack_base_title(t text)
RETURNS text
LANGUAGE sql
IMMUTABLE
SET search_path = public
AS $$
  SELECT regexp_replace(
    lower(regexp_replace(t, '(?i)\s*(–|free download|\(|\[).*$', '')),
    '[^a-z0-9]+', '', 'g'
  );
$$;

CREATE OR REPLACE VIEW public.merged_repacks
WITH (security_invoker = true) AS
SELECT
  base_key,
  (array_agg(id ORDER BY (upload_date IS NULL), upload_date DESC))[1] AS id,
  (array_agg(title ORDER BY (upload_date IS NULL), upload_date DESC))[1] AS title,
  (array_agg(file_size ORDER BY (file_size IS NULL), (upload_date IS NULL), upload_date DESC))[1] AS file_size,
  max(upload_date) AS upload_date,
  (array_agg(cover_url ORDER BY (cover_url IS NULL), (upload_date IS NULL), upload_date DESC))[1] AS cover_url,
  array_agg(DISTINCT uri) AS uris,
  array_agg(DISTINCT source) AS sources
FROM (
  SELECT id, title, source, file_size, upload_date, cover_url,
         public.repack_base_title(title) AS base_key,
         unnest(uris) AS uri
  FROM public.source_repacks
) s
WHERE base_key <> ''
GROUP BY base_key;

GRANT SELECT ON public.merged_repacks TO anon, authenticated;
