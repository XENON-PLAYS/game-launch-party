-- Create indexes for games sorting
CREATE INDEX IF NOT EXISTS idx_games_nome ON public.games(nome);
CREATE INDEX IF NOT EXISTS idx_games_lancamento ON public.games(lancamento DESC);

-- Create GIN index for categories array filtering
CREATE INDEX IF NOT EXISTS idx_games_categorias ON public.games USING GIN(categorias);

-- Create index for user_id in notifications
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);

-- Create index for user_id in user_roles
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);