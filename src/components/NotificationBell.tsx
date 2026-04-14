import { useState, useEffect } from "react";
import { Bell, Info } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";

export function NotificationBell() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const { data: notifications = [] } = useQuery({
    queryKey: ["notifications", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10);
      return data ?? [];
    },
    enabled: !!user,
  });

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel("notifications-changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["notifications", user.id] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, queryClient]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = useMutation({
    mutationFn: async (id: string) => {
      await supabase.from("notifications").update({ read: true }).eq("id", id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications", user?.id] });
    }
  });

  const markAllRead = useMutation({
    mutationFn: async () => {
      if (!user) return;
      await supabase.from("notifications").update({ read: true }).eq("user_id", user.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications", user?.id] });
    }
  });

  return (
    <div className="relative">
      <button 
        onClick={() => setOpen(!open)}
        className="p-2.5 rounded-xl hover:bg-muted/50 transition-colors relative"
      >
        <Bell className="w-5 h-5 text-muted-foreground" />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 w-4 h-4 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-background">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence mode="wait">
        {open && (
          <div key="notifications-container">
            <div 
              className="fixed inset-0 z-[110]" 
              onClick={() => setOpen(false)} 
            />
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute right-0 top-full mt-4 w-80 bg-card border border-border rounded-2xl shadow-2xl z-[120] overflow-hidden"
            >
              <div className="p-4 border-b border-border flex items-center justify-between bg-muted/20">
                <h3 className="text-xs font-black uppercase tracking-widest text-foreground">Notificações</h3>
                {unreadCount > 0 && (
                  <button 
                    onClick={() => markAllRead.mutate()}
                    className="text-[10px] font-bold text-muted-foreground hover:text-foreground hover:underline uppercase tracking-widest"
                  >
                    Marcar todas como lidas
                  </button>
                )}
              </div>
              
              <div className="max-h-[400px] overflow-y-auto bg-card">
                {notifications.length > 0 ? (
                  <div className="divide-y divide-border">
                    {notifications.map((n) => (
                      <div 
                        key={n.id} 
                        className={`p-4 space-y-2 transition-colors cursor-pointer ${!n.read ? 'bg-muted/30' : 'hover:bg-muted/10'}`}
                        onClick={() => {
                          if (!n.read) markAsRead.mutate(n.id);
                        }}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${!n.read ? 'bg-primary/10 text-primary' : 'bg-muted/50 text-muted-foreground'}`}>
                            <Info className="w-4 h-4" />
                          </div>
                          <div className="flex-1 space-y-1">
                            <p className="text-sm font-bold leading-none text-foreground">{n.title}</p>
                            <p className="text-xs text-muted-foreground leading-relaxed">{n.message}</p>
                            <p className="text-[10px] text-muted-foreground/60 font-medium">
                              {new Date(n.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          {!n.read && <div className="w-2 h-2 rounded-full bg-primary mt-1" />}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-12 text-center space-y-4">
                    <div className="w-12 h-12 rounded-full bg-muted/50 mx-auto flex items-center justify-center opacity-40">
                      <Bell className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Nenhuma novidade na frota</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
