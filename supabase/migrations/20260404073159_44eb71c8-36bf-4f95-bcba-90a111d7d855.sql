
-- 1. Fix games table: Remove overly permissive policy, add admin-only management
DROP POLICY IF EXISTS "Authenticated users can manage games" ON public.games;
CREATE POLICY "Admins manage games" ON public.games
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 2. Fix download_links: Remove overly permissive management policy, fix VIP check
DROP POLICY IF EXISTS "Authenticated users can manage links" ON public.download_links;
CREATE POLICY "Admins manage links" ON public.download_links
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Download links access control" ON public.download_links;
CREATE POLICY "Download links access control" ON public.download_links
  FOR SELECT TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin')
    OR EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.user_id = auth.uid()
        AND profiles.is_vip = true
        AND (profiles.vip_expires_at IS NULL OR profiles.vip_expires_at > now())
    )
  );

-- 3. Fix user_roles: Remove blanket read policy, add own-role-only read
DROP POLICY IF EXISTS "Everyone can read roles" ON public.user_roles;
CREATE POLICY "Users read own roles" ON public.user_roles
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);
