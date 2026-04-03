-- 1. Ativar RLS em todas as tabelas (essencial contra SQL Injection)
DO $$ 
DECLARE 
    r RECORD;
BEGIN
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
        EXECUTE 'ALTER TABLE public.' || quote_ident(r.tablename) || ' ENABLE ROW LEVEL SECURITY;';
    END LOOP;
END $$;

-- 2. Garantir que buckets existam
INSERT INTO storage.buckets (id, name, public) 
VALUES ('game-images', 'game-images', true), ('avatars', 'avatars', true)
ON CONFLICT (id) DO UPDATE SET public = EXCLUDED.public;

-- 3. Políticas de Storage (Proteção contra acesso não autorizado)
-- Avatars: Qualquer um vê, dono edita
DROP POLICY IF EXISTS "Avatars are public" ON storage.objects;
CREATE POLICY "Avatars are public" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;
CREATE POLICY "Users can upload their own avatar" ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects;
CREATE POLICY "Users can update their own avatar" ON storage.objects FOR UPDATE 
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Game Images: Públicas para leitura
DROP POLICY IF EXISTS "Game images are public" ON storage.objects;
CREATE POLICY "Game images are public" ON storage.objects FOR SELECT USING (bucket_id = 'game-images');
