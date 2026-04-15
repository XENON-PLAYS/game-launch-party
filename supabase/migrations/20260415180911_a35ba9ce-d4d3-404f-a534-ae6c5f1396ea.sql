-- Add policy so all authenticated users can view profiles (needed for chat, rankings, etc.)
CREATE POLICY "Authenticated users can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (true);