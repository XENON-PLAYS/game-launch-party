CREATE TABLE public.source_repacks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source text NOT NULL DEFAULT 'fitgirl',
  title text NOT NULL,
  uris text[] NOT NULL DEFAULT '{}',
  file_size text,
  upload_date timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (source, title)
);

GRANT SELECT ON public.source_repacks TO anon;
GRANT SELECT ON public.source_repacks TO authenticated;
GRANT ALL ON public.source_repacks TO service_role;

ALTER TABLE public.source_repacks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Repacks são públicos para leitura"
ON public.source_repacks
FOR SELECT
USING (true);

CREATE INDEX idx_source_repacks_upload_date ON public.source_repacks (upload_date DESC NULLS LAST);
CREATE INDEX idx_source_repacks_title_lower ON public.source_repacks (lower(title));

CREATE TRIGGER update_source_repacks_updated_at
BEFORE UPDATE ON public.source_repacks
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();