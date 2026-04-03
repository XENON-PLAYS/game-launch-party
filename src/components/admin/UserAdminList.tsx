import { useState, useMemo } from "react";
import { 
  Search, 
  User, 
  Shield, 
  Star, 
  Calendar,
  MoreVertical,
  Mail,
  CheckCircle2,
  XCircle,
  Filter,
  ChevronDown
} from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tables } from "@/integrations/supabase/types";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

type Profile = {
  id: string;
  user_id: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
  is_vip: boolean;
  created_at: string;
  role: string | null;
};

interface UserAdminListProps {
  users: Profile[];
}

export function UserAdminList({ users }: UserAdminListProps) {
  const [busca, setBusca] = useState("");
  const [filtroVip, setFiltroVip] = useState<"todos" | "vip" | "comum">("todos");

  const filteredUsers = useMemo(() => {
    let result = [...users];
    if (busca) {
      result = result.filter((u) => 
        u.display_name?.toLowerCase().includes(busca.toLowerCase()) || 
        u.username?.toLowerCase().includes(busca.toLowerCase())
      );
    }
    if (filtroVip === "vip") result = result.filter((u) => u.is_vip);
    if (filtroVip === "comum") result = result.filter((u) => !u.is_vip);
    
    return result;
  }, [users, busca, filtroVip]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h2 className="text-3xl font-black tracking-tighter uppercase">Gestão de <span className="text-primary">Usuários</span></h2>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest opacity-60">
            {users.length} membros registrados na plataforma
          </p>
        </div>
      </div>

      <Card className="border-border/40 bg-card/50 backdrop-blur-xl shadow-xl overflow-hidden">
        <CardContent className="p-0">
          <div className="p-6 border-b border-border/40 flex flex-col lg:flex-row gap-4 lg:items-center justify-between">
            <div className="flex flex-1 items-center gap-4">
              <div className="relative flex-1 max-w-md group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input 
                  placeholder="Buscar usuário por nick ou username..." 
                  value={busca} 
                  onChange={(e) => setBusca(e.target.value)}
                  className="pl-12 h-12 rounded-xl bg-background/50 border-border/50 focus:ring-primary/20"
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="h-12 rounded-xl gap-2 font-bold text-xs uppercase tracking-widest border-border/50">
                    <Filter className="h-4 w-4" />
                    <span>Status VIP</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48" align="start">
                  <DropdownMenuItem onClick={() => setFiltroVip("todos")} className="text-xs font-bold uppercase tracking-widest">Todos</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFiltroVip("vip")} className="text-xs font-bold uppercase tracking-widest">Apenas VIP</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFiltroVip("comum")} className="text-xs font-bold uppercase tracking-widest">Membros Comuns</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-border/40">
                  <TableHead className="w-[60px] text-[10px] font-black uppercase tracking-widest text-center">Avatar</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest">Nickname / Display Name</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest">Username</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-center">Status VIP</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest">Membro Desde</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id} className="group border-border/40 hover:bg-muted/30 transition-colors">
                    <TableCell>
                      <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/20 bg-secondary flex items-center justify-center mx-auto">
                        {user.avatar_url ? (
                          <img src={user.avatar_url} className="w-full h-full object-cover" alt="" />
                        ) : (
                          <User className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-black text-sm uppercase tracking-tight">
                      {user.display_name || "Sem Nickname"}
                    </TableCell>
                    <TableCell className="font-bold text-xs text-muted-foreground font-mono">
                      <div className="flex flex-col">
                        <span>@{user.username || "sem_username"}</span>
                        {user.role && (
                          <span className="text-[10px] text-primary font-black uppercase tracking-widest">{user.role}</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {user.is_vip ? (
                        <Badge className="bg-primary/10 text-primary border-primary/20 text-[9px] font-black uppercase tracking-widest">
                          <Star className="h-3 w-3 mr-1 fill-primary" />
                          VIP
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-[9px] font-black uppercase tracking-widest">
                          Membro
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-xs font-bold text-muted-foreground flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5" />
                      {format(new Date(user.created_at), "dd/MM/yyyy", { locale: ptBR })}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem className="text-xs font-bold uppercase tracking-widest cursor-pointer">
                            <Shield className="mr-2 h-3.5 w-3.5" />
                            <span>Ver Perfil</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-xs font-bold uppercase tracking-widest text-destructive focus:bg-destructive/10 cursor-pointer">
                            <XCircle className="mr-2 h-3.5 w-3.5" />
                            <span>Banir Usuário</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredUsers.length === 0 && (
              <div className="py-32 text-center space-y-4">
                <div className="inline-flex p-6 rounded-full bg-secondary/50 border border-border/50">
                  <Search className="h-12 w-12 text-muted-foreground/30" />
                </div>
                <div>
                  <h3 className="text-lg font-black uppercase tracking-tight">Nenhum usuário encontrado</h3>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest opacity-60">Tente ajustar seus termos de busca</p>
                </div>
                <Button variant="outline" onClick={() => setBusca("")} className="rounded-xl uppercase text-[10px] font-black tracking-widest h-10 px-6">
                  Limpar Busca
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
