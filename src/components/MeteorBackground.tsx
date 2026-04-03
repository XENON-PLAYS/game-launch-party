import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface MeteorProps {
  id: number;
  startX: string;
  startY: string;
  duration: number;
  delay: number;
}

export const MeteorBackground = () => {
  const [meteors, setMeteors] = useState<MeteorProps[]>([]);

  useEffect(() => {
    // Gerar meteoros iniciais
    const initialMeteors = Array.from({ length: 4 }).map((_, i) => ({
      id: i,
      startX: `${Math.random() * 80 + 10}%`,
      startY: `${Math.random() * 20 - 10}%`,
      duration: Math.random() * 2 + 1, // 1 a 3 segundos (rápido)
      delay: Math.random() * 15, // Atraso variado
    }));
    setMeteors(initialMeteors);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
      <div className="ufo opacity-20"></div>
      {meteors.map((meteor) => (
        <div
          key={meteor.id}
          className="cosmic-element"
          style={{
            top: meteor.startY,
            left: meteor.startX,
            animationName: "shooting-star-anim",
            animationDuration: `${meteor.duration + 8}s`, // Ajustado para a animação CSS que tem pausa
            animationDelay: `${meteor.delay}s`,
            animationIterationCount: "infinite",
            animationTimingFunction: "linear",
          }}
        />
      ))}
    </div>
  );
};
