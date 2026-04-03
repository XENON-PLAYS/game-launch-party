-- Add rating columns to games table
ALTER TABLE public.games ADD COLUMN IF NOT EXISTS rating_avg NUMERIC(3, 2) DEFAULT 0;
ALTER TABLE public.games ADD COLUMN IF NOT EXISTS rating_count INTEGER DEFAULT 0;

-- Function to update game rating
CREATE OR REPLACE FUNCTION public.update_game_rating()
RETURNS TRIGGER AS $$
DECLARE
    new_avg NUMERIC(3, 2);
    new_count INTEGER;
BEGIN
    SELECT COALESCE(AVG(rating), 0), COUNT(*)
    INTO new_avg, new_count
    FROM public.game_ratings
    WHERE game_id = COALESCE(NEW.game_id, OLD.game_id);

    UPDATE public.games
    SET rating_avg = new_avg,
        rating_count = new_count
    WHERE id = COALESCE(NEW.game_id, OLD.game_id);

    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Triggers for game_ratings
DROP TRIGGER IF EXISTS tr_update_game_rating ON public.game_ratings;
CREATE TRIGGER tr_update_game_rating
AFTER INSERT OR UPDATE OR DELETE ON public.game_ratings
FOR EACH ROW EXECUTE FUNCTION public.update_game_rating();

-- Function to update comment counts
CREATE OR REPLACE FUNCTION public.update_comment_reaction_counts()
RETURNS TRIGGER AS $$
DECLARE
    target_id UUID;
BEGIN
    target_id := COALESCE(NEW.comment_id, OLD.comment_id);

    UPDATE public.game_comments
    SET 
        likes = (SELECT COUNT(*) FROM public.comment_reactions WHERE comment_id = target_id AND reaction_type = 'like'),
        dislikes = (SELECT COUNT(*) FROM public.comment_reactions WHERE comment_id = target_id AND reaction_type = 'dislike')
    WHERE id = target_id;

    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Triggers for comment_reactions
DROP TRIGGER IF EXISTS tr_update_comment_reaction_counts ON public.comment_reactions;
CREATE TRIGGER tr_update_comment_reaction_counts
AFTER INSERT OR UPDATE OR DELETE ON public.comment_reactions
FOR EACH ROW EXECUTE FUNCTION public.update_comment_reaction_counts();

-- Recalculate all existing ratings and comment counts
DO $$
DECLARE
    g_id UUID;
    c_id UUID;
BEGIN
    FOR g_id IN SELECT id FROM public.games LOOP
        UPDATE public.games
        SET 
            rating_avg = (SELECT COALESCE(AVG(rating), 0) FROM public.game_ratings WHERE game_id = g_id),
            rating_count = (SELECT COUNT(*) FROM public.game_ratings WHERE game_id = g_id)
        WHERE id = g_id;
    END LOOP;

    FOR c_id IN SELECT id FROM public.game_comments LOOP
        UPDATE public.game_comments
        SET 
            likes = (SELECT COUNT(*) FROM public.comment_reactions WHERE comment_id = c_id AND reaction_type = 'like'),
            dislikes = (SELECT COUNT(*) FROM public.comment_reactions WHERE comment_id = c_id AND reaction_type = 'dislike')
        WHERE id = c_id;
    END LOOP;
END;
$$;
