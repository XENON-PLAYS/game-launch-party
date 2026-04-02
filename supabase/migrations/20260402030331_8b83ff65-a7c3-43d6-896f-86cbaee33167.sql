-- Permite user_id nulo para downloads de visitantes
ALTER TABLE public.download_history ALTER COLUMN user_id DROP NOT NULL;

-- Atualiza políticas de RLS para download_history
DROP POLICY IF EXISTS "Users record downloads" ON public.download_history;
CREATE POLICY "Anyone can record downloads" 
ON public.download_history 
FOR INSERT 
WITH CHECK (true);

-- Garante que usuários ainda podem ver seu próprio histórico (se logados)
DROP POLICY IF EXISTS "Users view own history" ON public.download_history;
CREATE POLICY "Users view own history" 
ON public.download_history 
FOR SELECT 
USING (auth.uid() = user_id OR user_id IS NULL); -- Visitantes podem ver se não tiver user_id? Talvez melhor só auth.uid()
