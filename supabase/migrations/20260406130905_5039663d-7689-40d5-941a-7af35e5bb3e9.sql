-- Add dlc and user_nick to game_requests
ALTER TABLE public.game_requests 
ADD COLUMN IF NOT EXISTS dlc TEXT,
ADD COLUMN IF NOT EXISTS user_nick TEXT;

-- Drop existing policies to recreate them with the VIP constraint
DROP POLICY IF EXISTS "VIP users can insert game requests" ON public.game_requests;
DROP POLICY IF EXISTS "Users can view their own game requests" ON public.game_requests;
DROP POLICY IF EXISTS "Admins can view all game requests" ON public.game_requests;
DROP POLICY IF EXISTS "Admins can update all game requests" ON public.game_requests;

-- Enable RLS (already enabled but good practice)
ALTER TABLE public.game_requests ENABLE ROW LEVEL SECURITY;

-- Policy: VIP users can insert their own requests
-- Using the profiles table to check is_vip
CREATE POLICY "VIP users can insert game requests" 
ON public.game_requests 
FOR INSERT 
WITH CHECK (
    auth.uid() = user_id AND 
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND is_vip = true
    )
);

-- Policy: Users can view their own requests
CREATE POLICY "Users can view their own game requests" 
ON public.game_requests 
FOR SELECT 
USING (auth.uid() = user_id);

-- Policy: Admins can view all requests
CREATE POLICY "Admins can view all game requests" 
ON public.game_requests 
FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND (status = 'admin' OR status = 'owner')
    )
);

-- Policy: Admins can update all requests
CREATE POLICY "Admins can update all game requests" 
ON public.game_requests 
FOR UPDATE 
USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND (status = 'admin' OR status = 'owner')
    )
);
