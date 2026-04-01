import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Header } from "@/components/Header";
import { CartPopup } from "@/components/CartPopup";

const Cadastro = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ nome: "", email: "", senha: "", confirma: "" });
  const [erro, setErro] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (key: string, val: string) => setForm((p) => ({ ...p, [key]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");
    if (!form.nome || !form.email || !form.senha) { setErro("Preencha todos os campos!"); return; }
    if (form.senha.length < 6) { setErro("Senha deve ter no mínimo 6 caracteres!"); return; }
    if (form.senha !== form.confirma) { setErro("As senhas não conferem!"); return; }

    setLoading(true);
    const { error } = await register({ email: form.email, password: form.senha, displayName: form.nome });
    setLoading(false);
    if (error) { setErro(error); return; }
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <CartPopup />
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <form onSubmit={handleSubmit} autoComplete="off" className="w-full max-w-[500px]">
          <fieldset className="auth-fieldset">
            <h1 className="auth-title">Criar Conta</h1>
            {erro && <p className="text-center text-destructive text-sm mb-4 font-['Evogria']">{erro}</p>}
            <div className="space-y-3">
              <div className="flex flex-col gap-1">
                <label className="auth-label">Nome:</label>
                <input type="text" value={form.nome} onChange={(e) => set("nome", e.target.value)} placeholder="Digite seu nome" className="auth-input" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="auth-label">Email:</label>
                <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="Digite seu email" className="auth-input" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="auth-label">Senha:</label>
                <div className="relative">
                  <input type={showPass ? "text" : "password"} value={form.senha} onChange={(e) => set("senha", e.target.value)} placeholder="Digite sua senha" className="auth-input pr-10" />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="auth-label">Confirme a Senha:</label>
                <input type="password" value={form.confirma} onChange={(e) => set("confirma", e.target.value)} placeholder="Confirme sua senha" className="auth-input" />
              </div>
              <button type="submit" disabled={loading} className="auth-btn w-full flex items-center justify-center gap-2">
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                Criar Conta
              </button>
            </div>
            <p className="text-center text-muted-foreground text-sm mt-4 font-['Evogria']">
              Já tem conta? <Link to="/login" className="text-primary font-bold hover:underline">Faça Login</Link>
            </p>
          </fieldset>
        </form>
      </main>
    </div>
  );
};

export default Cadastro;
