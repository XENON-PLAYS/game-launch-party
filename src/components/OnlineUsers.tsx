import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Users } from "lucide-react";

export function OnlineUsers() {
  const [onlineCount, setOnlineCount] = useState(0);

  useEffect(() => {
    // Unique key per session to ensure accurate counting of all tabs/users
    const channel = supabase.channel("online-users");

    channel
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState();
        // Count all unique presence entries (sessions)
        const count = Object.values(state).flat().length;
        setOnlineCount(count);
      })
      .on("presence", { event: "join" }, ({ key, newPresences }) => {
        // console.log("User joined", key, newPresences);
      })
      .on("presence", { event: "leave" }, ({ key, leftPresences }) => {
        // console.log("User left", key, leftPresences);
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          // Track current user presence with a timestamp
          await channel.track({ 
            online_at: new Date().toISOString()
          });
        }
      });

    // Heartbeat to update database status for authenticated users
    const heartbeatInterval = setInterval(async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await supabase.rpc("update_online_status");
      }
    }, 30000); // Every 30 seconds

    return () => {
      clearInterval(heartbeatInterval);
      channel.unsubscribe();
    };
  }, []);

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase tracking-widest animate-pulse">
      <Users className="w-3 h-3" />
      <span>{onlineCount} Jogadores Online</span>
    </div>
  );
}