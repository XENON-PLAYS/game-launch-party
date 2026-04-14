-- Dropar antes de recriar com novo tipo de retorno
DROP FUNCTION IF EXISTS public.get_admin_users_list();

-- Recriar a função de listagem de usuários para agrupar roles
CREATE OR REPLACE FUNCTION public.get_admin_users_list()
 RETURNS TABLE(id uuid, user_id uuid, username text, display_name text, avatar_url text, is_vip boolean, is_banned boolean, created_at timestamp with time zone, role text, status text, last_seen_at timestamp with time zone)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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
        p.is_banned,
        p.created_at,
        COALESCE(STRING_AGG(ur.role::text, ', '), 'user') as role,
        p.status,
        p.last_seen_at
    FROM 
        public.profiles p
    LEFT JOIN 
        public.user_roles ur ON p.user_id = ur.user_id
    GROUP BY
        p.id, p.user_id, p.username, p.display_name, p.avatar_url, p.is_vip, p.is_banned, p.created_at, p.status, p.last_seen_at
    ORDER BY 
        p.created_at DESC;
END;
$function$;

-- Corrigir a função toggle_admin_role para lidar com a ausência de restrição única em user_id
CREATE OR REPLACE FUNCTION public.toggle_admin_role(target_user_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
    -- Verificar se quem chama é admin
    IF NOT EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE public.user_roles.user_id = auth.uid() 
        AND public.user_roles.role = 'admin'
    ) THEN
        RAISE EXCEPTION 'Não autorizado. Apenas administradores podem acessar esta função.';
    END IF;

    -- Não permitir que o admin remova o seu próprio cargo (segurança mínima)
    IF target_user_id = auth.uid() THEN
        RAISE EXCEPTION 'Você não pode remover seu próprio acesso de administrador.';
    END IF;

    IF EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = target_user_id AND role = 'admin') THEN
        DELETE FROM public.user_roles WHERE user_id = target_user_id AND role = 'admin';
        RETURN 'removed';
    ELSE
        -- Tentar inserir, se já existe o par (user_id, admin) ignora
        INSERT INTO public.user_roles (user_id, role) 
        VALUES (target_user_id, 'admin')
        ON CONFLICT (user_id, role) DO NOTHING;
        RETURN 'added';
    END IF;
END;
$$;
