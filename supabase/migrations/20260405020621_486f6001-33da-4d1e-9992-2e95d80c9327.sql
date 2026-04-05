-- Remove the overly permissive public policy
DROP POLICY IF EXISTS "Ratings viewable by everyone" ON public.game_ratings;

-- Allow users to only see their own ratings
-- Aggregate rating data is already stored in the games table (rating_avg, rating_count)
-- so this change doesn't break the public game view.
CREATE POLICY "Users can view their own ratings" 
ON public.game_ratings 
FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);