import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Menu, X, ChevronDown, LogOut, LogIn, UserPlus, Shield, Sun, Moon, User, Search } from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useState, useEffect } from "react";
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
          <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">Catálogo</Link>
          <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">Novidades</Link>
          {isAdmin && (
            <Link to="/admin" className="text-primary hover:text-primary/80 flex items-center gap-2">
              <Shield className="w-4 h-4" /> Admin
            </Link>
          )}
        </nav>

        {/* Search Desktop Mockup */}
        <div className="hidden xl:flex flex-1 max-w-sm relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary" />
          <input 
            type="text" 
            placeholder="Buscar jogos piratas..." 
            className="w-full bg-background border border-input rounded-full pl-11 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <button onClick={toggleTheme} className="p-2.5 rounded-xl hover:bg-muted transition-colors">
            {theme === "dark" ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-muted-foreground" />}
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