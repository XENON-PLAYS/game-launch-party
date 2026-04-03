import { useState, useMemo, useRef } from "react";
import { Link, Navigate } from "react-router-dom";
import { Plus, Pencil, Trash2, Search, X, Store, LogOut, ChevronDown, Download, Monitor, LayoutGrid, BarChart3, Clock, Flame, Shield, Users, Image as ImageIcon, Loader2, CheckCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Tables } from "@/integrations/supabase/types";
import { RequirementsEditor } from "@/components/RequirementsEditor";
import { toast } from "sonner";
import imageCompression from "browser-image-compression";

type Game = Tables<"games">;
type SortOption = "nome" | "preco_asc" | "preco_desc" | "downloads";

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
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [activeTab, setActiveTab] = useState<"general" | "requirements" | "downloads" | "gallery" | "installation">("general");
  const [links, setLinks] = useState<any[]>([]);

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
      if (ordenacao === "downloads") return b.download_count - a.download_count;
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

  const openAdd = () => { 
    setEditGame({ 
      categorias: [], 
      modos: [], 
      idiomas: [], 
      requisitos_minimo: {}, 
      requisitos_recomendado: {}, 
      destaques: [], 
      galeria: [] 
    }); 
    setLinks([]);
    setModalMode("add"); 
    setModalOpen(true); 
    setActiveTab("general");
  };

  const openEdit = async (game: Game) => { 
    setEditGame({ ...game }); 
    // Fetch links for this game
    const { data } = await supabase.from("download_links").select("*").eq("game_id", game.id);
    setLinks(data || []);
    setModalMode("edit"); 
    setModalOpen(true); 
    setActiveTab("general");
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: "imagem" | "galeria") => {
    const file = e.target.files?.[0];
    if (!file) return;

    // MIME type validation
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Apenas imagens (JPEG, PNG, WebP) são permitidas.");
      return;
    }

    setUploading(true);
    try {
      // Compress
      const options = { maxSizeMB: 1, maxWidthOrHeight: 1200, useWebWorker: true };
      const compressedFile = await imageCompression(file, options);
      
      const fileExt = "webp"; // Standardize extension
      const filePath = `covers/${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage.from("game-images").upload(filePath, compressedFile);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from("game-images").getPublicUrl(filePath);

      if (field === "imagem") {
        setEditGame(prev => ({ ...prev, imagem: publicUrl }));
      } else {
        setEditGame(prev => ({ ...prev, galeria: [...(prev.galeria || []), publicUrl] }));
      }
      toast.success("Upload concluído!");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setUploading(false);
    }
  };

  const deleteGame = (id: string, nome: string) => { if (confirm(`Eliminar "${nome}"?`)) deleteMutation.mutate(id); };
  const setField = (key: string, value: any) => setEditGame((p) => ({ ...p, [key]: value }));
  const formatPreco = (v: number) => (v === 0 ? "Gratuito" : `R$ ${v.toFixed(2).replace(".", ",")}`);

  const saveGame = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Auto-generate slug if missing
    if (!editGame.slug && editGame.nome) {
      editGame.slug = editGame.nome.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
    }

    try {
      // Cast editGame to any for insertion to avoid strict type issues with Partial
      const { data: gameData, error } = modalMode === "add" 
        ? await supabase.from("games").insert(editGame as any).select().single()
        : await supabase.from("games").update(editGame as any).eq("id", editGame.id!).select().single();

      if (error) throw error;

      // Save links
      if (gameData) {
        // Simple logic: delete old links and insert new ones for simplicity in this demo
        // In production, you'd want a more robust sync
        await supabase.from("download_links").delete().eq("game_id", gameData.id);
        if (links.length > 0) {
          await supabase.from("download_links").insert(
            links.map(l => ({ ...l, game_id: gameData.id, id: undefined }))
          );
        }
      }

      queryClient.invalidateQueries({ queryKey: ["admin-games"] });
      queryClient.invalidateQueries({ queryKey: ["games"] });
      setModalOpen(false);
      toast.success("Jogo salvo com sucesso!");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-popover/95 backdrop-blur-md border-b border-border">
        <div className="container-responsive h-16 flex items-center justify-between">
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

      <main className="container-responsive py-6">
        {/* Metrics Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary" /> Downloads por Jogo
            </h3>
            <div className="space-y-4">
              {[...games].sort((a, b) => b.download_count - a.download_count).slice(0, 5).map(g => (
                <div key={g.id} className="flex items-center justify-between gap-4">
                  <span className="text-sm font-bold truncate flex-1">{g.nome}</span>
                  <span className="text-xs px-2 py-1 rounded bg-secondary font-mono">{g.download_count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-yellow-500" /> Jogos Populares
            </h3>
            <div className="space-y-4">
              {[...games].sort((a, b) => b.download_count - a.download_count).slice(0, 3).map(g => (
                <div key={g.id} className="flex items-center gap-3">
                  <img src={g.imagem || ""} className="w-10 h-10 rounded object-cover" alt="" />
                  <div>
                    <p className="text-xs font-bold truncate">{g.nome}</p>
                    <p className="text-[10px] text-muted-foreground">{g.download_count} downloads</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500" /> Jogos Recentes
            </h3>
            <div className="space-y-4">
              {[...games].sort((a, b) => (b.created_at || "").localeCompare(a.created_at || "")).slice(0, 3).map(g => (
                <div key={g.id} className="flex items-center gap-3">
                  <img src={g.imagem || ""} className="w-10 h-10 rounded object-cover" alt="" />
                  <div>
                    <p className="text-xs font-bold truncate">{g.nome}</p>
                    <p className="text-[10px] text-muted-foreground">Adicionado em {new Date(g.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mb-6">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input type="text" placeholder="Buscar por nome..." value={busca} onChange={(e) => setBusca(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
          <select value={ordenacao} onChange={(e) => setOrdenacao(e.target.value as SortOption)} className="bg-card border border-border rounded-lg px-3 py-2.5 text-sm text-foreground">
            <option value="nome">Nome A-Z</option>
            <option value="preco_asc">Preço ↑</option>
            <option value="preco_desc">Preço ↓</option>
            <option value="downloads">Mais Baixados</option>
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

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
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
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-0 sm:p-4 animate-in fade-in duration-300" onClick={() => setModalOpen(false)}>
          <div className="bg-card border-x sm:border border-border rounded-none sm:rounded-[2rem] w-full max-w-4xl h-full sm:h-auto sm:max-h-[90vh] overflow-hidden flex flex-col shadow-3xl animate-in zoom-in-95 duration-300" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="p-6 sm:p-8 border-b border-border flex items-center justify-between bg-muted/30">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  {modalMode === "add" ? <Plus className="w-6 h-6" /> : <Pencil className="w-6 h-6" />}
                </div>
                <div>
                  <h2 className="text-xl font-black uppercase tracking-tight">{modalMode === "add" ? "Adicionar Novo Jogo" : "Editar Jogo"}</h2>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest opacity-60">Complete os detalhes do tesouro</p>
                </div>
              </div>
              <button onClick={() => setModalOpen(false)} className="p-3 hover:bg-muted rounded-xl transition-colors"><X className="w-6 h-6" /></button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-border bg-muted/10 px-6 sm:px-8">
              {[
                { id: "general", label: "Geral", icon: LayoutGrid },
                { id: "requirements", label: "Requisitos", icon: Monitor },
                { id: "downloads", label: "Links", icon: Download },
                { id: "gallery", label: "Mídia", icon: ImageIcon },
                { id: "installation", label: "Instalação", icon: CheckCircle }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-6 py-4 text-xs font-black uppercase tracking-widest transition-all border-b-2 ${activeTab === tab.id ? "border-primary text-primary bg-primary/5" : "border-transparent text-muted-foreground hover:text-foreground"}`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Modal Body */}
            <form id="admin-form" onSubmit={saveGame} className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8 bg-card/50">
              {activeTab === "general" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in slide-in-from-bottom-4 duration-500">
                  <div className="space-y-6">
                    <div>
                      <label className="admin-label">Nome do Jogo *</label>
                      <input required value={editGame.nome || ""} onChange={(e) => setField("nome", e.target.value)} placeholder="Grand Theft Auto V" className="admin-input" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="admin-label">Preço (R$) *</label>
                        <input type="number" step="0.01" min="0" required value={editGame.preco ?? ""} onChange={(e) => setField("preco", parseFloat(e.target.value) || 0)} className="admin-input" />
                      </div>
                      <div>
                        <label className="admin-label">Tamanho</label>
                        <input value={editGame.tamanho || ""} onChange={(e) => setField("tamanho", e.target.value)} placeholder="120 GB" className="admin-input" />
                      </div>
                    </div>
                    <div>
                      <label className="admin-label">Slug (URL)</label>
                      <input value={editGame.slug || ""} onChange={(e) => setField("slug", e.target.value)} placeholder="gta-v" className="admin-input" />
                    </div>
                    <div>
                      <label className="admin-label">Categorias (vírgula)</label>
                      <input value={editGame.categorias?.join(", ") || ""} onChange={(e) => setField("categorias", e.target.value.split(",").map(s => s.trim()).filter(Boolean))} className="admin-input" />
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <label className="admin-label">Descrição</label>
                      <textarea rows={6} value={editGame.descricao || ""} onChange={(e) => setField("descricao", e.target.value)} className="admin-input resize-none" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="admin-label">Lançamento</label>
                        <input type="date" value={editGame.lancamento || ""} onChange={(e) => setField("lancamento", e.target.value)} className="admin-input" />
                      </div>
                      <div>
                        <label className="admin-label">Desenvolvedor</label>
                        <input value={editGame.desenvolvedor || ""} onChange={(e) => setField("desenvolvedor", e.target.value)} className="admin-input" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "requirements" && (
                <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                  <RequirementsEditor 
                    label="Requisitos Mínimos"
                    initialValue={editGame.requisitos_minimo}
                    onChange={(v) => setField("requisitos_minimo", v)}
                  />
                  <RequirementsEditor 
                    label="Requisitos Recomendados"
                    initialValue={editGame.requisitos_recomendado}
                    onChange={(v) => setField("requisitos_recomendado", v)}
                  />
                </div>
              )}

              {activeTab === "installation" && (
                <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                  <div className="grid lg:grid-cols-2 gap-12">
                    <div className="space-y-6">
                      <div>
                        <label className="admin-label">Pré-requisitos / Dependências</label>
                        <textarea rows={4} value={editGame.pre_requisitos || ""} onChange={(e) => setField("pre_requisitos", e.target.value)} placeholder="Steam, DirectX 12, etc." className="admin-input resize-none" />
                      </div>
                      <div>
                        <label className="admin-label">Passo a Passo (separe por ;)</label>
                        <textarea rows={6} value={editGame.passo_a_passo || ""} onChange={(e) => setField("passo_a_passo", e.target.value)} placeholder="1. Baixar; 2. Instalar; 3. Jogar" className="admin-input resize-none" />
                      </div>
                    </div>
                    <div className="space-y-6">
                      <div>
                        <label className="admin-label">Link Demo / Teste</label>
                        <input value={editGame.link_demo || ""} onChange={(e) => setField("link_demo", e.target.value)} placeholder="https://store.steampowered.com/app/..." className="admin-input" />
                      </div>
                      <div>
                        <label className="admin-label">Observações (separe por ;)</label>
                        <textarea rows={6} value={editGame.observacoes || ""} onChange={(e) => setField("observacoes", e.target.value)} placeholder="Idioma: Português; Tamanho: 60GB; etc." className="admin-input resize-none" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "downloads" && (
                <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black uppercase tracking-widest text-primary">Links de Download</h3>
                    <button 
                      type="button" 
                      onClick={() => setLinks([...links, { label: "Servidor 1", url: "", status: "online", click_count: 0 }])}
                      className="px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary/20 transition-all"
                    >
                      Adicionar Link
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {links.map((link, idx) => (
                      <div key={idx} className="p-4 border border-border rounded-2xl bg-muted/20 flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Rótulo (ex: Google Drive)</label>
                          <input 
                            value={link.label} 
                            onChange={(e) => {
                              const newLinks = [...links];
                              newLinks[idx].label = e.target.value;
                              setLinks(newLinks);
                            }}
                            className="admin-input !py-2 !text-xs"
                          />
                        </div>
                        <div className="flex-[2] space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest opacity-60">URL do Tesouro</label>
                          <input 
                            value={link.url} 
                            onChange={(e) => {
                              const newLinks = [...links];
                              newLinks[idx].url = e.target.value;
                              setLinks(newLinks);
                            }}
                            className="admin-input !py-2 !text-xs"
                          />
                        </div>
                        <div className="w-full sm:w-32 space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Status</label>
                          <select 
                            value={link.status}
                            onChange={(e) => {
                              const newLinks = [...links];
                              newLinks[idx].status = e.target.value;
                              setLinks(newLinks);
                            }}
                            className="admin-input !py-2 !text-xs"
                          >
                            <option value="online">Online</option>
                            <option value="offline">Offline</option>
                          </select>
                        </div>
                        <div className="flex items-end">
                          <button 
                            type="button" 
                            onClick={() => setLinks(links.filter((_, i) => i !== idx))}
                            className="p-3 bg-destructive/10 text-destructive rounded-xl hover:bg-destructive/20 transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                    {links.length === 0 && (
                      <div className="p-12 text-center border-2 border-dashed border-border rounded-3xl opacity-40">
                        Nenhum link configurado para este jogo.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "gallery" && (
                <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label className="admin-label">Capa Principal</label>
                      <div 
                        className="aspect-[3/4] rounded-[2rem] border-4 border-dashed border-border bg-muted/20 flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-primary/50 transition-all overflow-hidden relative group"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        {editGame.imagem ? (
                          <>
                            <img src={editGame.imagem} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <ImageIcon className="w-12 h-12 text-white" />
                            </div>
                          </>
                        ) : (
                          <>
                            <ImageIcon className="w-12 h-12 text-muted-foreground opacity-30" />
                            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Clique para Upload</p>
                          </>
                        )}
                        {uploading && (
                          <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-20">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                          </div>
                        )}
                      </div>
                      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, "imagem")} />
                      <input value={editGame.imagem || ""} onChange={(e) => setField("imagem", e.target.value)} placeholder="Ou cole a URL..." className="admin-input !text-xs !py-2" />
                    </div>

                    <div className="space-y-4">
                      <label className="admin-label">Galeria de Screenshots</label>
                      <div className="grid grid-cols-2 gap-4">
                        {editGame.galeria?.map((img, idx) => (
                          <div key={idx} className="aspect-video rounded-xl border border-border overflow-hidden relative group">
                            <img src={img} className="w-full h-full object-cover" />
                            <button 
                              type="button" 
                              onClick={() => setEditGame(prev => ({ ...prev, galeria: prev.galeria?.filter((_, i) => i !== idx) }))}
                              className="absolute top-2 right-2 p-1.5 bg-destructive text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                        <div 
                          className="aspect-video rounded-xl border-2 border-dashed border-border flex items-center justify-center hover:border-primary/50 cursor-pointer transition-all"
                          onClick={() => {
                            const input = document.createElement('input');
                            input.type = 'file';
                            input.accept = 'image/*';
                            input.onchange = (e) => handleImageUpload(e as any, "galeria");
                            input.click();
                          }}
                        >
                          <Plus className="w-6 h-6 text-muted-foreground opacity-40" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="admin-label">Trailer (YouTube Embed URL)</label>
                        <input value={editGame.trailer_url || ""} onChange={(e) => setField("trailer_url", e.target.value)} placeholder="https://www.youtube.com/embed/..." className="admin-input" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </form>

            {/* Modal Footer */}
            <div className="p-6 sm:p-8 border-t border-border bg-muted/30 flex items-center justify-end gap-4">
              <button 
                type="button" 
                onClick={() => setModalOpen(false)} 
                className="px-8 py-3 rounded-xl font-bold text-sm uppercase tracking-widest text-muted-foreground hover:bg-muted transition-all"
              >
                Cancelar
              </button>
              <button 
                form="admin-form"
                type="submit" 
                disabled={uploading}
                className="px-12 py-3 rounded-xl bg-primary text-primary-foreground font-black uppercase tracking-[0.2em] text-sm hover:bg-primary/90 shadow-xl shadow-primary/20 transition-all active:scale-95 disabled:opacity-50"
              >
                {uploading ? "Aguarde..." : "Salvar Tesouro"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
