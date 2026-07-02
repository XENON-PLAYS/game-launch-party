CREATE EXTENSION IF NOT EXISTS pg_trgm WITH SCHEMA extensions;

CREATE INDEX IF NOT EXISTS idx_merged_repacks_title_trgm
  ON public.merged_repacks
  USING gin (title extensions.gin_trgm_ops);