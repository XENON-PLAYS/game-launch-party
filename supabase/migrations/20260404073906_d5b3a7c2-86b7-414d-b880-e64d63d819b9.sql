-- Fix the VIP access check in the Download links access control policy
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