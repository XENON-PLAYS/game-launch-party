import { Link, useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown, LogOut, LogIn, UserPlus, Shield, Sun, Moon, User, Search, Trophy, Bell, PlusCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useState, useEffect, useRef } from "react";
import { OnlineUsers } from "./OnlineUsers";
import { NotificationBell } from "./NotificationBell";
import { SunMoonSystem } from "./SunMoonSystem";
import { GameRequestModal } from "./GameRequestModal";
import { optimizeImageUrl } from "@/lib/utils";
import logo from "@/assets/logo.png";

export function Header() {
  
  const { user, profile, logout, isAdmin } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="sticky top-0 z-[100] bg-background/80 backdrop-blur-md border-b border-primary/10 py-0 shadow-sm">
      <div className="container-responsive flex items-center justify-between gap-3 md:gap-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-1.5 sm:gap-2 md:gap-3 shrink-0">
          <img 
            src={logo} 
            alt="Logo" 
            width={64}
            height={64}
            className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 object-contain" 
          />
          <div className="flex flex-col leading-[0.85]">
            <span className="font-black text-white text-base sm:text-lg md:text-2xl lg:text-3xl tracking-tighter uppercase drop-shadow-md">JOGOS</span>
            <span className="font-black text-primary text-base sm:text-lg md:text-2xl lg:text-3xl tracking-tighter uppercase drop-shadow-sm">GRÁTIS</span>
          </div>
        </Link>

        {/* Nav Desktop */}
        <nav className="hidden lg:flex items-center gap-8 text-xs font-bold uppercase tracking-widest">
          <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">Catálogo</Link>
          <button 
            onClick={() => user ? setIsRequestModalOpen(true) : navigate("/login")}
            className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" /> Pedir Jogo
          </button>
          <Link to="/vip" className="text-yellow-500 hover:text-yellow-400 flex items-center gap-2 animate-pulse">
            <Trophy className="w-4 h-4" /> VIP
          </Link>
          {isAdmin && (
            <Link to="/admin" className="text-primary hover:text-primary/80 flex items-center gap-2">
              <Shield className="w-4 h-4" /> Admin
            </Link>
          )}
        </nav>


        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden sm:block">
            <OnlineUsers />
          </div>

          {user && <NotificationBell />}

          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme} 
            className="p-2.5 rounded-xl hover:bg-muted transition-colors relative h-10 w-10 flex items-center justify-center overflow-visible"
            aria-label="Alternar tema"
          >
            <SunMoonSystem />
          </button>


          {/* User Profile / Menu */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2 p-1.5 pr-4 rounded-full bg-muted hover:bg-muted/80 transition-colors font-bold text-xs uppercase tracking-widest border border-border"
            >
              <div className="w-8 h-8 rounded-full overflow-hidden bg-background flex items-center justify-center border border-border">
                {profile?.avatar_url ? <img src={optimizeImageUrl(profile.avatar_url, 64)} alt="" className="w-full h-full object-cover" /> : <User className="w-4 h-4" />}
              </div>
              <span className="hidden md:block max-w-[100px] truncate">
                {profile?.display_name || user?.email?.split("@")[0] || "Entrar"}
              </span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${menuOpen ? "rotate-180" : ""}`} />
            </button>
            
            <AnimatePresence>
              {menuOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 top-full mt-2 bg-popover border border-border rounded-xl w-60 shadow-xl z-50 p-1"
                >
                  {user ? (
                    <div className="space-y-1">
                      <div className="px-3 py-2 border-b border-border mb-1">
                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Conta</p>
                        <p className="text-sm font-bold truncate">{profile?.display_name || user.email}</p>
                      </div>
                      {isAdmin && (
                        <Link to="/admin" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 hover:bg-muted rounded-lg text-sm font-bold">
                          <Shield className="w-4 h-4" /> Admin
                        </Link>
                      )}
                      <Link to="/perfil" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 hover:bg-muted rounded-lg text-sm font-bold">
                        <User className="w-4 h-4" /> Perfil
                      </Link>
                      <Link to="/vip" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 hover:bg-yellow-500/10 text-yellow-500 rounded-lg text-sm font-bold">
                        <Trophy className="w-4 h-4" /> Área VIP
                      </Link>
                      <button onClick={() => { logout(); setMenuOpen(false); }} className="flex items-center gap-2 px-3 py-2 hover:bg-destructive/10 text-destructive rounded-lg text-sm font-bold w-full text-left">
                        <LogOut className="w-4 h-4" /> Sair
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <Link to="/login" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 hover:bg-muted rounded-lg text-sm font-bold">
                        <LogIn className="w-4 h-4" /> Entrar
                      </Link>
                      <Link to="/cadastro" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 hover:bg-muted rounded-lg text-sm font-bold">
                        <UserPlus className="w-4 h-4" /> Registrar
                      </Link>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile Menu Toggle */}
          <button className="p-2.5 rounded-xl hover:bg-muted md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-popover py-4 px-4 space-y-4 font-bold uppercase tracking-widest text-xs">
          <Link to="/" className="block py-2 text-muted-foreground hover:text-primary" onClick={() => setMobileOpen(false)}>Catálogo</Link>
          <button 
            className="block w-full text-left py-2 text-muted-foreground hover:text-primary" 
            onClick={() => {
              setMobileOpen(false);
              user ? setIsRequestModalOpen(true) : navigate("/login");
            }}
          >
            Pedir Jogo
          </button>
          {isAdmin && (
            <Link to="/admin" className="block py-2 text-primary flex items-center gap-2" onClick={() => setMobileOpen(false)}>
              <Shield className="w-4 h-4" /> Admin
            </Link>
          )}
          <Link to="/vip" className="block py-2 text-yellow-500 animate-pulse flex items-center gap-2" onClick={() => setMobileOpen(false)}>
            <Trophy className="w-4 h-4" /> VIP
          </Link>
          <div className="pt-4 border-t border-border flex flex-col gap-4">
            {!user ? (
              <>
                <Link to="/login" className="flex items-center gap-2 text-muted-foreground" onClick={() => setMobileOpen(false)}><LogIn className="w-4 h-4" /> Login</Link>
                <Link to="/cadastro" className="flex items-center gap-2 text-muted-foreground" onClick={() => setMobileOpen(false)}><UserPlus className="w-4 h-4" /> Registrar</Link>
              </>
            ) : (
              <>
                <Link to="/perfil" className="flex items-center gap-2 text-muted-foreground" onClick={() => setMobileOpen(false)}>
                  <User className="w-4 h-4" /> Perfil
                </Link>
                <button onClick={() => { logout(); setMobileOpen(false); }} className="flex items-center gap-2 text-destructive"><LogOut className="w-4 h-4" /> Sair</button>
              </>
            )}
          </div>
        </div>
      )}
      
      <GameRequestModal 
        isOpen={isRequestModalOpen} 
        onClose={() => setIsRequestModalOpen(false)} 
      />
    </header>
  );
}