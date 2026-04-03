export const SpaceBackground = () => {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none bg-background">
      {/* Basic stars effect */}
      <div 
        className="absolute inset-0 opacity-20"
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
      
      {/* Subtle nebula glows */}
      <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-primary/10 blur-[100px] rounded-full" />
      <div className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-primary/5 blur-[100px] rounded-full" />
    </div>
  );
};