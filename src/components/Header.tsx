import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Menu, X, ChevronDown, LogOut, LogIn, UserPlus, Shield, Sun, Moon, User, Search } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useState, useEffect } from "react";
import logo from "@/assets/logo.png";


export function Header() {
  const { count, setIsOpen } = useCart();
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
    <header className="sticky top-0 z-[100] bg-background/80 backdrop-blur-md border-b border-border py-4 shadow-sm">
      <div className="container mx-auto px-4 flex items-center justify-between gap-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 shrink-0">
          <img 
            src={logo} 
            alt="Jogos Piratas" 
            className="w-10 h-10 md:w-12 md:h-12" 
          />
          <div className="flex flex-col">
            <span className="font-['SuperSenior'] text-xl tracking-tighter leading-none">JOGOS</span>
            <span className="font-['SuperSenior'] text-xl tracking-tighter leading-none text-primary">PIRATAS</span>
          </div>
        </Link>

        {/* Nav Desktop */}
        <nav className="hidden lg:flex items-center gap-8 text-xs font-bold uppercase tracking-widest">
          <Link to="/" className="text-muted-foreground hover:text-primary transition-all duration-300 relative group">
            Catálogo
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
          </Link>
          <Link to="/" className="text-muted-foreground hover:text-primary transition-all duration-300 relative group">
            Novidades
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
          </Link>
          {isAdmin && (
            <Link to="/admin" className="text-primary hover:text-primary/80 transition-all duration-300 flex items-center gap-2 group">
              <Shield className="w-4 h-4 group-hover:rotate-12 transition-transform" /> Admin
            </Link>
          )}
        </nav>

        {/* Search Desktop Mockup */}
        <div className="hidden xl:flex flex-1 max-w-sm relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Buscar jogos piratas..." 
            className="w-full bg-white/5 border border-white/10 rounded-full pl-11 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all duration-300"
            title={theme === "dark" ? "Tema claro" : "Tema escuro"}
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5 text-yellow-400" />
            ) : (
              <Moon className="w-5 h-5 text-muted-foreground" />
            )}
          </button>

          {/* Cart */}
          <button 
            onClick={() => setIsOpen(true)} 
            className="relative p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all duration-300 group"
          >
            <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
            {count > 0 && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1.5 -right-1.5 bg-primary text-primary-foreground text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold border-2 border-background"
              >
                {count}
              </motion.span>
            )}
          </button>

          {/* User Profile / Menu */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className={`flex items-center gap-3 p-1.5 pr-4 rounded-full transition-all duration-300 font-bold text-xs uppercase tracking-widest group border ${
                menuOpen ? "bg-primary border-primary text-primary-foreground" : "bg-white/5 border-white/5 hover:border-primary/50"
              }`}
            >
              <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-background shadow-lg bg-background flex items-center justify-center shrink-0">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-4 h-4" />
                )}
              </div>
              <span className="hidden md:block max-w-[100px] truncate">
                {profile?.display_name || user?.email?.split("@")[0] || "Acessar"}
              </span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${menuOpen ? "rotate-180" : "opacity-50"}`} />
            </button>
            
            <AnimatePresence>
              {menuOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 top-full mt-4 bg-popover/95 backdrop-blur-xl border border-white/10 rounded-2xl w-64 shadow-2xl overflow-hidden z-50 p-2"
                >
                  {user ? (
                    <div className="space-y-1">
                      <div className="px-4 py-3 border-b border-white/5 mb-1">
                        <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest mb-1">Logado como</p>
                        <p className="text-sm font-bold truncate">{profile?.display_name || user.email}</p>
                      </div>
                      {isAdmin && (
                        <Link to="/admin" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 hover:bg-primary hover:text-primary-foreground rounded-xl transition-all duration-300 text-sm font-bold uppercase tracking-widest">
                          <Shield className="w-4 h-4" /> Painel Admin
                        </Link>
                      )}
                      <Link to="/perfil" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 hover:bg-primary/10 rounded-xl transition-all duration-300 text-sm font-bold uppercase tracking-widest">
                        <User className="w-4 h-4" /> Meu Perfil
                      </Link>
                      <button 
                        onClick={() => { logout(); setMenuOpen(false); }} 
                        className="flex items-center gap-3 px-4 py-3 hover:bg-destructive/10 hover:text-destructive rounded-xl transition-all duration-300 text-sm font-bold uppercase tracking-widest w-full text-left"
                      >
                        <LogOut className="w-4 h-4" /> Sair
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <Link to="/login" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 hover:bg-primary hover:text-primary-foreground rounded-xl transition-all duration-300 text-sm font-bold uppercase tracking-widest">
                        <LogIn className="w-4 h-4" /> Entrar
                      </Link>
                      <Link to="/cadastro" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 hover:bg-primary/10 rounded-xl transition-all duration-300 text-sm font-bold uppercase tracking-widest">
                        <UserPlus className="w-4 h-4" /> Criar Conta
                      </Link>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all duration-300 md:hidden" 
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-white/5 bg-popover/95 backdrop-blur-xl overflow-hidden font-bold uppercase tracking-widest text-xs"
          >
            <div className="px-4 py-6 space-y-4">
              <Link to="/" className="block py-2 text-muted-foreground hover:text-primary transition-colors" onClick={() => setMobileOpen(false)}>Catálogo</Link>
              <Link to="/" className="block py-2 text-muted-foreground hover:text-primary transition-colors" onClick={() => setMobileOpen(false)}>Novidades</Link>
              {isAdmin && <Link to="/admin" className="block py-2 text-primary" onClick={() => setMobileOpen(false)}>Painel Admin</Link>}
              <div className="pt-4 border-t border-white/5 flex flex-col gap-4">
                {!user ? (
                  <>
                    <Link to="/login" className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors" onClick={() => setMobileOpen(false)}>
                      <LogIn className="w-4 h-4" /> Login
                    </Link>
                    <Link to="/cadastro" className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors" onClick={() => setMobileOpen(false)}>
                      <UserPlus className="w-4 h-4" /> Registrar
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/perfil" className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors" onClick={() => setMobileOpen(false)}>
                      <User className="w-4 h-4" /> Meu Perfil
                    </Link>
                    <button 
                      onClick={() => { logout(); setMobileOpen(false); }} 
                      className="flex items-center gap-3 text-destructive"
                    >
                      <LogOut className="w-4 h-4" /> Sair
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
