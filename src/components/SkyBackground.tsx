import { motion, useScroll, useTransform, useSpring } from "framer-motion";
// useTheme removed to keep background unchanged as requested

export function SkyBackground() {
  // Hardcode isDark to true to keep background unchanged as requested
  const isDark = true;
  const { scrollYProgress } = useScroll();
  
  // Smooth scroll transitions
  const smoothYProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  
  // Parallax effect for the sun/moon system
  const translateY = useTransform(smoothYProgress, [0, 1], [0, 80]);
  const scrollRotate = useTransform(smoothYProgress, [0, 1], [0, 20]);

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden bg-background">
      {/* Global Background Gradient */}
      <motion.div
        animate={{
          background: isDark 
            ? "#131313" 
            : "#ffffff"
        }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        className="absolute inset-0"
      />

      {/* Outer System Container - Handles Scroll Parallax */}
      <motion.div
        style={{ y: translateY, rotate: scrollRotate }}
        className="absolute top-0 right-0 w-[40vw] h-[40vw] min-w-[400px] min-h-[400px] flex items-center justify-center translate-x-[10%] -translate-y-[10%]"
      >
        {/* Inner System Container - Handles Theme Rotation */}
        <motion.div
          animate={{
            rotate: isDark ? 180 : 0
          }}
          transition={{ 
            type: "spring", 
            stiffness: 40, 
            damping: 15,
            mass: 1
          }}
          className="relative w-full h-full flex items-center justify-center"
        >
          {/* Sun - High when theme is Light (rotate 0) */}
          <div className="absolute top-[15%] left-1/2 -translate-x-1/2 w-1/3 h-1/3">
            <motion.div
              animate={{
                opacity: isDark ? 0.2 : 0.8,
                scale: isDark ? 0.7 : 1.2,
              }}
              className="absolute inset-0 rounded-full bg-yellow-400/30 blur-[60px]"
            />
            <motion.div
              animate={{
                opacity: isDark ? 0.3 : 1,
                scale: isDark ? 0.6 : 1,
              }}
              className="absolute inset-[20%] rounded-full bg-yellow-200 shadow-[0_0_80px_rgba(250,204,21,0.5)]"
            />
          </div>

          {/* Moon - High when theme is Dark (rotate 180) */}
          <div className="absolute bottom-[15%] left-1/2 -translate-x-1/2 w-1/3 h-1/3">
            <motion.div
              animate={{
                opacity: !isDark ? 0.2 : 1,
                scale: !isDark ? 0.7 : 1,
              }}
              className="absolute inset-[20%] rounded-full bg-indigo-100 shadow-[0_0_80px_rgba(129,140,248,0.4)]"
            />
            <motion.div
              animate={{
                opacity: !isDark ? 0.3 : 0.6,
                scale: !isDark ? 0.8 : 1.1,
              }}
              className="absolute inset-0 rounded-full bg-indigo-400/20 blur-[60px]"
            />
          </div>
        </motion.div>
      </motion.div>

      {/* Decorative Stars for Night */}
      <motion.div
        initial={false}
        animate={{ opacity: isDark ? 1 : 0 }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0"
      >
        {Array.from({ length: 40 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/40 animate-pulse"
            style={{
              top: `${Math.random() * 80}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 2 + 0.5}px`,
              height: `${Math.random() * 2 + 0.5}px`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 4 + 2}s`,
            }}
          />
        ))}
      </motion.div>
    </div>
  );
}
