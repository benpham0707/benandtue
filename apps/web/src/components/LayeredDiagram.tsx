"use client";

// Web-native scroll-animated recipe diagram. Three liquid slice PNGs stacked
// in cup-shape order. Scroll choreography: layers start close together (small
// negative gap), then each one in turn (matcha → milk → guava) pulls away
// from its neighbours and scales up a touch as it becomes the "featured"
// ingredient. After its moment it returns to the stack.

import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useRef } from "react";

export type DiagramLayer = {
  id: string;
  src: string;
  label: string;
  eyebrow?: string;
  /** Natural aspect ratio (W/H) of the trimmed slice PNG. */
  aspect: number;
  /** Visual base size relative to SLICE_W. 1 = full, 0.9 = 10% smaller. */
  baseScale?: number;
};

export const MATCHA_GUAVA_LAYERS: DiagramLayer[] = [
  {
    id: "matcha",
    src: "/bopomofo/recipe-slices/matcha.png",
    label: "Ceremonial Matcha",
    eyebrow: "Uji, Japan · stone-milled",
    aspect: 1531 / 1123,
  },
  {
    id: "milk",
    src: "/bopomofo/recipe-slices/milk.png",
    label: "Steamed Whole Milk",
    eyebrow: "Local dairy",
    aspect: 1531 / 1237,
    baseScale: 0.78,
  },
  {
    id: "guava",
    src: "/bopomofo/recipe-slices/guava.png",
    label: "Fresh Guava Purée",
    eyebrow: "Cold-pressed, no sweetener",
    aspect: 1531 / 1154,
    baseScale: 0.7,
  },
];

const SLICE_W = 320; // px — reference width; per-layer width = SLICE_W * baseScale
const ASSEMBLED_OVERLAP = 50; // start: adjacent layers near each other, small overlap
// Per-layer focus profile — how far the layer translates AND how much it
// scales up on its own emphasis turn. Matcha pulls less + scales less than
// guava since it's the top layer and visually dominant already.
const FOCUS: Record<"matcha" | "milk" | "guava", { push: number; scale: number }> = {
  matcha: { push: 56, scale: 1.05 },
  milk: { push: 0, scale: 1.1 }, // milk doesn't translate on its turn, only scales
  guava: { push: 90, scale: 1.1 },
};
// When MILK is the featured layer, matcha + guava nudge outward to give it
// room. Asymmetric — guava moves a "decent amount" more than matcha.
const MILK_FOCUS_NUDGE = { matcha: 40, guava: 78 };
// When an EDGE layer (matcha/guava) is featured, the OTHER edge layer barely
// moves — a small token shift to keep the silhouette breathing.
const EDGE_FOCUS_NUDGE = 8;
// Callout scale-up amount when its layer is focused.
const CALLOUT_FOCUS_SCALE_BOOST = 0.04;

// Bell curve: 1 at peak, smoothly falls to 0 at peak ± half-width.
const bell = (p: number, peak: number, halfWidth: number) => {
  const d = Math.abs(p - peak);
  if (d >= halfWidth) return 0;
  const t = 1 - d / halfWidth;
  return t * t * (3 - 2 * t); // smoothstep
};

// Compressed into the first ~60% of scroll so the full cycle completes
// while the diagram is still well within the viewport — no more "guava
// happens after the section has scrolled away."
const PEAKS = { matcha: 0.22, milk: 0.38, guava: 0.55 };
const HALF_WIDTH = 0.12;

