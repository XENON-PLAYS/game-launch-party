
import { Header } from "@/components/Header";
import { useAuth } from "@/context/AuthContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check, Shield, CreditCard, ArrowLeft, Loader2, Sparkles, Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Checkout = () => {
  const { profile, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const planName = searchParams.get("plan");

  const plans = {
    "Mensal": {
      name: "Plano Mensal",
      price: "R$ 5",
      period: "mês",
      description: "Ideal para começar.",
      features: ["Acesso VIP por 30 dias", "Badge VIP Básica", "Downloads Ilimitados"]
    },
    "Semestral": {
      name: "Plano Semestral",
      price: "R$ 25",
      period: "6 meses",
      description: "Economia de 15%.",
      features: ["Acesso VIP por 180 dias", "Badge VIP Prata", "Downloads Ilimitados", "Prioridade no Suporte"]
    },
    "Anual": {
      name: "Plano Anual",
      price: "R$ 45",
      period: "ano",
      description: "Melhor valor!",
      features: ["Acesso VIP por 365 dias", "Badge VIP Ouro", "Downloads Ilimitados", "Suporte 24/7", "Sorteios Exclusivos"]
    }
  };

  const selectedPlan = planName ? (plans as any)[planName] : null;

  useEffect(() => {
    if (searchParams.get("canceled") === "true") {
      toast.error("O pagamento foi cancelado. Você pode tentar novamente quando desejar.");
    }

    if (!profile) {
      toast.error("Por favor, faça login para continuar.");
      navigate("/login?redirect=/checkout" + (planName ? `?plan=${planName}` : ""));
    } else if (!planName || !selectedPlan) {
      navigate("/vip");
    }
  }, [profile, planName, selectedPlan, navigate, searchParams]);

  const handleCheckout = async () => {
    if (!profile || !planName) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { planName, userId: user?.id, email: user?.email },
      });

      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("Não foi possível gerar o link de pagamento.");
      }
    } catch (error: any) {
      console.error('Error:', error);
      toast.error(error.message || "Ocorreu um erro ao iniciar o pagamento.");
    } finally {
      setLoading(false);
    }
  };

  if (!selectedPlan) return null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      <main className="container-responsive py-24 flex flex-col items-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-12"
        >
          {/* Left Side: Summary */}
          <div className="space-y-8">
            <button 
              onClick={() => navigate("/vip")}
              className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-bold uppercase tracking-widest text-xs"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar aos planos
            </button>

            <div className="space-y-4">
              <h1 className="text-4xl font-black uppercase tracking-tight">
                Resumo da <span className="text-primary">Assinatura</span>
              </h1>
              <p className="text-muted-foreground">
                Você está a um passo de se tornar um membro de elite.
              </p>
            </div>

            <div className="p-8 rounded-[2rem] bg-card border border-primary/20 space-y-8">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-black uppercase">{selectedPlan.name}</h3>
                  <p className="text-muted-foreground text-sm font-medium">{selectedPlan.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-black text-primary">{selectedPlan.price}</div>
                  <div className="text-xs font-bold text-muted-foreground uppercase">/{selectedPlan.period}</div>
                </div>
              </div>

              <div className="space-y-4 pt-8 border-t border-border/50">
                {selectedPlan.features.map((feature: string, i: number) => (
                  <div key={i} className="flex items-center gap-3 text-sm font-bold uppercase tracking-tight">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-primary" />
                    </div>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4 p-6 rounded-2xl bg-primary/5 border border-primary/10">
              <Shield className="w-6 h-6 text-primary" />
              <div className="text-xs font-bold uppercase tracking-wider opacity-70">
                Pagamento 100% seguro e criptografado via Stripe.
              </div>
            </div>
          </div>

          {/* Right Side: Payment Info */}
          <div className="flex flex-col justify-center space-y-8 p-10 rounded-[2.5rem] bg-gradient-to-br from-card to-card/50 border-2 border-primary/10 shadow-2xl h-fit">
            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-background border border-border">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest">Meio de Pagamento</p>
                  <p className="text-sm text-muted-foreground font-medium">Cartão de Crédito</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm font-bold uppercase tracking-widest opacity-60">
                  <span>Subtotal</span>
                  <span>{selectedPlan.price}</span>
                </div>
                <div className="flex justify-between items-center text-lg font-black uppercase tracking-tight pt-4 border-t border-border/50">
                  <span>Total</span>
                  <span className="text-primary">{selectedPlan.price}</span>
                </div>
              </div>

              <button 
                onClick={handleCheckout}
                disabled={loading}
                className="w-full py-6 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-[0.2em] text-sm transition-all shadow-xl shadow-primary/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 group"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <span>Finalizar Pagamento</span>
                    <Sparkles className="w-5 h-5 group-hover:animate-pulse" />
                  </>
                )}
              </button>

              <div className="text-center space-y-4">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-relaxed">
                  Ao clicar em finalizar, você será redirecionado para a página segura de pagamento da Stripe.
                </p>
                <div className="flex justify-center gap-4 opacity-50 grayscale scale-90">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" alt="Stripe" className="h-5" />
                  <div className="flex gap-2">
                    <div className="w-8 h-5 bg-muted rounded flex items-center justify-center text-[8px] font-black">PIX</div>
                    <div className="w-8 h-5 bg-muted rounded flex items-center justify-center text-[8px] font-black">VISA</div>
                    <div className="w-8 h-5 bg-muted rounded flex items-center justify-center text-[8px] font-black">MC</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Checkout;
