import { Link, useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown, LogOut, LogIn, UserPlus, Shield, User, Trophy, PlusCircle, Settings } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { useAuth } from "@/context/AuthContext";
import { useState, useEffect, useRef } from "react";
import { OnlineUsers } from "./OnlineUsers";
import { GameRequestModal } from "./GameRequestModal";
import { optimizeImageUrl } from "@/lib/utils";
import { Button } from "./ui/button";

export function Header() {
  const { user, profile, logout, isAdmin } = useAuth();
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
    <header className="sticky top-0 z-[100] bg-background/80 backdrop-blur-md border-b border-border py-3 md:py-4 transition-all">
      <div className="container-responsive flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 shrink-0">
          <img 
            src="/src/assets/logo.png" 
            alt="Site Logo" 
            className="h-8 md:h-10 w-auto object-contain" 
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 font-bold text-xs uppercase tracking-wider text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition-colors">Catálogo</Link>
          <button 
            onClick={() => user ? setIsRequestModalOpen(true) : navigate("/login")}
            className="hover:text-foreground transition-colors flex items-center gap-1.5"
          >
            Pedir Jogo
          </button>
          <Link to="/vip" className="flex items-center gap-1.5 text-yellow-500 hover:text-yellow-600 transition-colors">
            <Trophy className="w-4 h-4" />
            <span>VIP</span>
          </Link>
          {isAdmin && (
            <Link to="/admin" className="text-primary hover:text-primary/80 flex items-center gap-1.5">
              <Shield className="w-4 h-4" />
              Admin
            </Link>
          )}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="hidden lg:block">
            <OnlineUsers />
          </div>

          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2 p-1 pr-3 rounded-full bg-secondary hover:bg-secondary/80 border border-border transition-all"
            >
              <div className="w-8 h-8 rounded-full overflow-hidden bg-muted flex items-center justify-center border border-border">
                {profile?.avatar_url ? (
                  <img src={optimizeImageUrl(profile.avatar_url, 64)} alt="" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-4 h-4 text-muted-foreground" />
                )}
              </div>
              <span className="hidden sm:inline-block max-w-[100px] truncate text-xs font-bold uppercase tracking-tight">
                {user ? (profile?.display_name || user.email?.split("@")[0]) : "Entrar"}
              </span>
              <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-300 ${menuOpen ? "rotate-180" : ""}`} />
            </button>
            
            <AnimatePresence>
              {menuOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 top-full mt-3 bg-popover border border-border rounded-xl w-60 shadow-2xl z-50 p-2"
                >
                  {user ? (
                    <div className="space-y-1">
                      <div className="px-3 py-3 border-b border-border mb-1">
                        <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Minha Conta</p>
                        <p className="text-sm font-bold truncate">{profile?.display_name || user.email}</p>
                      </div>
                      <Link to="/perfil" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 hover:bg-secondary rounded-lg text-xs font-bold transition-colors">
                        <User className="w-4 h-4" /> Perfil
                      </Link>
                      <Link to="/vip" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 hover:bg-yellow-500/10 text-yellow-500 rounded-lg text-xs font-bold transition-colors">
                        <Trophy className="w-4 h-4" /> Área VIP
                      </Link>
                      {isAdmin && (
                        <Link to="/admin" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 hover:bg-primary/10 text-primary rounded-lg text-xs font-bold transition-colors">
                          <Shield className="w-4 h-4" /> Administração
                        </Link>
                      )}
                      <button onClick={() => { logout(); setMenuOpen(false); }} className="flex items-center gap-3 px-3 py-2.5 hover:bg-destructive/10 text-destructive rounded-lg text-xs font-bold w-full text-left transition-colors">
                        <LogOut className="w-4 h-4" /> Sair
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <Link to="/login" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 hover:bg-primary/10 text-primary rounded-lg text-xs font-bold transition-colors">
                        <LogIn className="w-4 h-4" /> Entrar no Site
                      </Link>
                      <Link to="/cadastro" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 hover:bg-secondary rounded-lg text-xs font-bold transition-colors">
                        <UserPlus className="w-4 h-4" /> Registrar-se
                      </Link>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button 
            className="md:hidden p-2 rounded-lg hover:bg-secondary transition-colors" 
            onClick={() => setMobileOpen(!mobileOpen)}
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
            className="md:hidden border-t border-border bg-background overflow-hidden"
          >
            <div className="py-6 px-6 space-y-6 font-bold uppercase tracking-widest text-xs flex flex-col">
              <Link to="/" className="text-muted-foreground hover:text-foreground" onClick={() => setMobileOpen(false)}>Catálogo</Link>
              <button 
                className="text-left text-muted-foreground hover:text-foreground" 
                onClick={() => {
                  setMobileOpen(false);
                  user ? setIsRequestModalOpen(true) : navigate("/login");
                }}
              >
                Pedir Jogo
              </button>
              <Link to="/vip" className="text-yellow-500" onClick={() => setMobileOpen(false)}>VIP</Link>
              {isAdmin && <Link to="/admin" className="text-primary" onClick={() => setMobileOpen(false)}>Admin</Link>}
              
              <div className="h-px bg-border w-full"></div>
              
              {!user ? (
                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" asChild onClick={() => setMobileOpen(false)}>
                    <Link to="/login">Entrar</Link>
                  </Button>
                  <Button asChild onClick={() => setMobileOpen(false)}>
                    <Link to="/cadastro">Registrar</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <Link to="/perfil" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
                    <User className="w-4 h-4" /> Perfil
                  </Link>
                  <button onClick={() => { logout(); setMobileOpen(false); }} className="flex items-center gap-2 text-destructive">
                    <LogOut className="w-4 h-4" /> Sair
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