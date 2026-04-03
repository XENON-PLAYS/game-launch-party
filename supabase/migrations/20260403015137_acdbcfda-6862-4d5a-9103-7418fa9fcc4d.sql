CREATE OR REPLACE FUNCTION public.get_admin_users_list()
RETURNS TABLE (
    id UUID,
    user_id UUID,
    username TEXT,
    display_name TEXT,
    avatar_url TEXT,
    is_vip BOOLEAN,
    created_at TIMESTAMPTZ,
    role public.app_role
) AS $$
BEGIN
    -- Verificar se quem chama é admin
    IF NOT EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE public.user_roles.user_id = auth.uid() 
        AND public.user_roles.role = 'admin'
    ) THEN
        RAISE EXCEPTION 'Não autorizado. Apenas administradores podem acessar esta função.';
    END IF;

    RETURN QUERY
    SELECT 
        p.id,
        p.user_id,
        p.username,
        p.display_name,
        p.avatar_url,
        p.is_vip,
        p.created_at,
        ur.role
    FROM 
        public.profiles p
    LEFT JOIN 
        public.user_roles ur ON p.user_id = ur.user_id
    ORDER BY 
        p.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
