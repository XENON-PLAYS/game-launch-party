import { Store, LogOut, Shield, ChevronDown, User, Bell, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export function AdminHeader() {
  const { profile, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-border/10 bg-background/40 px-4 backdrop-blur-2xl md:px-6">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 md:hidden">
          <Shield className="h-6 w-6 text-primary" />
          <span className="text-lg font-bold">Admin</span>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <Link to="/" className="hidden md:flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
          <Store className="h-4 w-4" />
          <span>Voltar à Loja</span>
        </Link>
        
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 flex h-2 w-2 rounded-full bg-primary" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10 border border-border/50">
                <AvatarImage src={profile?.avatar_url || ""} alt={profile?.display_name || ""} />
                <AvatarFallback className="bg-primary/10 text-primary font-bold">
                  {profile?.display_name?.charAt(0).toUpperCase() || <User className="h-5 w-5" />}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{profile?.display_name || "Administrador"}</p>
                <p className="text-xs leading-none text-muted-foreground">{profile?.user_id ? "admin@elite.com" : "Carregando..."}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/perfil" className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Meu Perfil</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="md:hidden">
              <Link to="/" className="cursor-pointer">
                <Store className="mr-2 h-4 w-4" />
                <span>Voltar à Loja</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="text-destructive focus:bg-destructive/10 cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sair do Painel</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
