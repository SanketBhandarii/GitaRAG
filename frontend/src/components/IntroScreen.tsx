import React, { useState, useRef } from "react";
import { motion, Variants } from "framer-motion";
import { SparklesCore } from "./ui/sparkles";
import Welcome from "./Welcome";

interface IntroScreenProps {
  onComplete: () => void;
}

const IntroScreen: React.FC<IntroScreenProps> = ({ onComplete }) => {
  const [stage, setStage] = useState<"welcome" | "animation">("welcome");
  const [isExiting, setIsExiting] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const spinSlow: Variants = {
    animate: { rotate: 360, transition: { duration: 30, repeat: Infinity, ease: "linear" } },
  };

  const spinFast: Variants = {
    animate: { rotate: -360, transition: { duration: 12, repeat: Infinity, ease: "linear" } },
  };

  const spinMedium: Variants = {
    animate: { rotate: 360, transition: { duration: 20, repeat: Infinity, ease: "linear" } },
  };

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
      <div className="absolute inset-0 bg-gradient-to-br from-teal-950/40 via-black to-cyan-950/40" />
      
      <motion.div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(20, 184, 166, 0.2) 0%, transparent 50%)'
        }}
        animate={{ 
          scale: [1, 1.5, 1],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{ 
          duration: 8, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
      />

      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <SparklesCore
          id="intro-sparkles"
          background="transparent"
          minSize={0.5}
          maxSize={2}
          particleDensity={100}
          particleColor="#14b8a6"
          className="w-full h-full opacity-60"
        />
      </div>

      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-teal-400 rounded-full shadow-[0_0_10px_rgba(20,184,166,0.8)]"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 2, 0],
          }}
          transition={{
            duration: 2 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "easeInOut"
          }}
        />
      ))}

      <div className="relative flex items-center justify-center">
        <motion.div
          className="absolute rounded-full border-2 border-teal-600/30 shadow-[0_0_100px_rgba(20,184,166,0.4)]"
          style={{ width: "90vw", height: "90vw", maxWidth: "900px", maxHeight: "900px" }}
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeOut" }}
        />

        <motion.div
          className="absolute rounded-full border-2 border-cyan-600/30 shadow-[0_0_100px_rgba(6,182,212,0.4)]"
          style={{ width: "70vw", height: "70vw", maxWidth: "700px", maxHeight: "700px" }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeOut", delay: 0.5 }}
        />

        <motion.div className="absolute flex items-center justify-center w-[500px] h-[500px] sm:w-[650px] sm:h-[650px] opacity-40" variants={spinSlow} animate="animate">
          {Array.from({ length: 16 }).map((_, i) => (
            <motion.div 
              key={i} 
              className="absolute w-full h-[2px] bg-gradient-to-r from-transparent via-teal-500/60 to-transparent"
              style={{ transform: `rotate(${i * 22.5}deg)` }}
              animate={{ opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 3, delay: i * 0.1, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}
          <div className="absolute inset-8 rounded-full border-2 border-dashed border-teal-500/40 shadow-[inset_0_0_50px_rgba(20,184,166,0.2)]" />
        </motion.div>

        <motion.div className="absolute w-[400px] h-[400px] sm:w-[500px] sm:h-[500px] flex items-center justify-center mix-blend-screen" variants={spinMedium} animate="animate">
          <div className="absolute inset-0 border-2 border-cyan-500/30 rotate-45 rounded-lg shadow-[0_0_40px_rgba(6,182,212,0.3)]" />
          <div className="absolute inset-0 border-2 border-teal-500/30 rotate-12 rounded-lg shadow-[0_0_40px_rgba(20,184,166,0.3)]" />
          <div className="absolute inset-0 border-2 border-blue-500/30 -rotate-12 rounded-lg shadow-[0_0_40px_rgba(59,130,246,0.3)]" />
        </motion.div>

        <motion.div className="absolute w-[120px] h-[120px] sm:w-[200px] sm:h-[200px] rounded-full border-2 border-teal-400/30 shadow-[0_0_80px_rgba(20,184,166,0.4)]" variants={spinFast} animate="animate">
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.div 
              key={i} 
              className="absolute top-0 left-0 w-2 h-2 bg-teal-400 rounded-full shadow-[0_0_20px_rgba(20,184,166,1)]"
              style={{ transform: `translateX(-50%) rotate(${i * 30}deg) translateY(-180px)` }}
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, delay: i * 0.1, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}
        </motion.div>

        <motion.div className="absolute w-[250px] h-[250px] sm:w-[320px] sm:h-[320px] rounded-full border-2 border-teal-300/30 flex items-center justify-center shadow-[0_0_60px_rgba(20,184,166,0.3)]"
          animate={{ rotate: 360 }} transition={{ duration: 18, repeat: Infinity, ease: "linear" }}>
          {Array.from({ length: 32 }).map((_, i) => (
            <motion.div 
              key={i} 
              className="absolute h-4 w-[2px] bg-teal-400/70"
              style={{ top: '50%', left: '50%', transform: `translate(-50%, -50%) rotate(${i * 11.25}deg) translateY(-130px)` }}
              animate={{ opacity: [0.3, 1, 0.3], scaleY: [1, 1.5, 1] }}
              transition={{ duration: 2, delay: i * 0.05, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}
        </motion.div>

        <div className="relative z-10 flex items-center justify-center w-48 h-48 bg-black rounded-full shadow-[0_0_120px_rgba(20,184,166,0.6)] ring-4 ring-teal-500/40">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-teal-900/80 via-teal-950/60 to-black blur-3xl" />

          <svg viewBox="0 0 200 200" className="absolute w-full h-full opacity-100">
            <defs>
              <radialGradient id="omGlow">
                <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#0d9488" stopOpacity="0" />
              </radialGradient>
            </defs>

            <motion.g style={{ transformOrigin: "100px 100px" }} animate={{ rotate: 360 }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }}>
              {Array.from({ length: 24 }).map((_, i) => {
                const angle = (i * 360) / 24;
                return (
                  <motion.g key={i} style={{ transformOrigin: "100px 100px", transform: `rotate(${angle}deg)` }}
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.5, delay: i * 0.06, repeat: Infinity, ease: "easeInOut" }}>
                    <line x1="100" y1="35" x2="100" y2="52" stroke="#14b8a6" strokeWidth="3" strokeLinecap="round" />
                    <circle cx="100" cy="44" r="2.5" fill="#5eead4" className="shadow-[0_0_10px_rgba(20,184,166,1)]" />
                  </motion.g>
                );
              })}
            </motion.g>

            <motion.circle cx="100" cy="100" r="28" fill="none" stroke="#14b8a6" strokeWidth="2"
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              style={{ transformOrigin: "100px 100px" }} />

            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
              <motion.line key={angle} x1="100" y1="100" x2="100" y2="72" stroke="#14b8a6" strokeWidth="4" strokeLinecap="round" opacity="0.8"
                style={{ transformOrigin: "100px 100px", transform: `rotate(${angle}deg)` }}
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.8, delay: angle / 360, repeat: Infinity, ease: "easeInOut" }} />
            ))}            
          </svg>

          <motion.div className="relative z-30 text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-teal-200 via-teal-400 to-teal-600 drop-shadow-[0_0_50px_rgba(20,184,166,1)]"
            animate={{ 
              scale: [1, 1.15, 1], 
              filter: ["brightness(1) drop-shadow(0 0 50px rgba(20,184,166,1))", "brightness(1.3) drop-shadow(0 0 80px rgba(20,184,166,1))", "brightness(1) drop-shadow(0 0 50px rgba(20,184,166,1))"]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
            ॐ
          </motion.div>
        </div>
      </div>

      <motion.div className="absolute bottom-12 z-50 flex flex-col items-center gap-5"
        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5, duration: 1.2 }}>
        <motion.button onClick={handleComplete}
          className="group relative px-10 py-3 bg-gradient-to-r from-teal-900/80 via-teal-800/60 to-teal-900/80 border-2 border-teal-600/70 rounded-full text-teal-300 text-[11px] font-semibold tracking-[0.25em] overflow-hidden backdrop-blur-lg shadow-[0_0_40px_rgba(20,184,166,0.4)] cursor-pointer hover:shadow-[0_0_60px_rgba(20,184,166,0.6)] transition-all duration-300"
         >
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-transparent via-teal-400/30 to-transparent"
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
          <span className="relative z-10 group-hover:text-teal-100 transition-colors duration-300">SKIP SEQUENCE</span>
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default IntroScreen;