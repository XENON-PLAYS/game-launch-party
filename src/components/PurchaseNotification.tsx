import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Download, Crown } from "lucide-react";

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
  name: string;
  game: string;
}

export const PurchaseNotification = () => {
  const [current, setCurrent] = useState<Notification | null>(null);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const showNext = () => {
      setCurrent({
        id: Date.now(),
        name: random(NAMES),
        game: random(GAMES),
      });

      // Esconde depois de 5s e agenda a próxima
      timeoutId = setTimeout(() => {
        setCurrent(null);
        timeoutId = setTimeout(showNext, 4000 + Math.random() * 4000);
      }, 5000);
    };

    // Primeira notificação após um pequeno atraso
    timeoutId = setTimeout(showNext, 4000);

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div className="fixed bottom-4 left-4 z-40 pointer-events-none max-w-[calc(100vw-2rem)]">
      <AnimatePresence mode="wait">
        {current && (
          <motion.div
            key={current.id}
            initial={{ opacity: 0, x: -40, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -40, scale: 0.95 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#141414]/95 backdrop-blur-md px-4 py-3 shadow-2xl"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary ring-1 ring-primary/30">
              <Download className="h-5 w-5" />
            </div>
            <div className="min-w-0 leading-tight">
              <p className="text-sm font-bold text-white">
                {current.name}{" "}
                <span className="font-normal text-muted-foreground">acabou de baixar</span>
              </p>
              <p className="truncate text-sm font-semibold text-primary">{current.game}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
