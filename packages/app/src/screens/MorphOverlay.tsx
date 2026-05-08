// Hero morph overlay — Frames 02→03→04→05.
//
// Renders an absolutely-positioned destination layout above the menu while the
// `progress` shared value animates 0→1. Choreography (per spec §5.1):
//
//   • Gray stage opacity: 0 → 1 (peaks at progress 0.55)
//   • Title/tags/price: fade in *with the panel* (no stagger)
//   • Selected drink image: source rect → destination rect (~30–40 px translate,
//     1.0 → 1.05 scale) — the "barely moves" trick
//   • White lower sheet: translateY +screenH → 0 over 0.55 → 1.0 with overshoot
//
// Easing on the panel/image: cubic-bezier(0.32, 0.72, 0, 1).
// Other-card desat + dark-band cross-fade are driven on the MENU layer using
// the same `progress` value (see PickupMenu morphProgress prop).

import { Animated, StyleSheet, Text, View } from "react-native";
import {
  ChevronLeft,
  CupQuestionIcon,
  DrinkBadge,
  PriceTag,
  TagChip,
} from "../components/atoms";
import { CupIllustration } from "../components/CupIllustration";
import { colors, fontFamily, radii, space, type } from "../theme/tokens";
import type { Drink, DrinkStub } from "../types";

export type Rect = { x: number; y: number; width: number; height: number };

type Props = {
  /** Drink the morph is heading to (full detail data when available, stub otherwise). */
  drink: Drink | DrinkStub;
  /** Where on the screen the tapped card's cup is, in viewport coords. */
  sourceRect: Rect;
  /** Where the cup should land on the detail page, in viewport coords. */
  destRect: Rect;
  /** Animated 0→1, driven externally. */
  progress: Animated.Value;
  /** Outer container size — used to know "offscreen" for the sheet slide. */
  containerHeight: number;
};

export function MorphOverlay({
  drink,
  sourceRect,
  destRect,
  progress,
  containerHeight,
}: Props) {
  // Panel opacity: 0 → 1 with a slightly biased curve so it peaks fully ready
  // by progress 0.55.
  const stageOpacity = progress.interpolate({
    inputRange: [0, 0.55, 1],
    outputRange: [0, 1, 1],
    extrapolate: "clamp",
  });

  // Drink image position/scale source → dest.
  const cupX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [sourceRect.x, destRect.x],
  });
  const cupY = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [sourceRect.y, destRect.y],
  });
  const cupScale = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [sourceRect.width / destRect.width, 1.0],
  });

  // White sheet slides from below.
  const sheetTranslate = progress.interpolate({
    inputRange: [0, 0.55, 0.92, 1],
    outputRange: [containerHeight, containerHeight, 4, 0], // tiny overshoot
    extrapolate: "clamp",
  });

  // Has detail data? (only the 5 detail drinks have tags/recipe link/etc.)
  const detailed = "tags" in drink ? (drink as Drink) : null;

  return (
    <View
      pointerEvents="none"
      style={StyleSheet.absoluteFill as any}
    >
      {/* Gray destination stage */}
      <Animated.View
        style={[
          styles.stage,
          { opacity: stageOpacity },
        ]}
      >
        <View style={styles.stageBack}>
          <ChevronLeft size={24} />
        </View>
        <View style={styles.stageContent}>
          {detailed ? (
            <>
              <Text style={styles.title} numberOfLines={2}>{detailed.name}</Text>
              <View style={styles.tags}>
                {detailed.tags.map((t) => (
                  <TagChip key={t.label} tag={t} />
                ))}
              </View>
              {detailed.hasRecipeLink ? (
                <View style={styles.recipeRow}>
                  <CupQuestionIcon size={20} />
                  <Text style={styles.recipeText}>Recipe/Calories/Allergens</Text>
                </View>
              ) : null}
            </>
          ) : (
            <Text style={styles.title}>{drink.name}</Text>
          )}
          <View style={styles.priceRow}>
            <PriceTag amount={drink.price} />
          </View>
        </View>
      </Animated.View>

      {/* White sheet sliding up with skeleton bars */}
      <Animated.View
        style={[
          styles.sheet,
          { transform: [{ translateY: sheetTranslate }] },
        ]}
      >
        <View style={styles.skelRow1}>
          <View style={[styles.skel, { width: 52, height: 52, borderRadius: 26 }]} />
          <View style={[styles.skel, { width: 52, height: 52, borderRadius: 26 }]} />
          <View style={[styles.skel, { width: 52, height: 52, borderRadius: 26 }]} />
        </View>
        <View style={[styles.skel, { width: "92%", height: 12 }]} />
        <View style={[styles.skel, { width: "84%", height: 12 }]} />
        <View style={[styles.skel, { width: "76%", height: 12 }]} />
        <View style={{ height: 24 }} />
        <View style={[styles.skel, { width: "60%", height: 14, marginBottom: 12 }]} />
        <View style={[styles.skel, { width: "100%", height: 56, borderRadius: 10 }]} />
        <View style={{ height: 12 }} />
        <View style={[styles.skel, { width: "100%", height: 56, borderRadius: 10 }]} />
      </Animated.View>

      {/* Floating cup — anchored at source rect, animating to destination rect.
          We use absolute (x,y,scale) to drive the FLIP. */}
      <Animated.View
        style={[
          styles.cup,
          {
            width: destRect.width,
            height: destRect.height,
            transform: [
              { translateX: cupX },
              { translateY: cupY },
              { scale: cupScale },
            ],
          },
        ]}
      >
        <CupIllustration drinkId={drink.image} size={destRect.width} />
        {drink.badge ? (
          <View style={styles.badge}>
            <DrinkBadge badge={drink.badge} size={36} />
          </View>
        ) : null}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  stage: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    minHeight: space.stageH,
    backgroundColor: colors.bgStage,
    paddingHorizontal: space.pagePad,
    paddingTop: 12,
    paddingBottom: 40,
  },
  stageBack: {
    width: 32,
    height: 32,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  stageContent: {
    paddingTop: 24,
    paddingRight: 140,
  },
  title: {
    fontFamily: fontFamily.body,
    fontSize: type.drinkTitle.size,
    fontWeight: type.drinkTitle.weight,
    letterSpacing: type.drinkTitle.tracking,
    lineHeight: type.drinkTitle.lineHeight,
    color: colors.textPrimary,
    marginBottom: 12,
  },
  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 16,
  },
  recipeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 16,
  },
  recipeText: {
    fontFamily: fontFamily.body,
    fontSize: type.recipeLink.size,
    fontWeight: type.recipeLink.weight,
    color: colors.textPrimary,
  },
  priceRow: { marginTop: 4 },

  // White sheet
  sheet: {
    position: "absolute",
    top: space.stageH - 20,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.bgPage,
    borderTopLeftRadius: radii.sheet,
    borderTopRightRadius: radii.sheet,
    paddingTop: 28,
    paddingHorizontal: space.pagePad,
    gap: 8,
  },
  skelRow1: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 18,
  },
  skel: {
    backgroundColor: colors.skeleton,
    borderRadius: 6,
  },

  // Cup
  cup: {
    position: "absolute",
    top: 0,
    left: 0,
    alignItems: "center",
    transformOrigin: "top left" as any,
  },
  badge: {
    position: "absolute",
    top: -2,
    right: -2,
  },
});
