import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Header } from "@/components/Header";
import { CartPopup } from "@/components/CartPopup";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [erroEmail, setErroEmail] = useState("");
  const [erroSenha, setErroSenha] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErroEmail("");
    setErroSenha("");

    let hasError = false;
    if (!email) { setErroEmail("Preencha o email!"); hasError = true; }
    else if (!/\S+@\S+\.\S+/.test(email)) { setErroEmail("Email inválido!"); hasError = true; }
    if (!senha) { setErroSenha("Preencha a senha!"); hasError = true; }
    else if (senha.length < 8 || senha.length > 60) { setErroSenha("Senha deve ter entre 8 e 60 caracteres!"); hasError = true; }

    if (hasError) return;

    const success = login(email, senha);
    if (success) {
      navigate("/");
    } else {
      setErroEmail("Email ou senha incorretos!");
      setErroSenha("Email ou senha incorretos!");
    }
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

            <div className="space-y-4">
              <div className="flex flex-col gap-1">
                <label className="auth-label">Email:</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={erroEmail || "Digite seu email"}
                  className={`auth-input ${erroEmail ? "auth-input-error" : ""}`}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="auth-label">Senha:</label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    placeholder={erroSenha || "Digite sua senha"}
                    className={`auth-input pr-10 ${erroSenha ? "auth-input-error" : ""}`}
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button type="submit" className="auth-btn w-full">Entrar</button>
            </div>

            <p className="text-center text-muted-foreground text-sm mt-4 font-['Evogria']">
              Não tem uma conta? <Link to="/cadastro" className="text-primary font-bold hover:underline">Registre-se</Link>
            </p>
          </fieldset>
        </form>
      </main>

      <footer className="border-t border-border bg-card/50 py-6">
        <div className="container mx-auto px-4 flex justify-between text-muted-foreground text-xs">
          <p>© 2025 Richard, Bruno e Isabela. Todos os direitos reservados.</p>
          <p>Desenvolvido por Richard, Bruno e Isabela</p>
        </div>
      </footer>
    </div>
  );
};

export default Login;
