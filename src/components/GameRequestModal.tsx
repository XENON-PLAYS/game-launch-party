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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Gamepad2, Loader2, Send } from "lucide-react";

interface GameRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GameRequestModal({ isOpen, onClose }: GameRequestModalProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [gameName, setGameName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Você precisa estar logado para pedir um jogo.");
      return;
    }

    if (!gameName.trim()) {
      toast.error("Por favor, informe o nome do jogo.");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from("game_requests")
        .insert({
          user_id: user.id,
          game_name: gameName,
          description: description
        });

      if (error) throw error;

      toast.success("Pedido enviado com sucesso! Nossa equipe irá analisar.");
      setGameName("");
      setDescription("");
      onClose();
    } catch (error: any) {
      toast.error("Erro ao enviar pedido: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-card border-border/40 rounded-3xl overflow-hidden p-0">
        <div className="bg-primary/10 p-6 flex items-center gap-4 border-b border-border/40">
          <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
            <Gamepad2 className="h-6 w-6" />
          </div>
          <div>
            <DialogTitle className="text-xl font-black uppercase tracking-tight">Pedir Jogo</DialogTitle>
            <DialogDescription className="text-xs font-bold text-muted-foreground uppercase tracking-widest opacity-60">
              Não encontrou o que procurava? Peça aqui!
            </DialogDescription>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Nome do Jogo</label>
              <Input
                placeholder="Ex: God of War, Minecraft..."
                value={gameName}
                onChange={(e) => setGameName(e.target.value)}
                className="h-12 rounded-xl bg-background border-border/40 focus:ring-primary/20"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Observações (Opcional)</label>
              <Textarea
                placeholder="Ex: Versão específica, DLCs, etc..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[100px] rounded-xl bg-background border-border/40 focus:ring-primary/20 resize-none"
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
              className="w-full sm:w-auto rounded-xl h-12 font-black uppercase tracking-widest text-[10px] bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 group"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  Enviar Pedido
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
