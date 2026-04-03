-- Fix 1: Prevent users from self-escalating VIP/badges via direct UPDATE
-- Drop the current permissive UPDATE policy
DROP POLICY IF EXISTS "Users update own profile" ON public.profiles;

-- Create a restrictive UPDATE policy that prevents changes to sensitive fields
-- Users can only update their own profile AND sensitive fields must remain unchanged
CREATE POLICY "Users update own profile safely" ON public.profiles
FOR UPDATE TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (
  auth.uid() = user_id
  AND is_vip = (SELECT p.is_vip FROM public.profiles p WHERE p.user_id = auth.uid())
  AND vip_expires_at IS NOT DISTINCT FROM (SELECT p.vip_expires_at FROM public.profiles p WHERE p.user_id = auth.uid())
  AND badges IS NOT DISTINCT FROM (SELECT p.badges FROM public.profiles p WHERE p.user_id = auth.uid())
);

-- Fix 2: Restrict download_history SELECT - remove public anonymous access
DROP POLICY IF EXISTS "Users view own history" ON public.download_history;

CREATE POLICY "Users view own history" ON public.download_history
FOR SELECT TO authenticated
USING (auth.uid() = user_id);