import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff, Loader2, User, Mail, Lock, UserPlus, ChevronRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Header } from "@/components/Header";
import { SpaceBackground } from "@/components/SpaceBackground";
import { motion } from "framer-motion";

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
    navigate(`/login${redirect !== "/" ? `?redirect=${redirect}` : ""}`);
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
          className="w-full max-w-[500px]"
        >
          <form onSubmit={handleSubmit} autoComplete="off" className="relative group">
            {/* Decorative background glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-purple-600/30 rounded-[32px] blur-2xl opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>

            <div className="auth-fieldset relative overflow-hidden">
              {/* Internal subtle light sweep */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-30" />

              <div className="flex flex-col items-center mb-8">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 border border-primary/20 shadow-inner">
                  <UserPlus className="w-8 h-8 text-primary" />
                </div>
                <h1 className="auth-title">Nova Conta</h1>
                <p className="auth-subtitle">
                  Inicie sua jornada cósmica conosco hoje mesmo
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
                  <label className="auth-label">Nome Completo</label>
                  <div className="auth-input-container">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-primary transition-colors" />
                    <input 
                      type="text" 
                      value={form.nome} 
                      onChange={(e) => set("nome", e.target.value)} 
                      placeholder="Como deseja ser chamado?" 
                      className="auth-input pl-12" 
                      required
                    />
                  </div>
                </div>
                
                <div className="flex flex-col">
                  <label className="auth-label">Seu Email</label>
                  <div className="auth-input-container">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-primary transition-colors" />
                    <input 
                      type="email" 
                      value={form.email} 
                      onChange={(e) => set("email", e.target.value)} 
                      placeholder="exemplo@email.com" 
                      className="auth-input pl-12" 
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex flex-col">
                    <label className="auth-label">Senha</label>
                    <div className="auth-input-container">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-primary transition-colors" />
                      <input 
                        type={showPass ? "text" : "password"} 
                        value={form.senha} 
                        onChange={(e) => set("senha", e.target.value)} 
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
                  
                  <div className="flex flex-col">
                    <label className="auth-label">Confirmar</label>
                    <div className="auth-input-container">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-primary transition-colors" />
                      <input 
                        type="password" 
                        value={form.confirma} 
                        onChange={(e) => set("confirma", e.target.value)} 
                        placeholder="••••••••" 
                        className="auth-input pl-12" 
                        required
                      />
                    </div>
                  </div>
                </div>
                
                <button type="submit" disabled={loading} className="auth-btn group/btn mt-4">
                  <div className="auth-btn-glow" />
                  <div className="relative flex items-center justify-center gap-2">
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Construindo Perfil...</span>
                      </>
                    ) : (
                      <>
                        <span>Finalizar Cadastro</span>
                        <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </>
                    )}
                  </div>
                </button>
              </div>
              
              <div className="mt-10 text-center">
                <p className="text-white/40 text-xs uppercase tracking-widest font-bold">
                  Já faz parte da tripulação?{" "}
                  <Link to="/login" className="auth-link ml-1">
                    Fazer Login
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

export default Cadastro;
