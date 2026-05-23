import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Header } from "@/components/Header";
import { SEO } from "@/components/SEO";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { lovable } from "@/integrations/lovable/index";
import { MeteorBackground } from "@/components/MeteorBackground";
import { getRedirectUrl } from "@/config/auth";
import { getAuthErrorMessage } from "@/lib/auth-errors";

const Cadastro = () => {
  const { register, user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  useEffect(() => {
    if (user && !isLoading) {
      navigate(redirect);
    }
  }, [user, isLoading, navigate, redirect]);
  const [form, setForm] = useState({ nome: "", email: "", senha: "", confirma: "" });
  const [erro, setErro] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const set = (key: string, val: string) => setForm((p) => ({ ...p, [key]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");
    if (!form.nome || !form.email || !form.senha) {
      setErro("Preencha todos os campos!");
      toast.error("Preencha todos os campos!");
      return;
    }
    if (form.senha.length < 6) {
      setErro("Senha deve ter no mínimo 6 caracteres!");
      toast.error("Senha muito curta!");
      return;
    }
    if (form.senha !== form.confirma) {
      setErro("As senhas não conferem!");
      toast.error("As senhas não coincidem!");
      return;
    }

    setLoading(true);
    const { error } = await register({ email: form.email, password: form.senha, displayName: form.nome });
    setLoading(false);
    
    if (error) {
      setErro(error);
      toast.error(error);
      return;
    }
    
    toast.success("Conta criada com sucesso! Redirecionando...");
    // With auto_confirm_email enabled, the user is logged in automatically.
    // The useEffect at the top of the component will handle the redirection.
    // If not logged in immediately, we fall back to manual navigation to login.
    setTimeout(() => {
      if (!user) {
        navigate(`/login${redirect !== "/" ? `?redirect=${redirect}` : ""}`);
      }
    }, 2000);
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setErro("");
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: getRedirectUrl(),
      });

      if (result.error) {
        const errorMsg = getAuthErrorMessage(result.error);
        setErro(errorMsg);
        toast.error(errorMsg);
        setGoogleLoading(false);
        return;
      }

      if (result.redirected) {
        return;
      }

      toast.success("Bem-vindo!");
      navigate(redirect);
    } catch (err) {
      toast.error("Houve um erro técnico ao tentar cadastrar com o Google.");
    }
    setGoogleLoading(false);
  };

  return (
    <div className="min-h-screen space-background flex flex-col">
      <SEO
        title="Cadastro - Crie sua conta grátis"
        description="Crie uma conta gratuita no Jogos Grátis e tenha acesso ao maior catálogo de jogos para PC com downloads rápidos e seguros."
        keywords="cadastro jogos grátis, criar conta, registrar jogos pc"
      />
      <Header />
      <MeteorBackground />


      <motion.main 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex-1 flex items-center justify-center px-4 py-12 relative z-10"
      >
        <div className="w-full max-w-md">
          <form onSubmit={handleSubmit} className="bg-card border border-border p-8 rounded-xl shadow-lg transition-transform duration-300 hover:shadow-primary/5">
            <h1 className="text-2xl font-bold text-center mb-2">Nova Conta</h1>
            <p className="text-muted-foreground text-center mb-6">Crie sua conta para começar</p>
            
            {erro && (
              <div className="bg-destructive/10 border border-destructive text-destructive text-sm p-3 rounded mb-4 text-center">
                {erro}
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nome Completo</label>
                <input 
                  type="text" 
                  value={form.nome} 
                  onChange={(e) => set("nome", e.target.value)} 
                  placeholder="Seu nome" 
                  className="w-full px-3 py-2 bg-background border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" 
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input 
                  type="email" 
                  value={form.email} 
                  onChange={(e) => set("email", e.target.value)} 
                  placeholder="seu@email.com" 
                  className="w-full px-3 py-2 bg-background border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" 
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative">
                  <label className="block text-sm font-medium mb-1">Senha</label>
                  <input 
                    type={showPass ? "text" : "password"} 
                    value={form.senha} 
                    onChange={(e) => set("senha", e.target.value)} 
                    placeholder="******" 
                    className="w-full px-3 py-2 bg-background border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" 
                    required
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPass(!showPass)} 
                    className="absolute right-3 top-[34px] text-muted-foreground hover:text-foreground"
                  >
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Confirmar Senha</label>
                  <input 
                    type="password" 
                    value={form.confirma} 
                    onChange={(e) => set("confirma", e.target.value)} 
                    placeholder="******" 
                    className="w-full px-3 py-2 bg-background border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" 
                    required
                  />
                </div>
              </div>
              
              <button type="submit" disabled={loading} className="w-full py-2 bg-primary text-primary-foreground rounded-md font-semibold hover:opacity-90 transition-all active:scale-[0.98] disabled:opacity-50 mt-2">
                {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "CADASTRO"}
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <span className="relative bg-card px-3 text-xs text-muted-foreground uppercase tracking-wider">ou continue com</span>
              </div>

              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={googleLoading}
                className="w-full flex items-center justify-center gap-3 py-2.5 bg-background border border-input rounded-md font-medium hover:bg-accent transition-all disabled:opacity-50"
              >
                {googleLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                )}
                Cadastrar com Google
              </button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Já tem uma conta?{" "}
                <Link to="/login" className="text-primary hover:underline font-medium transition-colors">
                  Fazer Login
                </Link>
              </p>
            </div>
          </form>
        </div>
      </motion.main>
    </div>
  );
};

export default Cadastro;