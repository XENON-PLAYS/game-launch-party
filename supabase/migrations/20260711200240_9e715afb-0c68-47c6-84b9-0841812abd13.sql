-- Correct the previous fix so no SECURITY DEFINER view is introduced.
-- Move the materialized view into a private (non-API) schema and expose it via a
-- security_invoker view in public. This removes the materialized view from the
-- Data API (fixes linter 0016) without creating a security definer view (0010).

-- Remove the wrapper view created in the previous migration.
DROP VIEW IF EXISTS public.merged_repacks;

-- Private schema not exposed by the Data API.
CREATE SCHEMA IF NOT EXISTS private;
GRANT USAGE ON SCHEMA private TO anon, authenticated, service_role;

-- Move the materialized view out of the API-exposed public schema.
ALTER MATERIALIZED VIEW public.merged_repacks_mv SET SCHEMA private;
GRANT SELECT ON private.merged_repacks_mv TO anon, authenticated;
GRANT ALL ON private.merged_repacks_mv TO service_role;

-- Public view the app queries, running with the caller's privileges (invoker).
CREATE VIEW public.merged_repacks
WITH (security_invoker = on) AS
  SELECT * FROM private.merged_repacks_mv;

GRANT SELECT ON public.merged_repacks TO anon, authenticated;
GRANT ALL ON public.merged_repacks TO service_role;

-- Point the refresh function at the relocated materialized view.
CREATE OR REPLACE FUNCTION public.refresh_merged_repacks()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'private'
AS $function$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Not allowed';
  END IF;
  REFRESH MATERIALIZED VIEW CONCURRENTLY private.merged_repacks_mv;
END;
$function$;
