-- Consolidate user_roles policies
DROP POLICY IF EXISTS "Users can read own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users read own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can read all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;

CREATE POLICY "Users can read own roles" 
ON public.user_roles 
FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles" 
ON public.user_roles 
FOR SELECT 
TO authenticated 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage all roles" 
ON public.user_roles 
FOR ALL 
TO authenticated 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Remove hardcoded admin assignment trigger
DROP TRIGGER IF EXISTS on_auth_user_created_assign_admin ON auth.users;
DROP FUNCTION IF EXISTS public.auto_assign_admin_role();

-- Ensure download_history policies are clean
DROP POLICY IF EXISTS "Authenticated users record own downloads" ON public.download_history;
DROP POLICY IF EXISTS "Anonymous record downloads" ON public.download_history;

CREATE POLICY "Authenticated users record own downloads" 
ON public.download_history 
FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anonymous record downloads" 
ON public.download_history 
FOR INSERT 
TO anon 
WITH CHECK (user_id IS NULL);
