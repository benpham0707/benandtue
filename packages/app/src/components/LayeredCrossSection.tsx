// Recipe diagram: stacked ingredient slices that take turns being emphasized
// as the explore section scrolls into view. Faithful port of the web
// LayeredDiagram component, scaled ~0.46× to fit the phone-sized section.
// Includes per-layer baseScale, sequential bell-curve focus, z-stacking,
// mute opacity, and the keyed brush-stroke backdrop behind each callout.

import { useMemo } from "react";
import { Animated, Image, StyleSheet, Text, View } from "react-native";

import { colors, fontFamily, type } from "../theme/tokens";
import type { CrossSectionLayer } from "../types";
import { assetPath } from "../utils/assetPath";

type Props = {
  layers: CrossSectionLayer[];
  scrollY: Animated.Value;
  /** Y of this section inside the scroll container, measured by parent. */
  sectionAbsY: number;
  /** Phone viewport height — drives the scroll trigger range. */
  viewportH: number;
};

// Natural aspect ratios (W/H) of the trimmed slice PNGs.
const ASPECT: Record<string, number> = {
  matcha: 1531 / 1123,
  milk: 1531 / 1237,
  guava: 1531 / 1154,
};

// All numeric constants below are the web values (320px-wide slice) scaled
// down by SCALE so the proportions match the polished web design exactly.
const SCALE = 0.46;
const SLICE_W = Math.round(320 * SCALE); // 147
// Per-pair overlap (top→bottom). matcha↔milk stays tight (scaled web value);
// milk↔guava uses a smaller overlap so guava sits noticeably below milk
// without nesting into its wave-tongues. Length = layers.length - 1.
const ASSEMBLED_OVERLAPS = [Math.round(50 * SCALE), 11];
const FOCUS: Record<"matcha" | "milk" | "guava", { push: number; scale: number }> = {
  matcha: { push: Math.round(56 * SCALE), scale: 1.05 },
  // Milk gets its own downward push when focused so it isn't crowded by the
  // matcha layer above. Combined with MILK_NUDGE.matcha pushing the matcha
  // layer up, this opens a clear gap during milk's turn. -5 trim so milk
  // doesn't drift too far from matcha; the extra space comes out of guava's
  // nudge instead.
  milk: { push: Math.round(60 * SCALE) - 5, scale: 1.1 },
  // Guava push pulled back 20px — it was moving too far away from the stack
  // when emphasised.
  guava: { push: Math.round(90 * SCALE) - 20, scale: 1.1 },
};
const MILK_NUDGE = {
  // Matcha pulled 5px closer to milk during milk's focus — was overshooting.
  matcha: Math.round(40 * SCALE) - 5,
  // Guava picks up the 5px milk gave up, so the milk↔guava gap grows by 5
  // during milk's focus and milk stays nearer the centre of the stack.
  guava: Math.round(78 * SCALE) + 5,
};
const EDGE_NUDGE = Math.round(8 * SCALE);
const CALLOUT_FOCUS_SCALE_BOOST = 0.04;

// Per-layer base size — exact web ratios.
const BASE_SCALE: Record<string, number> = {
  matcha: 1.0,
  milk: 0.78,
  guava: 0.7,
};

const PEAKS = { matcha: 0.22, milk: 0.38, guava: 0.55 };
const HALF_WIDTH = 0.12;
const SAMPLES = 41;

// Sticky-pin behavior: the diagram pins inside the viewport for this many
// viewport-heights of scroll travel, letting the matcha→milk→guava cycle
// play out slowly while the user keeps scrolling. Without this the section
// is small and the cycle would burn through in a fraction of a screen.
const STICKY_TRAVEL_VH = 1.5;
// Where in the viewport the diagram is pinned during the sticky window.
// 0 = top of viewport, 1 = bottom. 0.18 sits comfortably below the hero
// chrome on mobile.
const STICKY_PIN_VH = 0.18;

// Brush-stroke backdrop behind each callout. Pre-keyed transparent PNG so it
// composites cleanly over the explore section's beige bg without needing
// mix-blend-mode (which RN doesn't support).
const BRUSH_URI = assetPath("/bopomofo/brush-stroke-transparent.png");
const BRUSH_ASPECT = 2172 / 724; // natural W/H of the trimmed brush

// ----- math (same as web LayeredDiagram) -----

const bell = (p: number, peak: number, halfWidth: number) => {
  const d = Math.abs(p - peak);
  if (d >= halfWidth) return 0;
  const t = 1 - d / halfWidth;
  return t * t * (3 - 2 * t);
};

const focusFor = (idx: number, p: number) => {
  if (idx === 0) return bell(p, PEAKS.matcha, HALF_WIDTH);
  if (idx === 1) return bell(p, PEAKS.milk, HALF_WIDTH);
  return bell(p, PEAKS.guava, HALF_WIDTH);
};

