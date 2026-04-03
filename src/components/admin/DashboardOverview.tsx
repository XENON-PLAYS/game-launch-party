import { 
  BarChart3, 
  Users, 
  Download, 
  Gamepad2, 
  TrendingUp, 
  Clock, 
  Star,
  Shield,
  Zap,
  Flame,
  MousePointer2
} from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tables } from "@/integrations/supabase/types";

type Game = Tables<"games">;

interface DashboardOverviewProps {
  games: Game[];
  userCount: number;
  averageRating: number;
}

const StatCard = ({ icon: Icon, label, value, trend, color }: { icon: any, label: string, value: string | number, trend?: string, color: string }) => (
  <Card className="overflow-hidden border-border/40 bg-card/50 backdrop-blur-xl group hover:border-primary/40 transition-all duration-500 shadow-lg shadow-black/5">
    <CardContent className="p-6">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-2">
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">{label}</p>
          <p className="text-3xl font-black tracking-tighter">{value}</p>
          {trend && (
            <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-500">
              <TrendingUp className="h-3 w-3" />
              <span>{trend} este mês</span>
            </div>
          )}
        </div>
        <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center text-white shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6`}>
          <Icon className="h-7 w-7" />
        </div>
      </div>
    </CardContent>
  </Card>
);

export function DashboardOverview({ games, userCount, averageRating }: DashboardOverviewProps) {
  const totalDownloads = games.reduce((acc, game) => acc + (game.download_count || 0), 0);
  const displayRating = averageRating > 0 ? averageRating.toFixed(1) : "0.0";
  
  const topGames = [...games]
    .sort((a, b) => (b.download_count || 0) - (a.download_count || 0))
    .slice(0, 5);

  const recentGames = [...games]
    .sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h2 className="text-4xl font-black tracking-tighter uppercase"><span className="text-primary">Visão</span> Geral</h2>
          <div className="flex items-center gap-3">
            <span className="w-12 h-1 bg-primary rounded-full shadow-lg shadow-primary/20" />
            <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Painel de Controle Central</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="rounded-xl font-bold uppercase tracking-widest text-xs border-primary/20 hover:bg-primary/10">
            Exportar Relatório
          </Button>
          <Button className="rounded-xl font-bold uppercase tracking-widest text-xs shadow-lg shadow-primary/20">
            Atualizar Dados
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={Gamepad2} 
          label="Total de Jogos" 
          value={games.length} 
          trend="+3" 
          color="bg-primary" 
        />
        <StatCard 
          icon={Download} 
          label="Downloads Totais" 
          value={totalDownloads.toLocaleString()} 
          trend="+1.2k" 
          color="bg-blue-500" 
        />
        <StatCard 
          icon={Users} 
          label="Usuários Ativos" 
          value={userCount.toLocaleString()} 
          trend="+28%" 
          color="bg-purple-500" 
        />
        <StatCard 
          icon={Star} 
          label="Avaliação Média" 
          value={averageRating} 
          trend="+0.2" 
          color="bg-yellow-500" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border-border/40 bg-card/50 backdrop-blur-xl shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-6">
            <div className="space-y-1">
              <CardTitle className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
                <Flame className="h-5 w-5 text-orange-500" />
                Performance do Catálogo
              </CardTitle>
              <CardDescription className="text-xs font-bold uppercase tracking-widest opacity-60">Jogos com maior engajamento</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="text-xs font-bold uppercase text-primary">Ver Tudo</Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {topGames.map((game, index) => (
                <div key={game.id} className="flex items-center gap-4 group">
                  <span className="text-2xl font-black text-muted-foreground/20 italic group-hover:text-primary/40 transition-colors">0{index + 1}</span>
                  <div className="w-14 h-14 rounded-xl overflow-hidden shadow-lg border border-border/50">
                    <img src={game.imagem || ""} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-black text-sm uppercase truncate tracking-tight">{game.nome}</h4>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{game.categorias?.[0] || "Ação"}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-sm">{game.download_count?.toLocaleString()}</p>
                    <p className="text-[10px] font-bold text-emerald-500 uppercase">Downloads</p>
                  </div>
                  <div className="w-24 h-2 bg-secondary rounded-full overflow-hidden hidden sm:block">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(game.download_count || 0) / (topGames[0].download_count || 1) * 100}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="h-full bg-primary"
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/40 bg-card/50 backdrop-blur-xl shadow-xl">
          <CardHeader className="pb-6">
            <div className="space-y-1">
              <CardTitle className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Atividade Recente
              </CardTitle>
              <CardDescription className="text-xs font-bold uppercase tracking-widest opacity-60">Últimas adições ao sistema</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-border/50">
              {recentGames.map((game) => (
                <div key={game.id} className="relative pl-8 flex items-start gap-4 group">
                  <div className="absolute left-0 top-1.5 w-[24px] h-[24px] rounded-full border-4 border-background bg-primary z-10 shadow-lg shadow-primary/20 group-hover:scale-125 transition-transform" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1">
                      {new Date(game.created_at || 0).toLocaleDateString()}
                    </p>
                    <h4 className="font-black text-xs uppercase tracking-tight leading-tight mb-1 group-hover:text-primary transition-colors">{game.nome}</h4>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Jogo adicionado ao catálogo</p>
                  </div>
                </div>
              ))}
            </div>
            <Button className="w-full mt-8 rounded-xl font-bold uppercase tracking-[0.2em] text-[10px] h-12 bg-secondary hover:bg-secondary/80 text-foreground border border-border/50">
              Ver Log de Auditoria
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
