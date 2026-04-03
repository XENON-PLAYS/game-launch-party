import { useState, useMemo, useEffect } from "react";
import { useSearchParams, Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Tables } from "@/integrations/supabase/types";
import { toast } from "sonner";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { DashboardOverview } from "@/components/admin/DashboardOverview";
import { GameAdminList } from "@/components/admin/GameAdminList";
import { GameFormModal } from "@/components/admin/GameFormModal";
import { UserAdminList } from "@/components/admin/UserAdminList";
import { GameRequestList } from "@/components/admin/GameRequestList";
import { BugReportList } from "@/components/admin/BugReportList";
import { Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

type Game = Tables<"games">;

const Admin = () => {
  const { user, isAdmin, isLoading: authLoading } = useAuth();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "dashboard";

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selectedGame, setSelectedGame] = useState<Partial<Game> | null>(null);

  const { data: games = [], isLoading: gamesLoading, isError: gamesError } = useQuery({
    queryKey: ["admin-games"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("games")
        .select("*")
        .order("nome");
      if (error) throw error;
      return data ?? [];
    },
  });
  
  const { data: statsData } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const { count: userCount } = await supabase.from("profiles").select("*", { count: "exact", head: true });
      const { data: ratingData } = await supabase.from("game_ratings").select("rating");
      const { count: pendingRequests } = await supabase.from("game_requests").select("*", { count: "exact", head: true }).eq("status", "pending");
      const { count: newReports } = await supabase.from("bug_reports").select("*", { count: "exact", head: true }).eq("status", "new");
      
      const avgRating = ratingData && ratingData.length > 0
        ? ratingData.reduce((acc, r) => acc + r.rating, 0) / ratingData.length
        : 0;
        
      return { 
        userCount: userCount ?? 0, 
        averageRating: avgRating,
        pendingRequests: pendingRequests ?? 0,
        newReports: newReports ?? 0
      };
    },
    enabled: activeTab === "dashboard",
  });
  
  const { data: usersData = [], isLoading: usersLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_admin_users_list");
      if (error) throw error;
      return data ?? [];
    },
    enabled: activeTab === "users",
  });

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-10 w-10 text-primary animate-spin" />
      </div>
    );
  }

  if (!isAdmin) return <Navigate to="/login" replace />;

  const handleOpenAdd = () => {
    setModalMode("add");
    setSelectedGame({
      categorias: [],
      modos: [],
      idiomas: [],
      requisitos_minimo: {},
      requisitos_recomendado: {},
      destaques: [],
      galeria: [],
      pre_requisitos: "",
      passo_a_passo: "",
      link_demo: "",
      observacoes: "",
      preco: 0,
      download_count: 0
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (game: Game) => {
    setModalMode("edit");
    setSelectedGame(game);
    setIsModalOpen(true);
  };

  const handleDeleteGame = async (id: string, nome: string) => {
    if (!confirm(`Tem certeza que deseja excluir "${nome}"? Esta ação não pode ser desfeita.`)) return;

    try {
      const { error } = await supabase.from("games").delete().eq("id", id);
      if (error) throw error;
      
      queryClient.invalidateQueries({ queryKey: ["admin-games"] });
      queryClient.invalidateQueries({ queryKey: ["games"] });
      toast.success(`"${nome}" foi removido com sucesso.`);
    } catch (error: any) {
      toast.error(`Erro ao excluir: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground antialiased selection:bg-primary selection:text-primary-foreground">
      <AdminSidebar />
      
      <div className="md:pl-64 flex flex-col min-h-screen">
        <AdminHeader />
        
        <main className="flex-1 p-6 md:p-10 max-w-[1600px] mx-auto w-full">
          {gamesLoading ? (
            <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
              <Loader2 className="h-12 w-12 text-primary animate-spin" />
              <p className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Sincronizando com a Central Elite...</p>
            </div>
          ) : gamesError ? (
            <div className="h-[60vh] flex flex-col items-center justify-center space-y-6 text-center max-w-md mx-auto">
              <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
                <AlertCircle className="h-10 w-10" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-black uppercase tracking-tight">Falha na Sincronização</h3>
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest opacity-60">Não foi possível carregar os dados do catálogo. Verifique sua conexão ou permissões.</p>
              </div>
              <Button onClick={() => queryClient.invalidateQueries({ queryKey: ["admin-games"] })} className="rounded-xl px-8 h-12 font-black uppercase tracking-widest text-xs">
                Tentar Novamente
              </Button>
            </div>
          ) : (
            <>
              {activeTab === "dashboard" && (
                <DashboardOverview 
                  games={games} 
                  userCount={statsData?.userCount || 0} 
                  averageRating={statsData?.averageRating || 0} 
                />
              )}
              {activeTab === "games" && (
                <GameAdminList 
                  games={games} 
                  onEdit={handleOpenEdit} 
                  onDelete={handleDeleteGame}
                  onAdd={handleOpenAdd}
                />
              )}
              {activeTab === "users" && (
                usersLoading ? (
                  <div className="h-[40vh] flex flex-col items-center justify-center space-y-4">
                    <Loader2 className="h-10 w-10 text-primary animate-spin" />
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Carregando base de usuários...</p>
                  </div>
                ) : (
                  <UserAdminList users={usersData as any} />
                )
              )}
              {activeTab === "requests" && (
                <GameRequestList />
              )}
              {activeTab === "reports" && (
                <BugReportList />
              )}
            </>
          )}
        </main>
      </div>

      <GameFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mode={modalMode}
        game={selectedGame}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ["admin-games"] });
          queryClient.invalidateQueries({ queryKey: ["games"] });
          setIsModalOpen(false);
        }}
      />
    </div>
  );
};

export default Admin;
