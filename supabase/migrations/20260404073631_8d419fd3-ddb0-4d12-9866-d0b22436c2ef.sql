-- Remove existing overly broad management policies
DROP POLICY IF EXISTS "Authenticated users can manage games" ON public.games;
DROP POLICY IF EXISTS "Admins manage games" ON public.games;

-- Create individual policies for admin operations
CREATE POLICY "Admins can insert games" 
ON public.games 
FOR INSERT 
TO authenticated 
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update games" 
ON public.games 
FOR UPDATE 
TO authenticated 
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete games" 
ON public.games 
FOR DELETE 
TO authenticated 
USING (public.has_role(auth.uid(), 'admin'));