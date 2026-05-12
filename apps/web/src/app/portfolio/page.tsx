"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import { PhoneFrame } from "@/components/PhoneFrame";
import { BrowserFrame } from "@/components/BrowserFrame";
import { DemoCredentials } from "@/components/DemoCredentials";
import { ResponsiveScaler } from "@/components/ResponsiveScaler";

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

const POCKETS_URL = "https://pocketsmcp.lovable.app/?demo=1";
const POCKETS_DEMO_EMAIL = "demo@bt-portfolio.com";
const POCKETS_DEMO_PASSWORD = "BTPortfolioDemo2026";
const POCKETSAPP_DEMO_EMAIL = "demo@bt-portfolio.com";
const POCKETSAPP_DEMO_PASSWORD = "BTPortfolioDemo2026";
const POCKETSAPP_BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
// `?demo=1` triggers the autofill + auto-submit branch inside the embedded
// login screen (see pockets-app/PocketsApp/app/(auth)/login.tsx).
const POCKETSAPP_DEMO_SRC = `${POCKETSAPP_BASE_PATH}/pocketsapp-demo/index.html?demo=1`;

export default function PortfolioPage() {
  return (
    <main className="relative min-h-screen overflow-x-clip bg-black text-white">
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

          <div className="order-1 lg:order-2 flex items-center justify-center w-full">
            {/* Same physical phone size as the Pockets App section below
                (340×736 inner, 368×764 with bezel) so the two embeds sit
                identically in the layout. */}
            <ResponsiveScaler width={368} height={764}>
              <div
                className="lg:[transform:perspective(1600px)_rotateY(-6deg)_rotateX(2deg)]"
                style={{
                  // NOTE: transformStyle is explicitly `flat`, not
                  // `preserve-3d`. With preserve-3d Chromium hit-tests
                  // descendants in 3D and clicks on the right column of
                  // the embedded Bopomofo menu silently resolved to the
                  // dark header band.
                  transformStyle: "flat",
                }}
              >
                <PhoneFrame width={340} height={736}>
                  <AppDemoShell
                    initialRoute={{ name: "detail", drinkId: "matcha-guava-latte" }}
                  />
                </PhoneFrame>
              </div>
            </ResponsiveScaler>
          </div>
        </motion.div>
      </section>

      <section className="pb-32 px-6 md:px-12 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col gap-12 lg:gap-16"
        >
          <div className="grid lg:grid-cols-[1fr_auto] gap-8 lg:gap-12 items-end">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-white/50 mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-[#28C840]" />
                Live demo · in production
              </span>

              <h2
                className="text-4xl md:text-6xl font-medium tracking-tight leading-[1.05] mb-6"
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
              >
                Pocket&apos;s Chocolates
                <span className="block text-white/40 italic font-light">
                  a backend for AI agents.
                </span>
              </h2>

              <p className="text-base md:text-lg text-white/70 leading-relaxed mb-8">
                A production MCP server plus REST API giving AI agents
                structured access to Pocket&apos;s business intelligence —
                40+ tools across discovery, SQL-validated querying and
                7-dimension product analytics, with safe-number guarantees
                and a hardened query engine that only runs vetted SELECTs.
              </p>

              <div className="flex flex-wrap gap-3 mb-8 text-xs">
                {[
                  "MCP Server",
                  "TypeScript · Node",
                  "Express · Fly.io",
                  "Anthropic Claude",
                ].map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 rounded-full border border-white/15 text-white/70"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <DemoCredentials
                email={POCKETS_DEMO_EMAIL}
                password={POCKETS_DEMO_PASSWORD}
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/portfolio/pockets"
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
              <a
                href={POCKETS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white/90 hover:border-white/40 transition"
              >
                Visit live site
              </a>
            </div>
          </div>

          <div className="w-full aspect-[3/4] sm:aspect-[4/3] lg:aspect-[16/10]">
            <BrowserFrame url={POCKETS_URL} width="100%" height="100%">
              <iframe
                src={POCKETS_URL}
                title="Pocket's Chocolates Backend"
                style={{
                  width: "100%",
                  height: "100%",
                  border: "none",
                  display: "block",
                  background: "#FFFFFF",
                }}
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              />
            </BrowserFrame>
          </div>
        </motion.div>
      </section>

      <section className="pb-32 px-6 md:px-12 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="grid lg:grid-cols-[1fr_minmax(0,420px)] gap-12 lg:gap-20 items-center"
        >
          <div className="order-2 lg:order-1 max-w-xl">
            <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-white/50 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E86C2C]" />
              Live demo · in production
            </span>

            <h2
              className="text-4xl md:text-6xl font-medium tracking-tight leading-[1.05] mb-6"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
            >
              Pocket&apos;s App
              <span className="block text-white/40 italic font-light">
                rewards, in your pocket.
              </span>
            </h2>

            <p className="text-base md:text-lg text-white/70 leading-relaxed mb-8">
              The customer-facing companion to Pocket&apos;s Chocolates —
              a mobile loyalty app where guests scan receipts, climb tiers
              and redeem rewards. Built with Expo Router and Supabase,
              and embedded here as the same production bundle that ships
              to TestFlight and Google Play. The demo signs in
              automatically with a read-only account that lives in our
              Supabase project — credentials below if you want to sign in
              yourself from a fresh browser.
            </p>

            <div className="flex flex-wrap gap-3 mb-8 text-xs">
              {[
                "Expo + Expo Router",
                "Supabase auth + Postgres + edge functions",
                "NativeWind · Zustand",
                "Same bundle as iOS + Android",
              ].map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1.5 rounded-full border border-white/15 text-white/70"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="mb-8">
              <DemoCredentials
                email={POCKETSAPP_DEMO_EMAIL}
                password={POCKETSAPP_DEMO_PASSWORD}
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/portfolio/pocketsapp"
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

          <div className="order-1 lg:order-2 flex items-center justify-center w-full">
            {/* PhoneFrame width=340 + bezel*2 (14) = 368 box width. */}
            <ResponsiveScaler width={368} height={764}>
              <div
                className="lg:[transform:perspective(1600px)_rotateY(-6deg)_rotateX(2deg)]"
                style={{ transformStyle: "flat" }}
              >
                <PhoneFrame width={340} height={736}>
                  <iframe
                    src={POCKETSAPP_DEMO_SRC}
                    title="Pocket's App — live demo"
                    allow="camera; geolocation; clipboard-read; clipboard-write"
                    style={{
                      width: "100%",
                      height: "100%",
                      border: "none",
                      display: "block",
                      background: "#FAF8F5",
                    }}
                  />
                </PhoneFrame>
              </div>
            </ResponsiveScaler>
          </div>
        </motion.div>
      </section>

      <section
        id="archive"
        className="pb-32 px-6 md:px-12 max-w-7xl mx-auto"
      >
        <div className="mb-12 border-t border-white/10 pt-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
          >
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-white/50 mb-4">
                <span className="h-1 w-6 bg-white/30" />
                Archive
              </span>
              <h2
                className="text-3xl md:text-5xl font-medium tracking-tight leading-[1.05]"
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
              >
                Passion projects
                <span className="text-white/40 italic font-light">
                  {" "}· on hiatus.
                </span>
              </h2>
              <p className="mt-4 text-base text-white/60 leading-relaxed">
                Work we still believe in but stepped back from when bigger
                ventures pulled focus. The case studies live on — the
                engineering is still ours, and we&apos;d happily pick any of
                them back up.
              </p>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          <Link
            href="/portfolio/foresight"
            className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] transition hover:border-[#22C55E]/40 hover:bg-[#22C55E]/[0.03]"
          >
            <div className="relative overflow-hidden border-b border-white/10 bg-black">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`${POCKETSAPP_BASE_PATH}/foresight/dashboard-comparison.png`}
                alt="Foresight Prediction Dashboard"
                className="aspect-[16/10] w-full object-cover object-left-top transition duration-500 group-hover:scale-[1.02]"
                draggable={false}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </div>
            <div className="flex flex-1 flex-col p-5">
              <span className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-white/50 mb-3">
                <span className="h-1.5 w-1.5 rounded-full bg-[#22C55E] shadow-[0_0_10px_#22C55E]" />
                Passion project · on hiatus
              </span>
              <h3
                className="text-2xl text-white"
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
              >
                Foresight
                <span className="block text-sm text-white/40 italic font-light">
                  a calibrated book for CS2 player props.
                </span>
              </h3>
              <p className="mt-3 text-sm text-white/65 leading-relaxed">
                Three-tier ML ensemble with Bayesian calibration and
                correlation-aware Kelly sizing. 0.92 test AUC on 123k
                player-performance rows.
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5 text-[10px]">
                {["Python", "PyTorch", "LightGBM", "Supabase"].map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/10 px-2 py-1 text-white/60"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="mt-5 inline-flex items-center gap-2 text-sm text-white/80 transition group-hover:text-[#4ADE80]">
                Read the case study
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="transition group-hover:translate-x-0.5"
                >
                  <path
                    d="M9 6l6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </Link>
        </motion.div>
      </section>
    </main>
  );
}