export function LayeredDiagram({
  layers = MATCHA_GUAVA_LAYERS,
}: {
  layers?: DiagramLayer[];
}) {
  const sectionRef = useRef<HTMLElement>(null);
  // Tight scroll trigger — animation completes across the section's own
  // height plus one viewport-height of approach. Faster than the previous
  // sticky pin.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Per-layer rendered width/height using each layer's baseScale.
  const widths = layers.map((l) => SLICE_W * (l.baseScale ?? 1));
  const heights = layers.map((l, i) => widths[i] / l.aspect);

  // Assembled top of each layer.
  const assembledTops: number[] = [];
  let yAcc = 0;
  for (let i = 0; i < layers.length; i++) {
    assembledTops.push(yAcc);
    yAcc += heights[i];
    if (i < layers.length - 1) yAcc -= ASSEMBLED_OVERLAP;
  }
  const stackContentH = yAcc;
  // Container height accommodates the peak displacement of the outer layers
  // (matcha pulling up + guava pulling down + milk nudge for guava).
  const TOP_BUFFER = Math.max(FOCUS.matcha.push, MILK_FOCUS_NUDGE.matcha) + 24;
  const BOT_BUFFER = Math.max(FOCUS.guava.push, MILK_FOCUS_NUDGE.guava) + 24;
  const stackH = stackContentH + TOP_BUFFER + BOT_BUFFER;

  return (
    <section
      ref={sectionRef}
      className="relative mx-auto w-full max-w-5xl px-6 py-16 md:py-20"
    >
      <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-10 md:gap-16 items-start">
        {/* Slice column */}
        <div
          className="relative mx-auto md:mx-0"
          style={{ width: SLICE_W + 40, height: stackH }}
        >
          {layers.map((layer, i) => (
            <LayerSlice
              key={layer.id}
              layer={layer}
              idx={i}
              total={layers.length}
              top={assembledTops[i] + TOP_BUFFER}
              width={widths[i]}
              height={heights[i]}
              progress={scrollYProgress}
            />
          ))}
        </div>

        {/* Callouts column */}
        <div className="relative w-full" style={{ height: stackH }}>
          {layers.map((layer, i) => (
            <LayerCallout
              key={layer.id}
              layer={layer}
              idx={i}
              total={layers.length}
              centerY={assembledTops[i] + heights[i] / 2 + TOP_BUFFER}
              progress={scrollYProgress}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function LayerSlice({
  layer,
  idx,
  total,
  top,
  width,
  height,
  progress,
}: {
  layer: DiagramLayer;
  idx: number; // 0 = matcha (top), 1 = milk (middle), 2 = guava (bottom)
  total: number;
  top: number;
  width: number;
  height: number;
  progress: MotionValue<number>;
}) {
  const ty = useTransform(progress, (p) => translateForIdx(idx, p));
  const scale = useTransform(progress, (p) => scaleForIdx(idx, p));
  // Muted = some OTHER layer is being focused while this one isn't. At scroll
  // start (no layer focused) muteAmount is 0 → full opacity + saturation.
  const opacity = useTransform(progress, (p) => 1 - muteAmount(idx, p) * 0.55);
  const filter = useTransform(
    progress,
    (p) => `saturate(${(1 - muteAmount(idx, p) * 0.45).toFixed(3)})`,
  );
  // Stack so matcha (top) is in front, milk middle, guava behind.
  const zIndex = total - idx;

  return (
    <motion.div
      className="absolute left-0 right-0 flex justify-center"
      style={{ top, y: ty, scale, zIndex, opacity, filter }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={layer.src}
        alt={layer.label}
        width={width}
        height={height}
        style={{ width, height, objectFit: "contain" }}
        draggable={false}
      />
    </motion.div>
  );
}

function LayerCallout({
  layer,
  idx,
  total,
  centerY,
  progress,
}: {
  layer: DiagramLayer;
  idx: number;
  total: number;
  centerY: number;
  progress: MotionValue<number>;
}) {
  const ty = useTransform(progress, (p) => translateForIdx(idx, p));
  const calloutScale = useTransform(
    progress,
    (p) => 1 + CALLOUT_FOCUS_SCALE_BOOST * focusForIdx(idx, p),
  );
  // Text mute — same gentle dim as before.
  const opacity = useTransform(progress, (p) => 1 - muteAmount(idx, p) * 0.6);
  // Brush mute — much more aggressive so non-focused strokes recede into the
  // background. Compounds with the parent motion.div opacity, so the effective
  // brush alpha is `opacity * brushOpacity` — roughly 1.0 when focused and
  // ~0.06 when another layer is focused.
  const brushOpacity = useTransform(
    progress,
    (p) => 1 - muteAmount(idx, p) * 0.85,
  );
  const zIndex = total - idx;
  return (
    <motion.div
      className="absolute left-0 right-0 flex items-center gap-4"
      style={{ top: centerY - 24, y: ty, opacity, scale: calloutScale, zIndex }}
    >
      <div className="hidden md:block h-px w-12 border-t border-dashed border-stone-300" />
      <div className="relative inline-block">
        {/* Brush-stroke backdrop. mix-blend-mode: multiply knocks the image's
            white background out against the white page bg so only the smear
            shows. */}
        <motion.img
          src="/bopomofo/brush-stroke.png"
          alt=""
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 -z-0 w-[150%] max-w-none -translate-x-1/2 -translate-y-1/2 select-none"
          style={{ mixBlendMode: "multiply", opacity: brushOpacity }}
          draggable={false}
        />
        <div className="relative z-10 px-4 py-2">
          {layer.eyebrow ? (
            <div className="text-[11px] uppercase tracking-[0.12em] text-white/85">
              {layer.eyebrow}
            </div>
          ) : null}
          <div className="text-xl md:text-2xl font-semibold text-white">
            {layer.label}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ---------- shared focus math ----------

function focusForIdx(idx: number, p: number): number {
  if (idx === 0) return bell(p, PEAKS.matcha, HALF_WIDTH);
  if (idx === 1) return bell(p, PEAKS.milk, HALF_WIDTH);
  return bell(p, PEAKS.guava, HALF_WIDTH);
}

// 0 = this layer is the focused one (or no layer is focused) → no muting.
// 1 = another layer is fully focused and this one isn't → maximum mute.
function muteAmount(idx: number, p: number): number {
  const myFocus = focusForIdx(idx, p);
  const maxFocus = Math.max(
    bell(p, PEAKS.matcha, HALF_WIDTH),
    bell(p, PEAKS.milk, HALF_WIDTH),
    bell(p, PEAKS.guava, HALF_WIDTH),
  );
  return Math.max(0, maxFocus - myFocus);
}

function translateForIdx(idx: number, p: number): number {
  const m = bell(p, PEAKS.matcha, HALF_WIDTH);
  const k = bell(p, PEAKS.milk, HALF_WIDTH);
  const g = bell(p, PEAKS.guava, HALF_WIDTH);
  if (idx === 0) {
    return (
      -FOCUS.matcha.push * m -
      MILK_FOCUS_NUDGE.matcha * k -
      EDGE_FOCUS_NUDGE * g
    );
  }
  if (idx === 1) return 0;
  return (
    FOCUS.guava.push * g +
    MILK_FOCUS_NUDGE.guava * k +
    EDGE_FOCUS_NUDGE * m
  );
}

function scaleForIdx(idx: number, p: number): number {
  // baseScale is applied to the rendered img width/height, so the transform
  // scale just adds the focus emphasis on top.
  const target = idx === 0 ? FOCUS.matcha : idx === 1 ? FOCUS.milk : FOCUS.guava;
  return 1 + (target.scale - 1) * focusForIdx(idx, p);
}
