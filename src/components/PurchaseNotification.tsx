import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Download, Crown, X, CheckCircle2 } from "lucide-react";

const NAMES = [
  "Pedro H.",
  "Lucas M.",
  "Gabriel S.",
  "João P.",
  "Matheus L.",
  "Rafael A.",
  "Enzo C.",
  "Guilherme R.",
  "Bruno F.",
  "Vitor O.",
  "Felipe D.",
  "Arthur N.",
  "Ana C.",
  "Julia M.",
  "Larissa S.",
];

const GAMES = [
  "GTA V",
  "Elden Ring",
  "Red Dead 2",
  "Black Myth",
  "God of War",
  "The Witcher 3",
  "Cyberpunk 2077",
  "Hogwarts Legacy",
  "EA FC 25",
  "Silent Hill 2",
  "Resident Evil 4",
  "Dark Souls 2",
  "Spider-Man 2",
  "Sons of Forest",
  "Palworld",
];

const random = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

interface Notification {
  id: number;
  type: "download" | "vip";
  name: string;
  detail: string;
  minutes: number;
}

export const PurchaseNotification = () => {
  const [current, setCurrent] = useState<Notification | null>(null);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const showNext = () => {
      // ~30% das notificações são de compra de VIP
      const isVip = Math.random() < 0.3;
      setCurrent({
        id: Date.now(),
        type: isVip ? "vip" : "download",
        name: random(NAMES),
        detail: isVip ? "Plano VIP" : random(GAMES),
        minutes: 1 + Math.floor(Math.random() * 9),
      });

      // Esconde depois de 6s e agenda a próxima (~30s de intervalo)
      timeoutId = setTimeout(() => {
        setCurrent(null);
        timeoutId = setTimeout(showNext, 30000);
      }, 6000);
    };

    // Primeira notificação após um pequeno atraso
    timeoutId = setTimeout(showNext, 8000);

    return () => clearTimeout(timeoutId);
  }, []);

  const isVip = current?.type === "vip";

  return (
    <div className="fixed bottom-4 left-4 z-40 max-w-[calc(100vw-2rem)]">
      <AnimatePresence mode="wait">
        {current && (
          <motion.div
            key={current.id}
            initial={{ opacity: 0, x: -40, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -40, scale: 0.95 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="relative flex w-[300px] items-center gap-3 overflow-hidden rounded-2xl border border-primary/25 bg-[#141414]/95 p-2.5 pr-8 shadow-2xl backdrop-blur-md"
          >
            {/* brilho lateral */}
            <span className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-primary to-primary/40" />

            {/* thumbnail */}
            <div
              className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${
                isVip
                  ? "from-yellow-500/30 to-yellow-600/10 text-yellow-400 ring-1 ring-yellow-400/30"
                  : "from-primary/30 to-primary/5 text-primary ring-1 ring-primary/30"
              }`}
            >
              {isVip ? (
                <Crown className="h-6 w-6" />
              ) : (
                <Download className="h-6 w-6" />
              )}
            </div>

            {/* conteúdo */}
            <div className="min-w-0 flex-1 leading-tight">
              <p className="text-xs text-muted-foreground">
                <span className="font-semibold text-white">{current.name}</span>{" "}
                {isVip ? "assinou" : "baixou"}
              </p>
              <p
                className={`mt-0.5 truncate text-sm font-bold ${
                  isVip ? "text-yellow-400" : "text-white"
                }`}
              >
                {current.detail}
              </p>
              <p className="mt-1 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <span>há {current.minutes} min</span>
                <span className="text-primary">•</span>
                <span className="inline-flex items-center gap-1 text-primary">
                  <CheckCircle2 className="h-3 w-3" />
                  {isVip ? "Assinatura ativa" : "Download verificado"}
                </span>
              </p>
            </div>

            {/* fechar */}
            <button
              type="button"
              aria-label="Fechar"
              onClick={() => setCurrent(null)}
              className="absolute right-2 top-2 text-muted-foreground transition-colors hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
