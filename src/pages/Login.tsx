import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Header } from "@/components/Header";
import { CartPopup } from "@/components/CartPopup";

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
    if (!email || !senha) { setErro("Preencha todos os campos!"); return; }
    setLoading(true);
    const { error } = await login(email, senha);
    setLoading(false);
    if (error) { setErro(error); return; }
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <CartPopup />
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <form onSubmit={handleSubmit} autoComplete="off" className="w-full max-w-[500px]">
          <fieldset className="auth-fieldset">
            <h1 className="auth-title">Acessar Conta</h1>
            <p className="text-center text-muted-foreground mb-6 text-sm font-['Evogria']">Bem-vindo(a) de volta!</p>
            {erro && <p className="text-center text-destructive text-sm mb-4 font-['Evogria']">{erro}</p>}
            <div className="space-y-4">
              <div className="flex flex-col gap-1">
                <label className="auth-label">Email:</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Digite seu email" className="auth-input" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="auth-label">Senha:</label>
                <div className="relative">
                  <input type={showPass ? "text" : "password"} value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="Digite sua senha" className="auth-input pr-10" />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={loading} className="auth-btn w-full flex items-center justify-center gap-2">
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                Entrar
              </button>
            </div>
            <p className="text-center text-muted-foreground text-sm mt-4 font-['Evogria']">
              Não tem uma conta? <Link to="/cadastro" className="text-primary font-bold hover:underline">Registre-se</Link>
            </p>
          </fieldset>
        </form>
      </main>
    </div>
  );
};

export default Login;
