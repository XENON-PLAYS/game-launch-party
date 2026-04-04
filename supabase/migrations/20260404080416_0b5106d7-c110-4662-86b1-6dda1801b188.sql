-- 1. Fix Games table policies
-- Drop any broad ALL policy if it exists (names may vary, so we target the logic)
DROP POLICY IF EXISTS "Authenticated users can manage games" ON public.games;
DROP POLICY IF EXISTS "Admins can insert games" ON public.games;
DROP POLICY IF EXISTS "Admins can update games" ON public.games;
DROP POLICY IF EXISTS "Admins can delete games" ON public.games;

-- Create specific policies for admins for INSERT, UPDATE, and DELETE
CREATE POLICY "Admins can insert games" 
ON public.games 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update games" 
ON public.games 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete games" 
ON public.games 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));


-- 2. Fix Download links access control
-- The report states it was checking profiles.id = auth.uid()
-- We fix it to use profiles.user_id = auth.uid()
DROP POLICY IF EXISTS "Download links access control" ON public.download_links;

CREATE POLICY "Download links access control"
ON public.download_links
FOR SELECT
TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role) 
  OR EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.is_vip = true 
    AND (profiles.vip_expires_at IS NULL OR profiles.vip_expires_at > now())
  )
);


-- 3. Fix User Roles visibility
-- Replace blanket read policy with one restricted to the user's own rows
DROP POLICY IF EXISTS "Everyone can read roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users read own roles" ON public.user_roles;

CREATE POLICY "Users read own roles" 
ON public.user_roles 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

-- Keep admin read access
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;
CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));
