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
  EyeOff
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export function BugReportList() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

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

  const handleUpdateStatus = async (id: string, status: 'resolved' | 'ignored') => {
    try {
      const { error } = await supabase
        .from("bug_reports")
        .update({ status })
        .eq("id", id);

      if (error) throw error;
      
      toast.success(`Reporte ${status === 'resolved' ? 'resolvido' : 'ignorado'} com sucesso!`);
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
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "resolved":
        return <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 gap-1"><CheckCircle2 className="h-3 w-3" /> Resolvido</Badge>;
      case "ignored":
        return <Badge className="bg-muted/20 text-muted-foreground border-border gap-1"><EyeOff className="h-3 w-3" /> Ignorado</Badge>;
      default:
        return <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 gap-1"><Clock className="h-3 w-3" /> Pendente</Badge>;
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
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-card/50 p-6 rounded-3xl border border-border/40 backdrop-blur-xl">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="w-12 h-12 rounded-2xl bg-destructive/10 flex items-center justify-center text-destructive">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-black uppercase tracking-tight">Reportes de Erros</h2>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest opacity-60">
              {filteredReports.length} reportes encontrados
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar jogo ou erro..."
              className="pl-10 h-11 rounded-xl bg-background/50 border-border/40 focus:ring-primary/20"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground hidden md:block" />
            <select
              className="h-11 rounded-xl bg-background/50 border border-border/40 px-3 text-xs font-bold uppercase tracking-widest outline-none focus:ring-2 ring-primary/20"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Todos os Status</option>
              <option value="pending">Pendentes</option>
              <option value="resolved">Resolvidos</option>
              <option value="ignored">Ignorados</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredReports.map((report) => (
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

              {report.status === 'pending' && (
                <div className="flex items-center gap-2 self-end md:self-center">
                  <Button 
                    size="sm"
                    variant="outline"
                    className="h-10 rounded-xl border-emerald-500/20 hover:bg-emerald-500/10 hover:text-emerald-500 font-bold uppercase tracking-widest text-[10px]"
                    onClick={() => handleUpdateStatus(report.id, 'resolved')}
                  >
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Resolvido
                  </Button>
                  <Button 
                    size="sm"
                    variant="outline"
                    className="h-10 rounded-xl border-muted-foreground/20 hover:bg-muted/10 hover:text-muted-foreground font-bold uppercase tracking-widest text-[10px]"
                    onClick={() => handleUpdateStatus(report.id, 'ignored')}
                  >
                    <EyeOff className="h-4 w-4 mr-2" />
                    Ignorar
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}

        {filteredReports.length === 0 && !isLoading && (
          <div className="py-20 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-muted/20 flex items-center justify-center mx-auto text-muted-foreground">
              <Bug className="h-8 w-8" />
            </div>
            <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest opacity-60">Nenhum reporte encontrado</p>
          </div>
        )}
      </div>
    </div>
  );
}
