-- 1. Criar schema para extensões se não existir
CREATE SCHEMA IF NOT EXISTS extensions;

-- 2. Mover extensões comuns do public para extensions
-- Isso resolve o alerta "Extension in Public"
DO $$ 
DECLARE 
    ext RECORD;
BEGIN
    FOR ext IN (SELECT extname FROM pg_extension WHERE extnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')) LOOP
        EXECUTE 'ALTER EXTENSION ' || quote_ident(ext.extname) || ' SET SCHEMA extensions;';
    END LOOP;
END $$;
