-- ============================================================
-- game_requests: restrict INSERT to VIP or admin only
-- ============================================================
DROP POLICY IF EXISTS "Users can create game requests" ON public.game_requests;
DROP POLICY IF EXISTS "VIP users can insert game requests" ON public.game_requests;

CREATE POLICY "VIP or admin can insert game requests"
ON public.game_requests
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id AND (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid() AND is_vip = true
    )
    OR public.has_role(auth.uid(), 'admin')
  )
);

-- ============================================================
-- game_requests: remove status-based admin policies (privilege escalation)
-- and rely on has_role() / user_roles instead
-- ============================================================
DROP POLICY IF EXISTS "Admins can view all game requests" ON public.game_requests;
DROP POLICY IF EXISTS "Admins can update all game requests" ON public.game_requests;

CREATE POLICY "Admins can view all game requests via role"
ON public.game_requests
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- ============================================================
-- notifications: remove user-facing INSERT (prevent forged notifications)
-- service_role bypasses RLS, so trusted server processes still work
-- ============================================================
DROP POLICY IF EXISTS "Users can create their own notifications" ON public.notifications;

-- ============================================================
-- game-images storage bucket: explicit admin-only write policies
-- ============================================================
CREATE POLICY "Admins can upload game images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'game-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update game images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'game-images' AND public.has_role(auth.uid(), 'admin'))
WITH CHECK (bucket_id = 'game-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete game images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'game-images' AND public.has_role(auth.uid(), 'admin'));