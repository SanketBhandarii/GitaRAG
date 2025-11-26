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
    animate: { rotate: 360, transition: { duration: 40, repeat: Infinity, ease: "linear" } },
  };

  const spinFast: Variants = {
    animate: { rotate: -360, transition: { duration: 15, repeat: Infinity, ease: "linear" } },
  };

  const spinClockwise: Variants = {
    animate: { rotate: 360, transition: { duration: 25, repeat: Infinity, ease: "linear" } },
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
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <SparklesCore
          id="intro-sparkles"
          background="transparent"
          minSize={0.5}
          maxSize={1.5}
          particleDensity={70}
          particleColor="#5ec7ff"
          className="w-full h-full opacity-40"
        />
        
      </div>

      <div className="relative flex items-center justify-center">
        <motion.div
          className="absolute rounded-full border border-zinc-800/20"
          style={{ width: "90vw", height: "90vw", maxWidth: "800px", maxHeight: "800px" }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeOut" }}
        />

        <motion.div className="absolute flex items-center justify-center w-[500px] h-[500px] sm:w-[600px] sm:h-[600px] opacity-30" variants={spinSlow} animate="animate">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-zinc-500 to-transparent"
              style={{ transform: `rotate(${i * 30}deg)` }} />
          ))}
          <div className="absolute inset-4 rounded-full border border-dashed border-zinc-700/40" />
        </motion.div>

        <motion.div className="absolute w-[350px] h-[350px] sm:w-[450px] sm:h-[450px] flex items-center justify-center mix-blend-screen" variants={spinClockwise} animate="animate">
          <div className="absolute inset-0 border border-zinc-600/30 rotate-45" />
          <div className="absolute inset-0 border border-zinc-600/30 rotate-12" />
          <div className="absolute inset-0 border border-zinc-600/30 -rotate-12" />
        </motion.div>

        <motion.div className="absolute w-[100px] h-[100px] sm:w-[180px] sm:h-[180px] rounded-full border border-zinc-500/10 shadow-[0_0_60px_rgba(255,255,255,0.05)]" variants={spinFast} animate="animate">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="absolute top-0 left-0 w-1.5 h-1.5 bg-zinc-400 rounded-full shadow-[0_0_10px_white]"
              style={{ transform: `translateX(-50%) rotate(${i * 45}deg) translateY(-150px)` }} />
          ))}
        </motion.div>

        <motion.div className="absolute w-[220px] h-[220px] sm:w-[280px] sm:h-[280px] rounded-full border-[1px] border-zinc-400/20 flex items-center justify-center"
          animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}>
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className="absolute h-3 w-[1px] bg-zinc-500"
              style={{ top: '50%', left: '50%', transform: `translate(-50%, -50%) rotate(${i * 15}deg) translateY(-110px)` }} />
          ))}
        </motion.div>

        <div className="relative z-10 flex items-center justify-center w-48 h-48 bg-black rounded-full shadow-[0_0_100px_rgba(255,255,255,0.25)] ring-2 ring-zinc-700/50">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-zinc-800/60 via-zinc-900/40 to-black blur-3xl" />

          <svg viewBox="0 0 200 200" className="absolute w-full h-full opacity-100">
            <motion.g style={{ transformOrigin: "100px 100px" }} animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}>
              {Array.from({ length: 16 }).map((_, i) => {
                const angle = (i * 360) / 16;
                return (
                  <motion.g key={i} style={{ transformOrigin: "100px 100px", transform: `rotate(${angle}deg)` }}
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 2, delay: i * 0.125, repeat: Infinity, ease: "easeInOut" }}>
                    <line x1="100" y1="40" x2="100" y2="55" stroke="#a1a1aa" strokeWidth="2.5" strokeLinecap="round" />
                    <circle cx="100" cy="48" r="2" fill="#d4d4d8" />
                  </motion.g>
                );
              })}
            </motion.g>


            

            <motion.circle cx="100" cy="100" r="25" fill="none" stroke="url(#innerGlow)" strokeWidth="1.5"
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              style={{ transformOrigin: "100px 100px" }} />

            {[0, 60, 120, 180, 240, 300].map((angle) => (
              <motion.line key={angle} x1="100" y1="100" x2="100" y2="75" stroke="url(#timeRay)" strokeWidth="3" strokeLinecap="round" opacity="0.7"
                style={{ transformOrigin: "100px 100px", transform: `rotate(${angle}deg)` }}
                animate={{ opacity: [0.4, 0.9, 0.4] }}
                transition={{ duration: 2, delay: angle / 360, repeat: Infinity, ease: "easeInOut" }} />
            ))}            
          </svg>

          <motion.div className="relative z-30 text-7xl font-bold text-white drop-shadow-[0_0_40px_rgba(255,255,255,0.8)]"
            animate={{ scale: [1, 1.12, 1], textShadow: ["0 0 40px rgba(255,255,255,0.8)", "0 0 60px rgba(255,255,255,1)", "0 0 40px rgba(255,255,255,0.8)"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
            ॐ
          </motion.div>
        </div>
      </div>

      <motion.div className="absolute bottom-12 z-50 flex flex-col items-center gap-5"
        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5, duration: 1.2 }}>
        <motion.button onClick={handleComplete}
          className="group relative px-10 py-3 bg-gradient-to-r from-zinc-900/80 via-zinc-800/60 to-zinc-900/80 border border-zinc-700/70 rounded-full text-zinc-400 text-[11px] font-semibold tracking-[0.25em] overflow-hidden backdrop-blur-lg shadow-[0_0_30px_rgba(0,0,0,0.5)] cursor-pointer"
         >
          <span className="relative z-10 group-hover:text-zinc-200 transition-colors duration-300">SKIP SEQUENCE</span>
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default IntroScreen;