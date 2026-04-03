import { useState, useEffect, useRef } from "react";
import { 
  X, 
  Upload, 
  Plus, 
  Trash2, 
  Loader2, 
  Link as LinkIcon, 
  Monitor, 
  Image as ImageIcon, 
  Save,
  Gamepad2,
  Info,
  Settings,
  Download,
  Terminal,
  FileText
} from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { RequirementsEditor } from "@/components/RequirementsEditor";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { toast } from "sonner";
import imageCompression from "browser-image-compression";

type Game = Tables<"games">;
type DownloadLink = Tables<"download_links">;

interface GameFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "add" | "edit";
  game: Partial<Game> | null;
  onSuccess: () => void;
}

export function GameFormModal({ isOpen, onClose, mode, game, onSuccess }: GameFormModalProps) {
  const [formData, setFormData] = useState<Partial<Game>>({});
  const [links, setLinks] = useState<Partial<DownloadLink>[]>([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (game) {
      setFormData(game);
      if (mode === "edit" && game.id) {
        fetchLinks(game.id);
      } else {
        setLinks([]);
      }
    }
  }, [game, mode]);

  const fetchLinks = async (gameId: string) => {
    const { data, error } = await supabase
      .from("download_links")
      .select("*")
      .eq("game_id", gameId);
    if (!error && data) setLinks(data);
  };

  const handleFieldChange = (field: keyof Game, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayToggle = (field: "categorias" | "modos" | "idiomas", value: string) => {
    const current = (formData[field] as string[]) || [];
    if (current.includes(value)) {
      handleFieldChange(field, current.filter(v => v !== value));
    } else {
      handleFieldChange(field, [...current, value]);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: keyof Game | "galeria") => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Apenas imagens (JPEG, PNG, WebP) são permitidas.");
      return;
    }

    setUploading(true);
    try {
      const options = { maxSizeMB: 1, maxWidthOrHeight: 1920, useWebWorker: true };
      const compressedFile = await imageCompression(file, options);
      
      const fileExt = "webp";
      const filePath = `games/${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage.from("game-images").upload(filePath, compressedFile);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from("game-images").getPublicUrl(filePath);

      if (field === "galeria") {
        setFormData(prev => ({ ...prev, galeria: [...(prev.galeria || []), publicUrl] }));
      } else {
        handleFieldChange(field as keyof Game, publicUrl);
      }
      toast.success("Upload concluído com sucesso!");
    } catch (error: any) {
      toast.error(`Erro no upload: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.nome) {
      toast.error("O nome do jogo é obrigatório.");
      return;
    }

    setSaving(true);
    try {
      // Generate slug if missing
      const finalData = { ...formData };
      if (!finalData.slug && finalData.nome) {
        finalData.slug = finalData.nome
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-");
      }

      let gameId = finalData.id;

      if (mode === "add") {
        const { data, error } = await supabase.from("games").insert(finalData as any).select().single();
        if (error) throw error;
        gameId = data.id;
      } else {
        const { error } = await supabase.from("games").update(finalData as any).eq("id", finalData.id!);
        if (error) throw error;
      }

      // Sync links
      if (gameId) {
        await supabase.from("download_links").delete().eq("game_id", gameId);
        if (links.length > 0) {
          const linksToInsert = links.map(l => ({
            game_id: gameId,
            label: l.label || "Download",
            url: l.url || "",
            status: l.status === "Ativo" || !l.status ? "online" : l.status,
            click_count: l.click_count || 0
          }));
          const { error: linksError } = await supabase.from("download_links").insert(linksToInsert);
          if (linksError) throw linksError;
        }
      }

      toast.success(`Jogo ${mode === "add" ? "adicionado" : "atualizado"} com sucesso!`);
      onSuccess();
    } catch (error: any) {
      toast.error(`Erro ao salvar: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const addLink = () => setLinks([...links, { label: "Direct Download", url: "", status: "online" }]);
  const updateLink = (index: number, field: keyof DownloadLink, value: any) => {
    const newLinks = [...links];
    newLinks[index] = { ...newLinks[index], [field]: value };
    setLinks(newLinks);
  };
  const removeLink = (index: number) => setLinks(links.filter((_, i) => i !== index));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl h-[90vh] flex flex-col p-0 overflow-hidden border-border/40 bg-card/95 backdrop-blur-2xl">
        <DialogHeader className="p-8 border-b border-border/40 bg-muted/30">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
              {mode === "add" ? <Plus className="w-8 h-8" /> : <Settings className="w-8 h-8" />}
            </div>
            <div>
              <DialogTitle className="text-2xl font-black uppercase tracking-tighter">
                {mode === "add" ? "Cadastrar Novo" : "Configurar"} <span className="text-primary">Título</span>
              </DialogTitle>
              <DialogDescription className="text-xs font-bold uppercase tracking-[0.2em] opacity-60">
                Central de gerenciamento de metadados de JOGOS GRATIS
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
          <div className="w-full lg:w-64 border-b lg:border-b-0 lg:border-r border-border/40 bg-muted/20 p-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} orientation="vertical" className="w-full">
              <TabsList className="flex lg:flex-col items-stretch bg-transparent gap-2 h-auto p-0">
                {[
                  { id: "general", icon: Info, label: "Geral" },
                  { id: "media", icon: ImageIcon, label: "Mídia" },
                  { id: "requirements", icon: Monitor, label: "Hardware" },
                  { id: "downloads", icon: Download, label: "Downloads" },
                  { id: "installation", icon: Terminal, label: "Setup" },
                ].map((tab) => (
                  <TabsTrigger 
                    key={tab.id} 
                    value={tab.id}
                    className="justify-start gap-3 h-12 px-4 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-black uppercase tracking-widest text-[10px] transition-all"
                  >
                    <tab.icon className="h-4 w-4" />
                    <span className="hidden lg:inline">{tab.label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          <div className="flex-1 overflow-hidden relative bg-card/30">
            <ScrollArea className="h-full p-8">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsContent value="general" className="mt-0 space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Nome do Título</Label>
                      <Input 
                        value={formData.nome || ""} 
                        onChange={(e) => handleFieldChange("nome", e.target.value)} 
                        className="h-12 rounded-xl bg-background/50" 
                        placeholder="Ex: Cyberpunk 2077"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Preço (0 para Grátis)</Label>
                      <Input 
                        type="number" 
                        value={formData.preco || 0} 
                        onChange={(e) => handleFieldChange("preco", parseFloat(e.target.value))} 
                        className="h-12 rounded-xl bg-background/50 font-mono"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Desenvolvedor</Label>
                      <Input 
                        value={formData.desenvolvedor || ""} 
                        onChange={(e) => handleFieldChange("desenvolvedor", e.target.value)} 
                        className="h-12 rounded-xl bg-background/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Distribuidor</Label>
                      <Input 
                        value={formData.distribuidor || ""} 
                        onChange={(e) => handleFieldChange("distribuidor", e.target.value)} 
                        className="h-12 rounded-xl bg-background/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Data de Lançamento</Label>
                      <Input 
                        type="date" 
                        value={formData.lancamento || ""} 
                        onChange={(e) => handleFieldChange("lancamento", e.target.value)} 
                        className="h-12 rounded-xl bg-background/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Tamanho da Instalação</Label>
                      <Input 
                        value={formData.tamanho || ""} 
                        onChange={(e) => handleFieldChange("tamanho", e.target.value)} 
                        placeholder="Ex: 70 GB"
                        className="h-12 rounded-xl bg-background/50"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Categorias</Label>
                    <div className="flex flex-wrap gap-2">
                      {["FPS", "RPG", "Ação", "Terror", "Aventura", "Multiplayer", "Estratégia", "Simulação", "Mundo Aberto", "Indie"].map(cat => (
                        <Badge 
                          key={cat} 
                          variant={formData.categorias?.includes(cat) ? "default" : "outline"}
                          className="cursor-pointer px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all"
                          onClick={() => handleArrayToggle("categorias", cat)}
                        >
                          {cat}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Descrição Detalhada</Label>
                    <Textarea 
                      value={formData.descricao || ""} 
                      onChange={(e) => handleFieldChange("descricao", e.target.value)} 
                      className="min-h-[200px] rounded-2xl bg-background/50 resize-none"
                      placeholder="Descreva a experiência épica que este jogo oferece..."
                    />
                  </div>
                </TabsContent>

                <TabsContent value="media" className="mt-0 space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Capa do Jogo (3:4)</Label>
                      <div 
                        className="aspect-[3/4] rounded-2xl border-2 border-dashed border-border/40 bg-muted/20 flex flex-col items-center justify-center relative overflow-hidden group hover:border-primary/40 transition-all cursor-pointer"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        {formData.imagem ? (
                          <>
                            <img src={formData.imagem} className="w-full h-full object-cover" alt="" />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <Upload className="h-10 w-10 text-white" />
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                              <Upload className="h-8 w-8" />
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Clique para Upload</p>
                          </>
                        )}
                        <input 
                          type="file" 
                          ref={fileInputRef} 
                          className="hidden" 
                          onChange={(e) => handleImageUpload(e, "imagem")} 
                          accept="image/*" 
                        />
                      </div>
                    </div>

                    <div className="space-y-8">
                      <div className="space-y-4">
                        <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Trailer URL (YouTube)</Label>
                        <div className="relative group">
                          <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary" />
                          <Input 
                            value={formData.trailer_url || ""} 
                            onChange={(e) => handleFieldChange("trailer_url", e.target.value)} 
                            className="pl-12 h-12 rounded-xl bg-background/50" 
                            placeholder="https://www.youtube.com/watch?v=..."
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Hero Image (Banner 21:9)</Label>
                        <div className="aspect-[21/9] rounded-2xl border-2 border-dashed border-border/40 bg-muted/20 relative overflow-hidden">
                          {formData.hero_image ? (
                            <img src={formData.hero_image} className="w-full h-full object-cover" alt="" />
                          ) : (
                            <div className="flex flex-col items-center justify-center h-full">
                              <ImageIcon className="h-10 w-10 text-muted-foreground/30 mb-2" />
                              <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Banner Principal</p>
                            </div>
                          )}
                        </div>
                        <Input type="text" placeholder="URL ou deixe em branco" value={formData.hero_image || ""} onChange={(e) => handleFieldChange("hero_image", e.target.value)} className="rounded-xl h-10 text-xs" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Galeria de Imagens</Label>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8 rounded-lg text-[10px] font-black uppercase tracking-widest gap-2"
                        onClick={() => {
                          const url = prompt("Insira a URL da imagem para a galeria:");
                          if (url) {
                            setFormData(prev => ({ ...prev, galeria: [...(prev.galeria || []), url] }));
                          }
                        }}
                      >
                        <Plus className="h-3 w-3" /> Adicionar URL
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {formData.galeria?.map((url, i) => (
                        <div key={i} className="aspect-video rounded-xl border border-border/50 overflow-hidden relative group">
                          <img src={url} className="w-full h-full object-cover" alt="" />
                          <button 
                            className="absolute top-2 right-2 p-1.5 bg-destructive rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => {
                              const newGaleria = [...(formData.galeria || [])];
                              newGaleria.splice(i, 1);
                              handleFieldChange("galeria", newGaleria);
                            }}
                          >
                            <Trash2 className="h-3 w-3 text-white" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="requirements" className="mt-0 space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                  <RequirementsEditor 
                    label="Requisitos Mínimos" 
                    initialValue={formData.requisitos_minimo} 
                    onChange={(val) => handleFieldChange("requisitos_minimo", val)} 
                  />
                  <RequirementsEditor 
                    label="Requisitos Recomendados" 
                    initialValue={formData.requisitos_recomendado} 
                    onChange={(val) => handleFieldChange("requisitos_recomendado", val)} 
                  />
                </TabsContent>

                <TabsContent value="downloads" className="mt-0 space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h4 className="text-sm font-black uppercase tracking-tighter">Links de Download</h4>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">Configure múltiplos espelhos e servidores</p>
                    </div>
                    <Button onClick={addLink} className="rounded-xl font-black uppercase tracking-widest text-[10px] h-10 gap-2">
                      <Plus className="h-4 w-4" /> Novo Link
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {links.map((link, i) => (
                      <div key={i} className="p-6 rounded-2xl border border-border/40 bg-muted/10 space-y-4 relative group">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-[9px] font-black uppercase tracking-widest opacity-60">Nome do Servidor</Label>
                            <Input 
                              value={link.label || ""} 
                              onChange={(e) => updateLink(i, "label", e.target.value)} 
                              placeholder="Ex: Google Drive"
                              className="rounded-xl h-11 bg-background"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-[9px] font-black uppercase tracking-widest opacity-60">URL do Download</Label>
                            <Input 
                              value={link.url || ""} 
                              onChange={(e) => updateLink(i, "url", e.target.value)} 
                              placeholder="https://..."
                              className="rounded-xl h-11 bg-background font-mono text-xs"
                            />
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="absolute top-2 right-2 h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                          onClick={() => removeLink(i)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}

                    {links.length === 0 && (
                      <div className="py-20 border-2 border-dashed border-border/40 rounded-3xl flex flex-col items-center justify-center text-center px-6">
                        <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
                          <Download className="h-8 w-8 text-muted-foreground/30" />
                        </div>
                        <h5 className="font-black uppercase tracking-tight mb-1">Nenhum link ativo</h5>
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest opacity-60 max-w-xs">Adicione links de download para que os usuários possam acessar o jogo.</p>
                      </div>
                    )}
                    <div className="pt-4 border-t border-border/40">
                      <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">URL da Demo (Opcional)</Label>
                      <div className="relative group mt-2">
                        <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary" />
                        <Input 
                          value={formData.link_demo || ""} 
                          onChange={(e) => handleFieldChange("link_demo", e.target.value)} 
                          className="pl-12 h-12 rounded-xl bg-background/50" 
                          placeholder="https://..."
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="installation" className="mt-0 space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest opacity-60 flex items-center gap-2">
                        <FileText className="h-3 w-3" /> Pré-requisitos do Sistema
                      </Label>
                      <Textarea 
                        value={formData.pre_requisitos || ""} 
                        onChange={(e) => handleFieldChange("pre_requisitos", e.target.value)} 
                        className="min-h-[120px] rounded-2xl bg-background/50"
                        placeholder="Ex: Instalar Visual C++, DirectX, etc."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest opacity-60 flex items-center gap-2">
                        <Terminal className="h-3 w-3" /> Passo a Passo da Instalação
                      </Label>
                      <Textarea 
                        value={formData.passo_a_passo || ""} 
                        onChange={(e) => handleFieldChange("passo_a_passo", e.target.value)} 
                        className="min-h-[150px] rounded-2xl bg-background/50"
                        placeholder="1. Extraia o arquivo\n2. Execute o setup.exe..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Observações Importantes</Label>
                      <Textarea 
                        value={formData.observacoes || ""} 
                        onChange={(e) => handleFieldChange("observacoes", e.target.value)} 
                        className="min-h-[100px] rounded-2xl bg-background/50"
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </ScrollArea>
          </div>
        </div>

        <DialogFooter className="p-8 border-t border-border/40 bg-muted/30">
          <div className="flex items-center justify-between w-full">
            <div className="hidden md:flex items-center gap-4">
              {uploading && (
                <div className="flex items-center gap-2 text-primary font-black uppercase tracking-widest text-[10px] animate-pulse">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Transmitindo Dados...
                </div>
              )}
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <Button variant="ghost" onClick={onClose} className="flex-1 md:flex-none h-12 px-8 rounded-xl font-black uppercase tracking-widest text-xs">
                Cancelar
              </Button>
              <Button 
                onClick={handleSave} 
                disabled={saving || uploading}
                className="flex-1 md:flex-none h-12 px-10 rounded-xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 gap-3"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {mode === "add" ? "Registrar Jogo" : "Salvar Alterações"}
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
