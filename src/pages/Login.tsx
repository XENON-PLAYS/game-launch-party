import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Header } from "@/components/Header";
import { SpaceBackground } from "@/components/SpaceBackground";
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
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
      <SpaceBackground />
      <Header />
      
      <main className="flex-1 flex items-center justify-center px-4 py-12 relative z-10">
        <div className="w-full max-w-md">
          <form onSubmit={handleSubmit} className="auth-fieldset">
            <h1 className="auth-title">Acessar Conta</h1>
            <p className="auth-subtitle">Entre com seu e-mail e senha</p>
            
            {erro && (
              <div className="bg-destructive/10 border border-destructive text-destructive text-sm p-3 rounded mb-4 text-center">
                {erro}
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label className="auth-label">Email</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="seu@email.com" 
                  className="auth-input" 
                  required
                />
              </div>
              
              <div className="relative">
                <label className="auth-label">Senha</label>
                <input 
                  type={showPass ? "text" : "password"} 
                  value={senha} 
                  onChange={(e) => setSenha(e.target.value)} 
                  placeholder="******" 
                  className="auth-input" 
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
              
              <button type="submit" disabled={loading} className="auth-btn mt-2">
                {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Entrar"}
              </button>
            </div>

            <div className="mt-6 flex flex-col items-center gap-4">
              <button 
                type="button"
                onClick={() => {
                  setEmail("varaver90@gmail.com");
                  setSenha("Teste123@");
                }}
                className="text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                Preencher Admin (Teste)
              </button>

              <p className="text-sm text-muted-foreground">
                Não tem uma conta?{" "}
                <Link to="/cadastro" className="auth-link font-medium">
                  Cadastre-se
                </Link>
              </p>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Login;