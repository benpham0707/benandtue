// Standalone web page for the Matcha Guava Latte — hero photo at the top,
// scroll-animated ingredient diagram in the middle. Not embedded in the
// phone-shaped React Native demo; this is a regular web page.

import type { Metadata } from "next";
import Link from "next/link";

import { LayeredDiagram } from "@/components/LayeredDiagram";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const metadata: Metadata = {
  title: "Matcha Guava Latte · Bopomofo",
  description:
    "Three layers, three sources: cold-pressed guava, steamed whole milk, ceremonial matcha shaken with ice.",
};

export default function MatchaGuavaLattePage() {
  return (
    // White page so the brush-stroke backdrop reads cleanly. The hero section
    // below has its own dark photo + gradient, so it stays self-contained.
    <main className="min-h-screen bg-white text-stone-900">
      {/* Hero */}
      <section className="relative overflow-hidden bg-black text-white">
        <div className="absolute inset-0 -z-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${BASE_PATH}/bopomofo/matcha-guava-latte-hero.png`}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            draggable={false}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black" />
        </div>
        <div className="relative mx-auto flex min-h-[100svh] max-w-5xl flex-col justify-end px-6 pb-16 md:pb-24">
          <Link
            href="/portfolio/bopomofo"
            className="mb-10 inline-flex items-center gap-2 text-sm text-white/70 hover:text-white"
          >
            <span aria-hidden>←</span> Back to Bopomofo
          </Link>
          <div className="text-xs uppercase tracking-[0.24em] text-white/60">
            Premium Matcha · Signature
          </div>
          <h1 className="mt-3 font-serif text-5xl leading-[1.05] md:text-7xl">
            Matcha Guava Latte
          </h1>
          <p className="mt-6 max-w-xl text-base text-white/70 md:text-lg">
            Three layers, three sources. Cold-pressed guava on the bottom,
            steamed whole milk in the middle, and ceremonial matcha shaken with
            ice on top. Nothing artificial, nothing added.
          </p>
        </div>
      </section>

      {/* Ingredient section header */}
      <section className="mx-auto w-full max-w-5xl px-6 pt-24 md:pt-32">
        <div className="text-xs uppercase tracking-[0.24em] text-stone-500">
          The Recipe
        </div>
        <h2 className="mt-3 max-w-2xl font-serif text-4xl leading-tight text-stone-900 md:text-6xl">
          Built layer by layer, exactly as poured.
        </h2>
        <p className="mt-6 max-w-xl text-base text-stone-600 md:text-lg">
          Scroll to see each layer pull apart. Every ingredient is sourced
          directly — what you see is what's in the cup.
        </p>
      </section>

      {/* Scroll-animated layered diagram */}
      <LayeredDiagram />

      {/* Footer note */}
      <section className="mx-auto w-full max-w-5xl px-6 pb-32 pt-8">
        <p className="text-xs text-stone-500">
          *Image displayed is for illustration purposes only. Layer
          proportions may vary by cup.
        </p>
      </section>
    </main>
  );
}
