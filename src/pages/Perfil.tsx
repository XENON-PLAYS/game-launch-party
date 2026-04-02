import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Header } from "@/components/Header";
import { CartPopup } from "@/components/CartPopup";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Camera, User, Check, AlertCircle, BadgeCheck } from "lucide-react";
import { toast } from "sonner";
import imageCompression from "browser-image-compression";

const Perfil = () => {
  const { user, profile, isLoading: authLoading, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
    if (profile) {
      setUsername(profile.username || "");
      setDisplayName(profile.display_name || "");
    }
  }, [user, profile, authLoading, navigate]);

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
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id);

      if (error) throw error;
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

      const fileExt = file.name.split(".").pop();
      const filePath = `${user.id}/${Math.random()}.${fileExt}`;

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

      toast.success("Avatar atualizado!");
      window.location.reload();
    } catch (error: any) {
      toast.error(error.message || "Erro ao fazer upload");
    } finally {
      setUploading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const isGifAvatar = profile?.avatar_url?.toLowerCase().endsWith(".gif");

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <CartPopup />
      
      <main className="flex-1 container mx-auto px-4 py-12 max-w-4xl">
        <div className="grid md:grid-cols-[300px_1fr] gap-8">
          {/* Sidebar / Avatar */}
          <div className="space-y-6">
            <div className="auth-fieldset flex flex-col items-center p-8">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary/20 bg-secondary flex items-center justify-center relative">
                  {profile?.avatar_url ? (
                    <img 
                      src={profile.avatar_url} 
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
                
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-2 rounded-full shadow-lg hover:scale-110 transition-transform disabled:opacity-50"
                >
                  <Camera className="w-4 h-4" />
                </button>
                
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

              <div className="text-center mt-4">
                <h2 className="font-['SuperSenior'] text-xl truncate max-w-[200px]">
                  {profile?.display_name || "Usuário"}
                </h2>
                <p className="text-muted-foreground text-sm font-['Evogria']">
                  @{profile?.username || "sem_usuario"}
                </p>
                {profile?.is_vip && (
                  <span className="mt-2 inline-block bg-yellow-500/10 text-yellow-500 text-[10px] font-bold px-2 py-1 rounded border border-yellow-500/20 uppercase tracking-widest font-['Evogria']">
                    Usuário VIP
                  </span>
                )}
              </div>
            </div>

            <div className="auth-fieldset p-6 space-y-4">
              <h3 className="text-sm font-['Evogria'] border-b border-border pb-2">Informações da Conta</h3>
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground uppercase font-['Evogria']">Email</p>
                <p className="text-sm font-medium">{user?.email}</p>
              </div>
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground uppercase font-['Evogria']">Membro desde</p>
                <p className="text-sm font-medium">
                  {user?.created_at ? new Date(user.created_at).toLocaleDateString("pt-BR") : "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="space-y-6">
            <div className="auth-fieldset p-8">
              <h1 className="auth-title !text-left !mb-8">Configurações do Perfil</h1>
              
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
                    <p className="text-[10px] text-muted-foreground">O nome que aparece no topo do site e comentários.</p>
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
                    <p className="text-[10px] text-muted-foreground">Seu identificador único na plataforma.</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="auth-btn px-8 flex items-center justify-center gap-2 min-w-[150px]"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                    Salvar Alterações
                  </button>
                </div>
              </form>
            </div>

            <div className="bg-primary/5 border border-primary/10 rounded-xl p-6 flex gap-4 items-start">
              <AlertCircle className="w-6 h-6 text-primary shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-sm mb-1">Dica de Personalização</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Você pode usar avatares animados (GIF) para deixar seu perfil mais dinâmico! 
                  Lembre-se que o tamanho máximo permitido é de 5MB para garantir o melhor desempenho da plataforma.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Perfil;
