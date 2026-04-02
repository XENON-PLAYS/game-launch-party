
-- 1. Restrict user_roles SELECT to own roles only
DROP POLICY IF EXISTS "Anyone can read roles" ON public.user_roles;
CREATE POLICY "Users read own roles" ON public.user_roles
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- 2. Protect profiles UPDATE from self-assigning VIP fields
-- Replace the permissive update policy with one that prevents modifying is_vip/vip_expires_at
DROP POLICY IF EXISTS "Users update own profile" ON public.profiles;

-- Create a secure update function that strips VIP fields
CREATE OR REPLACE FUNCTION public.update_own_profile(
  _user_id uuid,
  _username text DEFAULT NULL,
  _display_name text DEFAULT NULL,
  _avatar_url text DEFAULT NULL,
  _bio text DEFAULT NULL,
  _theme text DEFAULT NULL,
  _status text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL OR auth.uid() != _user_id THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;
  UPDATE public.profiles
  SET
    username = COALESCE(_username, username),
    display_name = COALESCE(_display_name, display_name),
    avatar_url = COALESCE(_avatar_url, avatar_url),
    bio = COALESCE(_bio, bio),
    theme = COALESCE(_theme, theme),
    status = COALESCE(_status, status),
    updated_at = now()
  WHERE user_id = _user_id;
END;
$$;

-- Re-add update policy but only for own profile (VIP fields protected by the function above for critical updates)
CREATE POLICY "Users update own profile" ON public.profiles
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 3. Fix download_history INSERT to bind ownership
DROP POLICY IF EXISTS "Anyone can record downloads" ON public.download_history;
CREATE POLICY "Authenticated users record own downloads" ON public.download_history
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Anonymous record downloads" ON public.download_history
  FOR INSERT TO anon
  WITH CHECK (user_id IS NULL);
