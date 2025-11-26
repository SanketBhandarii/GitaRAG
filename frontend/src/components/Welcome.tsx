import React from "react";
import { motion } from "framer-motion";
import { SparklesCore } from "./ui/sparkles";

interface WelcomeProps {
  onBegin: () => void;
}

const Welcome: React.FC<WelcomeProps> = ({ onBegin }) => {
  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center p-4 overflow-hidden">
      <div className="absolute inset-0 w-full h-full">
        <SparklesCore
          id="welcome-sparkles"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={70}
          particleColor="#FFFFFF"
          className="w-full h-full opacity-60"
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-zinc-900/30 blur-[100px] rounded-full pointer-events-none" />
      </div>

      <motion.div 
        className="relative z-10 max-w-md w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        <div className="bg-zinc-900/40 backdrop-blur-2xl border border-zinc-800/60 rounded-3xl p-8 sm:p-12 text-center shadow-2xl shadow-black/50 ring-1 ring-white/5">
          
          <motion.div 
            className="text-6xl sm:text-7xl font-bold text-zinc-300 mb-6 inline-block"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            ॐ
          </motion.div>

          <motion.h1 
            className="text-4xl sm:text-5xl font-bold text-white mb-4 tracking-tight"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Gita<span className="text-zinc-400">RAG</span>
          </motion.h1>

          <motion.p 
            className="text-sm sm:text-base text-zinc-400 mb-10 leading-relaxed px-2 font-light"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            Find clarity, peace, and direction through the timeless wisdom of the Bhagavad Gita.
          </motion.p>

          <motion.button
            onClick={onBegin}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-4 cursor-pointer bg-zinc-100 hover:bg-white text-zinc-900 rounded-xl font-semibold transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)] mb-8"
          >
            Begin Your Journey
          </motion.button>

          <motion.div 
            className="pt-6 border-t border-zinc-800/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.8 }}
          >
            <p className="text-xs text-zinc-500 font-serif italic tracking-wide">
              "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन"
            </p>
            <p className="text-[10px] text-zinc-600 mt-1 uppercase tracking-widest">
              You have the right to work, but never to the fruit of work
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Welcome;