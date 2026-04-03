
import { Header } from "@/components/Header";
import { useAuth } from "@/context/AuthContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check, Shield, CreditCard, ArrowLeft, Sparkles } from "lucide-react";
import { PRICING_CONFIG } from "@/config/pricing";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";


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
      description: "Acesso total por 30 dias.",
      features: ["Downloads imediatos (sem filas)", "Insignia VIP exclusiva", "Experiência sem anúncios", "Suporte prioritário"],
      iconColor: "text-orange-500",
      iconBg: "bg-orange-500/10",
      borderColor: "border-orange-500/20",
      buttonColor: "bg-orange-600 hover:bg-orange-700 shadow-orange-500/10"
    },
    "Semestral": {
      name: "Plano Semestral",
      price: "R$ 25",
      period: "6 meses",
      description: "Economia de 15% inclusa.",
      features: ["Todos os benefícios do Mensal", "Badge VIP Prata de prestígio", "Acesso antecipado a jogos", "Sugestões personalizadas"],
      iconColor: "text-slate-400",
      iconBg: "bg-slate-400/10",
      borderColor: "border-slate-400/20",
      buttonColor: "bg-slate-500 hover:bg-slate-600 shadow-slate-400/30"
    },
    "Anual": {
      name: "Plano Anual",
      price: "R$ 45",
      period: "ano",
      description: "O melhor custo-benefício!",
      features: ["Todos os benefícios do Semestral", "Insignia Ouro Lendária", "Prioridade em pedidos", "Sorteios mensais de keys"],
      iconColor: "text-amber-400",
      iconBg: "bg-amber-400/10",
      borderColor: "border-amber-400/20",
      buttonColor: "bg-amber-500 hover:bg-amber-600 shadow-amber-400/40"
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
    if (!profile || !planName || !user) return;
    setLoading(true);
    
    try {
      // Find the corresponding URL in PRICING_CONFIG
      const planKey = planName.toLowerCase() as keyof typeof PRICING_CONFIG;
      const stripeUrl = PRICING_CONFIG[planKey];
      
      if (!stripeUrl) {
        throw new Error("Plano não configurado.");
      }

      // Add user info to the URL to link the payment to the user
      const checkoutUrl = new URL(stripeUrl);
      checkoutUrl.searchParams.set("prefilled_email", user.email || "");
      // Combine userId and planName into client_reference_id for the webhook to parse
      checkoutUrl.searchParams.set("client_reference_id", `${user.id}__${planName}`);
      
      // Redirect to Stripe checkout
      window.location.href = checkoutUrl.toString();
    } catch (error: any) {
      console.error("Error redirecting to checkout:", error);
      toast.error(error.message || "Erro ao iniciar o pagamento. Tente novamente mais tarde.");
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

            <div className={`p-8 rounded-[2rem] bg-card border ${selectedPlan.borderColor} space-y-8`}>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-black uppercase">{selectedPlan.name}</h3>
                  <p className="text-muted-foreground text-sm font-medium">{selectedPlan.description}</p>
                </div>
                <div className="text-right">
                  <div className={`text-3xl font-black ${selectedPlan.iconColor}`}>{selectedPlan.price}</div>
                  <div className="text-xs font-bold text-muted-foreground uppercase">/{selectedPlan.period}</div>
                </div>
              </div>

              <div className="space-y-4 pt-8 border-t border-border/50">
                {selectedPlan.features.map((feature: string, i: number) => (
                  <div key={i} className="flex items-center gap-3 text-sm font-bold uppercase tracking-tight">
                    <div className={`w-5 h-5 rounded-full ${selectedPlan.iconBg} flex items-center justify-center shrink-0`}>
                      <Check className={`w-3 h-3 ${selectedPlan.iconColor}`} />
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
          <div className={`flex flex-col justify-center space-y-8 p-10 rounded-[2.5rem] bg-gradient-to-br from-card to-card/50 border-2 ${selectedPlan.borderColor} shadow-2xl h-fit`}>
            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-background border border-border">
                <div className={`w-10 h-10 rounded-lg ${selectedPlan.iconBg} flex items-center justify-center`}>
                  <CreditCard className={`w-5 h-5 ${selectedPlan.iconColor}`} />
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
                  <span className={selectedPlan.iconColor}>{selectedPlan.price}</span>
                </div>
              </div>

              <button 
                onClick={handleCheckout}
                disabled={loading}
                className={`w-full py-6 rounded-2xl ${selectedPlan.iconBg.replace('/10', '')} ${selectedPlan.iconColor.replace('text', 'bg').replace('500', '600').replace('400', '500')} hover:opacity-90 text-white font-black uppercase tracking-[0.2em] text-sm transition-all shadow-xl active:scale-[0.98] flex items-center justify-center gap-3 group disabled:opacity-70 disabled:cursor-not-allowed`}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Iniciando...</span>
                  </>
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
