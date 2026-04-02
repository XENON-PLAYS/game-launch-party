-- Cria um esquema para extensões se não existir
CREATE SCHEMA IF NOT EXISTS extensions;

-- Move a extensão unaccent para o esquema de extensões
-- ALTER EXTENSION unaccent SET SCHEMA extensions; -- Depende da configuração do Supabase, às vezes já está lá.

-- Define o search_path para as funções
ALTER FUNCTION slugify(text) SET search_path = public, extensions;
ALTER FUNCTION update_game_slug() SET search_path = public, extensions;