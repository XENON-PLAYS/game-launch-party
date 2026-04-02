CREATE OR REPLACE VIEW public.game_stats AS
SELECT 
    g.id,
    g.nome,
    g.imagem,
    g.preco,
    g.categorias,
    g.lancamento,
    g.created_at,
    g.download_count,
    COALESCE(AVG(r.rating), 0) as avg_rating,
    COUNT(r.id) as rating_count
FROM 
    public.games g
LEFT JOIN 
    public.game_ratings r ON g.id = r.game_id
GROUP BY 
    g.id;