const translateFor = (idx: number, p: number) => {
  const m = bell(p, PEAKS.matcha, HALF_WIDTH);
  const k = bell(p, PEAKS.milk, HALF_WIDTH);
  const g = bell(p, PEAKS.guava, HALF_WIDTH);
  if (idx === 0) {
    return -FOCUS.matcha.push * m - MILK_NUDGE.matcha * k - EDGE_NUDGE * g;
  }
  if (idx === 1) return FOCUS.milk.push * k;
  return FOCUS.guava.push * g + MILK_NUDGE.guava * k + EDGE_NUDGE * m;
};

const scaleFor = (idx: number, p: number) => {
  const conf = idx === 0 ? FOCUS.matcha : idx === 1 ? FOCUS.milk : FOCUS.guava;
  return 1 + (conf.scale - 1) * focusFor(idx, p);
};

const muteAmountFor = (idx: number, p: number) => {
  const my = focusFor(idx, p);
  const maxFocus = Math.max(
    bell(p, PEAKS.matcha, HALF_WIDTH),
    bell(p, PEAKS.milk, HALF_WIDTH),
    bell(p, PEAKS.guava, HALF_WIDTH),
  );
  return Math.max(0, maxFocus - my);
};

// Build a [0..1] progress sample table for one curve-of-p.
const sampleCurve = (fn: (p: number) => number) => {
  const inputs: number[] = [];
  const outputs: number[] = [];
  for (let i = 0; i <= SAMPLES; i++) {
    const p = i / SAMPLES;
    inputs.push(p);
    outputs.push(fn(p));
  }
  return { inputs, outputs };
};

// ----- component -----

