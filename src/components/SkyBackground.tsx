import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import { useIsMobile } from "@/hooks/use-mobile";

export function SkyBackground() {
  const { theme } = useTheme();
  const isMobile = useIsMobile();
  const isDark = theme === "dark";
  const { scrollYProgress } = useScroll();
  
  // Smooth scroll transitions
  const smoothYProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  
  // Parallax effect for the sun/moon system
  const translateY = useTransform(smoothYProgress, [0, 1], [0, 80]);
  const scrollRotate = useTransform(smoothYProgress, [0, 1], [0, 20]);

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden bg-background">
      {/* 1. Global Background Base Gradient */}
      <motion.div
        animate={{
          background: isDark 
            ? "radial-gradient(circle at 50% -20%, #1e1e1e 0%, #0a0a0a 100%)" 
            : "radial-gradient(circle at 50% -20%, #f8fafc 0%, #ffffff 100%)"
        }}
        transition={{ duration: 1, ease: "easeInOut" }}
        className="absolute inset-0"
      />

      {/* 2. Modern Mesh/Blob Gradients (Aurora Effect) */}
      <div className="absolute inset-0 overflow-hidden">
        {!isMobile && (
          <>
            <motion.div 
              animate={{
                opacity: isDark ? 0.4 : 0.2,
                scale: [1, 1.2, 1],
                x: [0, 50, 0],
                y: [0, 30, 0]
              }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full blur-[120px] bg-primary/20"
            />
            <motion.div 
              animate={{
                opacity: isDark ? 0.3 : 0.15,
                scale: [1, 1.1, 1],
                x: [0, -40, 0],
                y: [0, 20, 0]
              }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="absolute top-[20%] -right-[10%] w-[60%] h-[60%] rounded-full blur-[100px] bg-indigo-500/10"
            />
          </>
        )}
        {isMobile && (
          <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full blur-[120px] bg-primary/10 opacity-30" />
        )}
      </div>

      {/* 3. Subtle Grid Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: '40px 40px',
          color: isDark ? '#ffffff' : '#000000'
        }}
      />

      {/* 4. Noise Texture for depth */}
      <div 
        className="absolute inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* 5. The Sun/Moon Parallax System (Refined) */}
      <motion.div
        style={{ y: translateY, rotate: scrollRotate }}
        className="absolute top-0 right-0 w-[40vw] h-[40vw] min-w-[400px] min-h-[400px] flex items-center justify-center translate-x-[15%] -translate-y-[15%]"
      >
        <motion.div
          animate={{ rotate: isDark ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 30, damping: 20 }}
          className="relative w-full h-full flex items-center justify-center"
        >
          {/* Sun */}
          <div className="absolute top-[15%] left-1/2 -translate-x-1/2 w-1/4 h-1/4">
            <motion.div
              animate={{ opacity: isDark ? 0 : 0.6, scale: isDark ? 0.5 : 1 }}
              className="absolute inset-0 rounded-full bg-yellow-400/20 blur-[60px]"
            />
            <motion.div
              animate={{ opacity: isDark ? 0 : 1, scale: isDark ? 0.5 : 1 }}
              className="absolute inset-[25%] rounded-full bg-yellow-200/80 shadow-[0_0_60px_rgba(250,204,21,0.3)]"
            />
          </div>

          {/* Moon */}
          <div className="absolute bottom-[15%] left-1/2 -translate-x-1/2 w-1/4 h-1/4">
            <motion.div
              animate={{ opacity: !isDark ? 0 : 1, scale: !isDark ? 0.5 : 1 }}
              className="absolute inset-[25%] rounded-full bg-slate-200 shadow-[0_0_60px_rgba(148,163,184,0.3)]"
            />
            <motion.div
              animate={{ opacity: !isDark ? 0 : 0.4, scale: !isDark ? 0.5 : 1.2 }}
              className="absolute inset-0 rounded-full bg-indigo-400/10 blur-[50px]"
            />
          </div>
        </motion.div>
      </motion.div>

      {/* 6. Refined Stars for Dark Mode */}
      <motion.div
        initial={false}
        animate={{ opacity: isDark ? 0.6 : 0 }}
        transition={{ duration: 1 }}
        className="absolute inset-0"
      >
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/30 animate-pulse"
            style={{
              top: `${(i * 13) % 100}%`,
              left: `${(i * 17) % 100}%`,
              width: `${(i % 3) + 0.5}px`,
              height: `${(i % 3) + 0.5}px`,
              animationDelay: `${i % 5}s`,
              animationDuration: `${(i % 4) + 2}s`,
            }}
          />
        ))}
      </motion.div>
    </div>
  );
}