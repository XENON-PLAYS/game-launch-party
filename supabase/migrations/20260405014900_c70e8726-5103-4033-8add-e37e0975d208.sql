-- 1. Profiles: Restrict public exposure
DROP POLICY IF EXISTS "Profiles viewable by everyone" ON public.profiles;

-- Allow authenticated users to see profiles (includes public info)
-- Note: To fully hide sensitive columns from other users, a view would be required.
-- This policy at least prevents unauthenticated users from seeing anything.
CREATE POLICY "Profiles are viewable by authenticated users" 
ON public.profiles 
FOR SELECT 
TO authenticated 
USING (true);

-- Admins can view all profiles (redundant but explicit)
CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
TO authenticated 
USING (public.has_role(auth.uid(), 'admin'));


-- 2. Download History: Allow admins to audit everything
DROP POLICY IF EXISTS "Admins can view all download history" ON public.download_history;
CREATE POLICY "Admins can view all download history" 
ON public.download_history 
FOR SELECT 
TO authenticated 
USING (public.has_role(auth.uid(), 'admin'));


-- 3. User Roles: Restrict reading roles to self or admin
DROP POLICY IF EXISTS "Anyone can read roles" ON public.user_roles;

CREATE POLICY "Users can read own roles" 
ON public.user_roles 
FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can read all roles" 
ON public.user_roles 
FOR SELECT 
TO authenticated 
USING (public.has_role(auth.uid(), 'admin'));


-- 4. User Roles: Ensure INSERT/UPDATE/DELETE is admin-only
-- This is already mostly covered by "Admins can manage roles", but let's be explicit.
DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;
CREATE POLICY "Admins can manage roles" 
ON public.user_roles 
FOR ALL 
TO authenticated 
USING (public.has_role(auth.uid(), 'admin'));
