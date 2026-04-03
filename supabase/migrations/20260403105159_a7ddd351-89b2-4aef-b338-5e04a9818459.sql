-- Add last_seen_at to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_seen_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Function to update last_seen_at
CREATE OR REPLACE FUNCTION public.update_online_status()
RETURNS VOID AS $$
BEGIN
  UPDATE public.profiles
  SET last_seen_at = now(),
      status = 'online'
  WHERE user_id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- View to see online users (active in the last 5 minutes)
CREATE OR REPLACE VIEW public.online_users_stats AS
SELECT 
  count(*) filter (where last_seen_at > now() - interval '5 minutes') as online_count,
  count(*) as total_users
FROM public.profiles;

-- Grant access to the function
GRANT EXECUTE ON FUNCTION public.update_online_status() TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_online_status() TO anon;
