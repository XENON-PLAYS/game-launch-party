import { Link, useNavigate, useLocation } from "react-router-dom";
import { 
  ChevronDown, 
  LogOut, 
  LogIn, 
  UserPlus, 
  Shield, 
  User, 
  Crown,
  Sun,
  Moon,
  Menu,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useState, useEffect, useRef } from "react";
import { OnlineUsers } from "./OnlineUsers";
import { NotificationBell } from "./NotificationBell";
import { GameRequestModal } from "./GameRequestModal";
import { optimizeImageUrl } from "@/lib/utils";
import pirateLogo from "@/assets/logo-pirate.png";

export function Header() {
  const { user, profile, logout, isAdmin } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
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

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  const navLinks = (
    <>
      <Link 
        to="/" 
        className={`text-[13px] font-black uppercase tracking-[0.2em] transition-all duration-300 relative group py-2 ${
          location.pathname === "/" ? "text-white" : "text-gray-500 hover:text-white"
        }`}
      >
        Catálogo
        <span className={`absolute -bottom-1 left-0 h-0.5 bg-white transition-all duration-300 ${
          location.pathname === "/" ? "w-full" : "w-0 group-hover:w-full"
        }`} />
      </Link>
      <Link 
        to="/novidades" 
        className={`text-[13px] font-black uppercase tracking-[0.2em] transition-all duration-300 relative group py-2 ${
          location.pathname === "/novidades" ? "text-white" : "text-gray-500 hover:text-white"
        }`}
      >
        Novidades
        <span className={`absolute -bottom-1 left-0 h-0.5 bg-white transition-all duration-300 ${
          location.pathname === "/novidades" ? "w-full" : "w-0 group-hover:w-full"
        }`} />
      </Link>
      <Link 
        to="/vip" 
        className="flex items-center gap-2 text-[13px] font-black uppercase tracking-[0.2em] text-[#fbbf24] hover:brightness-125 transition-all relative group py-2"
      >
        <Crown className="w-4 h-4 fill-[#fbbf24]" />
        Vip
        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#fbbf24] transition-all duration-300 group-hover:w-full" />
      </Link>
      {isAdmin && (
        <Link 
          to="/admin" 
          className="text-[13px] font-black uppercase tracking-[0.2em] text-[#ff0000] hover:brightness-125 transition-all relative group py-2"
        >
          Admin
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#ff0000] transition-all duration-300 group-hover:w-full" />
        </Link>
      )}
    </>
  );

  return (
    <>
      <header className="sticky top-0 z-[100] bg-[#0f0f0f] border-b border-white/5 py-4 px-4 md:px-12 flex items-center justify-between shadow-2xl transition-all duration-300">
        <div className="container mx-auto flex items-center justify-between gap-4 lg:gap-6">
          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-gray-400 hover:text-white transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <img src={pirateLogo} alt="Logo" className="w-14 h-14 object-contain transition-transform group-hover:scale-110 duration-300" />
            <div className="flex flex-col items-start leading-[0.8] py-1">
              <span className="text-xl md:text-2xl font-black tracking-tighter text-white">JOGOS</span>
              <span className="text-xl md:text-2xl font-black tracking-tighter text-[#ff0000]">PIRATAS</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-12 flex-1 justify-center">
            {navLinks}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3 sm:gap-6 shrink-0">
            <div className="hidden sm:block">
              <OnlineUsers />
            </div>

            <div className="flex items-center gap-2 sm:gap-4 lg:gap-6 border-l border-white/5 pl-3 sm:pl-6">
              <NotificationBell />
              
              <button 
                onClick={toggleTheme}
                className="p-2 text-gray-400 hover:text-white transition-all hover:bg-white/5 rounded-xl group"
                title={theme === 'dark' ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
              >
                {theme === "dark" ? (
                  <Sun className="w-5 h-5 group-hover:rotate-45 transition-transform" />
                ) : (
                  <Moon className="w-5 h-5 group-hover:-rotate-12 transition-transform" />
                )}
              </button>

              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-3 p-1 rounded-full bg-white/5 border border-white/5 hover:bg-white/10 transition-all group"
                >
                  <div className="w-9 h-9 rounded-full overflow-hidden border border-white/10 group-hover:border-white/30 transition-all">
                    {profile?.avatar_url ? (
                      <img src={optimizeImageUrl(profile.avatar_url, 80)} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-[#1a1a1a] flex items-center justify-center">
                        <User className="w-5 h-5 text-gray-500" />
                      </div>
                    )}
                  </div>
                  <div className="hidden sm:flex items-center gap-2 pr-2">
                    <span className="text-[11px] font-black uppercase tracking-widest text-white/90 group-hover:text-white transition-colors">
                      {profile?.display_name || (user?.email?.split("@")[0] || "RICHARD").toUpperCase()}
                    </span>
                    <ChevronDown className={`w-3.5 h-3.5 text-gray-500 transition-transform duration-500 ${menuOpen ? "rotate-180" : ""}`} />
                  </div>
                </button>
                
                <AnimatePresence>
                  {menuOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 top-full mt-4 bg-[#111111] border border-white/5 rounded-2xl w-64 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50 p-2 overflow-hidden backdrop-blur-xl"
                    >
                      {user ? (
                        <div className="space-y-1">
                          <div className="px-4 py-4 border-b border-white/5 mb-1 bg-white/[0.02]">
                            <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Minha Conta</p>
                            <p className="text-sm font-bold text-white truncate">{profile?.display_name || user.email}</p>
                          </div>
                          <Link to="/perfil" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 text-gray-400 hover:text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all">
                            <User className="w-4 h-4" /> Perfil
                          </Link>
                          <Link to="/vip" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 hover:bg-[#fbbf24]/10 text-[#fbbf24] rounded-xl text-xs font-black uppercase tracking-wider transition-all">
                            <Crown className="w-4 h-4 fill-[#fbbf24]" /> Área VIP
                          </Link>
                          {isAdmin && (
                            <Link to="/admin" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 hover:bg-[#ff0000]/10 text-[#ff0000] rounded-xl text-xs font-black uppercase tracking-wider transition-all">
                              <Shield className="w-4 h-4" /> Administração
                            </Link>
                          )}
                          <button onClick={() => { logout(); setMenuOpen(false); }} className="flex items-center gap-3 px-4 py-3 hover:bg-[#ff0000]/10 text-[#ff0000] rounded-xl text-xs font-black uppercase tracking-wider w-full text-left transition-all">
                            <LogOut className="w-4 h-4" /> Sair da conta
                          </button>
                        </div>
                      ) : (
                        <div className="p-1 space-y-1">
                          <Link to="/login" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all">
                            <LogIn className="w-4 h-4" /> Entrar no Site
                          </Link>
                          <Link to="/cadastro" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 bg-[#ff0000] hover:bg-[#e60000] text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-lg shadow-[#ff0000]/20">
                            <UserPlus className="w-4 h-4" /> Criar Conta
                          </Link>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        <GameRequestModal 
          isOpen={isRequestModalOpen} 
          onClose={() => setIsRequestModalOpen(false)} 
        />
      </header>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden sticky top-[73px] z-[99] bg-[#0f0f0f] border-b border-white/5 overflow-hidden"
          >
            <nav className="flex flex-col gap-1 p-4">
              {navLinks}
              <div className="mt-3 pt-3 border-t border-white/10 sm:hidden">
                <OnlineUsers />
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

