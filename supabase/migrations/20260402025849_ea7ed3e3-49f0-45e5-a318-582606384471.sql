-- Habilita extensão unaccent se necessário
CREATE EXTENSION IF NOT EXISTS unaccent;

-- Função para converter texto em slug amigável
CREATE OR REPLACE FUNCTION slugify(text TEXT)
RETURNS TEXT AS $$
DECLARE
    slug TEXT;
BEGIN
    -- Converte para minúsculas e remove acentuação
    slug := lower(unaccent(text));
    -- Substitui caracteres não alfanuméricos por hífens
    slug := regexp_replace(slug, '[^a-z0-9]+', '-', 'g');
    -- Remove hífens duplicados
    slug := regexp_replace(slug, '-+', '-', 'g');
    -- Remove hífens no início e no final
    slug := trim(both '-' from slug);
    RETURN slug;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Adiciona a coluna slug na tabela de games
ALTER TABLE public.games ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;

-- Atualiza slugs para os jogos existentes
UPDATE public.games SET slug = slugify(nome) WHERE slug IS NULL;

-- Função de trigger para manter o slug atualizado
CREATE OR REPLACE FUNCTION update_game_slug()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.nome IS NOT NULL AND (TG_OP = 'INSERT' OR OLD.nome IS DISTINCT FROM NEW.nome) THEN
        NEW.slug := slugify(NEW.nome);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criação do trigger
DROP TRIGGER IF EXISTS trg_update_game_slug ON public.games;
CREATE TRIGGER trg_update_game_slug
BEFORE INSERT OR UPDATE ON public.games
FOR EACH ROW
EXECUTE FUNCTION update_game_slug();