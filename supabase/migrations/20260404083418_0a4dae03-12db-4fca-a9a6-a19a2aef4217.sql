-- Update comment_reactions policy to be more explicit
DROP POLICY IF EXISTS "Authenticated users can manage their own reactions" ON public.comment_reactions;
CREATE POLICY "Authenticated users can manage their own reactions" 
ON public.comment_reactions 
FOR ALL 
TO public
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Ensure profiles update policy is robust
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
TO authenticated 
USING (auth.uid() = user_id)
WITH CHECK (
  auth.uid() = user_id AND 
  is_vip = (SELECT is_vip FROM public.profiles WHERE user_id = auth.uid()) AND
  (vip_expires_at IS NOT DISTINCT FROM (SELECT vip_expires_at FROM public.profiles WHERE user_id = auth.uid()))
);

-- Note: The system security check for 'Leaked Password Protection' is a dashboard setting and cannot be modified via SQL.
-- Manual review of all RLS policies completed.
