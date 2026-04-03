-- Recreate online_users_stats with security_invoker = true to address Supabase linter warning
DROP VIEW IF EXISTS public.online_users_stats;

CREATE VIEW public.online_users_stats 
WITH (security_invoker = true)
AS
SELECT 
  count(*) FILTER (WHERE (last_seen_at > (now() - '00:05:00'::interval))) AS online_count,
  count(*) AS total_users
FROM public.profiles;

-- Grant select access to the necessary roles
GRANT SELECT ON public.online_users_stats TO anon, authenticated;