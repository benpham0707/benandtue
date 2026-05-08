"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { useRef } from "react";

type QuestRing = "inner" | "middle" | "outer";

interface Quest {
  label: string;
  subtitle: string;
  ring: QuestRing;
  href: string;
}

const QUESTS: Quest[] = [
  { label: "Uplift", subtitle: "AI for college apps", ring: "inner", href: "#uplift" },
  { label: "DeBATTLE", subtitle: "1v1 debate game", ring: "middle", href: "#debattle" },
  { label: "Portfolio", subtitle: "Design & builds", ring: "outer", href: "#portfolio" },
  { label: "Lab", subtitle: "Tiny experiments", ring: "outer", href: "#lab" },
];

export function HeroOrbitVisual() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const shouldReduceMotion = useReducedMotion();

  // Cursor-based tilt
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(
    useTransform(y, [-40, 40], [10, -10]),
    { stiffness: 140, damping: 18 }
  );
  const rotateY = useSpring(
    useTransform(x, [-40, 40], [-10, 10]),
    { stiffness: 140, damping: 18 }
  );

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const offsetX = e.clientX - (rect.left + rect.width / 2);
    const offsetY = e.clientY - (rect.top + rect.height / 2);
    // Scale down so tilt is subtle
    x.set(offsetX / 4);
    y.set(offsetY / 4);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  // Animation durations - slower if reduced motion
  const innerDuration = shouldReduceMotion ? 60 : 18;
  const middleDuration = shouldReduceMotion ? 80 : 28;
  const outerDuration = shouldReduceMotion ? 120 : 40;

  return (
    <motion.div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY }}
      className="relative w-full md:w-[420px] h-[420px] rounded-[32px] border border-neutral-800/60 bg-gradient-to-b from-neutral-900 to-black overflow-hidden shadow-[0_0_80px_rgba(139,92,246,0.45)] perspective-[1200px]"
    >
      {/* Background glow */}
      <div className="pointer-events-none absolute -inset-24 bg-[radial-gradient(circle_at_top,_rgba(139,92,246,0.7),_transparent_60%)]" />

      {/* Faint grid texture */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.08] bg-[radial-gradient(circle_at_center,_#ffffff_1px,transparent_0)] [background-size:22px_22px]" />

      {/* Orbit system */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-64 h-64 md:w-72 md:h-72">
          {/* Outer ring */}
          <motion.div
            className="absolute inset-0 rounded-full border border-neutral-700/50"
            animate={shouldReduceMotion ? {} : { rotate: 360 }}
            transition={{ duration: outerDuration, repeat: Infinity, ease: "linear" }}
          />

          {/* Middle ring */}
          <motion.div
            className="absolute inset-[18%] rounded-full border border-neutral-700/50"
            animate={shouldReduceMotion ? {} : { rotate: -360 }}
            transition={{ duration: middleDuration, repeat: Infinity, ease: "linear" }}
          />

          {/* Inner ring */}
          <motion.div
            className="absolute inset-[34%] rounded-full border border-neutral-700/60"
            animate={shouldReduceMotion ? {} : { rotate: 360 }}
            transition={{ duration: innerDuration, repeat: Infinity, ease: "linear" }}
          />

          {/* Center core (B&T) */}
          <div className="absolute inset-[43%] flex items-center justify-center">
            <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-zinc-100 to-zinc-400 text-[10px] font-semibold tracking-[0.25em] uppercase text-black shadow-[0_0_40px_rgba(255,255,255,0.5)]">
              <span>B&amp;T</span>
              <div className="pointer-events-none absolute -inset-2 rounded-full border border-white/40 blur-[1px]" />
            </div>
          </div>

          {/* Quest nodes */}
          {QUESTS.map((quest, index) => {
            const ringInset =
              quest.ring === "inner"
                ? "inset-[34%]"
                : quest.ring === "middle"
                ? "inset-[18%]"
                : "inset-0";

            const duration =
              quest.ring === "inner" ? innerDuration : quest.ring === "middle" ? middleDuration : outerDuration;

            return (
              <motion.a
                key={quest.label}
                href={quest.href}
                className={`absolute ${ringInset} flex items-start justify-center`}
                style={{ translateY: "-50%" }}
                animate={shouldReduceMotion ? {} : { rotate: 360 }}
                transition={{
                  duration,
                  repeat: Infinity,
                  ease: "linear",
                  delay: index * 2,
                }}
              >
                <motion.div
                  whileHover={{ scale: 1.08, y: -6 }}
                  whileTap={{ scale: 0.96 }}
                  className="group relative flex flex-col items-center gap-1"
                >
                  {/* Node dot */}
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-violet-500 via-fuchsia-500 to-sky-500 shadow-[0_0_18px_rgba(139,92,246,0.8)]" />

                  {/* Tooltip */}
                  <div className="pointer-events-none origin-top scale-90 rounded-2xl bg-black/80 px-3 py-1.5 text-[11px] font-medium text-neutral-100 opacity-0 backdrop-blur transition group-hover:opacity-100 group-hover:scale-100">
                    <div>{quest.label}</div>
                    <div className="text-[10px] text-neutral-400">
                      {quest.subtitle}
                    </div>
                  </div>
                </motion.div>
              </motion.a>
            );
          })}
        </div>
      </div>

      {/* Status pill in corner */}
      <div className="absolute bottom-5 left-5 text-xs text-neutral-400">
        <div className="flex items-center gap-2 rounded-full bg-black/60 px-3 py-1 backdrop-blur">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          <span>Exploring {QUESTS.length}+ active side quests</span>
        </div>
      </div>
    </motion.div>
  );
}




