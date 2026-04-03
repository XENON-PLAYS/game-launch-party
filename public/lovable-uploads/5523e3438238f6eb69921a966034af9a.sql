CREATE OR REPLACE FUNCTION public.get_user_ranking()
RETURNS TABLE (
  username TEXT,
  display_name TEXT,
  avatar_url TEXT,
  is_vip BOOLEAN,
  badges TEXT[],
  download_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.username,
    p.display_name,
    p.avatar_url,
    p.is_vip,
    p.badges,
    COUNT(dh.id) as download_count
  FROM 
    public.profiles p
  LEFT JOIN 
    public.download_history dh ON p.user_id = dh.user_id
  GROUP BY 
    p.id
  ORDER BY 
    download_count DESC
  LIMIT 10;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;