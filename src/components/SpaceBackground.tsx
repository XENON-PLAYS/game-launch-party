import { motion } from "framer-motion";

export const SpaceBackground = () => {
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
        animate={{ opacity: [0.1, 0.4, 0.1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
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

      {/* Space Glows (Nebulae) */}
      <div className="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] bg-primary/10 blur-[120px] rounded-full" />
      <div className="absolute -bottom-[10%] -right-[10%] w-[60%] h-[60%] bg-blue-600/10 blur-[120px] rounded-full" />
      <div className="absolute top-[20%] right-[10%] w-[40%] h-[40%] bg-purple-600/5 blur-[100px] rounded-full" />
      
      {/* Subtle Noise for texture */}
      <div className="absolute inset-0 bg-noise opacity-[0.03]" />
    </div>
  );
};
