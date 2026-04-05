import { Link, useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown, LogOut, LogIn, UserPlus, Shield, Moon, User, Trophy, PlusCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useState, useEffect, useRef } from "react";
import { OnlineUsers } from "./OnlineUsers";
import { GameRequestModal } from "./GameRequestModal";
import { optimizeImageUrl } from "@/lib/utils";

export function Header() {
  const { user, profile, logout, isAdmin } = useAuth();
  const { toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  return (
    <header className="sticky top-0 z-[100] bg-[#111111] border-b border-white/5 py-3 md:py-4 shadow-2xl transition-all">
      <div className="container-responsive flex items-center justify-between gap-4 md:gap-8">
        {/* Logo à esquerda (JOGOS GRÁTIS com caveira de pirata) */}
        <Link to="/" className="flex items-center gap-2 group shrink-0">
          <div className="text-2xl md:text-3xl filter drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] group-hover:scale-110 transition-transform duration-300">💀</div>
          <div className="flex flex-col leading-none">
            <span className="font-black text-white text-base md:text-2xl tracking-tighter uppercase italic">JOGOS</span>
            <span className="font-black text-green-500 text-base md:text-2xl tracking-tighter uppercase italic -mt-1">GRÁTIS</span>
          </div>
        </Link>

        {/* No meio (desktop): links CATÁLOGO | Pedir Jogo | VIP (com ícone de troféu) */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-10 font-bold text-[11px] lg:text-[13px] uppercase tracking-[0.15em] text-gray-400">
          <Link to="/" className="hover:text-white transition-colors duration-300">CATÁLOGO</Link>
          <button 
            onClick={() => user ? setIsRequestModalOpen(true) : navigate("/login")}
            className="hover:text-white transition-colors duration-300 flex items-center gap-1.5"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            PEDIR JOGO
          </button>
          <Link to="/vip" className="flex items-center gap-1.5 text-yellow-500 hover:text-yellow-400 transition-colors duration-300 animate-pulse">
            <Trophy className="w-4 h-4" />
            <span>VIP</span>
          </Link>
          {isAdmin && (
            <Link to="/admin" className="text-primary hover:text-primary/80 flex items-center gap-1.5">
              <Shield className="w-4 h-4" />
              ADMIN
            </Link>
          )}
        </nav>

        {/* À direita: Botão verde "1 JOGADORES ONLINE", Ícone de lua, Botão "ENTRAR" */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden lg:block">
            <OnlineUsers />
          </div>

          <button 
            onClick={toggleTheme} 
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-300"
            aria-label="Modo escuro"
          >
            <Moon className="w-5 h-5" />
          </button>

          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-300 font-black text-[10px] sm:text-xs uppercase tracking-widest text-white group"
            >
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full overflow-hidden bg-background flex items-center justify-center border border-white/10 group-hover:border-green-500/50 transition-colors">
                {profile?.avatar_url ? (
                  <img src={optimizeImageUrl(profile.avatar_url, 64)} alt="" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                )}
              </div>
              <span className="hidden sm:inline-block max-w-[80px] truncate">
                {user ? (profile?.display_name || user.email?.split("@")[0]) : "ENTRAR"}
              </span>
              {!user && <span className="sm:hidden">ENTRAR</span>}
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${menuOpen ? "rotate-180" : ""}`} />
            </button>
            
            <AnimatePresence>
              {menuOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 top-full mt-3 bg-[#1a1a1a] border border-white/10 rounded-xl w-60 shadow-2xl z-50 p-2 overflow-hidden backdrop-blur-xl"
                >
                  {user ? (
                    <div className="space-y-1">
                      <div className="px-3 py-3 border-b border-white/5 mb-1 bg-white/5 rounded-t-lg">
                        <p className="text-[9px] text-gray-500 uppercase font-black tracking-widest">MINHA CONTA</p>
                        <p className="text-sm font-bold text-white truncate">{profile?.display_name || user.email}</p>
                      </div>
                      <Link to="/perfil" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 hover:bg-white/5 rounded-lg text-xs font-bold text-gray-300 hover:text-white transition-colors">
                        <User className="w-4 h-4 text-gray-400" /> PERFIL
                      </Link>
                      <Link to="/vip" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 hover:bg-yellow-500/10 text-yellow-500 rounded-lg text-xs font-bold transition-colors">
                        <Trophy className="w-4 h-4" /> ÁREA VIP
                      </Link>
                      {isAdmin && (
                        <Link to="/admin" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 hover:bg-primary/10 text-primary rounded-lg text-xs font-bold transition-colors">
                          <Shield className="w-4 h-4" /> ADMINISTRAÇÃO
                        </Link>
                      )}
                      <button onClick={() => { logout(); setMenuOpen(false); }} className="flex items-center gap-3 px-3 py-2.5 hover:bg-red-500/10 text-red-500 rounded-lg text-xs font-bold w-full text-left transition-colors">
                        <LogOut className="w-4 h-4" /> SAIR
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <Link to="/login" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 hover:bg-green-500/10 text-green-500 rounded-lg text-xs font-bold transition-colors">
                        <LogIn className="w-4 h-4" /> ENTRAR NO SITE
                      </Link>
                      <Link to="/cadastro" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 hover:bg-white/5 text-gray-300 rounded-lg text-xs font-bold transition-colors">
                        <UserPlus className="w-4 h-4" /> REGISTRAR-SE
                      </Link>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Em telas pequenas (mobile) → aparece o botão de menu (três linhas) */}
          <button 
            className="md:hidden p-2 rounded-lg text-white hover:bg-white/10 transition-colors" 
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-white/5 bg-[#111111] overflow-hidden"
          >
            <div className="py-6 px-6 space-y-6 font-black uppercase tracking-widest text-xs flex flex-col">
              <Link to="/" className="text-gray-400 hover:text-white" onClick={() => setMobileOpen(false)}>CATÁLOGO</Link>
              <button 
                className="text-left text-gray-400 hover:text-white flex items-center gap-2" 
                onClick={() => {
                  setMobileOpen(false);
                  user ? setIsRequestModalOpen(true) : navigate("/login");
                }}
              >
                <PlusCircle className="w-4 h-4" /> PEDIR JOGO
              </button>
              <Link to="/vip" className="text-yellow-500 flex items-center gap-2" onClick={() => setMobileOpen(false)}>
                <Trophy className="w-4 h-4" /> VIP
              </Link>
              {isAdmin && (
                <Link to="/admin" className="text-primary flex items-center gap-2" onClick={() => setMobileOpen(false)}>
                  <Shield className="w-4 h-4" /> ADMIN
                </Link>
              )}
              
              <div className="h-px bg-white/5 w-full my-2"></div>
              
              {!user ? (
                <div className="grid grid-cols-2 gap-4">
                  <Link to="/login" className="flex items-center justify-center gap-2 py-3 bg-white/5 rounded-xl text-white" onClick={() => setMobileOpen(false)}>
                    <LogIn className="w-4 h-4" /> ENTRAR
                  </Link>
                  <Link to="/cadastro" className="flex items-center justify-center gap-2 py-3 bg-green-500/10 text-green-500 rounded-xl" onClick={() => setMobileOpen(false)}>
                    <UserPlus className="w-4 h-4" /> REGISTRAR
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  <Link to="/perfil" className="flex items-center gap-2 text-gray-300" onClick={() => setMobileOpen(false)}>
                    <User className="w-4 h-4" /> PERFIL
                  </Link>
                  <button onClick={() => { logout(); setMobileOpen(false); }} className="flex items-center gap-2 text-red-500">
                    <LogOut className="w-4 h-4" /> SAIR
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <GameRequestModal 
        isOpen={isRequestModalOpen} 
        onClose={() => setIsRequestModalOpen(false)} 
      />
    </header>
  );
}
