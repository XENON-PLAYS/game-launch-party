import { motion } from "framer-motion";
import { useEffect, useState, useMemo } from "react";

const Meteor = ({ initialDelay }: { initialDelay: number }) => {
  // Configurações de movimento para cada meteoro individual
  // Usamos useMemo para manter valores fixos durante o ciclo de vida do componente
  const meteorConfig = useMemo(() => ({
    startX: Math.random() * 80, // 0 a 80vw
    startY: Math.random() * -20 - 10, // -30 a -10vh
    duration: 0.8 + Math.random() * 1.2, // 0.8 a 2.0 segundos (rápido!)
    repeatDelay: 5 + Math.random() * 15, // Espera entre passagens
  }), []);

  return (
    <motion.div
      initial={{ 
        x: "-10vw", 
        y: "-10vh", 
        opacity: 0,
        scale: 0.8
      }}
      animate={{
        x: ["0vw", "130vw"],
        y: ["0vh", "130vh"],
        opacity: [0, 1, 1, 0],
        scale: [0.8, 1.2, 1.2, 0.8]
      }}
      transition={{
        duration: meteorConfig.duration,
        repeat: Infinity,
        repeatDelay: meteorConfig.repeatDelay,
        delay: initialDelay,
        ease: "linear",
      }}
      className="cosmic-element"
      style={{
        left: `${meteorConfig.startX}vw`,
        top: `${meteorConfig.startY}vh`,
        rotate: "45deg",
      }}
    />
  );
};

export const MeteorBackground = () => {
  // Renderiza múltiplos meteoros com diferentes atrasos iniciais
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
      <div className="ufo opacity-10"></div>
      <Meteor initialDelay={1} />
      <Meteor initialDelay={6} />
      <Meteor initialDelay={12} />
      <Meteor initialDelay={18} />
    </div>
  );
};
