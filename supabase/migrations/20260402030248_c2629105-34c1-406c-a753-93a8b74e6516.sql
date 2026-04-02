-- Adiciona a coluna download_count à tabela games
ALTER TABLE public.games ADD COLUMN IF NOT EXISTS download_count INT NOT NULL DEFAULT 0;

-- Função para atualizar o contador de downloads
CREATE OR REPLACE FUNCTION public.increment_game_download_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.games
  SET download_count = download_count + 1
  WHERE id = NEW.game_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger para incrementar o contador ao inserir no histórico de downloads
DROP TRIGGER IF EXISTS on_download_history_insert ON public.download_history;
CREATE TRIGGER on_download_history_insert
  AFTER INSERT ON public.download_history
  FOR EACH ROW EXECUTE FUNCTION public.increment_game_download_count();

-- Sincroniza os contadores existentes
UPDATE public.games g
SET download_count = (
  SELECT COUNT(*)
  FROM public.download_history dh
  WHERE dh.game_id = g.id
);
