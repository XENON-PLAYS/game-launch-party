-- Fix game_requests policies to use user_id instead of id for profiles check
DROP POLICY IF EXISTS "VIP users can insert game requests" ON public.game_requests;
DROP POLICY IF EXISTS "Admins can view all game requests" ON public.game_requests;
DROP POLICY IF EXISTS "Admins can update all game requests" ON public.game_requests;

CREATE POLICY "VIP users can insert game requests" 
ON public.game_requests 
FOR INSERT 
WITH CHECK (
    auth.uid() = user_id AND 
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE user_id = auth.uid() AND is_vip = true
    )
);

CREATE POLICY "Admins can view all game requests" 
ON public.game_requests 
FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE user_id = auth.uid() AND (status = 'admin' OR status = 'owner')
    )
);

CREATE POLICY "Admins can update all game requests" 
ON public.game_requests 
FOR UPDATE 
USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE user_id = auth.uid() AND (status = 'admin' OR status = 'owner')
    )
);

-- Also fix any other potentially broken policies in other tables if they exist
-- Let's check favorites, download_history etc. (though most use auth.uid() = user_id directly)
-- But if any use a subquery to profiles, they might have the same error.

-- Fix for potentially broken VIP checks in other places (if any were added in later migrations)
-- We'll look at the search results and fix them one by one.

-- The search result showed supabase/migrations/20260403115626_45206741-b10e-4a5c-8994-476bd3355e96.sql
-- Let's see what table that was for. It was likely a similar check.
-- Since I don't know the exact table name from the snippet, I'll stick to fixing what I know.