export function LayeredCrossSection({
  layers,
  scrollY,
  sectionAbsY,
  viewportH,
}: Props) {
  // Geometry — uses each layer's baseScale.
  const geom = useMemo(() => {
    const widths = layers.map((l) => SLICE_W * (BASE_SCALE[l.id] ?? 1));
    const heights = layers.map((l, i) => widths[i] / (ASPECT[l.id] ?? 1.3));
    const tops: number[] = [];
    let yAcc = 0;
    for (let i = 0; i < layers.length; i++) {
      tops.push(yAcc);
      yAcc += heights[i];
      if (i < layers.length - 1) {
        const overlap =
          ASSEMBLED_OVERLAPS[i] ?? ASSEMBLED_OVERLAPS[0] ?? 0;
        yAcc -= overlap;
      }
    }
    const topBuffer = Math.max(FOCUS.matcha.push, MILK_NUDGE.matcha) + 16;
    const botBuffer = Math.max(FOCUS.guava.push, MILK_NUDGE.guava) + 16;
    const stackH = yAcc + topBuffer + botBuffer;
    return { widths, heights, tops, topBuffer, stackH };
  }, [layers]);

  // Scroll trigger synced to the diagram's actual viewing window. Cycle
  // starts when the section's top reaches the top of the viewport (so the
  // header eyebrow + h2 + description have just scrolled off and the
  // diagram is sitting comfortably in the upper part of the viewport).
  // Cycle ends ~0.7 viewports later — by which point the diagram has
  // scrolled past viewport top. No empty layout, no early-fire while the
  // section is still mostly below the screen.
  const start = Math.max(0, sectionAbsY);
  const end = Math.max(start + 1, sectionAbsY + viewportH * 0.7);
  const progress = scrollY.interpolate({
    inputRange: [start, end],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  // Per-layer animated values, sampled from the bell-curve math.
  const animated = useMemo(
    () =>
      layers.map((_, i) => {
        const ty = sampleCurve((p) => translateFor(i, p));
        const sc = sampleCurve((p) => scaleFor(i, p));
        // Slice mute — opacity 1 → 0.45 (RN has no saturate filter; opacity
        // alone carries the cue).
        const sliceOpacity = sampleCurve(
          (p) => 1 - muteAmountFor(i, p) * 0.55,
        );
        // Callout text — gentler mute so labels stay readable.
        const calloutOpacity = sampleCurve(
          (p) => 1 - muteAmountFor(i, p) * 0.6,
        );
        // Brush — aggressive mute so non-focused strokes nearly vanish.
        // Compounds with the parent callout opacity, so 1 × 1 = 1 focused,
        // 0.4 × 0.15 ≈ 0.06 muted (matching the web feel).
        const brushOpacity = sampleCurve(
          (p) => 1 - muteAmountFor(i, p) * 0.85,
        );
        const calloutScale = sampleCurve(
          (p) => 1 + CALLOUT_FOCUS_SCALE_BOOST * focusFor(i, p),
        );
        return {
          ty,
          sc,
          sliceOpacity,
          calloutOpacity,
          brushOpacity,
          calloutScale,
        };
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [layers.length],
  );

  return (
    <View style={styles.row}>
      {/* Slice column */}
      <View
        style={[
          styles.cupCol,
          { width: SLICE_W + 24, height: geom.stackH },
        ]}
      >
        {layers.map((layer, i) => {
          const a = animated[i];
          const translateY = progress.interpolate({
            inputRange: a.ty.inputs,
            outputRange: a.ty.outputs,
          });
          const scale = progress.interpolate({
            inputRange: a.sc.inputs,
            outputRange: a.sc.outputs,
          });
          const opacity = progress.interpolate({
            inputRange: a.sliceOpacity.inputs,
            outputRange: a.sliceOpacity.outputs,
          });
          // Stack: matcha (idx 0) front, milk middle, guava (last) behind.
          const zIndex = layers.length - i;
          return (
            <Animated.View
              key={layer.id}
              style={[
                styles.slice,
                {
                  top: geom.tops[i] + geom.topBuffer,
                  width: SLICE_W + 24,
                  height: geom.heights[i],
                  opacity,
                  transform: [{ translateY }, { scale }],
                  zIndex,
                },
              ]}
            >
              <Image
                source={{ uri: assetPath(layer.src) }}
                style={{
                  width: geom.widths[i],
                  height: geom.heights[i],
                  alignSelf: "center",
                }}
                resizeMode="contain"
                accessibilityIgnoresInvertColors
              />
            </Animated.View>
          );
        })}
      </View>

      {/* Callouts column — each callout shares its layer's translateY +
          carries its own brush-stroke backdrop. */}
      <View style={[styles.calloutCol, { height: geom.stackH }]}>
        {layers.map((layer, i) => {
          const a = animated[i];
          const translateY = progress.interpolate({
            inputRange: a.ty.inputs,
            outputRange: a.ty.outputs,
          });
          const opacity = progress.interpolate({
            inputRange: a.calloutOpacity.inputs,
            outputRange: a.calloutOpacity.outputs,
          });
          const scale = progress.interpolate({
            inputRange: a.calloutScale.inputs,
            outputRange: a.calloutScale.outputs,
          });
          const brushOpacity = progress.interpolate({
            inputRange: a.brushOpacity.inputs,
            outputRange: a.brushOpacity.outputs,
          });
          const centerY = geom.tops[i] + geom.heights[i] / 2 + geom.topBuffer;
          const zIndex = layers.length - i;
          // Brush sized to fit inside the actual callout column so it
          // doesn't run off the right edge of the phone container.
          const brushW = 158;
          const brushH = brushW / BRUSH_ASPECT;
          return (
            <Animated.View
              key={layer.id}
              style={[
                styles.calloutRow,
                {
                  top: centerY - 14,
                  opacity,
                  transform: [{ translateY }, { scale }],
                  zIndex,
                },
              ]}
            >
              <View style={styles.leader} />
              <View style={styles.calloutText}>
                {/* Brush backdrop — sized + positioned to sit behind the
                    eyebrow + label text. */}
                <Animated.View
                  style={[
                    styles.brushWrap,
                    {
                      width: brushW,
                      height: brushH,
                      // Brush sits flush with the callout column — start
                      // a few pixels into the left so the leader line still
                      // peeks out, and the right side never crosses the
                      // container boundary.
                      marginLeft: -23,
                      marginTop: -brushH / 2 + 12,
                      opacity: brushOpacity,
                    },
                  ]}
                  pointerEvents="none"
                >
                  <Image
                    source={{ uri: BRUSH_URI }}
                    style={{ width: brushW, height: brushH }}
                    resizeMode="stretch"
                    accessibilityIgnoresInvertColors
                  />
                </Animated.View>
                <View style={styles.calloutTextInner}>
                  {layer.eyebrow ? (
                    <Text style={styles.eyebrow} numberOfLines={1}>
                      {layer.eyebrow}
                    </Text>
                  ) : null}
                  <Text style={styles.label} numberOfLines={1}>
                    {layer.label}
                  </Text>
                </View>
              </View>
            </Animated.View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingTop: 8,
    paddingBottom: 8,
  },
  cupCol: {
    position: "relative",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  slice: {
    position: "absolute",
    left: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  calloutCol: {
    flex: 1,
    paddingLeft: 4,
    position: "relative",
  },
  calloutRow: {
    position: "absolute",
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  leader: {
    width: 14,
    height: 0,
    borderTopWidth: 0.8,
    borderTopColor: colors.divider,
    borderStyle: "dashed",
  },
  calloutText: {
    flex: 1,
    position: "relative",
  },
  brushWrap: {
    position: "absolute",
    left: 0,
    top: 0,
  },
  calloutTextInner: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  eyebrow: {
    fontFamily: fontFamily.body,
    fontSize: 6,
    fontWeight: "500",
    color: "rgba(255,255,255,0.85)",
    letterSpacing: 0.4,
    lineHeight: 8,
    textTransform: "uppercase",
  },
  label: {
    fontFamily: fontFamily.body,
    fontSize: 9.5,
    fontWeight: "600",
    color: "#FFFFFF",
    lineHeight: 11.5,
    marginTop: 1,
  },
});
