import { 
  LayoutDashboard, 
  Gamepad2, 
  Users, 
  Shield,
  ExternalLink,
  PlusCircle,
  AlertTriangle
} from "lucide-react";

import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface SidebarItemProps {
  icon: any;
  label: string;
  href: string;
  active?: boolean;
}

const SidebarItem = ({ icon: Icon, label, href, active }: SidebarItemProps) => (
  <Link
    to={href}
    className={cn(
      "flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-300 group",
      active 
        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
    )}
  >
    <Icon className={cn("h-5 w-5 transition-transform duration-300", !active && "group-hover:scale-110")} />
    <span className="text-sm font-bold uppercase tracking-wider">{label}</span>
  </Link>
);

export function AdminSidebar() {
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
    { icon: Gamepad2, label: "Catálogo", href: "/admin?tab=games" },
    { icon: Users, label: "Usuários", href: "/admin?tab=users" },
    { icon: PlusCircle, label: "Pedidos", href: "/admin?tab=requests" },
    { icon: AlertTriangle, label: "Reportes", href: "/admin?tab=reports" },
  ];

  const isActive = (href: string) => {
    if (href === "/admin" && location.search === "") return true;
    return location.search.includes(href.split("?")[1]);
  };

  return (
    <aside className="fixed left-0 top-0 z-50 h-screen w-64 border-r border-border/10 bg-background/40 backdrop-blur-2xl hidden md:flex flex-col">
      <div className="p-6">
        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
            <Shield className="h-6 w-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-black tracking-tighter leading-none uppercase">ELITE</span>
            <span className="text-[10px] font-black tracking-[0.2em] text-primary uppercase">STUDIO</span>
          </div>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-2 py-4 overflow-y-auto">
        <p className="px-3 mb-4 text-[10px] font-black text-muted-foreground/50 uppercase tracking-[0.2em]">Principal</p>
        {menuItems.slice(0, 3).map((item) => (
          <SidebarItem 
            key={item.href} 
            {...item} 
            active={isActive(item.href)} 
          />
        ))}

        <p className="px-3 mt-8 mb-4 text-[10px] font-black text-muted-foreground/50 uppercase tracking-[0.2em]">Comunidade</p>
        {menuItems.slice(3).map((item) => (
          <SidebarItem 
            key={item.href} 
            {...item} 
            active={isActive(item.href)} 
          />
        ))}
      </nav>


      <div className="p-4 border-t border-border/40">
        <Link 
          to="/" 
          className="flex items-center justify-between w-full px-4 py-3 rounded-xl bg-secondary/50 text-xs font-bold hover:bg-secondary transition-all"
        >
          <span>Acessar Site</span>
          <ExternalLink className="h-3 w-3" />
        </Link>
      </div>
    </aside>
  );
}
