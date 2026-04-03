import { useState, useRef, useEffect } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
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
   const { error } = await supabase
    .from("profiles")
    .update({
     username: username,
     display_name: displayName,
     bio: bio,
     status: status,
     theme: themePreference,
     updated_at: new Date().toISOString(),
    })
    .eq("user_id", user.id);

   if (error) throw error;
   
   // Update global theme if changed
   if (themePreference !== currentTheme) {
    setTheme(themePreference);
   }
   
   await refreshProfile();
   toast.success("Perfil atualizado com sucesso!");
  } catch (error: any) {
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

   const { error: updateError } = await supabase
    .from("profiles")
    .update({ avatar_url: publicUrl })
    .eq("user_id", user.id);

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
     <div className="auth-fieldset p-8">
      <h1 className="auth-title !text-left !mb-8 flex items-center gap-3">
       <Edit3 className="w-6 h-6 text-primary" />
       Configurações
      </h1>
      
      <form onSubmit={handleUpdateProfile} className="space-y-6">
       <div className="grid sm:grid-cols-2 gap-6">
        <div className="space-y-2">
         <label className="auth-label">Nome de Exibição</label>
         <input 
          type="text" 
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Como você quer ser chamado"
          className="auth-input"
         />
        </div>
        
        <div className="space-y-2">
         <label className="auth-label">Nome de Usuário (@)</label>
         <input 
          type="text" 
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="usuario_unico"
          className="auth-input"
         />
        </div>

        <div className="space-y-2 sm:col-span-2">
         <label className="auth-label">Bio (Sobre você)</label>
         <textarea 
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Conte um pouco sobre você..."
          className="auth-input min-h-[100px] resize-none"
         />
        </div>

        <div className="space-y-2">
         <label className="auth-label">Preferência de Tema</label>
         <div className="flex gap-2">
          <button
           type="button"
           onClick={() => setThemePreference("dark")}
           className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center gap-2 border transition-all ${themePreference === 'dark' ? 'border-primary bg-primary/10' : 'border-border bg-secondary/50'}`}
          >
           <Moon className="w-4 h-4" /> Escuro
          </button>
          <button
           type="button"
           onClick={() => setThemePreference("light")}
           className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center gap-2 border transition-all ${themePreference === 'light' ? 'border-primary bg-primary/10' : 'border-border bg-secondary/50'}`}
          >
           <Sun className="w-4 h-4" /> Claro
          </button>
         </div>
        </div>

        <div className="space-y-2">
         <label className="auth-label">Status Online</label>
         <div className="flex gap-2">
          <button
           type="button"
           onClick={() => setStatus("online")}
           className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center gap-2 border transition-all ${status === 'online' ? 'border-green-500 bg-green-500/10' : 'border-border bg-secondary/50'}`}
          >
           <Circle className="w-3 h-3 fill-green-500 text-green-500" /> Online
          </button>
          <button
           type="button"
           onClick={() => setStatus("offline")}
           className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center gap-2 border transition-all ${status === 'offline' ? 'border-gray-500 bg-gray-500/10' : 'border-border bg-secondary/50'}`}
          >
           <Circle className="w-3 h-3 fill-gray-500 text-gray-500" /> Offline
          </button>
         </div>
        </div>
       </div>

       <div className="pt-4 border-t border-border">
        <button 
         type="submit" 
         disabled={loading}
         className="auth-btn px-8 flex items-center justify-center gap-2 min-w-[150px]"
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
      <h2 className="text-2xl font-bold flex items-center gap-3">
       <Trophy className="w-6 h-6 text-yellow-500" /> Ranking Global
      </h2>
      <div className="auth-fieldset !p-0 overflow-hidden">
       <table className="w-full">
        <thead>
         <tr className="bg-white/5 text-left">
          <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Pos</th>
          <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Usuário</th>
          <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-right">Downloads</th>
         </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {ranking.map((r, i) => (
           <tr key={i} className="hover:bg-white/5 transition-colors">
            <td className="px-6 py-4 font-bold text-lg">#{i + 1}</td>
            <td className="px-6 py-4">
             <div className="flex items-center gap-3">
              <Link to={`/perfil/${r.user_id}`} className="shrink-0 hover:scale-110 transition-transform">
                <img src={r.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=user"} className="w-8 h-8 rounded-full border border-border" />
              </Link>
              <div>
               <Link to={`/perfil/${r.user_id}`} className="font-medium flex items-center gap-1 hover:text-primary transition-colors">
                {r.display_name}
                {r.is_vip && <BadgeCheck className="w-3 h-3 text-yellow-500" />}
               </Link>
               <p className="text-xs text-muted-foreground">@{r.username}</p>
              </div>
             </div>
            </td>
           <td className="px-6 py-4 text-right font-mono font-bold text-primary">
            {r.download_count}
           </td>
          </tr>
         ))}
        </tbody>
       </table>
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
     <div className="grid md:grid-cols-[280px_1fr] gap-8">
      {/* Sidebar */}
      <div className="space-y-6">
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
          <h2 className="text-xl truncate max-w-[180px]">
           {targetProfile?.display_name || "Usuário"}
          </h2>
          <div className={`w-2.5 h-2.5 rounded-full ${targetProfile?.status === 'online' || (targetProfile?.last_seen_at && new Date(targetProfile.last_seen_at).getTime() > Date.now() - 5 * 60 * 1000) ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-gray-500'}`} />
         </div>
         <p className="text-muted-foreground text-sm ">
          @{targetProfile?.username || "sem_usuario"}
         </p>
         
         <div className="flex flex-wrap justify-center gap-2 mt-4">
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

       {isOwnProfile && (
        <div className="auth-fieldset p-6 space-y-4">
         <h3 className="text-sm border-b border-border pb-2">Informações</h3>
         <div className="space-y-2">
          <p className="text-[10px] text-muted-foreground uppercase ">Email</p>
          <p className="text-xs font-medium truncate">{user?.email}</p>
         </div>
         <div className="space-y-2">
          <p className="text-[10px] text-muted-foreground uppercase ">Membro desde</p>
          <p className="text-xs font-medium">
           {user?.created_at ? new Date(user.created_at).toLocaleDateString("pt-BR") : "N/A"}
          </p>
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
