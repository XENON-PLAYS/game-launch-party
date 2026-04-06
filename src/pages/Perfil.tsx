import { useState, useRef, useEffect } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useQueryClient } from "@tanstack/react-query";
import { Header } from "@/components/Header";

import { supabase } from "@/integrations/supabase/client";
import { 
 Loader2, Camera, User, Check, AlertCircle, BadgeCheck, 
 History, Heart, Trophy, Sparkles, Moon, Sun, 
 Circle, Edit3, Save, X, ExternalLink
} from "lucide-react";
import { toast } from "sonner";
import imageCompression from "browser-image-compression";
import { GameCard } from "@/components/GameCard";

const Perfil = () => {
  const { user, profile, isLoading: authLoading, refreshProfile } = useAuth();
  const queryClient = useQueryClient();
  const { userId } = useParams();
  const { theme: currentTheme, setTheme } = useTheme();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [status, setStatus] = useState("offline");
  const [targetProfile, setTargetProfile] = useState<any>(null);
  const [viewLoading, setViewLoading] = useState(true);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
 const [themePreference, setThemePreference] = useState<"light" | "dark">("dark");
 
 const [loading, setLoading] = useState(false);
 const [uploading, setUploading] = useState(false);
 
 const [activeTab, setActiveTab] = useState<"settings" | "history" | "favorites" | "ranking" | "recommendations" | "profile">("settings");
 const [downloadHistory, setDownloadHistory] = useState<any[]>([]);
 const [favorites, setFavorites] = useState<any[]>([]);
 const [ranking, setRanking] = useState<any[]>([]);
 const [recommendations, setRecommendations] = useState<any[]>([]);
 const [loadingExtra, setLoadingExtra] = useState(false);

  useEffect(() => {
    const checkProfile = async () => {
      if (authLoading) return;

      if (!userId || (user && userId === user.id)) {
        setIsOwnProfile(true);
        setActiveTab("settings");
        if (profile) {
          setTargetProfile(profile);
          setUsername(profile.username || "");
          setDisplayName(profile.display_name || "");
          setBio(profile.bio || "");
          setStatus(profile.status || "offline");
          setThemePreference((profile.theme as "light" | "dark") || "dark");
          setViewLoading(false);
        }
        if (!user) navigate("/login");
      } else {
        setIsOwnProfile(false);
        setActiveTab("profile");
        setViewLoading(true);
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", userId)
          .single();
        
        if (error || !data) {
          toast.error("Usuário não encontrado");
          navigate("/");
          return;
        }
        setTargetProfile(data);
        setViewLoading(false);
      }
    };

    checkProfile();
  }, [userId, user, profile, authLoading, navigate]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("success") === "true") {
      toast.success("Pagamento realizado com sucesso! Seu status VIP será atualizado em instantes.", {
        duration: 5000,
        icon: <Trophy className="w-5 h-5 text-yellow-500" />
      });
      // Remove the query param from URL
      window.history.replaceState({}, document.title, window.location.pathname);
      // Refresh profile to see VIP status
      refreshProfile();
    }
  }, [refreshProfile]);

  useEffect(() => {
    if (isOwnProfile && user) {
      fetchExtraData();
    }
  }, [user, activeTab, isOwnProfile]);

 const fetchExtraData = async () => {
  if (!user) return;
  setLoadingExtra(true);
  try {
   if (activeTab === "history") {
    const { data } = await supabase
     .from("download_history")
     .select("*, games(*)")
     .eq("user_id", user.id)
     .order("created_at", { ascending: false });
    setDownloadHistory(data || []);
   } else if (activeTab === "favorites") {
    const { data } = await supabase
     .from("favorites")
     .select("*, games(*)")
     .eq("user_id", user.id)
     .order("created_at", { ascending: false });
    setFavorites(data || []);
   } else if (activeTab === "ranking") {
    const { data, error } = await supabase.rpc('get_user_ranking' as any);
    if (error) throw error;
    setRanking((data as any[]) || []);
   } else if (activeTab === "recommendations") {
    const { data } = await supabase
     .from("games")
     .select("*")
     .limit(4);
    setRecommendations(data || []);
   }
  } catch (error) {
   console.error("Error fetching extra data:", error);
  } finally {
   setLoadingExtra(false);
  }
 };

 const handleUpdateProfile = async (e: React.FormEvent) => {
   e.preventDefault();
   if (!user) return;

   setLoading(true);
   try {
    const { error } = await supabase.rpc("update_own_profile", {
      _user_id: user.id,
      _username: username || undefined,
      _display_name: displayName || undefined,
      _bio: bio || undefined,
      _status: status || undefined,
      _theme: themePreference || undefined,
    });

    if (error) throw error;
    
    // Update global theme if changed
    if (themePreference !== currentTheme) {
     setTheme(themePreference);
    }
    
    await refreshProfile();
    toast.success("Perfil atualizado com sucesso!");
   } catch (error: any) {
    console.error("Profile update error:", error);
    toast.error(error.message || "Erro ao atualizar perfil");
   } finally {
    setLoading(false);
   }
  };

 const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file || !user) return;

  // MIME type validation
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (!allowedTypes.includes(file.type)) {
   toast.error("Apenas imagens (JPEG, PNG, WebP, GIF) são permitidas.");
   return;
  }

  // Check size (5MB limit)
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
   toast.error("O arquivo deve ter no máximo 5MB");
   return;
  }

  setUploading(true);
  try {
   let fileToUpload = file;
   const isGif = file.type === "image/gif";

   // Compress if not GIF
   if (!isGif) {
    const options = {
     maxSizeMB: 1,
     maxWidthOrHeight: 1024,
     useWebWorker: true,
    };
    try {
     fileToUpload = await imageCompression(file, options);
    } catch (error) {
     console.error("Compression error:", error);
    }
   }

   const fileExt = isGif ? "gif" : "webp"; // Standardize extension
   const filePath = `${user.id}/${crypto.randomUUID()}.${fileExt}`;

   const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(filePath, fileToUpload);

   if (uploadError) throw uploadError;

   const { data: { publicUrl } } = supabase.storage
    .from("avatars")
    .getPublicUrl(filePath);

    const { error: updateError } = await supabase.rpc("update_own_profile", {
      _user_id: user.id,
      _avatar_url: publicUrl,
    });

    if (updateError) throw updateError;

   await refreshProfile();
   toast.success("Avatar atualizado!");
  } catch (error: any) {
   toast.error(error.message || "Erro ao fazer upload");
  } finally {
   setUploading(false);
  }
 };

  if (authLoading || viewLoading) {
   return (
    <div className="min-h-screen bg-background flex items-center justify-center">
     <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
   );
  }

  // Regra de privacidade: se o usuário estiver offline, bloquear visualização para terceiros
  if (!isOwnProfile && targetProfile?.status === 'offline') {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-12 flex flex-col items-center justify-center text-center space-y-6">
          <div className="p-8 rounded-3xl bg-card border border-border shadow-2xl max-w-md w-full animate-in fade-in zoom-in duration-300">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
              <User className="w-10 h-10 text-muted-foreground opacity-50" />
            </div>
            <h2 className="text-2xl font-black uppercase tracking-tight mb-2">Perfil Indisponível</h2>
            <p className="text-muted-foreground font-medium">Este usuário ativou o modo offline e seu perfil não está disponível no momento.</p>
            <div className="pt-6">
              <Link to="/" className="auth-btn px-8 inline-flex items-center gap-2">
                Voltar para o Início
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

 const isGifAvatar = targetProfile?.avatar_url?.toLowerCase().endsWith(".gif");

 const renderTabContent = () => {
  if (loadingExtra) {
   return (
    <div className="flex justify-center py-12">
     <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
   );
  }

  switch (activeTab) {
   case "profile":
    return (
      <div className="auth-fieldset p-8 bg-card/40 backdrop-blur-xl border-white/5 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors" />
        
        <h1 className="auth-title !text-left !mb-8 flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <User className="w-5 h-5 text-primary" />
          </div>
          Perfil do Jogador
        </h1>
        
        <div className="grid sm:grid-cols-2 gap-8 relative z-10">
          <div className="space-y-1 p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/70">Nome de Exibição</label>
            <p className="text-xl font-bold tracking-tight">{targetProfile?.display_name || "Nenhum nome definido"}</p>
          </div>
          
          <div className="space-y-1 p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/70">Identificação</label>
            <p className="text-xl font-bold tracking-tight text-muted-foreground">@{targetProfile?.username || "sem_usuario"}</p>
          </div>

          <div className="space-y-1 sm:col-span-2 p-6 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/70 mb-3 block">Sobre o Jogador</label>
            <p className="text-muted-foreground leading-relaxed italic">
              "{targetProfile?.bio || "Este usuário ainda não escreveu uma bio em sua jornada épica."}"
            </p>
          </div>
          
          <div className="flex items-center gap-4 sm:col-span-2 p-4 rounded-xl bg-primary/5 border border-primary/10">
            <div className="p-2 bg-primary/20 rounded-full">
              <Trophy className="w-4 h-4 text-primary" />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-primary/60">Data de Ingresso</label>
              <p className="text-sm font-bold">
                {targetProfile?.created_at ? new Date(targetProfile.created_at).toLocaleDateString("pt-BR", { day: 'numeric', month: 'long', year: 'numeric' }) : "Desconhecido"}
              </p>
            </div>
          </div>
        </div>
      </div>
    );

   case "settings":
    return (
     <div className="auth-fieldset p-8 bg-card/40 backdrop-blur-xl border-white/5 shadow-2xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 blur-3xl rounded-full -mr-24 -mt-24 group-hover:bg-primary/10 transition-colors" />
      
      <h1 className="auth-title !text-left !mb-8 flex items-center gap-3">
       <div className="p-2 bg-primary/10 rounded-lg">
        <Edit3 className="w-5 h-5 text-primary" />
       </div>
       Configurações de Conta
      </h1>
      
      <form onSubmit={handleUpdateProfile} className="space-y-8 relative z-10">
       <div className="grid sm:grid-cols-2 gap-8">
        <div className="space-y-2 group/input">
         <label className="auth-label group-focus-within/input:text-primary transition-colors flex items-center gap-2">
          Nome de Exibição
          <div className="h-px flex-1 bg-border/40 group-focus-within/input:bg-primary/20 transition-all" />
         </label>
         <input 
          type="text" 
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Como você quer ser chamado"
          className="auth-input bg-white/[0.03] border-white/5 focus:bg-white/[0.06] transition-all hover:border-white/20"
         />
        </div>
        
        <div className="space-y-2 group/input">
         <label className="auth-label group-focus-within/input:text-primary transition-colors flex items-center gap-2">
          Nome de Usuário (@)
          <div className="h-px flex-1 bg-border/40 group-focus-within/input:bg-primary/20 transition-all" />
         </label>
         <input 
          type="text" 
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="usuario_unico"
          className="auth-input bg-white/[0.03] border-white/5 focus:bg-white/[0.06] transition-all hover:border-white/20"
         />
        </div>

        <div className="space-y-2 sm:col-span-2 group/input">
         <label className="auth-label group-focus-within/input:text-primary transition-colors flex items-center gap-2">
          Bio (Conte um pouco sobre sua jornada)
          <div className="h-px flex-1 bg-border/40 group-focus-within/input:bg-primary/20 transition-all" />
         </label>
         <textarea 
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Conte um pouco sobre você..."
          className="auth-input min-h-[120px] resize-none bg-white/[0.03] border-white/5 focus:bg-white/[0.06] transition-all hover:border-white/20"
         />
        </div>

        <div className="space-y-3">
         <label className="auth-label flex items-center gap-2">
          Ambiente Visual
          <div className="h-px flex-1 bg-border/40" />
         </label>
         <div className="flex gap-3 p-1 bg-black/20 rounded-xl border border-white/5">
          <button
           type="button"
           onClick={() => setThemePreference("dark")}
           className={`flex-1 py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 border transition-all duration-300 ${themePreference === 'dark' ? 'border-primary/50 bg-primary/20 text-white shadow-inner' : 'border-transparent text-muted-foreground hover:bg-white/5'}`}
          >
           <Moon className="w-4 h-4" /> Escuro
          </button>
          <button
           type="button"
           onClick={() => setThemePreference("light")}
           className={`flex-1 py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 border transition-all duration-300 ${themePreference === 'light' ? 'border-primary/50 bg-primary/20 text-white shadow-inner' : 'border-transparent text-muted-foreground hover:bg-white/5'}`}
          >
           <Sun className="w-4 h-4" /> Claro
          </button>
         </div>
        </div>

        <div className="space-y-3">
         <label className="auth-label flex items-center gap-2">
          Privacidade & Status
          <div className="h-px flex-1 bg-border/40" />
         </label>
         <div className="flex gap-3 p-1 bg-black/20 rounded-xl border border-white/5">
          <button
           type="button"
           onClick={() => setStatus("online")}
           className={`flex-1 py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 border transition-all duration-300 ${status === 'online' ? 'border-green-500/50 bg-green-500/10 text-green-400' : 'border-transparent text-muted-foreground hover:bg-white/5'}`}
          >
           <div className={`w-2 h-2 rounded-full ${status === 'online' ? 'bg-green-500 animate-pulse' : 'bg-green-900/40'}`} /> Online
          </button>
          <button
           type="button"
           onClick={() => setStatus("offline")}
           className={`flex-1 py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 border transition-all duration-300 ${status === 'offline' ? 'border-gray-500/50 bg-gray-500/10 text-gray-400' : 'border-transparent text-muted-foreground hover:bg-white/5'}`}
          >
           <div className={`w-2 h-2 rounded-full ${status === 'offline' ? 'bg-gray-500 shadow-lg' : 'bg-gray-900/40'}`} /> Offline
          </button>
         </div>
        </div>
       </div>

       <div className="pt-8 border-t border-white/5 flex flex-wrap gap-4 justify-between items-center">
        <button 
         type="button"
         onClick={async () => {
          if (!user) return;
          try {
            const { error } = await supabase.from("notifications").insert({
              user_id: user.id,
              title: "🚀 Teste de Voo",
              message: "Sua frota de notificações está operando em 100%! Tudo pronto para a decolagem.",
              type: "info"
            });
            if (error) throw error;
            
            // Invalida o cache para mostrar a notificação na hora no sino do header
            queryClient.invalidateQueries({ queryKey: ["notifications", user.id] });
            
            toast.success("Mensagem de teste enviada para seu hangar!");
          } catch (error: any) {
            toast.error("Erro ao enviar notificação: " + error.message);
          }
         }}
         className="px-6 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2"
        >
         <Sparkles className="w-4 h-4 text-primary" />
         Testar Notificação
        </button>

        <button 
         type="submit" 
         disabled={loading}
         className="auth-btn !w-auto px-10 flex items-center justify-center gap-2 hover:scale-[1.02] hover:shadow-primary/25 active:scale-95 transition-all shadow-xl"
        >
         {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
         Salvar Alterações
        </button>
       </div>
      </form>
     </div>
    );
   
   case "favorites":
    return (
     <div className="space-y-6">
      <h2 className="text-2xl font-bold flex items-center gap-3">
       <Heart className="w-6 h-6 text-red-500 fill-red-500" /> Meus Favoritos
      </h2>
      {favorites.length > 0 ? (
       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {favorites.map(f => (
         <GameCard key={f.id} game={f.games} />
        ))}
       </div>
      ) : (
       <div className="auth-fieldset p-12 text-center text-muted-foreground">
        Ainda não há favoritos. Explore nossa biblioteca!
       </div>
      )}
     </div>
    );

   case "history":
    return (
     <div className="space-y-6">
      <h2 className="text-2xl font-bold flex items-center gap-3">
       <History className="w-6 h-6 text-blue-500" /> Histórico de Downloads
      </h2>
      {downloadHistory.length > 0 ? (
       <div className="space-y-4">
        {downloadHistory.map(h => (
         <div key={h.id} className="auth-fieldset !p-4 flex items-center gap-4">
          <img src={h.games.imagem} alt={h.games.nome} className="w-16 h-16 object-cover rounded-lg" />
          <div className="flex-1">
           <h4 className="font-bold text-lg">{h.games.nome}</h4>
           <p className="text-xs text-muted-foreground">
            {new Date(h.created_at).toLocaleString("pt-BR")}
           </p>
          </div>
          <Link to={`/jogo/${h.games.id}`} className="p-2 hover:bg-white/5 rounded-full transition-colors">
           <ExternalLink className="w-5 h-5" />
          </Link>
         </div>
        ))}
       </div>
      ) : (
       <div className="auth-fieldset p-12 text-center text-muted-foreground">
        Nenhum download registrado.
       </div>
      )}
     </div>
    );

   case "ranking":
    return (
     <div className="space-y-6">
      <h2 className="text-2xl font-black flex items-center gap-3 tracking-tight">
       <div className="p-2 bg-yellow-500/10 rounded-lg">
        <Trophy className="w-6 h-6 text-yellow-500" />
       </div>
       Ranking de Jogadores
      </h2>
      <div className="auth-fieldset !p-0 overflow-hidden bg-card/40 backdrop-blur-xl border-white/5 shadow-2xl">
       <div className="overflow-x-auto">
        <table className="w-full">
         <thead>
          <tr className="bg-white/5 text-left border-b border-white/5">
           <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Posição</th>
           <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Jogador</th>
           <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-right text-muted-foreground">Downloads</th>
          </tr>
         </thead>
         <tbody className="divide-y divide-white/5">
           {ranking.map((r, i) => (
            <tr key={i} className="group hover:bg-primary/5 transition-all duration-300">
             <td className="px-6 py-4">
              <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg font-black text-sm ${i === 0 ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/20' : i === 1 ? 'bg-gray-300 text-black shadow-lg shadow-gray-300/20' : i === 2 ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/20' : 'bg-white/5 text-muted-foreground'}`}>
               #{i + 1}
              </span>
             </td>
             <td className="px-6 py-4">
              <div className="flex items-center gap-4">
               <Link to={`/perfil/${r.user_id}`} className="shrink-0 relative">
                <img src={r.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=user"} className="w-10 h-10 rounded-full border-2 border-white/10 group-hover:border-primary/50 transition-colors object-cover" />
                {r.is_vip && <div className="absolute -top-1 -right-1 bg-yellow-500 rounded-full p-0.5"><BadgeCheck className="w-2.5 h-2.5 text-black" /></div>}
               </Link>
               <div>
                <Link to={`/perfil/${r.user_id}`} className="font-bold text-sm group-hover:text-primary transition-colors flex items-center gap-1">
                 {r.display_name}
                </Link>
                <p className="text-xs text-muted-foreground">@{r.username}</p>
               </div>
              </div>
             </td>
            <td className="px-6 py-4 text-right">
             <span className="font-mono font-black text-primary text-lg tracking-tighter">
              {r.download_count}
             </span>
            </td>
           </tr>
          ))}
         </tbody>
        </table>
       </div>
      </div>
     </div>
    );

   case "recommendations":
    return (
     <div className="space-y-6">
      <h2 className="text-2xl font-bold flex items-center gap-3">
       <Sparkles className="w-6 h-6 text-purple-500" /> Recomendados para Você
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
       {recommendations.map(g => (
        <GameCard key={g.id} game={g} />
       ))}
      </div>
     </div>
    );

   default:
    return null;
  }
 };

  return (
  <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
   {/* Professional Background Elements */}
   <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full animate-pulse" />
    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
   </div>

   <Header />
   
    <main className="flex-1 container mx-auto px-4 py-12 max-w-6xl relative z-10">
      <div className="grid md:grid-cols-[280px_1fr] gap-8 items-start">
        {/* Sidebar Container */}
        <div className="space-y-6">
          {/* User Info Card */}
          <div className="auth-fieldset flex flex-col items-center p-0 overflow-hidden group/sidebar">
            {/* Cover Gradient */}
            <div className="w-full h-24 bg-gradient-to-br from-primary/40 via-primary/20 to-transparent relative">
              <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" />
            </div>
            
            <div className="flex flex-col items-center px-8 pb-8 -mt-12 relative z-10">
              <div className="relative group">
                <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-background bg-secondary flex items-center justify-center relative shadow-xl ring-1 ring-white/10">
                  {targetProfile?.avatar_url ? (
                    <img 
                      src={targetProfile.avatar_url} 
                      alt="Avatar" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-16 h-16 text-muted-foreground" />
                  )}
                  {uploading && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <Loader2 className="w-8 h-8 animate-spin text-white" />
                    </div>
                  )}
                </div>
                
                {isOwnProfile && (
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-2 rounded-full shadow-lg hover:scale-110 transition-transform disabled:opacity-50"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                )}
                
                {isGifAvatar && (
                  <div className="absolute -top-1 -right-1 bg-yellow-500 text-black text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5 animate-pulse shadow-lg">
                    <BadgeCheck className="w-3 h-3" /> GIF
                  </div>
                )}
                
                <input 
                  type="file" 
                  ref={fileInputRef}
                  className="hidden" 
                  accept="image/jpeg,image/png,image/gif"
                  onChange={handleAvatarUpload}
                />
              </div>

              <div className="text-center mt-4 w-full">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <h2 className="text-xl truncate max-w-[180px] font-bold">
                    {targetProfile?.display_name || "Usuário"}
                  </h2>
                  <div className={`w-2.5 h-2.5 rounded-full ${targetProfile?.status === 'online' || (targetProfile?.last_seen_at && new Date(targetProfile.last_seen_at).getTime() > Date.now() - 5 * 60 * 1000) ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-gray-500'}`} />
                </div>
                <p className="text-muted-foreground text-sm ">
                  @{targetProfile?.username || "sem_usuario"}
                </p>
                
                <div className="flex flex-col items-center gap-3 mt-4">
                  <div className="flex flex-wrap justify-center gap-2">
                    {targetProfile?.is_vip && (
                      <span className="bg-yellow-500/10 text-yellow-500 text-[9px] font-bold px-2 py-0.5 rounded border border-yellow-500/20 uppercase tracking-widest ">
                        VIP
                      </span>
                    )}
                    {targetProfile?.badges?.map((badge: string, idx: number) => (
                      <span key={idx} className="bg-primary/10 text-primary text-[9px] font-bold px-2 py-0.5 rounded border border-primary/20 uppercase tracking-widest ">
                        {badge}
                      </span>
                    ))}
                  </div>
                  {isOwnProfile && targetProfile?.is_vip && targetProfile?.vip_expires_at && (
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-500/5 border border-yellow-500/10">
                      <div className="w-1 h-1 rounded-full bg-yellow-500 animate-pulse" />
                      <p className="text-[10px] text-yellow-500/70 font-bold uppercase tracking-wider">
                        VIP EXPIRA EM: {new Date(targetProfile.vip_expires_at).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Nav Menu */}
          <div className="auth-fieldset !p-2 space-y-1 bg-card/40 backdrop-blur-xl border-white/5 shadow-xl">
            {[
              { id: "profile", icon: User, label: "Perfil", hidden: false },
              { id: "settings", icon: Edit3, label: "Configurações", hidden: !isOwnProfile },
              { id: "favorites", icon: Heart, label: "Favoritos", hidden: !isOwnProfile },
              { id: "history", icon: History, label: "Download History", hidden: !isOwnProfile },
              { id: "ranking", icon: Trophy, label: "Ranking Global", hidden: false },
              { id: "recommendations", icon: Sparkles, label: "Sugestões", hidden: false },
            ].filter(tab => !tab.hidden).map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-300 ${activeTab === tab.id ? 'bg-primary text-white shadow-lg shadow-primary/25 scale-[1.02]' : 'hover:bg-primary/10 text-muted-foreground hover:text-primary hover:translate-x-1'}`}
              >
                <tab.icon className={`w-4 h-4 transition-colors ${activeTab === tab.id ? 'text-white' : 'text-primary'}`} />
                <span className="font-semibold">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Account Details */}
          {isOwnProfile && (
            <div className="auth-fieldset p-6 space-y-5 bg-card/30 backdrop-blur-xl border-white/5 shadow-xl">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground border-b border-white/5 pb-3">Dados da Conta</h3>
              <div className="space-y-4">
                <div className="space-y-1">
                  <p className="text-[9px] text-primary font-black uppercase tracking-widest ">E-mail cadastrado</p>
                  <p className="text-xs font-bold truncate text-foreground/90">{user?.email}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[9px] text-primary font-black uppercase tracking-widest ">Data de cadastro</p>
                  <p className="text-xs font-bold text-foreground/90">
                    {user?.created_at ? new Date(user.created_at).toLocaleDateString("pt-BR") : "N/A"}
                  </p>
                </div>
                {targetProfile?.is_vip && targetProfile?.vip_expires_at && (
                  <div className="space-y-1">
                    <p className="text-[9px] text-yellow-500 font-black uppercase tracking-widest ">VIP Expira em</p>
                    <p className="text-xs font-bold text-foreground/90">
                      {new Date(targetProfile.vip_expires_at).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Main Content Area */}
        <div className="space-y-6">
          {renderTabContent()}
        </div>
      </div>
    </main>
  </div>
 );
};

export default Perfil;
