import { Header } from "@/components/Header";
import { Check, Shield, Zap, Star, Trophy, CreditCard, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

const VipPage = () => {
  const { profile, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("canceled") === "true") {
      toast.error("O pagamento foi cancelado. Se tiver alguma dúvida, entre em contato com o suporte.");
      // Remove the query param
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const plans = [
    {
      name: "Mensal",
      price: "R$ 5",
      period: "/mês",
      description: "Acesso completo a todas as funcionalidades VIP por 30 dias.",
      features: [
        "Downloads imediatos (sem filas)",
        "Insignia VIP exclusiva no perfil",
        "Experiência 100% livre de anúncios",
        "Suporte técnico priorizado"
      ],
      color: "from-primary/10 to-primary/20",
      borderColor: "border-primary/20",
      buttonColor: "bg-primary/80 hover:bg-primary shadow-primary/10"
    },
    {
      name: "Semestral",
      price: "R$ 25",
      period: "/6 meses",
      description: "Economize 15% e garanta sua tranquilidade por meio ano.",
      features: [
        "Todos os benefícios do Mensal",
        "Badge VIP Prata de prestígio",
        "Acesso antecipado a lançamentos",
        "Sugestões de jogos personalizadas"
      ],
      popular: true,
      color: "from-primary/20 to-primary/30",
      borderColor: "border-primary/50",
      buttonColor: "bg-primary hover:bg-primary/90 shadow-primary/30"
    },
    {
      name: "Anual",
      price: "R$ 45",
      period: "/ano",
      description: "Melhor Custo-Benefício: Economia de 25% para membros de elite.",
      features: [
        "Todos os benefícios do Semestral",
        "Insignia Ouro Lendário exclusiva",
        "Prioridade em pedidos de jogos",
        "Sorteios mensais de chaves Steam"
      ],
      color: "from-primary/30 to-primary/40",
      borderColor: "border-primary/60",
      buttonColor: "bg-primary hover:bg-primary/90 shadow-primary/40"
    }
  ];

  const handleSubscribe = async (planName: string) => {
    if (!profile) {
      toast.error("Você precisa estar logado para assinar um plano.");
      navigate("/login?redirect=/checkout?plan=" + planName);
      return;
    }
    
    navigate(`/checkout?plan=${planName}`);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      <main className="container-responsive py-24 space-y-32">
        {/* Hero Section */}
        <section className="text-center space-y-12 max-w-4xl mx-auto">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex p-6 rounded-full bg-primary/10 border border-primary/20 mb-8"
          >
            <Trophy className="w-16 h-16 text-primary drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
          </motion.div>
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-responsive-h1 leading-none uppercase font-black"
          >
            Torne-se um <span className="text-primary">Capitão VIP</span>
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-responsive-h3 text-muted-foreground font-medium"
          >
            Navegue por águas tranquilas sem anúncios, downloads instantâneos e suporte exclusivo.
          </motion.p>
        </section>

        {/* Benefits Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: Zap, title: "Sem Espera", desc: "Acesse seus jogos instantaneamente, sem contadores." },
            { icon: Shield, title: "Sem Anúncios", desc: "Uma experiência limpa e focada no que importa: o jogo." },
            { icon: Star, title: "Badge Exclusiva", desc: "Destaque-se na comunidade com badges VIP." },
            { icon: Sparkles, title: "Suporte 24/7", desc: "Prioridade absoluta em pedidos e ajuda técnica." }
          ].map((benefit, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 rounded-3xl bg-card border border-border/50 space-y-6 hover:border-primary/30 transition-colors group"
            >
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <benefit.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black uppercase tracking-tight">{benefit.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{benefit.desc}</p>
            </motion.div>
          ))}
        </section>

        {/* Pricing Table */}
        <section className="space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-responsive-h2 uppercase font-black">Escolha seu Plano</h2>
            <div className="w-24 h-1.5 bg-primary rounded-full mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative p-10 rounded-[2.5rem] border-2 bg-gradient-to-br ${plan.color} ${plan.borderColor} flex flex-col space-y-10 group hover:scale-[1.02] transition-all duration-500 overflow-hidden shadow-2xl`}
              >
                {plan.popular && (
                  <div className="absolute top-8 right-8 bg-primary text-primary-foreground text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest animate-pulse">
                    MAIS POPULAR
                  </div>
                )}
                
                <div className="space-y-4">
                  <h3 className="text-2xl font-black uppercase tracking-tight">{plan.name}</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black">{plan.price}</span>
                    <span className="text-muted-foreground font-bold">{plan.period}</span>
                  </div>
                  <p className="text-muted-foreground text-sm font-medium">{plan.description}</p>
                </div>

                <div className="space-y-6 flex-1">
                  {plan.features.map((feature, j) => (
                    <div key={j} className="flex items-center gap-4 text-sm font-bold uppercase tracking-tight">
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 text-primary" />
                      </div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={() => handleSubscribe(plan.name)}
                  className={`w-full py-5 rounded-2xl ${plan.buttonColor} text-white font-black uppercase tracking-[0.2em] text-xs transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3`}
                >
                  <CreditCard className="w-4 h-4" />
                  Assinar Agora
                </button>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Footer Info */}
        <section className="bg-primary/5 border border-primary/10 rounded-[3rem] p-12 md:p-20 text-center space-y-10">
          <h2 className="text-responsive-h3 uppercase font-black">Pagamento Seguro via Pix ou Cartão</h2>
          <p className="text-responsive-body max-w-2xl mx-auto opacity-70">
            Liberação automática após confirmação. Sem fidelidade, cancele quando quiser diretamente no seu perfil.
          </p>
          <div className="flex flex-wrap justify-center gap-8 opacity-40 grayscale group-hover:grayscale-0 transition-all">
            {/* Payment icons placeholders */}
            <div className="px-6 py-2 bg-card rounded-lg border border-border font-black">PIX</div>
            <div className="px-6 py-2 bg-card rounded-lg border border-border font-black">VISA</div>
            <div className="px-6 py-2 bg-card rounded-lg border border-border font-black">MASTER</div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/50 bg-card py-20 mt-32">
        <div className="container-responsive text-center text-muted-foreground opacity-40 font-bold uppercase tracking-widest text-xs">
          © 2025 JOGOS GRATIS — Navegue com a elite.
        </div>
      </footer>
    </div>
  );
};

export default VipPage;