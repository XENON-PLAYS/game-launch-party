import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Crown, X, CheckCircle2 } from "lucide-react";

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

const steamCover = (id: number) =>
  `https://cdn.cloudflare.steamstatic.com/steam/apps/${id}/library_600x900.jpg`;

const GAMES: { name: string; image: string }[] = [
  { name: "GTA V", image: steamCover(271590) },
  { name: "Elden Ring", image: steamCover(1245620) },
  { name: "Red Dead 2", image: steamCover(1174180) },
  { name: "Black Myth", image: steamCover(2358720) },
  { name: "God of War", image: steamCover(1593500) },
  { name: "The Witcher 3", image: steamCover(292030) },
  { name: "Cyberpunk 2077", image: steamCover(1091500) },
  { name: "Hogwarts Legacy", image: steamCover(990080) },
  { name: "EA FC 25", image: steamCover(2669320) },
  { name: "Silent Hill 2", image: steamCover(2124490) },
  { name: "Resident Evil 4", image: steamCover(2050650) },
  { name: "Dark Souls 2", image: steamCover(335300) },
  { name: "Spider-Man 2", image: steamCover(2651280) },
  { name: "Sons of Forest", image: steamCover(1326470) },
  { name: "Palworld", image: steamCover(1623730) },
];

const VIP_TIERS = [
  {
    name: "VIP Ouro",
    text: "text-yellow-400",
    from: "from-yellow-500/30",
    to: "to-yellow-600/10",
    ring: "ring-yellow-400/40",
  },
  {
    name: "VIP Prata",
    text: "text-slate-200",
    from: "from-slate-300/30",
    to: "to-slate-400/10",
    ring: "ring-slate-300/40",
  },
  {
    name: "VIP Bronze",
    text: "text-amber-500",
    from: "from-amber-600/30",
    to: "to-amber-700/10",
    ring: "ring-amber-500/40",
  },
] as const;

const random = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

interface Notification {
  id: number;
  type: "download" | "vip";
  name: string;
  game: { name: string; image: string };
  tier: (typeof VIP_TIERS)[number];
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
        game: random(GAMES),
        tier: random(VIP_TIERS as unknown as (typeof VIP_TIERS)[number][]),
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
            {isVip ? (
              <div
                className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${current!.tier.from} ${current!.tier.to} ${current!.tier.text} ring-1 ${current!.tier.ring}`}
              >
                <Crown className="h-6 w-6" />
              </div>
            ) : (
              <div className="h-14 w-11 shrink-0 overflow-hidden rounded-lg ring-1 ring-white/10">
                <img
                  src={current!.game.image}
                  alt={current!.game.name}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
            )}

            {/* conteúdo */}
            <div className="min-w-0 flex-1 leading-tight">
              <p className="text-xs text-muted-foreground">
                <span className="font-semibold text-white">{current!.name}</span>{" "}
                {isVip ? "assinou" : "baixou"}
              </p>
              <p
                className={`mt-0.5 truncate text-sm font-bold ${
                  isVip ? current!.tier.text : "text-white"
                }`}
              >
                {isVip ? current!.tier.name : current!.game.name}
              </p>
              <p className="mt-1 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <span>há {current!.minutes} min</span>
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
