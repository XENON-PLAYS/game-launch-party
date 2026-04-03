import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Header } from "@/components/Header";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { MeteorBackground } from "@/components/MeteorBackground";

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
    <div className="min-h-screen space-background flex flex-col">
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
            <h1 className="text-2xl font-bold text-center mb-2">Acessar Conta</h1>
            <p className="text-muted-foreground text-center mb-6">Entre com seu e-mail e senha</p>
            
            {erro && (
              <div className="bg-destructive/10 border border-destructive text-destructive text-sm p-3 rounded mb-4 text-center">
                {erro}
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="seu@email.com" 
                  className="w-full px-3 py-2 bg-background border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" 
                  required
                />
              </div>
              
              <div className="relative">
                <label className="block text-sm font-medium mb-1">Senha</label>
                <input 
                  type={showPass ? "text" : "password"} 
                  value={senha} 
                  onChange={(e) => setSenha(e.target.value)} 
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
              
              <button type="submit" disabled={loading} className="w-full py-2 bg-primary text-primary-foreground rounded-md font-semibold hover:opacity-90 transition-all active:scale-[0.98] disabled:opacity-50 mt-2">
                {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Entrar"}
              </button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Não tem uma conta?{" "}
                <Link to="/cadastro" className="text-primary hover:underline font-medium transition-colors">
                  Cadastre-se
                </Link>
              </p>
            </div>
          </form>
        </div>
      </motion.main>
    </div>
  );
};

export default Login;