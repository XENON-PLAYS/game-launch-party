-- Update games policies for admins to use 'authenticated' role
DROP POLICY IF EXISTS "Admins can insert games" ON public.games;
CREATE POLICY "Admins can insert games" 
ON public.games 
FOR INSERT 
TO authenticated 
WITH CHECK (has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can update games" ON public.games;
CREATE POLICY "Admins can update games" 
ON public.games 
FOR UPDATE 
TO authenticated 
USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can delete games" ON public.games;
CREATE POLICY "Admins can delete games" 
ON public.games 
FOR DELETE 
TO authenticated 
USING (has_role(auth.uid(), 'admin'));

-- Bug reports admin policies
DROP POLICY IF EXISTS "Admins can view all bug reports" ON public.bug_reports;
CREATE POLICY "Admins can view all bug reports" 
ON public.bug_reports 
FOR SELECT 
TO authenticated 
USING (has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can update bug reports" ON public.bug_reports;
CREATE POLICY "Admins can update bug reports" 
ON public.bug_reports 
FOR UPDATE 
TO authenticated 
USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));

-- Game requests admin policies
DROP POLICY IF EXISTS "Admins can view all game requests" ON public.game_requests;
CREATE POLICY "Admins can view all game requests" 
ON public.game_requests 
FOR SELECT 
TO authenticated 
USING (has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can update game requests" ON public.game_requests;
CREATE POLICY "Admins can update game requests" 
ON public.game_requests 
FOR UPDATE 
TO authenticated 
USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));

-- Profiles: Add admin update policy
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
CREATE POLICY "Admins can update all profiles" 
ON public.profiles 
FOR UPDATE 
TO authenticated 
USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));

-- Game ratings: Add admin delete policy for moderation
DROP POLICY IF EXISTS "Admins can delete any rating" ON public.game_ratings;
CREATE POLICY "Admins can delete any rating" 
ON public.game_ratings 
FOR DELETE 
TO authenticated 
USING (has_role(auth.uid(), 'admin'));

-- Download history: Cleanup duplicate policies
DROP POLICY IF EXISTS "Admin can view all download history" ON public.download_history;
DROP POLICY IF EXISTS "Admins can view all download history" ON public.download_history;
CREATE POLICY "Admins can view all download history" 
ON public.download_history 
FOR SELECT 
TO authenticated 
USING (has_role(auth.uid(), 'admin'));

-- Download links: Ensure admin management is robust
DROP POLICY IF EXISTS "Admins manage links" ON public.download_links;
CREATE POLICY "Admins manage links" 
ON public.download_links 
FOR ALL 
TO authenticated 
USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));
