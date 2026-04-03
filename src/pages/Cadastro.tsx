import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Header } from "@/components/Header";
import { toast } from "sonner";
import { motion } from "framer-motion";

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
    navigate(`/login${redirect !== "/" ? `?redirect=${redirect}` : ""}`);
  };

  return (
    <div className="min-h-screen space-background flex flex-col">
      <Header />
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        <div className="ufo"></div>
        <div className="cosmic-element cosmic-1"></div>
        <div className="cosmic-element cosmic-2"></div>
        <div className="cosmic-element cosmic-3"></div>
      </div>

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
                {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Criar Conta"}
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