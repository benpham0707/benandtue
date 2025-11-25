"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

interface LoadingSequenceProps {
  onComplete: () => void;
}

export default function LoadingSequence({ onComplete }: LoadingSequenceProps) {
  const [phase, setPhase] = useState(1);

  useEffect(() => {
    // Phase 1: Subtle gray logo (2.5s)
    const phase2Timer = setTimeout(() => setPhase(2), 2500);
    // Phase 2: Logo transforms to white (2s)
    const phase3Timer = setTimeout(() => setPhase(3), 4500);
    // Phase 3: Complete and callback (1.5s)
    const completeTimer = setTimeout(() => onComplete(), 6000);

    return () => {
      clearTimeout(phase2Timer);
      clearTimeout(phase3Timer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase < 3 && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        >
          {/* Ambient glow effect */}
          <motion.div
            className="absolute inset-0 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: phase === 2 ? 0.3 : 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/5 rounded-full blur-[150px]" />
          </motion.div>

          {/* Floating orb indicator */}
          <motion.div
            className="absolute top-1/4 w-3 h-3 rounded-full bg-white"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: phase >= 1 ? 1 : 0, 
              scale: phase >= 1 ? 1 : 0,
              y: phase === 2 ? [0, -10, 0] : 0
            }}
            transition={{ 
              duration: 0.5,
              y: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
            }}
          />

          {/* B&T Logo */}
          <motion.div
            className="relative font-display select-none"
            initial={{ scale: 1 }}
            animate={{ 
              scale: phase === 2 ? 1.1 : 1,
            }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.h1
              className="text-[20vw] md:text-[25vw] font-bold tracking-tighter leading-none"
              style={{ fontFamily: "'Inter', sans-serif" }}
              initial={{ color: "#1a1a1a" }}
              animate={{ 
                color: phase === 2 ? "#ffffff" : "#1a1a1a",
                textShadow: phase === 2 
                  ? "0 0 80px rgba(255,255,255,0.3), 0 0 160px rgba(255,255,255,0.1)" 
                  : "none"
              }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            >
              B&T
            </motion.h1>

            {/* Scan line effect */}
            <motion.div
              className="absolute inset-0 overflow-hidden pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: phase === 2 ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white/50 to-transparent"
                initial={{ top: "0%" }}
                animate={{ top: "100%" }}
                transition={{ 
                  duration: 1.2, 
                  repeat: Infinity,
                  ease: "linear",
                  repeatDelay: 0.5
                }}
              />
            </motion.div>
          </motion.div>

          {/* Particle effects */}
          {phase === 2 && (
            <>
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-white/40 rounded-full"
                  initial={{ 
                    x: 0, 
                    y: 0, 
                    opacity: 0,
                    scale: 0 
                  }}
                  animate={{ 
                    x: (Math.random() - 0.5) * 400,
                    y: (Math.random() - 0.5) * 400,
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0]
                  }}
                  transition={{ 
                    duration: 2,
                    delay: i * 0.1,
                    ease: "easeOut"
                  }}
                />
              ))}
            </>
          )}

          {/* Progress indicator */}
          <motion.div
            className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ delay: 0.5 }}
          >
            {[1, 2].map((p) => (
              <motion.div
                key={p}
                className="w-8 h-[2px] rounded-full"
                initial={{ backgroundColor: "#333333" }}
                animate={{ 
                  backgroundColor: phase >= p ? "#ffffff" : "#333333",
                  scaleX: phase === p ? [1, 1.2, 1] : 1
                }}
                transition={{ duration: 0.3 }}
              />
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

