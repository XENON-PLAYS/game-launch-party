import { useState, useMemo } from "react";
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Search, 
  SlidersHorizontal, 
  LayoutGrid, 
  Table as TableIcon, 
  Eye, 
  MoreVertical,
  ChevronDown,
  Filter,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Copy
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
import { motion, AnimatePresence } from "framer-motion";

type Game = Tables<"games">;
type SortOption = "nome" | "preco_asc" | "preco_desc" | "downloads";

interface GameAdminListProps {
  games: Game[];
  onEdit: (game: Game) => void;
  onDelete: (id: string, name: string) => void;
  onAdd: () => void;
  onDuplicate: (game: Game) => void;
}

export function GameAdminList({ games, onEdit, onDelete, onAdd, onDuplicate }: GameAdminListProps) {
  const [busca, setBusca] = useState("");
  const [ordenacao, setOrdenacao] = useState<SortOption>("nome");
  const [filtroCategoria, setFiltroCategoria] = useState("todas");
  const [viewMode, setViewMode] = useState<"grid" | "table">("table");

  const allCategories = useMemo(() => 
    Array.from(new Set(games.flatMap((g) => g.categorias || []))).sort(), 
  [games]);

  const filteredGames = useMemo(() => {
    let result = [...games];
    if (busca) result = result.filter((g) => g.nome.toLowerCase().includes(busca.toLowerCase()));
    if (filtroCategoria !== "todas") result = result.filter((g) => g.categorias?.includes(filtroCategoria));
    
    result.sort((a, b) => {
      if (ordenacao === "preco_asc") return (a.preco || 0) - (b.preco || 0);
      if (ordenacao === "preco_desc") return (b.preco || 0) - (a.preco || 0);
      if (ordenacao === "downloads") return (b.download_count || 0) - (a.download_count || 0);
      return (a.nome || "").localeCompare(b.nome || "");
    });
    return result;
  }, [games, busca, ordenacao, filtroCategoria]);

  const formatPreco = (v: number) => (v === 0 ? "Gratuito" : `R$ ${v.toFixed(2).replace(".", ",")}`);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h2 className="text-3xl font-black tracking-tighter uppercase">Gestão de <span className="text-primary">Catálogo</span></h2>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest opacity-60">
            Gerencie {games.length} títulos no sistema
          </p>
        </div>
        <Button onClick={onAdd} className="h-12 px-8 rounded-xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 flex items-center gap-3">
          <Plus className="h-5 w-5" />
          <span>Novo Jogo</span>
        </Button>
      </div>

      <Card className="border-border/40 bg-card/50 backdrop-blur-xl shadow-xl overflow-hidden">
        <CardContent className="p-0">
          <div className="p-6 border-b border-border/40 flex flex-col lg:flex-row gap-4 lg:items-center justify-between">
            <div className="flex flex-1 items-center gap-4">
              <div className="relative flex-1 max-w-md group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input 
                  placeholder="Buscar jogo por nome..." 
                  value={busca} 
                  onChange={(e) => setBusca(e.target.value)}
                  className="pl-12 h-12 rounded-xl bg-background/50 border-border/50 focus:ring-primary/20"
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="h-12 rounded-xl gap-2 font-bold text-xs uppercase tracking-widest border-border/50">
                    <Filter className="h-4 w-4" />
                    <span>Filtros</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="start">
                  <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Categorias</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => setFiltroCategoria("todas")} className="text-xs font-bold uppercase tracking-widest">
                    Todas
                  </DropdownMenuItem>
                  {allCategories.map(cat => (
                    <DropdownMenuItem key={cat} onClick={() => setFiltroCategoria(cat)} className="text-xs font-bold uppercase tracking-widest">
                      {cat}
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Ordenação</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => setOrdenacao("nome")} className="text-xs font-bold uppercase tracking-widest">A - Z</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setOrdenacao("downloads")} className="text-xs font-bold uppercase tracking-widest">Popularidade</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setOrdenacao("preco_asc")} className="text-xs font-bold uppercase tracking-widest">Menor Preço</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setOrdenacao("preco_desc")} className="text-xs font-bold uppercase tracking-widest">Maior Preço</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex items-center gap-2 p-1 bg-secondary/50 rounded-xl">
              <Button 
                variant={viewMode === "table" ? "secondary" : "ghost"} 
                size="sm" 
                onClick={() => setViewMode("table")}
                className="rounded-lg h-9 w-9 p-0"
              >
                <TableIcon className="h-4 w-4" />
              </Button>
              <Button 
                variant={viewMode === "grid" ? "secondary" : "ghost"} 
                size="sm" 
                onClick={() => setViewMode("grid")}
                className="rounded-lg h-9 w-9 p-0"
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            {viewMode === "table" ? (
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-border/40">
                    <TableHead className="w-[80px] text-[10px] font-black uppercase tracking-widest">Capa</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest">Nome do Jogo</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest">Categorias</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-center">Downloads</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest">Preço</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest">Status</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence mode="popLayout">
                    {filteredGames.map((game) => (
                      <TableRow key={game.id} className="group border-border/40 hover:bg-muted/30 transition-colors">
                        <TableCell>
                          <div className="w-12 h-12 rounded-lg overflow-hidden border border-border/50 shadow-sm transition-transform group-hover:scale-110">
                            <img src={game.imagem || ""} className="w-full h-full object-cover" alt="" />
                          </div>
                        </TableCell>
                        <TableCell className="font-black text-sm uppercase tracking-tight max-w-[200px] truncate">
                          {game.nome}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {game.categorias?.slice(0, 2).map(cat => (
                              <Badge key={cat} variant="secondary" className="text-[9px] font-black uppercase tracking-widest bg-primary/10 text-primary border-primary/20">
                                {cat}
                              </Badge>
                            ))}
                            {(game.categorias?.length || 0) > 2 && (
                              <Badge variant="secondary" className="text-[9px] font-black uppercase tracking-widest">
                                +{game.categorias!.length - 2}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-center font-bold text-xs font-mono">
                          {game.download_count?.toLocaleString()}
                        </TableCell>
                        <TableCell className="font-black text-xs text-primary">
                          {formatPreco(game.preco)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-emerald-500">
                            <CheckCircle2 className="h-3 w-3" />
                            <span>Ativo</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40">
                              <DropdownMenuItem onClick={() => onEdit(game)} className="text-xs font-bold uppercase tracking-widest cursor-pointer">
                                <Pencil className="mr-2 h-3.5 w-3.5" />
                                <span>Editar</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => onDuplicate(game)} className="text-xs font-bold uppercase tracking-widest cursor-pointer">
                                <Copy className="mr-2 h-3.5 w-3.5" />
                                <span>Duplicar</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild className="text-xs font-bold uppercase tracking-widest cursor-pointer">
                                <a href={`/jogo/${game.slug}`} target="_blank" rel="noreferrer" className="flex items-center">
                                  <Eye className="mr-2 h-3.5 w-3.5" />
                                  <span>Visualizar</span>
                                </a>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => onDelete(game.id, game.nome)}
                                className="text-xs font-bold uppercase tracking-widest text-destructive focus:bg-destructive/10 cursor-pointer"
                              >
                                <Trash2 className="mr-2 h-3.5 w-3.5" />
                                <span>Excluir</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </AnimatePresence>
                </TableBody>
              </Table>
            ) : (
              <div className="p-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
                {filteredGames.map((game) => (
                  <motion.div 
                    layout
                    key={game.id} 
                    className="group bg-card/50 border border-border/50 rounded-2xl overflow-hidden hover:border-primary/40 transition-all shadow-lg hover:shadow-primary/5"
                  >
                    <div className="aspect-[4/3] overflow-hidden relative">
                      <img src={game.imagem || ""} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                        <div className="flex gap-2 w-full">
                          <Button 
                            variant="secondary" 
                            size="sm" 
                            className="flex-1 h-8 text-[10px] font-black uppercase tracking-widest rounded-lg"
                            onClick={() => onEdit(game)}
                          >
                            <Pencil className="h-3 w-3 mr-1" />
                            Editar
                          </Button>
                          <Button 
                            variant="secondary" 
                            size="sm" 
                            className="h-8 w-8 p-0 rounded-lg"
                            onClick={() => onDuplicate(game)}
                            title="Duplicar"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            className="h-8 w-8 p-0 rounded-lg"
                            onClick={() => onDelete(game.id, game.nome)}
                            title="Excluir"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 space-y-2">
                      <h3 className="font-black text-xs uppercase truncate tracking-tight">{game.nome}</h3>
                      <div className="flex items-center justify-between">
                        <span className="text-primary font-black text-xs">{formatPreco(game.preco)}</span>
                        <span className="text-[10px] font-bold text-muted-foreground uppercase">{game.download_count} DLs</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {filteredGames.length === 0 && (
              <div className="py-32 text-center space-y-4">
                <div className="inline-flex p-6 rounded-full bg-secondary/50 border border-border/50">
                  <Search className="h-12 w-12 text-muted-foreground/30" />
                </div>
                <div>
                  <h3 className="text-lg font-black uppercase tracking-tight">Nenhum jogo encontrado</h3>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest opacity-60">Tente ajustar seus termos de busca ou filtros</p>
                </div>
                <Button variant="outline" onClick={() => { setBusca(""); setFiltroCategoria("todas"); }} className="rounded-xl uppercase text-[10px] font-black tracking-widest h-10 px-6">
                  Limpar Filtros
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
