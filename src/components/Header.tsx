import { Link } from "react-router-dom";
import { ShoppingCart, Search, Moon, Sun, Menu, X, User } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useState } from "react";
import logo from "@/assets/logo.png";

export function Header() {
  const { count, setIsOpen } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-popover/95 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 shrink-0 group">
          <img src={logo} alt="Jogos Piratas" className="w-10 h-10 group-hover:scale-110 transition-transform" />
          <span className="font-['SuperSenior'] text-lg tracking-wide hidden sm:block">
            JOGOS<br className="leading-none" /><span className="text-primary">PIRATAS</span>
          </span>
        </Link>

        {/* Nav Desktop */}
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">Catálogo</Link>
          <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">Categorias</Link>
          <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">Novidades</Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsOpen(true)}
            className="relative p-2 rounded-lg hover:bg-secondary transition-colors"
          >
            <ShoppingCart className="w-5 h-5" />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {count}
              </span>
            )}
          </button>

          <button className="p-2 rounded-lg hover:bg-secondary transition-colors md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-popover px-4 py-4 space-y-3">
          <Link to="/" className="block text-muted-foreground hover:text-foreground" onClick={() => setMobileOpen(false)}>Catálogo</Link>
          <Link to="/" className="block text-muted-foreground hover:text-foreground" onClick={() => setMobileOpen(false)}>Categorias</Link>
          <Link to="/" className="block text-muted-foreground hover:text-foreground" onClick={() => setMobileOpen(false)}>Novidades</Link>
        </div>
      )}
    </header>
  );
}
