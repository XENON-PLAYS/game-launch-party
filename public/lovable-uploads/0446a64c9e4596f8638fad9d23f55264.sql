-- 1. Certificar que o RLS está habilitado
ALTER TABLE public.download_links ENABLE ROW LEVEL SECURITY;

-- 2. Remover a política permissiva antiga (SELECT true)
-- Usamos o nome identificado no diagnóstico: 'Links viewable by everyone'
DROP POLICY IF EXISTS "Links viewable by everyone" ON public.download_links;

-- 3. Criar política de acesso para VIPs e Admins
-- Esta política garante que apenas usuários autenticados com status VIP ativo (ou Admins) possam ver os links.
CREATE POLICY "Download links access control" 
ON public.download_links 
FOR SELECT 
TO authenticated 
USING (
  -- Caso 1: Usuário é Admin (usando a lógica de role existente no projeto)
  has_role(auth.uid(), 'admin'::app_role)
  OR 
  -- Caso 2: Usuário é VIP ativo
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
      AND is_vip = true 
      AND (vip_expires_at IS NULL OR vip_expires_at > now())
  )
);

-- Nota: A política 'Admins manage links' já cobre INSERT/UPDATE/DELETE. 
-- Mas para garantir segurança completa, vamos reforçar que INSERT/UPDATE/DELETE são restritos a admins.
-- Se já existir uma política para isso, ela permanece. Caso contrário, o RLS bloqueia por padrão.
