import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export const SpaceBackground = () => {
  const [shootingStars, setShootingStars] = useState<{ id: number; top: string; left: string; delay: number; duration: number }[]>([]);

  useEffect(() => {
    const generateStar = () => ({
      id: Math.random(),
      top: `${Math.random() * 40}%`,
      left: `${Math.random() * 100}%`,
      delay: Math.random() * 2,
      duration: 1.2 + Math.random() * 1.5,
    });

    const interval = setInterval(() => {
      setShootingStars((prev) => [...prev.slice(-2), generateStar()]);
    }, 6000); // Frequency: every 6 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none bg-[#05070A]">
      {/* Fixed Stars Layer */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            radial-gradient(1px 1px at 25px 35px, white, transparent),
            radial-gradient(1px 1px at 50px 100px, white, transparent),
            radial-gradient(1.5px 1.5px at 125px 210px, white, transparent),
            radial-gradient(1px 1px at 175px 40px, white, transparent),
            radial-gradient(1.5px 1.5px at 200px 150px, white, transparent),
            radial-gradient(1px 1px at 250px 300px, white, transparent)
          `,
          backgroundSize: '300px 300px',
        }}
      />
      
      {/* Twinkling Stars Layer */}
      <motion.div 
        initial={{ opacity: 0.1 }}
        animate={{ opacity: [0.1, 0.5, 0.1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0"
        style={{
          backgroundImage: `
            radial-gradient(1px 1px at 15px 25px, white, transparent),
            radial-gradient(1.5px 1.5px at 75px 150px, white, transparent),
            radial-gradient(1px 1px at 150px 250px, white, transparent),
            radial-gradient(2px 2px at 225px 50px, white, transparent)
          `,
          backgroundSize: '400px 400px',
        }}
      />

      {/* Shooting Stars */}
      {shootingStars.map((star) => (
        <motion.div
          key={star.id}
          initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
          animate={{ 
            x: -400, 
            y: 400, 
            opacity: [0, 1, 0],
            scale: [0, 1, 0.5]
          }}
          transition={{ 
            duration: star.duration, 
            delay: star.delay,
            ease: "easeOut"
          }}
          className="absolute w-[2px] h-[2px] bg-white rounded-full shadow-[0_0_10px_2px_rgba(255,255,255,0.8)]"
          style={{ top: star.top, left: star.left }}
        >
          <div className="absolute top-0 left-0 w-[100px] h-[1px] bg-gradient-to-r from-white to-transparent -rotate-[45deg] origin-left" />
        </motion.div>
      ))}

      {/* Floating Particles */}
      {Array.from({ length: 15 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-primary/20 rounded-full blur-[1px]"
          animate={{
            y: [0, -100, 0],
            x: [0, Math.random() * 50 - 25, 0],
            opacity: [0, 0.4, 0],
            scale: [0, 1.5, 0]
          }}
          transition={{
            duration: 15 + Math.random() * 10,
            repeat: Infinity,
            delay: Math.random() * 10,
            ease: "easeInOut"
          }}
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
        />
      ))}

      {/* Space Glows (Nebulae) */}
      <motion.div 
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.1, 0.15, 0.1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] bg-primary/20 blur-[120px] rounded-full" 
      />
      <motion.div 
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute -bottom-[10%] -right-[10%] w-[60%] h-[60%] bg-blue-600/15 blur-[120px] rounded-full" 
      />
      <motion.div 
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.05, 0.1, 0.05],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut", delay: 5 }}
        className="absolute top-[20%] right-[10%] w-[40%] h-[40%] bg-purple-600/10 blur-[100px] rounded-full" 
      />
      
      {/* Subtle Noise for texture */}
      <div className="absolute inset-0 bg-noise opacity-[0.03]" />
      
      {/* Bottom Gradient for smoother content transition */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#05070A] to-transparent z-1" />
    </div>
  );
};
