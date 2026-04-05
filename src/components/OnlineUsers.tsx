import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export function OnlineUsers() {
  const [onlineCount, setOnlineCount] = useState(0);

  useEffect(() => {
    const channel = supabase.channel("online-users");

    channel
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState();
        const count = Object.keys(state).length;
        setOnlineCount(count);
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({ 
            online_at: new Date().toISOString()
          });
        }
      });

    return () => {
      channel.unsubscribe();
    };
  }, []);

  return (
    <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-500 hover:bg-green-600 text-black text-[10px] font-black uppercase tracking-widest shadow-[0_0_15px_rgba(34,197,94,0.4)] transition-all duration-300">
      <span className="w-2 h-2 bg-black rounded-full animate-pulse"></span>
      <span>{onlineCount} JOGADORES ONLINE</span>
    </div>
  );
}
