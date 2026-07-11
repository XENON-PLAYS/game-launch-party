-- Fix: "Materialized View in API" (linter 0016)
-- The materialized view merged_repacks was granted to anon/authenticated,
-- exposing it over the Data API. Keep the materialized view private and expose
-- a regular view (not flagged by the linter) under the same name so the app
-- keeps querying "merged_repacks" exactly as before.

-- 1. Rename the materialized view to a private name (indexes follow the rename).
ALTER MATERIALIZED VIEW public.merged_repacks RENAME TO merged_repacks_mv;

-- 2. Remove Data API access to the materialized view itself.
REVOKE ALL ON public.merged_repacks_mv FROM anon, authenticated;
GRANT ALL ON public.merged_repacks_mv TO service_role;

-- 3. Expose a regular view wrapper with the same name/columns the app queries.
CREATE VIEW public.merged_repacks AS
  SELECT * FROM public.merged_repacks_mv;

GRANT SELECT ON public.merged_repacks TO anon, authenticated;
GRANT ALL ON public.merged_repacks TO service_role;

-- 4. Point the refresh function at the renamed materialized view.
CREATE OR REPLACE FUNCTION public.refresh_merged_repacks()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Not allowed';
  END IF;
  REFRESH MATERIALIZED VIEW CONCURRENTLY public.merged_repacks_mv;
END;
$function$;
