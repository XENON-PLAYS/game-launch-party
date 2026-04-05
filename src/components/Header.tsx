import { Link, useNavigate, useLocation } from "react-router-dom";
import { 
  Menu, 
  X, 
  ChevronDown, 
  LogOut, 
  LogIn, 
  UserPlus, 
  Shield, 
  User, 
  Trophy, 
  Search,
  MoreVertical,
  Home,
  Gamepad2,
  PlusCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { useAuth } from "@/context/AuthContext";
import { useState, useEffect, useRef } from "react";
import { OnlineUsers } from "./OnlineUsers";
import { GameRequestModal } from "./GameRequestModal";
import { BugReportModal } from "./BugReportModal";
import { optimizeImageUrl } from "@/lib/utils";
import { Button } from "./ui/button";
import logo from "@/assets/logo.png";


export function Header() {
  const { user, profile, logout, isAdmin } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
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
  const [isBugModalOpen, setIsBugModalOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const navLinks = [
    { label: "Início", path: "/", icon: Home },
    { label: "Jogos", path: "/", icon: Gamepad2 },
    { label: "Pedir Jogo", onClick: () => user ? setIsRequestModalOpen(true) : navigate("/login"), icon: PlusCircle },
  ];

  return (
    <header className="sticky top-0 z-[100] bg-background/60 backdrop-blur-2xl border-b border-white/5 py-4 transition-all duration-500 shadow-xl shadow-black/20">
      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-60" />
      <div className="container-responsive flex items-center justify-between gap-6 md:gap-10 relative">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group shrink-0">
          <img 
            src={logo} 
            alt="Site Logo" 
            className="h-8 md:h-9 w-auto object-contain" 
          />
          <div className="flex flex-col">
            <span className="text-sm font-black text-primary tracking-tighter">JOGOS PIRATAS VIPS</span>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">JOGADORES ONLINE</span>
              <OnlineUsers />
            </div>
          </div>
        </Link>

        {/* Search Bar - Removed from Header */}

        {/* Desktop Navigation & Actions */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8">
          <nav className="flex items-center gap-6 lg:gap-8">
            {navLinks.map((link) => (
              link.path ? (
                <Link 
                  key={link.label}
                  to={link.path} 
                  className={`text-[11px] font-bold uppercase tracking-wider transition-all duration-300 relative group py-2 ${
                    location.pathname === link.path ? "text-primary" : "text-muted-foreground hover:text-primary"
                  }`}
                >
                  {link.label}
                  <span className={`absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300 ${
                    location.pathname === link.path ? "w-full" : "w-0 group-hover:w-full"
                  }`} />
                </Link>
              ) : (
                <button 
                  key={link.label}
                  onClick={link.onClick}
                  className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground hover:text-primary transition-all duration-300 relative group py-2"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
                </button>
              )
            ))}
            
            {/* Discord Removed */}
          </nav>

          <div className="flex items-center gap-4 border-l border-border/40 pl-6 lg:pl-8">
            <div className="relative" ref={menuRef}>

              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-3 p-1 rounded-full bg-card/40 hover:bg-card/60 border border-border/50 backdrop-blur-xl transition-all duration-300 group"
              >
                <div className="w-8 h-8 rounded-full overflow-hidden bg-muted flex items-center justify-center border border-border group-hover:border-primary/40 transition-all duration-300">
                  {profile?.avatar_url ? (
                    <img src={optimizeImageUrl(profile.avatar_url, 64)} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  )}
                </div>
                {user && (
                  <span className="hidden lg:inline-block max-w-[100px] truncate text-[10px] font-black uppercase tracking-widest text-foreground/80 group-hover:text-foreground pr-2">
                    {profile?.display_name || user.email?.split("@")[0]}
                  </span>
                )}
                {!user && (
                  <span className="hidden lg:inline-block text-[10px] font-black uppercase tracking-widest text-foreground/80 group-hover:text-foreground pr-4 pl-1">
                    Entrar
                  </span>
                )}
                {user && <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform duration-500 mr-2 ${menuOpen ? "rotate-180 text-primary" : ""}`} />}
              </button>
              
              <AnimatePresence>
                {menuOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 top-full mt-3 bg-popover/90 backdrop-blur-xl border border-border rounded-xl w-60 shadow-2xl z-50 p-2"
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
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-3 md:hidden">
          <button 
            className="p-2.5 rounded-xl bg-card/40 border border-border/50 text-foreground hover:bg-card/60 transition-all" 
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <MoreVertical className="w-5 h-5" />}
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
            className="md:hidden border-t border-border bg-background/95 backdrop-blur-xl overflow-hidden"
          >
            <div className="py-6 px-6 space-y-6 flex flex-col">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input 
                  type="text" 
                  placeholder="Procurar jogos..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:border-primary" 
                />
              </form>

              <div className="space-y-4">
                {navLinks.map((link) => (
                  link.path ? (
                    <Link 
                      key={link.label}
                      to={link.path} 
                      className="flex items-center gap-3 text-sm font-bold text-muted-foreground hover:text-primary transition-colors"
                      onClick={() => setMobileOpen(false)}
                    >
                      <link.icon className="w-4 h-4" />
                      {link.label}
                    </Link>
                  ) : (
                    <button 
                      key={link.label}
                      onClick={() => { link.onClick?.(); setMobileOpen(false); }}
                      className="flex items-center gap-3 text-sm font-bold text-muted-foreground hover:text-primary transition-colors w-full text-left"
                    >
                      <link.icon className="w-4 h-4" />
                      {link.label}
                    </button>
                  )
                ))}
                {/* Discord Removed */}
              </div>
              
              <div className="h-px bg-border w-full"></div>
              
              {!user ? (
                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" asChild onClick={() => setMobileOpen(false)} className="rounded-xl">
                    <Link to="/login">Entrar</Link>
                  </Button>
                  <Button asChild onClick={() => setMobileOpen(false)} className="rounded-xl">
                    <Link to="/cadastro">Registrar</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <Link to="/perfil" className="flex items-center gap-3 text-sm font-bold" onClick={() => setMobileOpen(false)}>
                    <User className="w-4 h-4" /> Perfil
                  </Link>
                  <button onClick={() => { logout(); setMobileOpen(false); }} className="flex items-center gap-3 text-sm font-bold text-destructive">
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
      
      <BugReportModal 
        isOpen={isBugModalOpen} 
        onClose={() => setIsBugModalOpen(false)}
        gameId="general"
        gameName="Geral"
      />
    </header>
  );
}
