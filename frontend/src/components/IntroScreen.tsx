import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { SparklesCore } from "./ui/sparkles";
import Welcome from "./Welcome";

interface IntroScreenProps {
  onComplete: () => void;
}

const IntroScreen: React.FC<IntroScreenProps> = ({ onComplete }) => {
  const [stage, setStage] = useState<"welcome" | "animation">("welcome");
  const [isExiting, setIsExiting] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleBegin = () => {
    if (!audioRef.current) {
      const audio = new Audio("/gitaintro.m4a");
      audioRef.current = audio;
      audio.play().catch(() => {});
      audio.addEventListener("ended", handleComplete);
    }
    setStage("animation");
  };

  const handleComplete = () => {
    setIsExiting(true);
    if (audioRef.current) {
      const fadeInterval = setInterval(() => {
        if (audioRef.current && audioRef.current.volume > 0.05) {
          audioRef.current.volume -= 0.05;
        } else {
          clearInterval(fadeInterval);
          if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
          }
        }
      }, 50);
    }
    setTimeout(() => onComplete(), 1000);
  };

  if (stage === "welcome") {
    return <Welcome onBegin={handleBegin} />;
  }

  return (
    <motion.div
      className="fixed inset-0 bg-black flex items-center justify-center overflow-hidden z-[100]"
      initial={{ opacity: 1 }}
      animate={{ opacity: isExiting ? 0 : 1 }}
      transition={{ duration: 1 }}
    >
      <div className="absolute inset-0 overflow-hidden z-0">
        <motion.div 
          className="absolute inset-[-50%] w-[200%] h-[200%] bg-cover bg-center"
          style={{ backgroundImage: "url('/cosmic-bg.png')" }}
          initial={{ scale: 1, opacity: 0, rotate: 0 }}
          animate={{ 
            scale: [1, 1.15, 1], 
            opacity: 0.1, 
            rotate: 180 
          }}
          transition={{ 
            opacity: { duration: 15, ease: "easeOut" },
            scale: { duration: 20, repeat: Infinity, ease: "easeInOut" },
            rotate: { duration: 240, repeat: Infinity, ease: "linear" }
          }}
        />

        <motion.div 
          className="absolute inset-[-50%] w-[200%] h-[200%] bg-cover bg-center mix-blend-screen"
          style={{ backgroundImage: "url('/cosmic-bg.png')" }}
          initial={{ scale: 1.1, opacity: 0, rotate: 0 }}
          animate={{ 
            scale: [1.1, 1.25, 1.1], 
            opacity: 0.2, 
            rotate: -180 
          }}
          transition={{ 
            opacity: { duration: 15, ease: "easeOut" },
            scale: { duration: 25, repeat: Infinity, ease: "easeInOut" },
            rotate: { duration: 300, repeat: Infinity, ease: "linear" }
          }}
        />
      </div>

      <div className="absolute inset-0 bg-black/40 z-0" />

      <div className="absolute inset-0 w-full h-full pointer-events-none z-10">
        <SparklesCore
          id="intro-sparkles"
          background="transparent"
          minSize={0.5}
          maxSize={1}
          particleDensity={80}
          particleColor="#ffffff"
          className="w-full h-full opacity-100"
        />
      </div>

      <div className="relative z-20 flex items-center justify-center w-full h-full perspective-[1000px]">
        
        <motion.div 
            className="absolute w-[min(800px,80vw)] aspect-square rounded-full border-[1px] border-white/10"
            animate={{ rotateX: 70, rotateZ: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        />
        <motion.div 
            className="absolute w-[min(600px,60vw)] aspect-square rounded-full border-[1px] border-white/20 border-dashed"
            animate={{ rotateX: 70, rotateZ: -360 }}
            transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
        />

        <motion.div 
            className="absolute w-[min(900px,90vw)] aspect-square rounded-full border-[1px] border-white/5"
            animate={{ rotateY: 45, rotateZ: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        />

        <div className="absolute inset-0 flex items-center justify-center">
             {Array.from({ length: 3 }).map((_, i) => (
                 <motion.div 
                    key={i}
                    className="absolute w-[2px] h-[120vh] bg-gradient-to-b from-transparent via-white/30 to-transparent"
                    style={{ rotate: i * 60 }}
                    animate={{ rotate: [i * 60, i * 60 + 360] }}
                    transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                 />
             ))}
        </div>

        <motion.div 
            className="relative flex items-center justify-center w-[90vw] max-w-[400px] aspect-square"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 2, ease: "circOut" }}
        >
            <div className="absolute inset-0 bg-orange-500/5 rounded-full blur-[80px] animate-pulse" />
            
            <motion.div
                className="relative z-30 text-[clamp(6rem,20vw,9rem)] font-bold text-transparent bg-clip-text bg-gradient-to-b from-white via-orange-100 to-orange-500 drop-shadow-[0_0_50px_rgba(255,165,0,0.4)] flex items-center justify-center pb-4"
                style={{ lineHeight: 1.5, paddingBottom: '20px' }} 
                animate={{ 
                    filter: ["brightness(1)", "brightness(1.2)", "brightness(1)"],
                    scale: [1, 1.05, 1]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
                ॐ
            </motion.div>
        </motion.div>

      </div>

      <motion.div className="absolute bottom-8 sm:bottom-16 z-50"
        initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2, duration: 1 }}>
        <motion.button onClick={handleComplete}
          className="group relative px-8 sm:px-12 py-3 sm:py-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-full overflow-hidden transition-all duration-300 hover:bg-white/10 hover:border-white/30 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] cursor-pointer"
         >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
          <span className="relative z-10 text-white/70 text-xs sm:text-sm font-bold tracking-[0.3em] sm:tracking-[0.4em] group-hover:text-white transition-colors duration-300">SKIP</span>
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default IntroScreen;