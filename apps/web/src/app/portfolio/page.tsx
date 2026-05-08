"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import { PhoneFrame } from "@/components/PhoneFrame";

const AppDemoShell = dynamic(
  () => import("@/components/AppDemoShell").then((m) => m.AppDemoShell),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full bg-[#F7F4EE] flex items-center justify-center text-[#5C544A] text-sm font-medium">
        Brewing…
      </div>
    ),
  },
);

export default function PortfolioPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <Navigation />

      <div className="absolute inset-0 -z-10 opacity-60">
        <div className="absolute -top-40 -left-32 w-[640px] h-[640px] rounded-full bg-gradient-to-br from-[#3B1F2B] via-[#5A2D3D] to-transparent blur-3xl" />
        <div className="absolute -bottom-40 -right-32 w-[720px] h-[720px] rounded-full bg-gradient-to-tr from-[#C7975B] via-[#5B7548] to-transparent blur-3xl opacity-60" />
      </div>

      <section className="pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="grid lg:grid-cols-[1fr_minmax(0,420px)] gap-12 lg:gap-20 items-center"
        >
          <div className="order-2 lg:order-1 max-w-xl">
            <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-white/50 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C7975B]" />
              Live demo · in development
            </span>

            <h1
              className="text-4xl md:text-6xl font-medium tracking-tight leading-[1.05] mb-6"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
            >
              Bopomofo
              <span className="block text-white/40 italic font-light">
                a tea bar in your pocket.
              </span>
            </h1>

            <p className="text-base md:text-lg text-white/70 leading-relaxed mb-8">
              An end-to-end ordering experience built mobile-first.
              Browse the menu, customise size, sweetness, ice and toppings,
              then add to bag — every interaction tuned to feel like a
              shipped native app.
            </p>

            <div className="flex flex-wrap gap-3 mb-10 text-xs">
              {[
                "React Native + react-native-web",
                "Single codebase · web + iOS + Android",
                "Live state · zustand",
                "Token-based theming",
              ].map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1.5 rounded-full border border-white/15 text-white/70"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/portfolio/bopomofo"
                className="inline-flex items-center gap-2 rounded-full bg-white text-black px-5 py-3 text-sm font-semibold hover:bg-white/90 transition"
              >
                Open full screen
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M9 6l6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white/90 hover:border-white/40 transition"
              >
                Talk to us
              </Link>
            </div>
          </div>

          <div className="order-1 lg:order-2 flex items-center justify-center">
            <div
              style={{
                transform: "perspective(1600px) rotateY(-6deg) rotateX(2deg)",
                transformStyle: "preserve-3d",
              }}
            >
              <PhoneFrame>
                <AppDemoShell />
              </PhoneFrame>
            </div>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
