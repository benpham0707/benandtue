"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LoadingSequence from "@/components/LoadingSequence";
import Navigation from "@/components/Navigation";
import ImageCollage from "@/components/ImageCollage";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasVisited, setHasVisited] = useState(false);

  useEffect(() => {
    // Check if user has visited before in this session
    const visited = sessionStorage.getItem("bt-visited");
    if (visited) {
      setIsLoading(false);
      setHasVisited(true);
    }
  }, []);

  const handleLoadingComplete = () => {
    setIsLoading(false);
    sessionStorage.setItem("bt-visited", "true");
  };

  return (
    <main className="relative min-h-screen bg-black overflow-hidden">
      {/* Loading Sequence */}
      <AnimatePresence>
        {isLoading && !hasVisited && (
          <LoadingSequence onComplete={handleLoadingComplete} />
        )}
      </AnimatePresence>

      {/* Main Content */}
      <AnimatePresence>
        {!isLoading && (
          <>
            <Navigation />

            {/* Hero Section */}
            <section className="relative min-h-screen flex flex-col justify-between px-6 md:px-12 pt-32 pb-8">
              {/* Background gradient */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-purple-900/10 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-blue-900/10 via-transparent to-transparent" />
              </div>

              {/* Floating orb */}
              <motion.div
                className="absolute top-1/4 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-white"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                  y: [0, -15, 0]
                }}
                transition={{ 
                  opacity: { delay: 0.3, duration: 0.5 },
                  scale: { delay: 0.3, duration: 0.5 },
                  y: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                }}
              />

              {/* Hero Content Grid */}
              <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center flex-1">
                {/* Left: Text Content */}
                <div className="flex flex-col justify-center">
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight mb-8">
                      <span className="block text-white">Two cousins,</span>
                      <span className="block text-white/60">infinite side quests.</span>
                    </h1>
                  </motion.div>

                  {/* Tagline description */}
                  <motion.p
                    className="text-white/50 text-lg md:text-xl max-w-md mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                  >
                    Building digital experiences, one project at a time. 
                    Design, development, and everything in between.
                  </motion.p>

                  {/* CTA Buttons */}
                  <motion.div
                    className="flex flex-wrap gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                  >
                    <Link
                      href="/gallery"
                      className="group relative px-8 py-4 bg-white text-black font-medium rounded-full overflow-hidden transition-transform hover:scale-105"
                    >
                      <span className="relative z-10">View Projects</span>
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-violet-500 to-purple-500"
                        initial={{ x: "-100%" }}
                        whileHover={{ x: 0 }}
                        transition={{ duration: 0.3 }}
                      />
                      <span className="absolute inset-0 z-10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                        View Projects
                      </span>
                    </Link>
                    <Link
                      href="/contact"
                      className="px-8 py-4 border border-white/20 text-white font-medium rounded-full hover:bg-white/5 transition-colors"
                    >
                      Get in Touch
                    </Link>
                  </motion.div>
                </div>

                {/* Right: Image Collage */}
                <motion.div
                  className="hidden lg:block h-[500px]"
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  <ImageCollage />
                </motion.div>
              </div>

              {/* Bottom: Large B&T Logo */}
              <motion.div
                className="relative mt-auto"
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                <h2
                  className="text-[25vw] md:text-[30vw] font-bold tracking-tighter leading-none text-white select-none"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  B&T
                </h2>
                
                {/* Gradient overlay on logo */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none" />
              </motion.div>

              {/* Scroll indicator */}
              <motion.div
                className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
              >
                <span className="text-white/30 text-xs tracking-widest">SCROLL</span>
                <motion.div
                  className="w-[1px] h-8 bg-gradient-to-b from-white/50 to-transparent"
                  animate={{ scaleY: [1, 0.5, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              </motion.div>

              {/* Social link */}
              <motion.a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-8 right-8 text-white/30 hover:text-white transition-colors"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                whileHover={{ scale: 1.1 }}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </motion.a>
            </section>

            {/* Second Section Preview */}
            <section className="relative min-h-screen bg-black px-6 md:px-12 py-24">
              <motion.div
                className="max-w-4xl mx-auto text-center"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
              >
                <h2 className="text-3xl md:text-5xl font-bold mb-8">
                  <span className="text-white/30">We build</span>{" "}
                  <span className="text-white">things that matter.</span>
                </h2>
                <p className="text-white/50 text-lg max-w-2xl mx-auto mb-12">
                  From concept to launch, we craft digital experiences that push boundaries 
                  and create lasting impact. Every project is a new adventure.
                </p>
                
                {/* Stats */}
                <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
                  {[
                    { value: "∞", label: "Side Quests" },
                    { value: "2", label: "Cousins" },
                    { value: "24/7", label: "Building" },
                  ].map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      className="text-center"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                        {stat.value}
                      </div>
                      <div className="text-white/40 text-sm">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </section>
          </>
        )}
      </AnimatePresence>
    </main>
  );
}
