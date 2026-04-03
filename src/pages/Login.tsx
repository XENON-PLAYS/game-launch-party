import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Header } from "@/components/Header";

import { toast } from "sonner";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
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
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full" />
      
      <Header />
      
      
      <main className="flex-1 flex items-center justify-center px-4 py-12 relative z-10">
        <form onSubmit={handleSubmit} autoComplete="off" className="w-full max-w-[480px]">
          <div className="auth-fieldset">
            <div className="flex flex-col items-center mb-10">
              <h1 className="auth-title">Acessar Conta</h1>
              <div className="h-1 w-20 bg-primary/50 rounded-full mt-2" />
              <p className="text-muted-foreground mt-4 text-xs font-semibold uppercase tracking-widest opacity-60">
                Entre com suas credenciais
              </p>
            </div>
            
            {erro && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-4 rounded-xl mb-6 text-center animate-in fade-in slide-in-from-top-2 duration-300">
                {erro}
              </div>
            )}
            
            <div className="space-y-6">
              <div className="flex flex-col">
                <label className="auth-label">Seu Email</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="exemplo@email.com" 
                  className="auth-input" 
                  required
                />
              </div>
              
              <div className="flex flex-col">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="auth-label mb-0">Sua Senha</label>
                  <button type="button" className="text-[10px] text-muted-foreground hover:text-primary uppercase tracking-tighter transition-colors">Esqueceu?</button>
                </div>
                <div className="relative">
                  <input 
                    type={showPass ? "text" : "password"} 
                    value={senha} 
                    onChange={(e) => setSenha(e.target.value)} 
                    placeholder="••••••••" 
                    className="auth-input pr-12" 
                    required
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPass(!showPass)} 
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-foreground transition-colors"
                  >
                    {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              
              <button type="submit" disabled={loading} className="auth-btn w-full flex items-center justify-center gap-3">
                <div className="auth-btn-glow" />
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Processando...</span>
                  </>
                ) : (
                  <span>Entrar Agora</span>
                )}
              </button>
            </div>
            <div className="mt-8 pt-6 border-t border-muted/20 flex flex-col gap-4">
              <button 
                type="button"
                onClick={() => {
                  setEmail("varaver90@gmail.com");
                  setSenha("Teste123@");
                }}
                className="text-[10px] text-muted-foreground/60 hover:text-primary uppercase tracking-widest font-bold transition-all text-center"
              >
                Preencher com Acesso Admin
              </button>
            </div>

            <div className="mt-10 text-center">
              <p className="text-muted-foreground text-xs uppercase tracking-widest font-bold">
                Ainda não é membro?{" "}
                <Link to="/cadastro" className="text-primary hover:text-primary/80 transition-all underline decoration-primary/30 underline-offset-4 decoration-2">
                  Criar Conta Grátis
                </Link>
              </p>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};

export default Login;
