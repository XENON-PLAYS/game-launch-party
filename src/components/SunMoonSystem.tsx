import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export function SunMoonSystem() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="relative w-10 h-10 flex items-center justify-center overflow-visible">
      {/* Sun Icon */}
      <motion.div
        initial={false}
        animate={{
          x: isDark ? 0 : -12,
          y: isDark ? 0 : 0,
          scale: isDark ? 1 : 0.6,
          opacity: isDark ? 1 : 0.5,
          rotate: isDark ? 0 : 180,
          filter: isDark ? "blur(0px)" : "blur(0.5px)",
        }}
        transition={{ 
          type: "spring", 
          stiffness: 150, 
          damping: 15,
          mass: 1 
        }}
        className="absolute z-20"
      >
        <Sun className="w-5 h-5 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]" />
      </motion.div>

      {/* Moon Icon */}
      <motion.div
        initial={false}
        animate={{
          x: !isDark ? 0 : 12,
          y: !isDark ? 0 : 0,
          scale: !isDark ? 1 : 0.6,
          opacity: !isDark ? 1 : 0.5,
          rotate: !isDark ? 0 : -180,
          filter: !isDark ? "blur(0px)" : "blur(0.5px)",
        }}
        transition={{ 
          type: "spring", 
          stiffness: 150, 
          damping: 15,
          mass: 1 
        }}
        className="absolute z-10"
      >
        <Moon className="w-5 h-5 text-indigo-400 drop-shadow-[0_0_8px_rgba(129,140,248,0.6)]" />
      </motion.div>
      
      {/* Orbit Ring (Decorative) */}
      <motion.div 
        animate={{ rotate: isDark ? 0 : 180 }}
        transition={{ duration: 1, ease: "easeInOut" }}
        className="absolute inset-0 border border-primary/10 rounded-full pointer-events-none"
      />
    </div>
  );
}
