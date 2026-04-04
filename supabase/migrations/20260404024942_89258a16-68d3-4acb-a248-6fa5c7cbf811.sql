-- Update the function to assign 'admin' role to all users
CREATE OR REPLACE FUNCTION public.auto_assign_admin_role()
RETURNS TRIGGER AS $$
BEGIN
  -- Assign 'admin' role to every new user
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Ensure all existing users have the 'admin' role
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role
FROM auth.users
ON CONFLICT (user_id, role) DO NOTHING;

-- Relax RLS for 'games' table to allow all authenticated users
DROP POLICY IF EXISTS "Admins manage games" ON public.games;
CREATE POLICY "Authenticated users can manage games" 
ON public.games 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Relax RLS for 'download_links' table to allow all authenticated users
DROP POLICY IF EXISTS "Admins manage links" ON public.download_links;
CREATE POLICY "Authenticated users can manage links" 
ON public.download_links 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Ensure user_roles can be viewed by everyone (useful for AuthContext)
DROP POLICY IF EXISTS "Users read own roles" ON public.user_roles;
CREATE POLICY "Everyone can read roles" 
ON public.user_roles 
FOR SELECT 
TO authenticated 
USING (true);
