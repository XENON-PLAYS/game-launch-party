-- Remove old trigger and function
DROP TRIGGER IF EXISTS update_comment_stats_on_reaction ON public.comment_reactions;
DROP FUNCTION IF EXISTS public.handle_comment_reaction_stats();
