import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff, Loader2, Mail, Lock, LogIn, ChevronRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Header } from "@/components/Header";
import { SpaceBackground } from "@/components/SpaceBackground";
import { motion } from "framer-motion";

import { toast } from "sonner";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");
    if (!email || !senha) {
      setErro("Preencha todos os campos!");
      toast.error("Preencha todos os campos!");
      return;
    }
    setLoading(true);
    const { error } = await login(email, senha);
    setLoading(false);
    
    if (error) {
      setErro(error);
      toast.error(error);
      return;
    }
    
    toast.success("Bem-vindo de volta!");
    navigate(redirect);
  };

  return (
    <div className="min-h-screen bg-[#05070A] relative overflow-hidden flex flex-col">
      <SpaceBackground />
      
      <Header />
      
      
      <main className="flex-1 flex items-center justify-center px-4 py-20 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-[460px]"
        >
          <form onSubmit={handleSubmit} autoComplete="off" className="relative group">
            {/* Decorative background glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-purple-600/30 rounded-[32px] blur-2xl opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            
            <div className="auth-fieldset relative overflow-hidden">
              {/* Internal subtle light sweep */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-30" />
              
              <div className="flex flex-col items-center mb-10">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 border border-primary/20 shadow-inner">
                  <LogIn className="w-8 h-8 text-primary" />
                </div>
                <h1 className="auth-title">Acessar Conta</h1>
                <p className="auth-subtitle">
                  Entre no portal e continue sua jornada
                </p>
              </div>
              
              {erro && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-4 rounded-2xl mb-8 text-center"
                >
                  {erro}
                </motion.div>
              )}
              
              <div className="space-y-6">
                <div className="flex flex-col">
                  <label className="auth-label">Seu Email</label>
                  <div className="auth-input-container">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-primary transition-colors" />
                    <input 
                      type="email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      placeholder="exemplo@email.com" 
                      className="auth-input pl-12" 
                      required
                    />
                  </div>
                </div>
                
                <div className="flex flex-col">
                  <div className="flex items-center justify-between mb-2">
                    <label className="auth-label mb-0">Sua Senha</label>
                    <button type="button" className="text-[10px] text-white/30 hover:text-primary uppercase tracking-tighter transition-colors font-bold">Esqueceu a senha?</button>
                  </div>
                  <div className="auth-input-container">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-primary transition-colors" />
                    <input 
                      type={showPass ? "text" : "password"} 
                      value={senha} 
                      onChange={(e) => setSenha(e.target.value)} 
                      placeholder="••••••••" 
                      className="auth-input px-12" 
                      required
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPass(!showPass)} 
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
                    >
                      {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                
                <button type="submit" disabled={loading} className="auth-btn group/btn">
                  <div className="auth-btn-glow" />
                  <div className="relative flex items-center justify-center gap-2">
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Sincronizando...</span>
                      </>
                    ) : (
                      <>
                        <span>Entrar no Sistema</span>
                        <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </>
                    )}
                  </div>
                </button>
              </div>

              <div className="mt-8 pt-8 border-t border-white/5 flex flex-col items-center gap-6">
                <button 
                  type="button"
                  onClick={() => {
                    setEmail("varaver90@gmail.com");
                    setSenha("Teste123@");
                  }}
                  className="px-4 py-2 rounded-lg text-[10px] text-white/20 hover:text-primary hover:bg-primary/5 uppercase tracking-widest font-black transition-all border border-transparent hover:border-primary/10"
                >
                  Acesso Rápido Admin
                </button>

                <p className="text-white/40 text-xs uppercase tracking-widest font-bold">
                  Novo por aqui?{" "}
                  <Link to="/cadastro" className="auth-link ml-1">
                    Crie sua conta
                  </Link>
                </p>
              </div>
            </div>
          </form>
        </motion.div>
      </main>
    </div>
  );
};

export default Login;
