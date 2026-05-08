"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Navigation from "@/components/Navigation";

const timeline = [
  {
    year: "2024",
    title: "The Beginning",
    description: "Two cousins decide to combine their skills and start building together.",
  },
  {
    year: "Present",
    title: "Building the Future",
    description: "Taking on projects that push boundaries and challenge conventions.",
  },
  {
    year: "Beyond",
    title: "Infinite Possibilities",
    description: "The side quests continue. Every project is a new adventure.",
  },
];

const values = [
  {
    icon: "⚡",
    title: "Move Fast",
    description: "We ship quickly without compromising quality. Speed is a feature.",
  },
  {
    icon: "🎯",
    title: "Stay Focused",
    description: "Every project gets our full attention. No half-measures.",
  },
  {
    icon: "🔮",
    title: "Think Different",
    description: "Conventional solutions bore us. We find creative paths.",
  },
  {
    icon: "🤝",
    title: "Build Together",
    description: "Collaboration is key. We grow stronger as a team.",
  },
];

export default function AboutPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  return (
    <main className="min-h-screen bg-black">
      <Navigation />

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-6 md:px-12 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-full blur-[150px]" />
        </div>

        <div className="relative z-10 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-white/40 text-sm tracking-widest uppercase mb-4 block">
              About Us
            </span>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8">
              Two cousins on a<br />
              <span className="text-white/40">digital adventure.</span>
            </h1>
          </motion.div>

          <motion.p
            className="text-white/60 text-xl md:text-2xl leading-relaxed max-w-2xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            We&apos;re not just building products—we&apos;re embarking on side quests. 
            Each project is an opportunity to explore, learn, and create something meaningful.
          </motion.p>
        </div>
      </section>

      {/* The Story Section */}
      <section className="py-24 px-6 md:px-12" ref={containerRef}>
        <motion.div
          className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center"
          style={{ y, opacity }}
        >
          <div>
            <motion.span
              className="text-white/40 text-sm tracking-widest uppercase mb-4 block"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              Our Story
            </motion.span>
            <motion.h2
              className="text-4xl md:text-5xl font-bold mb-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              From family to<br />
              <span className="text-white/40">founding team.</span>
            </motion.h2>
            <motion.div
              className="space-y-6 text-white/60 text-lg"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <p>
                It started with late-night conversations about ideas, designs, and code. 
                As cousins, we&apos;ve always shared a passion for creating things.
              </p>
              <p>
                B&T was born from that shared vision—a studio where we could bring 
                our wildest ideas to life while helping others do the same.
              </p>
              <p>
                Today, we take on projects that excite us, challenge us, and push 
                us to grow. Every &quot;side quest&quot; teaches us something new.
              </p>
            </motion.div>
          </div>

          {/* Visual element */}
          <motion.div
            className="relative aspect-square"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-violet-600/20 via-purple-600/20 to-indigo-600/20 border border-white/10">
              {/* Grid pattern */}
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: `
                    linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
                  `,
                  backgroundSize: "40px 40px",
                }}
              />
              
              {/* Central B&T */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span
                  className="text-8xl md:text-9xl font-bold text-white/10"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  B&T
                </span>
              </div>

              {/* Floating elements */}
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-3 h-3 rounded-full bg-white/20"
                  style={{
                    left: `${20 + i * 15}%`,
                    top: `${30 + (i % 3) * 20}%`,
                  }}
                  animate={{
                    y: [0, -20, 0],
                    opacity: [0.2, 0.5, 0.2],
                  }}
                  transition={{
                    duration: 3 + i * 0.5,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Timeline Section */}
      <section className="py-24 px-6 md:px-12 bg-white/[0.02]">
        <div className="max-w-4xl mx-auto">
          <motion.span
            className="text-white/40 text-sm tracking-widest uppercase mb-4 block text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Timeline
          </motion.span>
          <motion.h2
            className="text-4xl md:text-5xl font-bold mb-16 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            The journey so far.
          </motion.h2>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-white/10 -translate-x-1/2" />

            {timeline.map((item, index) => (
              <motion.div
                key={item.year}
                className={`relative flex items-center gap-8 mb-16 last:mb-0 ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
              >
                {/* Content */}
                <div className={`flex-1 pl-8 md:pl-0 ${index % 2 === 0 ? "md:pr-16 md:text-right" : "md:pl-16"}`}>
                  <span className="text-white/40 text-sm">{item.year}</span>
                  <h3 className="text-2xl font-bold mt-2 mb-3">{item.title}</h3>
                  <p className="text-white/60">{item.description}</p>
                </div>

                {/* Dot */}
                <div className="absolute left-0 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-white border-4 border-black" />

                {/* Spacer for alternating layout */}
                <div className="hidden md:block flex-1" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <motion.span
            className="text-white/40 text-sm tracking-widest uppercase mb-4 block text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Our Values
          </motion.span>
          <motion.h2
            className="text-4xl md:text-5xl font-bold mb-16 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            What drives us.
          </motion.h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                className="group relative p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/20 transition-colors"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <span className="text-4xl mb-4 block">{value.icon}</span>
                <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                <p className="text-white/50 text-sm">{value.description}</p>

                {/* Hover gradient */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/0 to-blue-500/0 group-hover:from-purple-500/5 group-hover:to-blue-500/5 transition-all duration-300" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 md:px-12">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-8">
            Ready to start your<br />
            <span className="text-white/40">side quest?</span>
          </h2>
          <p className="text-white/60 text-xl mb-12 max-w-xl mx-auto">
            Whether it&apos;s a wild idea or a refined concept, we&apos;re here to help bring it to life.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-3 px-10 py-5 bg-white text-black font-medium rounded-full hover:scale-105 transition-transform text-lg"
          >
            Let&apos;s Talk
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </a>
        </motion.div>
      </section>
    </main>
  );
}


