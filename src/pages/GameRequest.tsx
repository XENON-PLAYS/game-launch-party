import { useState } from "react";
import { Header } from "@/components/Header";
import { SEO } from "@/components/SEO";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Gamepad2, Crown, Lock } from "lucide-react";
import { Link } from "react-router-dom";

const GameRequest = () => {
  const { user, profile, isAdmin, isLoading } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    gameName: "",
    dlc: "",
    userNick: profile?.display_name || profile?.username || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || (!profile?.is_vip && !isAdmin)) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("game_requests").insert({
        user_id: user.id,
        game_name: formData.gameName,
        dlc: formData.dlc,
        user_nick: formData.userNick,
        status: "pending",
      });

      if (error) throw error;

      toast({
        title: "Pedido enviado!",
        description: "Seu pedido de jogo foi enviado com sucesso e será analisado pela equipe.",
      });

      setFormData({
        gameName: "",
        dlc: "",
        userNick: profile?.display_name || profile?.username || "",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao enviar pedido",
        description: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  const isVip = profile?.is_vip || isAdmin;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO title="Pedir Jogos - Jogos Grátis" description="Peça seus jogos favoritos e DLCs" />
      <Header />
      
      <main className="container mx-auto px-4 py-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto space-y-8 bg-card p-8 md:p-12 rounded-3xl border border-border backdrop-blur-xl shadow-2xl relative overflow-hidden"
        >
          {/* Background Decoration */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 blur-[100px] rounded-full" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-primary/5 blur-[100px] rounded-full" />

          <div className="text-center space-y-4 relative">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 mb-4">
              <Gamepad2 className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic">
              PEDIR <span className="text-primary">JOGOS</span>
            </h1>
            <div className="w-24 h-1 bg-primary mx-auto rounded-full shadow-[0_0_15px_#ff0000]" />
            <p className="text-muted-foreground mt-4">
              Quer um jogo específico ou uma DLC que ainda não temos? Peça aqui e nossa equipe fará o possível para trazer para você!
            </p>
          </div>

          {!isVip ? (
            <div className="bg-muted/30 border border-border rounded-2xl p-8 text-center space-y-6 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="w-16 h-16 bg-[#fbbf24]/10 border border-[#fbbf24]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-8 h-8 text-[#fbbf24]" />
                </div>
                <h3 className="text-xl font-bold text-foreground uppercase tracking-wider">Acesso Restrito</h3>
                <p className="text-muted-foreground max-w-sm mx-auto mt-2">
                  Esta funcionalidade é exclusiva para membros <span className="text-[#fbbf24] font-bold">VIP</span> do Jogos Grátis.
                </p>
                <div className="pt-6">
                  <Link 
                    to="/vip" 
                    className="inline-flex items-center gap-2 bg-[#fbbf24] hover:bg-[#f59e0b] text-black font-black px-8 py-4 rounded-xl transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(251,191,36,0.3)] uppercase italic"
                  >
                    <Crown className="w-5 h-5 fill-black" />
                    Seja VIP Agora
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 relative">
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground ml-1">Nome do Jogo</label>
                <input
                  required
                  type="text"
                  placeholder="Ex: Elden Ring, GTA V..."
                  className="w-full bg-muted/50 border border-border rounded-xl px-4 py-4 text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  value={formData.gameName}
                  onChange={(e) => setFormData({ ...formData, gameName: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground ml-1">DLC (Opcional)</label>
                <input
                  type="text"
                  placeholder="Ex: Shadow of the Erdtree..."
                  className="w-full bg-muted/50 border border-border rounded-xl px-4 py-4 text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  value={formData.dlc}
                  onChange={(e) => setFormData({ ...formData, dlc: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground ml-1">Seu Nick de Usuário</label>
                <input
                  required
                  type="text"
                  placeholder="Seu nome na comunidade"
                  className="w-full bg-muted/50 border border-border rounded-xl px-4 py-4 text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  value={formData.userNick}
                  onChange={(e) => setFormData({ ...formData, userNick: e.target.value })}
                />
              </div>

              <button
                disabled={isSubmitting}
                type="submit"
                className="w-full bg-primary hover:bg-primary/80 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black py-4 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_20px_rgba(255,0,0,0.3)] uppercase italic flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Gamepad2 className="w-5 h-5" />
                    Enviar Pedido
                  </>
                )}
              </button>
              
              <p className="text-center text-xs text-muted-foreground italic">
                * Os pedidos são processados por ordem de chegada e disponibilidade.
              </p>
            </form>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default GameRequest;