-- 1) Remove broad authenticated SELECT on profiles
DROP POLICY IF EXISTS "Authenticated users can view all profiles" ON public.profiles;

-- Ensure own-row read remains
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = user_id);

-- Allow admins to read all profiles directly
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- 2) Public-safe profiles view (only non-sensitive columns)
DROP VIEW IF EXISTS public.public_profiles;
CREATE VIEW public.public_profiles AS
SELECT
  user_id,
  username,
  display_name,
  avatar_url,
  bio,
  is_vip,
  badges,
  status,
  last_seen_at,
  created_at
FROM public.profiles;

GRANT SELECT ON public.public_profiles TO anon, authenticated;

-- 3) Consolidate duplicate UPDATE policies into a single restrictive one
DROP POLICY IF EXISTS "Users update own profile safely" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile safely" ON public.profiles;
CREATE POLICY "Users update own profile safely"
ON public.profiles FOR UPDATE TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (
  auth.uid() = user_id
  AND is_vip = (SELECT p.is_vip FROM public.profiles p WHERE p.user_id = auth.uid())
  AND vip_expires_at IS NOT DISTINCT FROM (SELECT p.vip_expires_at FROM public.profiles p WHERE p.user_id = auth.uid())
  AND badges IS NOT DISTINCT FROM (SELECT p.badges FROM public.profiles p WHERE p.user_id = auth.uid())
  AND is_banned = (SELECT p.is_banned FROM public.profiles p WHERE p.user_id = auth.uid())
);

-- 4) Restrict avatar object listing to the owner (public URL downloads still work via public bucket)
DROP POLICY IF EXISTS "Users can list their own avatar" ON storage.objects;
CREATE POLICY "Users can list their own avatar"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'avatars' AND (auth.uid())::text = (storage.foldername(name))[1]);