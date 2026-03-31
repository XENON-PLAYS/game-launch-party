import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Header } from "@/components/Header";
import { CartPopup } from "@/components/CartPopup";

const Cadastro = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ nome: "", sobrenome: "", email: "", telefone: "", senha: "", confirma: "" });
  const [erros, setErros] = useState<Record<string, string>>({});
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const set = (key: string, val: string) => setForm((p) => ({ ...p, [key]: val }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const err: Record<string, string> = {};

    if (!form.nome) err.nome = "Preencha o nome!";
    if (!form.sobrenome) err.sobrenome = "Preencha o sobrenome!";
    if (!form.email) err.email = "Preencha o email!";
    else if (!/\S+@\S+\.\S+/.test(form.email)) err.email = "Email inválido!";
    if (!form.telefone) err.telefone = "Preencha o telefone!";
    if (!form.senha) err.senha = "Preencha a senha!";
    else if (form.senha.length < 8 || form.senha.length > 60) err.senha = "Senha deve ter entre 8 e 60 caracteres!";
    if (form.senha !== form.confirma) err.confirma = "As senhas não conferem!";

    setErros(err);
    if (Object.keys(err).length > 0) return;

    const success = register(form);
    if (success) {
      navigate("/login");
    } else {
      setErros({ email: "Email já cadastrado!" });
    }
  };

  const fields = [
    { key: "nome", label: "Primeiro Nome:", placeholder: "Digite seu nome", type: "text" },
    { key: "sobrenome", label: "Sobrenome:", placeholder: "Digite seu sobrenome", type: "text" },
    { key: "email", label: "Email:", placeholder: "Digite seu email", type: "email" },
    { key: "telefone", label: "Celular:", placeholder: "(xx) xxxxx-xxxx", type: "tel" },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <CartPopup />

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <form onSubmit={handleSubmit} autoComplete="off" className="w-full max-w-[500px]">
          <fieldset className="auth-fieldset">
            <h1 className="auth-title">Criar Conta</h1>

            <div className="space-y-3">
              {fields.map((f) => (
                <div key={f.key} className="flex flex-col gap-1">
                  <label className="auth-label">{f.label}</label>
                  <input
                    type={f.type}
                    value={(form as any)[f.key]}
                    onChange={(e) => set(f.key, e.target.value)}
                    placeholder={erros[f.key] || f.placeholder}
                    className={`auth-input ${erros[f.key] ? "auth-input-error" : ""}`}
                  />
                </div>
              ))}

              <div className="flex flex-col gap-1">
                <label className="auth-label">Senha:</label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    value={form.senha}
                    onChange={(e) => set("senha", e.target.value)}
                    placeholder={erros.senha || "Digite sua senha"}
                    className={`auth-input pr-10 ${erros.senha ? "auth-input-error" : ""}`}
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="auth-label">Confirme a Senha:</label>
                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    value={form.confirma}
                    onChange={(e) => set("confirma", e.target.value)}
                    placeholder={erros.confirma || "Confirme sua senha"}
                    className={`auth-input pr-10 ${erros.confirma ? "auth-input-error" : ""}`}
                  />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button type="submit" className="auth-btn w-full">Criar Conta</button>
            </div>

            <p className="text-center text-muted-foreground text-sm mt-4 font-['Evogria']">
              Já tem conta? <Link to="/login" className="text-primary font-bold hover:underline">Faça Login</Link>
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

export default Cadastro;
