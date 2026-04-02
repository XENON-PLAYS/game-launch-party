import { Link } from "react-router-dom";
import { ShoppingCart, Menu, X, ChevronDown, LogOut, LogIn, UserPlus, Shield, Sun, Moon } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useState } from "react";
import logo from "@/assets/logo.png";

export function Header() {
  const { count, setIsOpen } = useCart();
  const { user, profile, logout, isAdmin } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-popover/95 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 shrink-0 group">
          <img src={logo} alt="Jogos Piratas" className="w-12 h-12 group-hover:scale-110 transition-transform" />
          <span className="font-['SuperSenior'] text-xl tracking-wide hidden sm:block leading-tight">
            JOGOS<br /><span className="text-primary">PIRATAS</span>
          </span>
        </Link>

        {/* Nav Desktop */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-['Evogria']">
          <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">Catálogo</Link>
          <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">Novidades</Link>
          {isAdmin && (
            <Link to="/admin" className="text-primary hover:text-primary/80 transition-colors flex items-center gap-1">
              <Shield className="w-3.5 h-3.5" /> Admin
            </Link>
          )}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-secondary transition-all duration-300"
            title={theme === "dark" ? "Tema claro" : "Tema escuro"}
          >
            {theme === "dark" ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-muted-foreground" />}
          </button>

          {/* Cart */}
          <button onClick={() => setIsOpen(true)} className="relative p-2 rounded-lg hover:bg-secondary transition-colors">
            <ShoppingCart className="w-5 h-5" />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">{count}</span>
            )}
          </button>

          {/* Acessar Dropdown */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="px-4 py-2 rounded-lg hover:bg-primary hover:shadow-[0_0_15px_hsl(1_76%_55%/0.5)] transition-all font-bold text-sm flex items-center gap-1 font-['Evogria']"
            >
              {user ? (profile?.display_name || user.email || "Usuário") : "Acessar"} <ChevronDown className="w-3.5 h-3.5" />
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-full mt-3 bg-popover border border-border rounded-xl w-48 shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                {user ? (
                  <>
                    {isAdmin && (
                      <Link to="/admin" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-4 py-3 hover:bg-primary/10 transition-colors text-sm border-b border-border">
                        <Shield className="w-4 h-4 text-primary" /> Painel Admin
                      </Link>
                    )}
                    <Link to="/perfil" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-4 py-3 hover:bg-primary/10 transition-colors text-sm border-b border-border">
                      <UserPlus className="w-4 h-4" /> Meu Perfil
                    </Link>
                    <button onClick={() => { logout(); setMenuOpen(false); }} className="flex items-center gap-2 px-4 py-3 hover:bg-primary/10 transition-colors text-sm w-full text-left">
                      <LogOut className="w-4 h-4" /> Sair
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-4 py-3 hover:bg-primary/10 transition-colors text-sm border-b border-border">
                      <LogIn className="w-4 h-4" /> Login
                    </Link>
                    <Link to="/cadastro" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-4 py-3 hover:bg-primary/10 transition-colors text-sm">
                      <UserPlus className="w-4 h-4" /> Registrar
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button className="p-2 rounded-lg hover:bg-secondary transition-colors md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-popover px-4 py-4 space-y-3 font-['Evogria']">
          <Link to="/" className="block text-muted-foreground hover:text-foreground" onClick={() => setMobileOpen(false)}>Catálogo</Link>
          <Link to="/" className="block text-muted-foreground hover:text-foreground" onClick={() => setMobileOpen(false)}>Novidades</Link>
          {isAdmin && <Link to="/admin" className="block text-primary" onClick={() => setMobileOpen(false)}>Painel Admin</Link>}
          {!user ? (
            <>
              <Link to="/login" className="block text-muted-foreground hover:text-foreground" onClick={() => setMobileOpen(false)}>Login</Link>
              <Link to="/cadastro" className="block text-muted-foreground hover:text-foreground" onClick={() => setMobileOpen(false)}>Registrar</Link>
            </>
          ) : (
            <>
              <Link to="/perfil" className="block text-muted-foreground hover:text-foreground" onClick={() => setMobileOpen(false)}>Meu Perfil</Link>
              <button onClick={() => { logout(); setMobileOpen(false); }} className="block text-muted-foreground hover:text-foreground">Sair</button>
            </>
          )}
        </div>
      )}
    </header>
  );
}
