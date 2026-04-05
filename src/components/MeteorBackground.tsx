import { motion } from "framer-motion";
import { useEffect, useState, useMemo } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

const Meteor = ({ initialDelay }: { initialDelay: number }) => {
  // Configurações de movimento para cada meteoro individual
  // Usamos useMemo para manter valores fixos durante o ciclo de vida do componente
  const meteorConfig = useMemo(() => ({
    startX: -150, // Começa fora da tela à esquerda
    startY: Math.random() * 90 + 5, // 5 a 95vh para não colar no topo/rodapé
    duration: 25 + Math.random() * 25, // 25 a 50 segundos (lento e sutil)
    repeatDelay: 10 + Math.random() * 15, // Espera entre passagens
  }), []);

  return (
    <motion.div
      initial={{ 
        x: "-20vw", 
        y: 0, 
        opacity: 0,
        scale: 0.7
      }}
      animate={{
        x: ["-10vw", "110vw"],
        opacity: [0, 0.3, 0.3, 0], // Opacidade sutil
        scale: [0.7, 1, 1, 0.7]
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
        left: 0,
        top: `${meteorConfig.startY}vh`,
        rotate: "0deg",
      }}
    />
  );
};

export const MeteorBackground = () => {
  const isMobile = useIsMobile();
  
  if (isMobile) return null;
  
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
