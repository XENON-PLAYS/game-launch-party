import { useState, useMemo } from "react";
import { Link, Navigate } from "react-router-dom";
import { Plus, Pencil, Trash2, Search, X, Store, LogOut, ChevronDown } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Tables } from "@/integrations/supabase/types";

type Game = Tables<"games">;
type SortOption = "nome" | "preco_asc" | "preco_desc";

const Admin = () => {
  const { user, logout, isAdmin, isLoading: authLoading } = useAuth();
  const queryClient = useQueryClient();
  const [busca, setBusca] = useState("");
  const [ordenacao, setOrdenacao] = useState<SortOption>("nome");
  const [filtroCategoria, setFiltroCategoria] = useState("todas");
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [editGame, setEditGame] = useState<Partial<Game>>({});

  const { data: games = [] } = useQuery({
    queryKey: ["admin-games"],
    queryFn: async () => {
      const { data } = await supabase.from("games").select("*").order("nome");
      return data ?? [];
    },
  });

  const allCategories = useMemo(() => Array.from(new Set(games.flatMap((g) => g.categorias))).sort(), [games]);

  const filteredGames = useMemo(() => {
    let result = games;
    if (busca) result = result.filter((g) => g.nome.toLowerCase().includes(busca.toLowerCase()));
    if (filtroCategoria !== "todas") result = result.filter((g) => g.categorias.includes(filtroCategoria));
    result = [...result].sort((a, b) => {
      if (ordenacao === "preco_asc") return a.preco - b.preco;
      if (ordenacao === "preco_desc") return b.preco - a.preco;
      return a.nome.localeCompare(b.nome);
    });
    return result;
  }, [games, busca, ordenacao, filtroCategoria]);

  const saveMutation = useMutation({
    mutationFn: async (game: Partial<Game>) => {
      if (modalMode === "add") {
        await supabase.from("games").insert({
          nome: game.nome || "",
          preco: game.preco || 0,
          imagem: game.imagem,
          categorias: game.categorias || [],
          modos: game.modos || [],
          idiomas: game.idiomas || [],
          classificacao: game.classificacao,
          descricao: game.descricao,
          desenvolvedor: game.desenvolvedor,
          distribuidor: game.distribuidor,
          lancamento: game.lancamento,
          destaques: game.destaques || [],
          trailer_url: game.trailer_url,
          requisitos_minimo: game.requisitos_minimo,
          requisitos_recomendado: game.requisitos_recomendado,
          tamanho: game.tamanho,
        });
      } else {
        await supabase.from("games").update({
          nome: game.nome,
          preco: game.preco,
          imagem: game.imagem,
          categorias: game.categorias,
          modos: game.modos,
          idiomas: game.idiomas,
          classificacao: game.classificacao,
          descricao: game.descricao,
          desenvolvedor: game.desenvolvedor,
          distribuidor: game.distribuidor,
          lancamento: game.lancamento,
          destaques: game.destaques,
          trailer_url: game.trailer_url,
          requisitos_minimo: game.requisitos_minimo,
          requisitos_recomendado: game.requisitos_recomendado,
          tamanho: game.tamanho,
        }).eq("id", game.id!);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-games"] });
      queryClient.invalidateQueries({ queryKey: ["games"] });
      setModalOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await supabase.from("games").delete().eq("id", id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-games"] });
      queryClient.invalidateQueries({ queryKey: ["games"] });
    },
  });

  if (authLoading) return null;
  if (!isAdmin) return <Navigate to="/login" replace />;

  const openAdd = () => { setEditGame({}); setModalMode("add"); setModalOpen(true); };
  const openEdit = (game: Game) => { setEditGame({ ...game }); setModalMode("edit"); setModalOpen(true); };
  const deleteGame = (id: string, nome: string) => { if (confirm(`Eliminar "${nome}"?`)) deleteMutation.mutate(id); };
  const setField = (key: string, value: any) => setEditGame((p) => ({ ...p, [key]: value }));
  const formatPreco = (v: number) => (v === 0 ? "Gratuito" : `R$ ${v.toFixed(2).replace(".", ",")}`);

  const saveGame = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate(editGame);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-popover/95 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="flex items-center gap-2 text-lg font-bold">
            <span className="text-primary">⚙</span> Painel Admin
          </h1>
          <div className="relative">
            <button onClick={() => setMenuOpen(!menuOpen)} className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-secondary transition-colors text-sm">
              Menu <ChevronDown className="w-4 h-4" />
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-full mt-2 bg-popover border border-border rounded-xl w-48 shadow-xl overflow-hidden z-50">
                <Link to="/" className="flex items-center gap-2 px-4 py-3 hover:bg-secondary transition-colors text-sm" onClick={() => setMenuOpen(false)}>
                  <Store className="w-4 h-4" /> Voltar à Loja
                </Link>
                <button onClick={() => { logout(); setMenuOpen(false); }} className="flex items-center gap-2 px-4 py-3 hover:bg-secondary transition-colors text-sm w-full text-left">
                  <LogOut className="w-4 h-4" /> Sair
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input type="text" placeholder="Buscar por nome..." value={busca} onChange={(e) => setBusca(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
          <select value={ordenacao} onChange={(e) => setOrdenacao(e.target.value as SortOption)} className="bg-card border border-border rounded-lg px-3 py-2.5 text-sm text-foreground">
            <option value="nome">Nome A-Z</option>
            <option value="preco_asc">Preço ↑</option>
            <option value="preco_desc">Preço ↓</option>
          </select>
          <select value={filtroCategoria} onChange={(e) => setFiltroCategoria(e.target.value)} className="bg-card border border-border rounded-lg px-3 py-2.5 text-sm text-foreground">
            <option value="todas">Todas Categorias</option>
            {allCategories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold">Jogos Registados ({filteredGames.length})</h2>
          <button onClick={openAdd} className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg font-bold text-sm hover:bg-primary/90 transition-colors">
            <Plus className="w-4 h-4" /> Novo Jogo
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredGames.map((game) => (
            <div key={game.id} className="bg-card border border-border rounded-xl overflow-hidden group">
              <div className="aspect-[4/3] overflow-hidden">
                <img src={game.imagem || ""} alt={game.nome} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              </div>
              <div className="p-4 space-y-2">
                <h3 className="font-bold text-sm truncate">{game.nome}</h3>
                <p className="text-primary font-bold text-sm">{formatPreco(game.preco)}</p>
                <p className="text-muted-foreground text-xs truncate">{game.categorias.join(", ") || "Sem categoria"}</p>
                <div className="flex gap-2 pt-2">
                  <button onClick={() => openEdit(game)} className="flex-1 flex items-center justify-center gap-1 bg-secondary hover:bg-secondary/80 text-foreground px-3 py-2 rounded-lg text-xs transition-colors">
                    <Pencil className="w-3 h-3" /> Editar
                  </button>
                  <button onClick={() => deleteGame(game.id, game.nome)} className="flex-1 flex items-center justify-center gap-1 bg-destructive/10 hover:bg-destructive/20 text-destructive px-3 py-2 rounded-lg text-xs transition-colors">
                    <Trash2 className="w-3 h-3" /> Excluir
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {modalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/70 flex items-center justify-center p-4" onClick={() => setModalOpen(false)}>
          <div className="bg-card border border-border rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-lg font-bold">{modalMode === "add" ? "Adicionar Novo Jogo" : "Editar Jogo"}</h2>
              <button onClick={() => setModalOpen(false)} className="p-1 hover:bg-secondary rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={saveGame} className="p-6 space-y-4">
              <div><label className="admin-label">Nome *</label><input required value={editGame.nome || ""} onChange={(e) => setField("nome", e.target.value)} placeholder="Grand Theft Auto V" className="admin-input" /></div>
              <div><label className="admin-label">Preço (R$) *</label><input type="number" step="0.01" min="0" required value={editGame.preco ?? ""} onChange={(e) => setField("preco", parseFloat(e.target.value) || 0)} placeholder="0" className="admin-input" /></div>
              <div><label className="admin-label">Categorias (vírgula)</label><input value={editGame.categorias?.join(", ") || ""} onChange={(e) => setField("categorias", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))} placeholder="Ação, RPG" className="admin-input" /></div>
              <div><label className="admin-label">Modos de Jogo</label><input value={editGame.modos?.join(", ") || ""} onChange={(e) => setField("modos", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))} placeholder="Singleplayer, Multiplayer" className="admin-input" /></div>
              <div><label className="admin-label">Idiomas</label><input value={editGame.idiomas?.join(", ") || ""} onChange={(e) => setField("idiomas", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))} placeholder="Português, Inglês" className="admin-input" /></div>
              <div><label className="admin-label">Classificação</label><input value={editGame.classificacao || ""} onChange={(e) => setField("classificacao", e.target.value)} placeholder="18+" className="admin-input" /></div>
              <div><label className="admin-label">Trailer (YouTube embed URL)</label><input value={editGame.trailer_url || ""} onChange={(e) => setField("trailer_url", e.target.value)} className="admin-input" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="admin-label">Lançamento</label><input type="date" value={editGame.lancamento || ""} onChange={(e) => setField("lancamento", e.target.value)} className="admin-input" /></div>
                <div><label className="admin-label">Desenvolvedor</label><input value={editGame.desenvolvedor || ""} onChange={(e) => setField("desenvolvedor", e.target.value)} className="admin-input" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="admin-label">Distribuidor</label><input value={editGame.distribuidor || ""} onChange={(e) => setField("distribuidor", e.target.value)} className="admin-input" /></div>
                <div><label className="admin-label">Tamanho</label><input value={editGame.tamanho || ""} onChange={(e) => setField("tamanho", e.target.value)} placeholder="120 GB" className="admin-input" /></div>
              </div>
              <div><label className="admin-label">Descrição</label><textarea rows={4} value={editGame.descricao || ""} onChange={(e) => setField("descricao", e.target.value)} className="admin-input resize-none" /></div>
              <div><label className="admin-label">Destaques (por linha)</label><textarea rows={3} value={editGame.destaques?.join("\n") || ""} onChange={(e) => setField("destaques", e.target.value.split("\n").filter(Boolean))} className="admin-input resize-none" /></div>
              <div><label className="admin-label">URL da Imagem</label><input value={editGame.imagem || ""} onChange={(e) => setField("imagem", e.target.value)} className="admin-input" /></div>
              {editGame.imagem && <img src={editGame.imagem} alt="Preview" className="max-w-full rounded-lg border border-border" />}
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setModalOpen(false)} className="flex-1 py-3 rounded-lg bg-secondary hover:bg-secondary/80 font-bold text-sm">Cancelar</button>
                <button type="submit" className="flex-1 py-3 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-sm">Salvar Jogo</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
