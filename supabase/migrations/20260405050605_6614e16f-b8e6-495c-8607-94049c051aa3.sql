CREATE OR REPLACE FUNCTION public.insert_user_role(p_user_id uuid, p_role text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if the current user has the 'admin' role
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Not allowed';
  END IF;

  -- Insert or update the user role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (p_user_id, p_role)
  ON CONFLICT (user_id, role) DO NOTHING;
END;
$$;

-- Revoke execute from public to be safe, then grant to authenticated users
REVOKE EXECUTE ON FUNCTION public.insert_user_role(uuid, text) FROM public;
GRANT EXECUTE ON FUNCTION public.insert_user_role(uuid, text) TO authenticated;