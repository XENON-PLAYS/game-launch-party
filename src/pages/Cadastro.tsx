import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Header } from "@/components/Header";

import { toast } from "sonner";

const Cadastro = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";
  const [form, setForm] = useState({ nome: "", email: "", senha: "", confirma: "" });
  const [erro, setErro] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

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
    
    toast.success("Conta criada com sucesso! Você já pode entrar.");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full" />
      
      <Header />
      
      
      <main className="flex-1 flex items-center justify-center px-4 py-12 relative z-10">
        <form onSubmit={handleSubmit} autoComplete="off" className="w-full max-w-[480px]">
          <div className="auth-fieldset">
            <div className="flex flex-col items-center mb-8">
              <h1 className="auth-title">Crie Sua Conta</h1>
              <div className="h-1 w-20 bg-primary/50 rounded-full mt-2" />
              <p className="text-muted-foreground mt-4 text-xs font-semibold uppercase tracking-widest opacity-60">
                Junte-se à nossa comunidade
              </p>
            </div>
            
            {erro && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-4 rounded-xl mb-6 text-center animate-in fade-in slide-in-from-top-2 duration-300">
                {erro}
              </div>
            )}
            
            <div className="space-y-4">
              <div className="flex flex-col">
                <label className="auth-label">Nome Completo</label>
                <input 
                  type="text" 
                  value={form.nome} 
                  onChange={(e) => set("nome", e.target.value)} 
                  placeholder="Seu nome" 
                  className="auth-input" 
                  required
                />
              </div>
              
              <div className="flex flex-col">
                <label className="auth-label">Seu Email</label>
                <input 
                  type="email" 
                  value={form.email} 
                  onChange={(e) => set("email", e.target.value)} 
                  placeholder="exemplo@email.com" 
                  className="auth-input" 
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="auth-label">Senha</label>
                  <div className="relative">
                    <input 
                      type={showPass ? "text" : "password"} 
                      value={form.senha} 
                      onChange={(e) => set("senha", e.target.value)} 
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
                
                <div className="flex flex-col">
                  <label className="auth-label">Confirmar</label>
                  <input 
                    type="password" 
                    value={form.confirma} 
                    onChange={(e) => set("confirma", e.target.value)} 
                    placeholder="••••••••" 
                    className="auth-input" 
                    required
                  />
                </div>
              </div>
              
              <button type="submit" disabled={loading} className="auth-btn w-full flex items-center justify-center gap-3 mt-4">
                <div className="auth-btn-glow" />
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Criando Conta...</span>
                  </>
                ) : (
                  <span>Criar Conta Agora</span>
                )}
              </button>
            </div>
            
            <div className="mt-10 text-center">
              <p className="text-muted-foreground text-xs uppercase tracking-widest font-bold">
                Já faz parte?{" "}
                <Link to="/login" className="text-primary hover:text-primary/80 transition-all underline decoration-primary/30 underline-offset-4 decoration-2">
                  Fazer Login
                </Link>
              </p>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};

export default Cadastro;
