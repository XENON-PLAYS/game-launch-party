import { Link, useNavigate, useLocation } from "react-router-dom";
import { 
  ChevronDown, 
  LogOut, 
  LogIn, 
  UserPlus, 
  Shield, 
  User, 
  Crown,
  Bell,
  Sun,
  Moon,
  Skull
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useState, useEffect, useRef } from "react";
import { OnlineUsers } from "./OnlineUsers";
import { NotificationBell } from "./NotificationBell";
import { GameRequestModal } from "./GameRequestModal";
import { optimizeImageUrl } from "@/lib/utils";

export function Header() {
  const { user, profile, logout, isAdmin } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
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

  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  return (
    <header className="sticky top-0 z-[100] bg-[#0f0f0f] border-b border-white/5 py-4 px-6 md:px-10 flex items-center justify-between shadow-2xl">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 group shrink-0">
        <Skull className="w-8 h-8 text-white fill-white" />
        <div className="flex font-black text-xl tracking-tighter">
          <span className="text-white">JOGOS</span>
          <span className="text-[#ff0000] ml-1.5 uppercase">Piratas</span>
        </div>
      </Link>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-10">
        <Link 
          to="/" 
          className={`text-[13px] font-black uppercase tracking-widest transition-all duration-300 ${
            location.pathname === "/" ? "text-white" : "text-gray-400 hover:text-white"
          }`}
        >
          Catálogo
        </Link>
        <Link 
          to="/novidades" 
          className={`text-[13px] font-black uppercase tracking-widest transition-all duration-300 ${
            location.pathname === "/novidades" ? "text-white" : "text-gray-400 hover:text-white"
          }`}
        >
          Novidades
        </Link>
        <Link 
          to="/vip" 
          className="flex items-center gap-2 text-[13px] font-black uppercase tracking-widest text-[#fbbf24] hover:brightness-110 transition-all"
        >
          <Crown className="w-4 h-4 fill-[#fbbf24]" />
          Vip
        </Link>
        {isAdmin && (
          <Link 
            to="/admin" 
            className="text-[13px] font-black uppercase tracking-widest text-[#ff0000] hover:brightness-110 transition-all"
          >
            Admin
          </Link>
        )}
      </nav>

      {/* Right Side Actions */}
      <div className="flex items-center gap-6">
        <div className="hidden lg:block">
          <OnlineUsers />
        </div>

        <div className="flex items-center gap-4">
          <NotificationBell />
          
          <button 
            onClick={toggleTheme}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-3 group"
            >
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/10 group-hover:border-white/30 transition-all">
                {profile?.avatar_url ? (
                  <img src={optimizeImageUrl(profile.avatar_url, 80)} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-[#1a1a1a] flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-500" />
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1.5">
                <span className="hidden sm:inline-block text-[12px] font-black uppercase tracking-widest text-white">
                  {profile?.display_name || (user?.email?.split("@")[0] || "RICHARD").toUpperCase()}
                </span>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${menuOpen ? "rotate-180" : ""}`} />
              </div>
            </button>
            
            <AnimatePresence>
              {menuOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 top-full mt-4 bg-[#111111] border border-white/5 rounded-xl w-60 shadow-2xl z-50 p-2 overflow-hidden"
                >
                  {user ? (
                    <div className="space-y-1">
                      <div className="px-4 py-3 border-b border-white/5 mb-1">
                        <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Minha Conta</p>
                        <p className="text-sm font-bold text-white truncate">{profile?.display_name || user.email}</p>
                      </div>
                      <Link to="/perfil" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 text-gray-300 hover:text-white rounded-lg text-xs font-bold transition-all">
                        <User className="w-4 h-4" /> Perfil
                      </Link>
                      <Link to="/vip" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 hover:bg-[#fbbf24]/10 text-[#fbbf24] rounded-lg text-xs font-bold transition-all">
                        <Crown className="w-4 h-4" /> Área VIP
                      </Link>
                      {isAdmin && (
                        <Link to="/admin" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 hover:bg-[#ff0000]/10 text-[#ff0000] rounded-lg text-xs font-bold transition-all">
                          <Shield className="w-4 h-4" /> Administração
                        </Link>
                      )}
                      <button onClick={() => { logout(); setMenuOpen(false); }} className="flex items-center gap-3 px-4 py-3 hover:bg-[#ff0000]/10 text-[#ff0000] rounded-lg text-xs font-bold w-full text-left transition-all">
                        <LogOut className="w-4 h-4" /> Sair
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <Link to="/login" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 text-white rounded-lg text-xs font-bold transition-all">
                        <LogIn className="w-4 h-4" /> Entrar no Site
                      </Link>
                      <Link to="/cadastro" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 text-white rounded-lg text-xs font-bold transition-all">
                        <UserPlus className="w-4 h-4" /> Registrar-se
                      </Link>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <GameRequestModal 
        isOpen={isRequestModalOpen} 
        onClose={() => setIsRequestModalOpen(false)} 
      />
    </header>
  );
}
