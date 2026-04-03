-- Create the comment_reactions table
CREATE TABLE IF NOT EXISTS public.comment_reactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    comment_id UUID NOT NULL REFERENCES public.game_comments(id) ON DELETE CASCADE,
    reaction_type TEXT NOT NULL CHECK (reaction_type IN ('like', 'dislike')),
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, comment_id)
);

-- Enable RLS
ALTER TABLE public.comment_reactions ENABLE ROW LEVEL SECURITY;

-- Policies for comment_reactions
CREATE POLICY "Anyone can view reactions" ON public.comment_reactions FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage their own reactions" ON public.comment_reactions 
    FOR ALL USING (auth.uid() = user_id);

-- Function to handle like/dislike counts automatically
CREATE OR REPLACE FUNCTION public.handle_comment_reaction_stats()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        IF (NEW.reaction_type = 'like') THEN
            UPDATE public.game_comments SET likes = likes + 1 WHERE id = NEW.comment_id;
        ELSIF (NEW.reaction_type = 'dislike') THEN
            UPDATE public.game_comments SET dislikes = dislikes + 1 WHERE id = NEW.comment_id;
        END IF;
    ELSIF (TG_OP = 'DELETE') THEN
        IF (OLD.reaction_type = 'like') THEN
            UPDATE public.game_comments SET likes = GREATEST(0, likes - 1) WHERE id = OLD.comment_id;
        ELSIF (OLD.reaction_type = 'dislike') THEN
            UPDATE public.game_comments SET dislikes = GREATEST(0, dislikes - 1) WHERE id = OLD.comment_id;
        END IF;
    ELSIF (TG_OP = 'UPDATE') THEN
        IF (OLD.reaction_type = 'like' AND NEW.reaction_type = 'dislike') THEN
            UPDATE public.game_comments SET likes = GREATEST(0, likes - 1), dislikes = dislikes + 1 WHERE id = NEW.comment_id;
        ELSIF (OLD.reaction_type = 'dislike' AND NEW.reaction_type = 'like') THEN
            UPDATE public.game_comments SET dislikes = GREATEST(0, dislikes - 1), likes = likes + 1 WHERE id = NEW.comment_id;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for stats
CREATE TRIGGER update_comment_stats_on_reaction
AFTER INSERT OR UPDATE OR DELETE ON public.comment_reactions
FOR EACH ROW EXECUTE FUNCTION public.handle_comment_reaction_stats();

-- Function to toggle reaction (to be called from RPC if needed, or just use standard UPSERT)
-- But simple UPSERT might be tricky with the trigger. Let's just use standard SQL from frontend.
