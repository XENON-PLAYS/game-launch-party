-- Fix search_path for update_game_rating
ALTER FUNCTION public.update_game_rating() SET search_path = public;

-- Fix search_path for update_comment_reaction_counts
ALTER FUNCTION public.update_comment_reaction_counts() SET search_path = public;
