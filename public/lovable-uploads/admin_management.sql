-- Allowing admins to manage VIP status on any profile
DROP POLICY IF EXISTS "Admins can update any profile" ON public.profiles;
CREATE POLICY "Admins can update any profile" 
ON public.profiles 
FOR UPDATE 
TO authenticated 
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Function to toggle VIP status
CREATE OR REPLACE FUNCTION public.toggle_vip_status(target_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    current_status BOOLEAN;
BEGIN
    -- Check if caller is admin
    IF NOT public.has_role(auth.uid(), 'admin') THEN
        RAISE EXCEPTION 'Apenas administradores podem gerenciar VIP.';
    END IF;

    SELECT is_vip INTO current_status FROM public.profiles WHERE user_id = target_user_id;
    
    UPDATE public.profiles 
    SET is_vip = NOT current_status,
        vip_expires_at = CASE WHEN NOT current_status THEN (NOW() + INTERVAL '30 days') ELSE NULL END
    WHERE user_id = target_user_id;
    
    RETURN NOT current_status;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Function to toggle Admin status
CREATE OR REPLACE FUNCTION public.toggle_admin_role(target_user_id UUID)
RETURNS TEXT AS $$
DECLARE
    is_already_admin BOOLEAN;
BEGIN
    -- Check if caller is admin
    IF NOT public.has_role(auth.uid(), 'admin') THEN
        RAISE EXCEPTION 'Apenas administradores podem gerenciar papéis.';
    END IF;

    -- Don't allow toggling self to prevent lockouts
    IF auth.uid() = target_user_id THEN
        RAISE EXCEPTION 'Você não pode alterar seu próprio papel de administrador.';
    END IF;

    SELECT EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = target_user_id AND role = 'admin'
    ) INTO is_already_admin;
    
    IF is_already_admin THEN
        DELETE FROM public.user_roles WHERE user_id = target_user_id AND role = 'admin';
        RETURN 'removed';
    ELSE
        INSERT INTO public.user_roles (user_id, role) 
        VALUES (target_user_id, 'admin')
        ON CONFLICT DO NOTHING;
        RETURN 'added';
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
