CREATE OR REPLACE FUNCTION public.increment_link_clicks(link_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE public.download_links
    SET click_count = click_count + 1
    WHERE id = link_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;