
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
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "pix">("stripe");
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
          <div className={`flex flex-col justify-center space-y-8 p-10 rounded-[2.5rem] bg-gradient-to-br from-card to-card/50 border-2 ${selectedPlan.borderColor} shadow-2xl h-fit relative overflow-hidden group/payment`}>
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl -mr-16 -mt-16 pointer-events-none group-hover/payment:bg-primary/10 transition-colors duration-500" />
            
            <div className="space-y-6">
              {/* Payment Selector */}
              <div className="grid grid-cols-2 gap-3 p-1.5 bg-background/50 rounded-2xl border border-border/50">
                <button 
                  onClick={() => setPaymentMethod("stripe")}
                  className={`flex items-center justify-center gap-2 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    paymentMethod === "stripe" 
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-105" 
                    : "text-muted-foreground hover:bg-muted/50"
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  Cartão / Stripe
                </button>
                <button 
                  onClick={() => setPaymentMethod("pix")}
                  className={`flex items-center justify-center gap-2 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    paymentMethod === "pix" 
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 scale-105" 
                    : "text-muted-foreground hover:bg-muted/50"
                  }`}
                >
                  <div className="w-3.5 h-3.5 rounded-full bg-emerald-500/20 flex items-center justify-center text-[8px] font-black text-emerald-500">P</div>
                  PIX Instantâneo
                </button>
              </div>

              {paymentMethod === "stripe" ? (
                <div className="flex items-center gap-4 p-5 rounded-2xl bg-background/30 border border-border/40 backdrop-blur-sm">
                  <div className={`w-12 h-12 rounded-xl ${selectedPlan.iconBg} flex items-center justify-center shadow-inner`}>
                    <CreditCard className={`w-6 h-6 ${selectedPlan.iconColor}`} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Meio de Pagamento</p>
                    <p className="text-sm font-black uppercase tracking-tight">Cartão de Crédito / Débito</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6 p-6 rounded-3xl bg-emerald-500/5 border border-emerald-500/10 backdrop-blur-sm animate-in fade-in zoom-in-95 duration-500">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                      <div className="text-emerald-500 font-black text-lg italic">PIX</div>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500/60">Pagamento via PIX</p>
                      <p className="text-sm font-black uppercase tracking-tight">Liberação Imediata</p>
                    </div>
                  </div>
                  
                  <div className="aspect-square bg-white rounded-2xl p-4 flex items-center justify-center shadow-lg border-4 border-emerald-500/20 group/qr relative">
                    <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover/qr:opacity-100 transition-opacity rounded-xl" />
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=00020101021126580014br.gov.bcb.pix013669146030-01d7-4638-89c0-67c0f16611525204000053039865404${selectedPlan.price.replace("R$ ", "")}.005802BR5915JOGOS%20GRATIS6009SAO%20PAULO62070503***6304`}
                      alt="QR Code PIX" 
                      className="w-full h-full object-contain group-hover/qr:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <div className="space-y-3">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center">Ou copie a chave abaixo:</p>
                    <div className="flex gap-2">
                      <input 
                        readOnly 
                        value="69146030-01d7-4638-89c0-67c0f1661152" 
                        className="flex-1 bg-background border border-border/50 rounded-xl px-4 py-3 text-[10px] font-mono text-center focus:ring-2 focus:ring-emerald-500/20"
                      />
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText("69146030-01d7-4638-89c0-67c0f1661152");
                          toast.success("Chave PIX copiada!");
                        }}
                        className="p-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/20"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-4 pt-4 border-t border-border/40">
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest opacity-60">
                  <span>Subtotal</span>
                  <span>{selectedPlan.price}</span>
                </div>
                <div className="flex justify-between items-center text-xl font-black uppercase tracking-tight pt-4 border-t border-border/20">
                  <span>Total Final</span>
                  <span className={paymentMethod === "pix" ? "text-emerald-500" : selectedPlan.iconColor}>{selectedPlan.price}</span>
                </div>
              </div>

              {paymentMethod === "stripe" ? (
                <button 
                  onClick={handleCheckout}
                  disabled={loading}
                  className={`w-full py-6 rounded-2xl ${selectedPlan.buttonColor} text-white font-black uppercase tracking-[0.2em] text-sm transition-all shadow-xl active:scale-[0.98] flex items-center justify-center gap-3 group disabled:opacity-70 disabled:cursor-not-allowed`}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Processando...</span>
                    </>
                  ) : (
                    <>
                      <span>Pagar com Cartão</span>
                      <Sparkles className="w-5 h-5 group-hover:animate-pulse" />
                    </>
                  )}
                </button>
              ) : (
                <button 
                  onClick={() => {
                    setLoading(true);
                    setTimeout(() => {
                      setLoading(false);
                      toast.success("Aguardando confirmação do PIX...");
                      navigate("/perfil");
                    }, 2000);
                  }}
                  disabled={loading}
                  className="w-full py-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase tracking-[0.2em] text-sm transition-all shadow-xl shadow-emerald-500/20 active:scale-[0.98] flex items-center justify-center gap-3 group disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <span>Confirmar Pagamento</span>
                      <Shield className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    </>
                  )}
                </button>
              )}

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
