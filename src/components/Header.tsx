import { Link, useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown, LogOut, LogIn, UserPlus, Shield, Sun, Moon, User, Search, Trophy, Bell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useState, useEffect } from "react";
import { OnlineUsers } from "./OnlineUsers";
import { NotificationBell } from "./NotificationBell";
import logo from "@/assets/logo.png";

export function Header() {
  
  const { user, profile, logout, isAdmin } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="sticky top-0 z-[100] bg-background/80 backdrop-blur-md border-b-2 border-primary/20 py-2 sm:py-3 md:py-4 shadow-sm">
      <div className="container-responsive flex items-center justify-between gap-3 md:gap-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-1.5 sm:gap-2 md:gap-3 shrink-0">
          <img 
            src={logo} 
            alt="JOGOS GRATIS" 
            className="w-7 h-7 sm:w-9 sm:h-9 md:w-12 md:h-12 lg:w-14 lg:h-14" 
          />
          <div className="flex flex-col">
            <span className="font-bold text-sm sm:text-base md:text-xl lg:text-2xl tracking-tighter leading-none">JOGOS</span>
            <span className="font-bold text-sm sm:text-base md:text-xl lg:text-2xl tracking-tighter leading-none text-primary">GRATIS</span>
          </div>
        </Link>

        {/* Nav Desktop */}
        <nav className="hidden lg:flex items-center gap-8 text-xs font-bold uppercase tracking-widest">
          <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">Catálogo</Link>
          <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">Novidades</Link>
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
            className="p-2.5 rounded-xl hover:bg-muted transition-colors relative h-10 w-10 flex items-center justify-center overflow-hidden"
            aria-label="Alternar tema"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={theme}
                initial={{ rotate: -360, scale: 0, opacity: 0 }}
                animate={{ rotate: 0, scale: 1, opacity: 1 }}
                exit={{ rotate: 360, scale: 0, opacity: 0 }}
                transition={{ 
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                  mass: 0.8
                }}
                className="flex items-center justify-center pointer-events-none"
              >
                {theme === "dark" ? (
                  <Sun className="w-5 h-5 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.4)]" />
                ) : (
                  <Moon className="w-5 h-5 text-indigo-400 drop-shadow-[0_0_8px_rgba(129,140,248,0.4)]" />
                )}
              </motion.div>
            </AnimatePresence>
          </button>


          {/* User Profile / Menu */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2 p-1.5 pr-4 rounded-full bg-muted hover:bg-muted/80 transition-colors font-bold text-xs uppercase tracking-widest border border-border"
            >
              <div className="w-8 h-8 rounded-full overflow-hidden bg-background flex items-center justify-center border border-border">
                {profile?.avatar_url ? <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" /> : <User className="w-4 h-4" />}
              </div>
              <span className="hidden md:block max-w-[100px] truncate">
                {profile?.display_name || user?.email?.split("@")[0] || "Entrar"}
              </span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${menuOpen ? "rotate-180" : ""}`} />
            </button>
            
            {menuOpen && (
              <div className="absolute right-0 top-full mt-2 bg-popover border border-border rounded-xl w-60 shadow-xl z-50 p-1">
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
                    <Link to="/vip" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 hover:bg-yellow-500/10 text-yellow-500 rounded-lg text-sm font-bold">
                      <Trophy className="w-4 h-4" /> Área VIP
                    </Link>
                    <Link to="/perfil" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 hover:bg-muted rounded-lg text-sm font-bold">
                      <User className="w-4 h-4" /> Perfil
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
              </div>
            )}
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
          <Link to="/" className="block py-2 text-muted-foreground hover:text-primary" onClick={() => setMobileOpen(false)}>Novidades</Link>
          {isAdmin && <Link to="/admin" className="block py-2 text-primary" onClick={() => setMobileOpen(false)}>Admin</Link>}
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
                <Link to="/perfil" className="flex items-center gap-2 text-muted-foreground" onClick={() => setMobileOpen(false)}><User className="w-4 h-4" /> Perfil</Link>
                <button onClick={() => { logout(); setMobileOpen(false); }} className="flex items-center gap-2 text-destructive"><LogOut className="w-4 h-4" /> Sair</button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}