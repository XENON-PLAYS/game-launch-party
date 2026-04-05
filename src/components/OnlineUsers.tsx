import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export function OnlineUsers() {
  const [onlineCount, setOnlineCount] = useState(1); // Start with 1 as requested "1 JOGADORES ONLINE"

  useEffect(() => {
    const channel = supabase.channel("online-users");

    channel
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState();
        const count = Object.keys(state).length;
        setOnlineCount(count > 0 ? count : 1);
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
    <div className="bg-[#22c55e] text-white text-[10px] font-black px-4 py-2 rounded-full flex items-center gap-2 hover:bg-[#16a34a] transition-all cursor-default shadow-[0_0_15px_rgba(34,197,94,0.3)]">
      <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
      <span>{onlineCount} {onlineCount === 1 ? 'JOGADOR' : 'JOGADORES'} ONLINE</span>
    </div>
  );
}
