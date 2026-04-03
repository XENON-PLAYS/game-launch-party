import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Search,
  Bug,
  Calendar,
  User,
  Gamepad2,
  Filter,
  EyeOff,
  Loader2,
  MoreVertical,
  Check,
  AlertCircle,
  Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { format, subDays, isAfter, startOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type BugReportStatus = 'new' | 'analyzing' | 'resolved' | 'discarded';

export function BugReportList() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");

  const { data: reports = [], isLoading } = useQuery({
    queryKey: ["admin-bug-reports"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bug_reports")
        .select(`
          *,
          profiles:user_id (display_name),
          games:game_id (nome)
        `)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const handleUpdateStatus = async (id: string, status: BugReportStatus) => {
    try {
      const { error } = await supabase
        .from("bug_reports")
        .update({ status })
        .eq("id", id);

      if (error) throw error;
      
      const statusLabels: Record<BugReportStatus, string> = {
        new: 'Novo',
        analyzing: 'Em Análise',
        resolved: 'Resolvido',
        discarded: 'Descartado'
      };
      
      toast.success(`Reporte atualizado para ${statusLabels[status]} com sucesso!`);
      queryClient.invalidateQueries({ queryKey: ["admin-bug-reports"] });
    } catch (error: any) {
      toast.error("Erro ao atualizar status: " + error.message);
    }
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = (report.games as any)?.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (report.profiles as any)?.display_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || report.status === statusFilter;
    const matchesType = typeFilter === "all" || report.report_type === typeFilter;
    
    let matchesDate = true;
    if (dateFilter !== "all") {
      const requestDate = new Date(report.created_at);
      const today = startOfDay(new Date());
      
      if (dateFilter === "today") {
        matchesDate = isAfter(requestDate, today);
      } else if (dateFilter === "7days") {
        matchesDate = isAfter(requestDate, subDays(today, 7));
      } else if (dateFilter === "30days") {
        matchesDate = isAfter(requestDate, subDays(today, 30));
      }
    }
    
    return matchesSearch && matchesStatus && matchesType && matchesDate;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "resolved":
        return <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 gap-1"><CheckCircle2 className="h-3 w-3" /> Resolvido</Badge>;
      case "analyzing":
        return <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 gap-1"><Clock className="h-3 w-3" /> Em Análise</Badge>;
      case "discarded":
        return <Badge className="bg-muted-foreground/10 text-muted-foreground border-muted-foreground/20 gap-1"><Trash2 className="h-3 w-3" /> Descartado</Badge>;
      default:
        return <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20 gap-1"><Clock className="h-3 w-3" /> Novo</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "link_broken":
        return <Badge variant="outline" className="text-destructive border-destructive/20 bg-destructive/5 uppercase text-[10px] tracking-widest">Link Quebrado</Badge>;
      case "game_not_working":
        return <Badge variant="outline" className="text-orange-500 border-orange-500/20 bg-orange-500/5 uppercase text-[10px] tracking-widest">Jogo não abre</Badge>;
      default:
        return <Badge variant="outline" className="uppercase text-[10px] tracking-widest">Outro</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-card/50 p-6 rounded-3xl border border-border/40 backdrop-blur-xl shadow-sm">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="w-12 h-12 rounded-2xl bg-destructive/10 flex items-center justify-center text-destructive">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-black uppercase tracking-tight">Reportes de Usuários</h2>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest opacity-60">
              {filteredReports.length} reportes encontrados
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar jogo, usuário ou erro..."
              className="pl-10 h-11 rounded-xl bg-background/50 border-border/40 focus:ring-primary/20"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2 flex-1 md:flex-none">
            <select
              className="h-11 flex-1 md:w-32 rounded-xl bg-background/50 border border-border/40 px-3 text-xs font-bold uppercase tracking-widest outline-none focus:ring-2 ring-primary/20"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Status: Todos</option>
              <option value="new">Novo</option>
              <option value="analyzing">Em Análise</option>
              <option value="resolved">Resolvido</option>
              <option value="discarded">Descartado</option>
            </select>
          </div>

          <div className="flex items-center gap-2 flex-1 md:flex-none">
            <select
              className="h-11 flex-1 md:w-32 rounded-xl bg-background/50 border border-border/40 px-3 text-xs font-bold uppercase tracking-widest outline-none focus:ring-2 ring-primary/20"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="all">Tipo: Todos</option>
              <option value="link_broken">Link Quebrado</option>
              <option value="game_not_working">Não abre</option>
              <option value="other">Outro</option>
            </select>
          </div>

          <div className="flex items-center gap-2 flex-1 md:flex-none">
            <select
              className="h-11 flex-1 md:w-32 rounded-xl bg-background/50 border border-border/40 px-3 text-xs font-bold uppercase tracking-widest outline-none focus:ring-2 ring-primary/20"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            >
              <option value="all">Data: Todas</option>
              <option value="today">Hoje</option>
              <option value="7days">7 dias</option>
              <option value="30days">30 dias</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {isLoading ? (
          <div className="h-64 flex flex-col items-center justify-center space-y-4">
            <Loader2 className="h-10 w-10 text-destructive animate-spin" />
            <p className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Sincronizando reportes...</p>
          </div>
        ) : filteredReports.map((report) => (
          <div 
            key={report.id}
            className="group bg-card/40 border border-border/40 rounded-2xl p-6 hover:bg-card/60 transition-all duration-300 hover:shadow-2xl hover:shadow-destructive/5"
          >
            <div className="flex flex-col md:flex-row justify-between gap-6">
              <div className="space-y-4 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-lg font-black uppercase tracking-tight">{(report.games as any)?.nome || 'Jogo Desconhecido'}</h3>
                  {getTypeBadge(report.report_type)}
                  {getStatusBadge(report.status)}
                </div>
                
                <p className="text-sm text-muted-foreground leading-relaxed bg-background/30 p-4 rounded-xl border border-border/20">
                  {report.description}
                </p>

                <div className="flex flex-wrap gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
                  <div className="flex items-center gap-2">
                    <User className="h-3 w-3" />
                    <span>{(report.profiles as any)?.display_name || 'Usuário'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3 w-3" />
                    <span>{format(new Date(report.created_at), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end md:self-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-10 px-4 rounded-xl border-border/40 hover:bg-muted/50 font-bold uppercase tracking-widest text-[10px]">
                      Ações
                      <MoreVertical className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 p-2 rounded-xl border-border/40 bg-card/90 backdrop-blur-xl">
                    <DropdownMenuItem 
                      onClick={() => handleUpdateStatus(report.id, 'new')}
                      className="rounded-lg text-[10px] font-bold uppercase tracking-widest focus:bg-blue-500/10 focus:text-blue-500"
                    >
                      <Clock className="mr-2 h-4 w-4 text-blue-500" />
                      Marcar como Novo
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleUpdateStatus(report.id, 'analyzing')}
                      className="rounded-lg text-[10px] font-bold uppercase tracking-widest focus:bg-amber-500/10 focus:text-amber-500"
                    >
                      <Clock className="mr-2 h-4 w-4 text-amber-500" />
                      Em Análise
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleUpdateStatus(report.id, 'resolved')}
                      className="rounded-lg text-[10px] font-bold uppercase tracking-widest focus:bg-emerald-500/10 focus:text-emerald-500"
                    >
                      <CheckCircle2 className="mr-2 h-4 w-4 text-emerald-500" />
                      Resolvido
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleUpdateStatus(report.id, 'discarded')}
                      className="rounded-lg text-[10px] font-bold uppercase tracking-widest focus:bg-destructive/10 focus:text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4 text-destructive" />
                      Descartar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        ))}

        {filteredReports.length === 0 && !isLoading && (
          <div className="py-20 text-center space-y-4 bg-card/20 rounded-3xl border border-dashed border-border/60">
            <div className="w-16 h-16 rounded-full bg-muted/20 flex items-center justify-center mx-auto text-muted-foreground">
              <AlertCircle className="h-8 w-8" />
            </div>
            <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest opacity-60">Nenhum reporte encontrado com os filtros atuais</p>
          </div>
        )}
      </div>
    </div>
  );
}
