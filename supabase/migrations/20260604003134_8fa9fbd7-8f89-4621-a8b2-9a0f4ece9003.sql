-- =====================================================================
-- 1. Lock down SECURITY DEFINER functions: remove implicit PUBLIC/anon
--    EXECUTE, re-grant only where the app actually needs it.
-- =====================================================================

-- Trigger-only functions: no direct EXECUTE needed by anyone (triggers run
-- regardless of EXECUTE privilege). Revoke from everyone.
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.increment_game_download_count() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_comment_reaction_counts() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_game_rating() FROM PUBLIC, anon, authenticated;

-- RPC / RLS helper functions: callable only by authenticated users + internal services.
REVOKE EXECUTE ON FUNCTION public.get_admin_users_list() FROM PUBLIC, anon;
GRANT  EXECUTE ON FUNCTION public.get_admin_users_list() TO authenticated, service_role;

REVOKE EXECUTE ON FUNCTION public.get_user_ranking() FROM PUBLIC, anon;
GRANT  EXECUTE ON FUNCTION public.get_user_ranking() TO authenticated, service_role;

REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon;
GRANT  EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated, service_role;

REVOKE EXECUTE ON FUNCTION public.increment_game_downloads(uuid) FROM PUBLIC, anon;
GRANT  EXECUTE ON FUNCTION public.increment_game_downloads(uuid) TO authenticated, service_role;

REVOKE EXECUTE ON FUNCTION public.increment_link_clicks(uuid) FROM PUBLIC, anon;
GRANT  EXECUTE ON FUNCTION public.increment_link_clicks(uuid) TO authenticated, service_role;

REVOKE EXECUTE ON FUNCTION public.insert_user_role(uuid, text) FROM PUBLIC, anon;
GRANT  EXECUTE ON FUNCTION public.insert_user_role(uuid, text) TO authenticated, service_role;

REVOKE EXECUTE ON FUNCTION public.toggle_admin_role(uuid) FROM PUBLIC, anon;
GRANT  EXECUTE ON FUNCTION public.toggle_admin_role(uuid) TO authenticated, service_role;

REVOKE EXECUTE ON FUNCTION public.toggle_ban_status(uuid) FROM PUBLIC, anon;
GRANT  EXECUTE ON FUNCTION public.toggle_ban_status(uuid) TO authenticated, service_role;

REVOKE EXECUTE ON FUNCTION public.toggle_vip_status(uuid) FROM PUBLIC, anon;
GRANT  EXECUTE ON FUNCTION public.toggle_vip_status(uuid) TO authenticated, service_role;

REVOKE EXECUTE ON FUNCTION public.update_online_status() FROM PUBLIC, anon;
GRANT  EXECUTE ON FUNCTION public.update_online_status() TO authenticated, service_role;

REVOKE EXECUTE ON FUNCTION public.update_own_profile(uuid, text, text, text, text, text, text) FROM PUBLIC, anon;
GRANT  EXECUTE ON FUNCTION public.update_own_profile(uuid, text, text, text, text, text, text) TO authenticated, service_role;

-- =====================================================================
-- 2. Storage: drop broad public SELECT (list) policies on public buckets.
--    Public image URLs bypass RLS, so display keeps working; this only
--    removes the ability to enumerate/list every file in the buckets.
-- =====================================================================
DROP POLICY IF EXISTS "Avatar images are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Avatars are public" ON storage.objects;
DROP POLICY IF EXISTS "Game images are public" ON storage.objects;
DROP POLICY IF EXISTS "Game images are publicly accessible" ON storage.objects;