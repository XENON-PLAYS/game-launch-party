-- Adicionar coluna is_banned se não existir
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'is_banned') THEN
        ALTER TABLE public.profiles ADD COLUMN is_banned BOOLEAN DEFAULT false;
    END IF;
END $$;

-- Função para alternar status VIP
CREATE OR REPLACE FUNCTION public.toggle_vip_status(target_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    current_status BOOLEAN;
BEGIN
    -- Verificar se quem chama é admin
    IF NOT EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE public.user_roles.user_id = auth.uid() 
        AND public.user_roles.role = 'admin'
    ) THEN
        RAISE EXCEPTION 'Não autorizado. Apenas administradores podem acessar esta função.';
    END IF;

    SELECT is_vip INTO current_status FROM public.profiles WHERE user_id = target_user_id;
    
    IF current_status THEN
        UPDATE public.profiles 
        SET is_vip = false, vip_expires_at = NULL 
        WHERE user_id = target_user_id;
        RETURN false;
    ELSE
        UPDATE public.profiles 
        SET is_vip = true, vip_expires_at = now() + interval '30 days' 
        WHERE user_id = target_user_id;
        RETURN true;
    END IF;
END;
$$;

-- Função para alternar cargo de administrador
CREATE OR REPLACE FUNCTION public.toggle_admin_role(target_user_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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
        -- Se já tem outro cargo (ex: moderator), atualiza ou insere novo
        INSERT INTO public.user_roles (user_id, role) 
        VALUES (target_user_id, 'admin')
        ON CONFLICT (user_id) DO UPDATE SET role = 'admin';
        RETURN 'added';
    END IF;
END;
$$;

-- Função para alternar banimento
CREATE OR REPLACE FUNCTION public.toggle_ban_status(target_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    current_banned BOOLEAN;
BEGIN
    -- Verificar se quem chama é admin
    IF NOT EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE public.user_roles.user_id = auth.uid() 
        AND public.user_roles.role = 'admin'
    ) THEN
        RAISE EXCEPTION 'Não autorizado. Apenas administradores podem acessar esta função.';
    END IF;

    -- Não permitir banir a si mesmo
    IF target_user_id = auth.uid() THEN
        RAISE EXCEPTION 'Você não pode banir a si mesmo.';
    END IF;

    SELECT is_banned INTO current_banned FROM public.profiles WHERE user_id = target_user_id;
    
    UPDATE public.profiles SET is_banned = NOT current_banned WHERE user_id = target_user_id;
    RETURN NOT current_banned;
END;
$$;

-- Garantir que admins possam atualizar todos os perfis (incluindo is_banned)
CREATE POLICY "Admins can update all profile fields" 
ON public.profiles 
FOR UPDATE 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));
