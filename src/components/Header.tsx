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
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useState, useEffect, useRef } from "react";
import { OnlineUsers } from "./OnlineUsers";
import { NotificationBell } from "./NotificationBell";
// removed GameRequestModal import
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


  // removed isRequestModalOpen state

  const navLinks = (
    <>
      <Link 
        to="/" 
        className={`text-[13px] font-black uppercase tracking-[0.2em] transition-all duration-300 relative group py-2 ${
          location.pathname === "/" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
        }`}
      >
        Catálogo
        <span className={`absolute -bottom-1 left-0 h-0.5 bg-foreground transition-all duration-300 ${
          location.pathname === "/" ? "w-full" : "w-0 group-hover:w-full"
        }`} />
      </Link>
      <Link 
        to="/novidades" 
        className={`text-[13px] font-black uppercase tracking-[0.2em] transition-all duration-300 relative group py-2 ${
          location.pathname === "/novidades" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
        }`}
      >
        Novidades
        <span className={`absolute -bottom-1 left-0 h-0.5 bg-foreground transition-all duration-300 ${
          location.pathname === "/novidades" ? "w-full" : "w-0 group-hover:w-full"
        }`} />
      </Link>
      <Link 
        to="/dmca" 
        className={`text-[13px] font-black uppercase tracking-[0.2em] transition-all duration-300 relative group py-2 ${
          location.pathname === "/dmca" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
        }`}
      >
        DMCA
        <span className={`absolute -bottom-1 left-0 h-0.5 bg-foreground transition-all duration-300 ${
          location.pathname === "/dmca" ? "w-full" : "w-0 group-hover:w-full"
        }`} />
      </Link>
      <Link 
        to="/privacidade" 
        className={`text-[13px] font-black uppercase tracking-[0.2em] transition-all duration-300 relative group py-2 ${
          location.pathname === "/privacidade" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
        }`}
      >
        POLÍTICA DE PRIVACIDADE
        <span className={`absolute -bottom-1 left-0 h-0.5 bg-foreground transition-all duration-300 ${
          location.pathname === "/privacidade" ? "w-full" : "w-0 group-hover:w-full"
        }`} />
      </Link>
      <Link 
        to="/pedir-jogo" 
        className={`text-[13px] font-black uppercase tracking-[0.2em] transition-all duration-300 relative group py-2 ${
          location.pathname === "/pedir-jogo" ? "text-primary" : "text-muted-foreground hover:text-foreground"
        }`}
      >
        Pedir Jogos
        <span className={`absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300 ${
          location.pathname === "/pedir-jogo" ? "w-full" : "w-0 group-hover:w-full"
        }`} />
      </Link>
      <Link 
        to="/vip" 
        className="flex items-center gap-2 text-[13px] font-black uppercase tracking-[0.2em] text-amber-500 hover:brightness-125 transition-all relative group py-2"
      >
        <Crown className="w-4 h-4 fill-amber-500" />
        Vip
        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-500 transition-all duration-300 group-hover:w-full" />
      </Link>
      {isAdmin && (
        <Link 
          to="/admin" 
          className="text-[13px] font-black uppercase tracking-[0.2em] text-primary hover:brightness-125 transition-all relative group py-2"
        >
          Admin
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
        </Link>
      )}
    </>
  );

  return (
    <>
      <header className="sticky top-0 z-[100] bg-background/95 backdrop-blur-md border-b border-border py-2 px-4 md:px-12 flex items-center justify-between shadow-2xl transition-all duration-300">
        <div className="w-full flex items-center justify-start gap-8 lg:gap-12">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <img src={pirateLogo} alt="Logo" className="w-10 h-10 md:w-12 md:h-12 object-contain transition-transform group-hover:scale-110 duration-300" />
            <div className="flex flex-col -space-y-2 py-1">
              <span className="text-xl md:text-2xl font-black tracking-tighter text-foreground leading-none">JOGOS</span>
              <span className="text-xl md:text-2xl font-black tracking-tighter text-primary leading-none">GRATIS</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-12 ml-8">
            {navLinks}
          </nav>

          <div className="flex-1" />

          {/* Right Side Actions */}
          <div className="flex items-center gap-2 sm:gap-6 shrink-0">
            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-muted-foreground hover:text-foreground transition-all hover:bg-muted/50 rounded-xl"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <div className="hidden sm:block">
              <OnlineUsers />
            </div>

            <div className="flex items-center gap-2 sm:gap-4 lg:gap-6 border-l border-border pl-3 sm:pl-6">
              <NotificationBell />
              
              <button 
                onClick={toggleTheme}
                className="p-2 text-muted-foreground hover:text-foreground transition-all hover:bg-muted/50 rounded-xl group"
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
                  className="flex items-center gap-3 p-1 rounded-full bg-muted/50 border border-border hover:bg-muted transition-all group"
                >
                  <div className="w-9 h-9 rounded-full overflow-hidden border border-border group-hover:border-primary/30 transition-all">
                    {profile?.avatar_url ? (
                      <img src={optimizeImageUrl(profile.avatar_url, 80)} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <User className="w-5 h-5 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="hidden sm:flex items-center gap-2 pr-2">
                    <span className="text-[11px] font-black uppercase tracking-widest text-foreground/90 group-hover:text-foreground transition-colors">
                      {profile?.display_name || (user?.email?.split("@")[0] || "RICHARD").toUpperCase()}
                    </span>
                    <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform duration-500 ${menuOpen ? "rotate-180" : ""}`} />
                  </div>
                </button>
                
                <AnimatePresence>
                  {menuOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 top-full mt-4 bg-card border border-border rounded-2xl w-64 shadow-2xl z-50 p-2 overflow-hidden backdrop-blur-xl"
                    >
                      {user ? (
                        <div className="space-y-1">
                          <div className="px-4 py-4 border-b border-border mb-1 bg-muted/20">
                            <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mb-1">Minha Conta</p>
                            <p className="text-sm font-bold text-foreground truncate">{profile?.display_name || user.email}</p>
                          </div>
                          <Link to="/perfil" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 hover:bg-muted text-muted-foreground hover:text-foreground rounded-xl text-xs font-black uppercase tracking-wider transition-all">
                            <User className="w-4 h-4" /> Perfil
                          </Link>
                          <Link to="/vip" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 hover:bg-amber-500/10 text-amber-500 rounded-xl text-xs font-black uppercase tracking-wider transition-all">
                            <Crown className="w-4 h-4 fill-amber-500" /> Área VIP
                          </Link>
                          {isAdmin && (
                            <Link to="/admin" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 hover:bg-primary/10 text-primary rounded-xl text-xs font-black uppercase tracking-wider transition-all">
                              <Shield className="w-4 h-4" /> Administração
                            </Link>
                          )}
                          <button onClick={() => { logout(); setMenuOpen(false); }} className="flex items-center gap-3 px-4 py-3 hover:bg-primary/10 text-primary rounded-xl text-xs font-black uppercase tracking-wider w-full text-left transition-all">
                            <LogOut className="w-4 h-4" /> Sair da conta
                          </button>
                        </div>
                      ) : (
                        <div className="p-1 space-y-1">
                          <Link to="/login" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 hover:bg-muted text-foreground rounded-xl text-xs font-black uppercase tracking-wider transition-all">
                            <LogIn className="w-4 h-4" /> LOGIN
                          </Link>
                          <Link to="/cadastro" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 bg-primary hover:opacity-90 text-primary-foreground rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-lg shadow-primary/20">
                            <UserPlus className="w-4 h-4" /> CADASTRO
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

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-background border-b border-border overflow-hidden absolute top-full left-0 w-full"
            >
              <div className="container mx-auto px-4 py-6 flex flex-col gap-6">
                {navLinks}
                <div className="pt-4 border-t border-border flex flex-col gap-4">
                  <OnlineUsers />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* removed GameRequestModal */}
      </header>

    </>
  );
}