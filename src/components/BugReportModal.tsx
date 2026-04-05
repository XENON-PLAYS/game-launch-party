import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Bug, Loader2, Send, AlertTriangle } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BugReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  gameId?: string | null;
  gameName?: string;
}

export function BugReportModal({ isOpen, onClose, gameId, gameName = "Geral" }: BugReportModalProps) {

  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [reportType, setReportType] = useState<string>("link_broken");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Você precisa estar logado para reportar um erro.");
      return;
    }

    if (!description.trim()) {
      toast.error("Por favor, descreva o problema.");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from("bug_reports")
        .insert({
          user_id: user.id,
          game_id: gameId,
          report_type: reportType,
          description: description,
          status: 'new'
        });

      if (error) throw error;

      toast.success("Reporte enviado com sucesso! Nossa equipe irá verificar.");
      setDescription("");
      onClose();
    } catch (error: any) {
      toast.error("Erro ao enviar reporte: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-card border-border/40 rounded-3xl overflow-hidden p-0">
        <div className="bg-destructive/10 p-6 flex items-center gap-4 border-b border-border/40">
          <div className="w-12 h-12 rounded-2xl bg-destructive flex items-center justify-center text-destructive-foreground shadow-lg shadow-destructive/20">
            <Bug className="h-6 w-6" />
          </div>
          <div>
            <DialogTitle className="text-xl font-black uppercase tracking-tight">Reportar Erro</DialogTitle>
            <DialogDescription className="text-xs font-bold text-muted-foreground uppercase tracking-widest opacity-60">
              Algo está errado com {gameName}?
            </DialogDescription>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Tipo de Problema</label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger className="h-12 rounded-xl bg-background border-border/40 focus:ring-primary/20">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="link_broken">Link Quebrado / Offline</SelectItem>
                  <SelectItem value="game_not_working">Jogo não funciona / Erro no arquivo</SelectItem>
                  <SelectItem value="other">Outro problema</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Descreva o Problema</label>
              <Textarea
                placeholder="Conte-nos o que aconteceu em detalhes..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[120px] rounded-xl bg-background border-border/40 focus:ring-primary/20 resize-none"
                required
              />
            </div>
          </div>

          <DialogFooter className="pt-4 flex flex-col sm:flex-row gap-3">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="w-full sm:w-auto rounded-xl h-12 font-black uppercase tracking-widest text-[10px]"
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="w-full sm:w-auto rounded-xl h-12 font-black uppercase tracking-widest text-[10px] bg-destructive hover:bg-destructive/90 shadow-xl shadow-destructive/20 group"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  Enviar Reporte
                  <Send className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
