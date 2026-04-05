-- Add a policy to allow admins to see all ratings
CREATE POLICY "Admins can view all ratings" 
ON public.game_ratings 
FOR SELECT 
TO authenticated 
USING (public.has_role(auth.uid(), 'admin'));