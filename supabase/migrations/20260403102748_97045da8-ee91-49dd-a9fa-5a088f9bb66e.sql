-- Fix relationships for game_comments
ALTER TABLE public.game_comments DROP CONSTRAINT IF EXISTS game_comments_user_id_fkey;
ALTER TABLE public.game_comments DROP CONSTRAINT IF EXISTS game_comments_game_id_fkey;
ALTER TABLE public.game_comments DROP CONSTRAINT IF EXISTS game_comments_parent_id_fkey;

-- Re-add with explicit links to public schema tables
ALTER TABLE public.game_comments
ADD CONSTRAINT game_comments_game_id_fkey 
FOREIGN KEY (game_id) 
REFERENCES public.games(id) 
ON DELETE CASCADE;

ALTER TABLE public.game_comments
ADD CONSTRAINT game_comments_user_id_fkey 
FOREIGN KEY (user_id) 
REFERENCES public.profiles(user_id) 
ON DELETE CASCADE;

ALTER TABLE public.game_comments
ADD CONSTRAINT game_comments_parent_id_fkey 
FOREIGN KEY (parent_id) 
REFERENCES public.game_comments(id) 
ON DELETE CASCADE;
