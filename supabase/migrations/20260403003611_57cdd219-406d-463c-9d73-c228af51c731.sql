-- Create a function to increment game download count
CREATE OR REPLACE FUNCTION public.increment_game_downloads(game_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE public.games
    SET download_count = COALESCE(download_count, 0) + 1
    WHERE id = game_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Grant access to authenticated and anon users
GRANT EXECUTE ON FUNCTION public.increment_game_downloads(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.increment_game_downloads(UUID) TO anon;
