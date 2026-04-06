CREATE POLICY "Users can create their own notifications" ON public.notifications
FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);