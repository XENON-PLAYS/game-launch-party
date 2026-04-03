import { motion, useScroll, useTransform } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import { useEffect, useState } from "react";

export function SkyBackground() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { scrollYProgress } = useScroll();
  
  // Parallax effect for the sun/moon
  const y = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 45]);

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
      {/* Global Background Gradient */}
      <motion.div
        animate={{
          background: isDark 
            ? "radial-gradient(circle at 50% 10%, #0f172a 0%, #020617 100%)" 
            : "radial-gradient(circle at 50% 10%, #f1f5f9 0%, #cbd5e1 100%)"
        }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        className="absolute inset-0"
      />

      {/* Sun/Moon System */}
      <motion.div
        style={{ y, rotate }}
        animate={{
          rotate: isDark ? 0 : 180
        }}
        transition={{ duration: 2, ease: "easeInOut" }}
        className="absolute top-[-10%] right-[10%] w-[30vw] h-[30vw] min-w-[300px] min-h-[300px]"
      >
        {/* Sun */}
        <motion.div
          animate={{
            opacity: isDark ? 0.4 : 0.8,
            scale: isDark ? 0.8 : 1.2,
          }}
          className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-1/3 rounded-full bg-yellow-400/20 blur-[60px]"
        />
        <motion.div
          animate={{
            opacity: isDark ? 0.1 : 1,
            scale: isDark ? 0.5 : 1,
          }}
          className="absolute top-[10%] left-1/2 -translate-x-1/2 w-1/4 h-1/4 rounded-full bg-yellow-200 shadow-[0_0_100px_rgba(250,204,21,0.4)]"
        />

        {/* Moon */}
        <motion.div
          animate={{
            opacity: !isDark ? 0.1 : 1,
            scale: !isDark ? 0.5 : 1,
          }}
          className="absolute bottom-[10%] left-1/2 -translate-x-1/2 w-1/4 h-1/4 rounded-full bg-indigo-100 shadow-[0_0_100px_rgba(129,140,248,0.3)]"
        />
        <motion.div
          animate={{
            opacity: !isDark ? 0.2 : 0.6,
            scale: !isDark ? 0.8 : 1.1,
          }}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/3 h-1/3 rounded-full bg-indigo-400/20 blur-[60px]"
        />
      </motion.div>

      {/* Decorative Stars for Night */}
      <motion.div
        animate={{ opacity: isDark ? 1 : 0 }}
        transition={{ duration: 1 }}
        className="absolute inset-0"
      >
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 3 + 2}s`,
            }}
          />
        ))}
      </motion.div>
    </div>
  );
}
