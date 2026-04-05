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
      color: "from-orange-500/10 to-orange-500/20",
      borderColor: "border-orange-500/20",
      buttonColor: "bg-orange-600 hover:bg-orange-700 shadow-orange-500/10",
      iconColor: "text-orange-500",
      iconBg: "bg-orange-500/20"
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
      color: "from-slate-400/10 to-slate-400/20",
      borderColor: "border-slate-400/50",
      buttonColor: "bg-slate-500 hover:bg-slate-600 shadow-slate-400/30",
      iconColor: "text-slate-400",
      iconBg: "bg-slate-400/20"
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
      color: "from-amber-400/10 to-amber-400/20",
      borderColor: "border-amber-400/60",
      buttonColor: "bg-amber-500 hover:bg-amber-600 shadow-amber-400/40",
      iconColor: "text-amber-500",
      iconBg: "bg-amber-400/20"
    }
  ];

  const handleSubscribe = async (planName: string) => {
    if (!profile) {
      toast.error("Você precisa estar logado para assinar um plano.");
      navigate("/login?redirect=" + encodeURIComponent("/checkout?plan=" + planName));
      return;
    }
    
    navigate(`/checkout?plan=${planName}`);
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-[20%] right-[10%] w-[20%] h-[20%] bg-amber-500/5 rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      <Header />
      
      <main className="container-responsive py-24 space-y-32 relative z-10">
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
            Sua Experiência <span className="text-primary">VIP de Elite</span>
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-responsive-h3 text-muted-foreground font-medium"
          >
            Navegue por um catálogo completo sem anúncios, com downloads imediatos e suporte exclusivo 24/7.
          </motion.p>
        </section>

        {/* Benefits Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: Zap, title: "Fila Zero", desc: "Acesse e baixe seus jogos instantaneamente, sem esperas ou contadores." },
            { icon: Shield, title: "Livre de Ads", desc: "Navegação fluida e focada no que importa, 100% sem anúncios intrusivos." },
            { icon: Star, title: "Insignia VIP", desc: "Destaque seu perfil na comunidade com badges exclusivas de membro." },
            { icon: Sparkles, title: "Suporte 24/7", desc: "Canal direto de suporte técnico para ajuda imediata com seus pedidos." }
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
                  <div className={`absolute top-8 right-8 ${plan.buttonColor} text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest animate-pulse`}>
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
                      <div className={`w-6 h-6 rounded-full ${plan.iconBg} flex items-center justify-center shrink-0`}>
                        <Check className={`w-3 h-3 ${plan.iconColor}`} />
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
            Liberação automática instantânea após confirmação do sistema. Sem taxas escondidas, cancele sua assinatura quando desejar diretamente no painel.
          </p>
          <div className="flex flex-wrap justify-center gap-8 opacity-40 grayscale group-hover:grayscale-0 transition-all">
            {/* Payment icons placeholders */}
            <div className="px-6 py-2 bg-card rounded-lg border border-border font-black">PIX</div>
            <div className="px-6 py-2 bg-card rounded-lg border border-border font-black">VISA</div>
            <div className="px-6 py-2 bg-card rounded-lg border border-border font-black">MASTERCARD</div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/50 bg-card py-20 mt-32">
        <div className="container-responsive text-center text-muted-foreground opacity-40 font-bold uppercase tracking-widest text-xs">
          © 2025 JOGOS PIRATAS — Navegue com a elite dos jogadores.
        </div>
      </footer>
    </div>
  );
};

export default VipPage;