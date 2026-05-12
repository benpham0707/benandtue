// Drink detail screen — Frames 06/07/14/15/16 + 08/09/10.
// Builds the full anatomy from BOPOMOFO_MENU_SPEC.md §4.

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {
  Animated,
  Easing,
  Image,
  type LayoutChangeEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  CheckIcon,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CupQuestionIcon,
  DrinkBadge,
  MinusIcon,
  PlusIcon,
  PriceTag,
  TagChip,
} from "../components/atoms";
import { CrossSection } from "../components/CrossSection";
import { LayeredCrossSection } from "../components/LayeredCrossSection";
import { CupIllustration } from "../components/CupIllustration";
import { RealCup } from "../components/RealCup";
import {
  SpinCup,
  type SpinCupHandle,
  hasSpinFrames,
  getSpinFrameCount,
} from "../components/SpinCup";
import { disclaimers, getDetailDrink } from "../data/drinks";
import { colors, fontFamily, layout, motion, radii, space, type } from "../theme/tokens";
import type { Drink, Variant } from "../types";
import { assetPath } from "../utils/assetPath";

export type DrinkDetailHandle = {
  /** Used by morph to fade the post-mount real content in. */
  setRealContentOpacity: (v: number) => void;
};

type Props = {
  drinkId: string;
  onBack: () => void;
  /** Initial display drink (for variant swap state). Defaults to drinkId's detail data. */
  initialDrinkId?: string;
};

export const DrinkDetail = forwardRef<DrinkDetailHandle, Props>(function DrinkDetail(
  { drinkId, onBack },
  ref,
) {
  const [activeVariantId, setActiveVariantId] = useState<string>(drinkId);
  const drink = getDetailDrink(activeVariantId) ?? getDetailDrink(drinkId);

  // Customization selection state.
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [expandedKey, setExpandedKey] = useState<string | null>(null);

  // Variant body fade — drives §5.4 swap animation.
  const bodyFade = useRef(new Animated.Value(1)).current;
  // Real content opacity — driven externally by the morph (sets to 0 then animates to 1).
  // Defaults to 1 so direct (non-morph) navigation renders fully visible immediately.
  const realFade = useRef(new Animated.Value(1)).current;

  // Y of the recipe (Cream Explore) section relative to the sheet's top —
  // measured at runtime; drives the docked-cup release.
  const [exploreOffsetY, setExploreOffsetY] = useState(0);
  const onExploreLayout = useCallback((e: LayoutChangeEvent) => {
    setExploreOffsetY(e.nativeEvent.layout.y);
  }, []);

  // Root width + height — width centers the cup horizontally; height drives
  // the cup-release trigger (we start scrolling the cup off-screen once the
  // recipe/explore section is close to entering the viewport).
  const [rootW, setRootW] = useState<number>(layout.phoneWidth);
  const [rootH, setRootH] = useState<number>(layout.phoneHeight);
  const onRootLayout = useCallback((e: LayoutChangeEvent) => {
    setRootW(e.nativeEvent.layout.width);
    setRootH(e.nativeEvent.layout.height);
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      setRealContentOpacity: (v) => realFade.setValue(v),
    }),
    [realFade],
  );

  // Scroll value for parallax collapse (§4.16 / §5.3).
  const scrollY = useRef(new Animated.Value(0)).current;
  const spinRef = useRef<SpinCupHandle | null>(null);
  const spinConfigRef = useRef({ start: 0, distance: 320, frames: 96 });

  // Cup-spec card height (for the parallax override) — measured at runtime.
  const [cupSpecCardHeight, setCupSpecCardHeight] = useState(0);

  const onCupSpecLayout = useCallback((e: LayoutChangeEvent) => {
    setCupSpecCardHeight(e.nativeEvent.layout.height);
  }, []);

  // Per-chip widths + chip height captured from the inline tag row — drives
  // the row-2 height animation that opens up below the static chips when the
  // overflow chip wraps.
  const [tagChipWidths, setTagChipWidths] = useState<Record<string, number>>({});
  const [tagChipHeight, setTagChipHeight] = useState(0);
  const onTagChipLayout = useCallback(
    (label: string) => (e: LayoutChangeEvent) => {
      const { width: w, height: h } = e.nativeEvent.layout;
      setTagChipWidths((prev) =>
        prev[label] === w ? prev : { ...prev, [label]: w },
      );
      setTagChipHeight((prev) => (prev === h ? prev : h));
    },
    [],
  );

  const swapVariant = useCallback(
    (v: Variant) => {
      // 1. body fade out
      Animated.timing(bodyFade, {
        toValue: 0.3,
        duration: motion.variant.bodyFadeOut,
        useNativeDriver: false,
      }).start(() => {
        setActiveVariantId(v.id);
        Animated.timing(bodyFade, {
          toValue: 1,
          duration: motion.variant.bodyFadeIn,
          useNativeDriver: false,
        }).start();
      });
    },
    [bodyFade],
  );

  if (!drink) {
    return (
      <View style={styles.root}>
        <Text style={styles.notFound}>Drink not found</Text>
      </View>
    );
  }

  // Parallax interpolations.
  const offset = cupSpecCardHeight + (drink.cupSpecs ? 24 : 0); // cup-spec override
  const adjustedScroll = Animated.subtract(scrollY, offset).interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
    extrapolate: "clamp",
  }); // not really useful — simpler: derive from scrollY via interpolate that clamps below 0
  const sPrime = scrollY.interpolate({
    inputRange: [offset, offset + 1],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });
  // Hero content choreography: the title + tags shrink and slide left into a
  // compact left-aligned block as the cup docks center; the recipe link and
  // price fade out (they're not needed in the docked state).
  //
  // Title animation runs slightly faster than the cup dock (ends at 70 vs the
  // dock's 100) and uses an ease-in-out curve so the resize feels distinct from
  // the cup's linear track instead of locked-step.
  const TITLE_END = 70;
  const easeSamples = 8;
  const titleEaseInputs: number[] = [];
  const titleScaleOutputs: number[] = [];
  const titleTxOutputs: number[] = [];
  const titleTyOutputs: number[] = [];
  for (let i = 0; i <= easeSamples; i++) {
    const t = i / easeSamples;
    // ease-in-out cubic
    const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    titleEaseInputs.push(t * TITLE_END);
    titleScaleOutputs.push(1 + (0.85 - 1) * eased);
    titleTxOutputs.push(0 + (-6 - 0) * eased);
    titleTyOutputs.push(0 + (-4 - 0) * eased);
  }
  const titleScale = scrollY.interpolate({
    inputRange: titleEaseInputs,
    outputRange: titleScaleOutputs,
    extrapolate: "clamp",
  });
  const titleTranslateX = scrollY.interpolate({
    inputRange: titleEaseInputs,
    outputRange: titleTxOutputs,
    extrapolate: "clamp",
  });
  const titleTranslateY = scrollY.interpolate({
    inputRange: titleEaseInputs,
    outputRange: titleTyOutputs,
    extrapolate: "clamp",
  });
  // Tag overflow choreography — only the *last* chip animates. It fades out
  // in place on row 1 (still occupying its inline layout slot, so static
  // chips don't shift), and a duplicate of it in row 2 fades in as that row
  // slides open. Static chips render exactly once with no opacity animation
  // so they stay visually solid (stacking two semi-transparent copies of the
  // same chip composites to ≈ 75%, not 100% — that's why the static chips
  // were appearing washed out before).
  const tagsInlineOpacity = scrollY.interpolate({
    inputRange: [0, TITLE_END],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });
  const tagsWrappedOpacity = scrollY.interpolate({
    inputRange: [0, TITLE_END],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });
  // Price fades a touch faster than the recipe link so the disappearance has
  // a sense of sequence rather than a synchronised dissolve. Both fade in
  // place — the row-2 tag is positioned absolutely below so it doesn't push
  // these rows down as it opens.
  // Price + recipe rows fade right-to-left via a CSS mask gradient. The
  // sweep is driven by a CSS custom property (`--sweep`) written directly to
  // the DOM node from the scroll listener — no React state, so the dock
  // animations don't re-render on every scroll tick.
  const priceRowRef = useRef<any>(null);
  const recipeRowRef = useRef<any>(null);
  useEffect(() => {
    const id = scrollY.addListener(({ value }) => {
      const priceP = Math.max(0, Math.min(1, value / 45));
      const recipeP = Math.max(0, Math.min(1, value / 65));
      const priceEl = priceRowRef.current as HTMLElement | null;
      const recipeEl = recipeRowRef.current as HTMLElement | null;
      if (priceEl?.style) priceEl.style.setProperty("--sweep", String(priceP));
      if (recipeEl?.style)
        recipeEl.style.setProperty("--sweep", String(recipeP));
      const cfg = spinConfigRef.current;
      const spinP = Math.max(0, Math.min(1, (value - cfg.start) / cfg.distance));
      spinRef.current?.setFrame(Math.floor(spinP * (cfg.frames - 1)));
    });
    return () => {
      scrollY.removeListener(id);
    };
  }, [scrollY]);
  // Mask: solid black from the left up to the sweep stop, then a 30% soft
  // band fading to transparent. At --sweep=0 the gradient sits off the right
  // edge (fully visible); at --sweep=1 it has swept past the left edge.
  const sweepMaskStyle = {
    maskImage:
      "linear-gradient(to right, #000 calc(100% - var(--sweep, 0) * 130%), transparent calc(130% - var(--sweep, 0) * 130%))",
    WebkitMaskImage:
      "linear-gradient(to right, #000 calc(100% - var(--sweep, 0) * 130%), transparent calc(130% - var(--sweep, 0) * 130%))",
  } as any;
  // Overflow logic: when there are 2+ chips and they've all measured in,
  // peel the last chip off as the "overflow" chip. The row-2 container's
  // height animates from 0 to one chip-height (+ gap) so the layout below
  // doesn't reserve empty space at scroll=0.
  const TAG_GAP = 4;
  const TAG_OVERFLOW_THRESHOLD = 100;
  const tagWidthsArr = drink.tags.map((t) => tagChipWidths[t.label] ?? 0);
  const tagsAllMeasured =
    tagWidthsArr.length >= 2 && tagWidthsArr.every((w) => w > 0);
  const totalInlineWidth = tagsAllMeasured
    ? tagWidthsArr.reduce((s, w) => s + w, 0) +
      TAG_GAP * (tagWidthsArr.length - 1)
    : 0;
  const hasOverflow = tagsAllMeasured && totalInlineWidth > TAG_OVERFLOW_THRESHOLD;
  const overflowChip = hasOverflow ? drink.tags[drink.tags.length - 1] : null;
  // Vertical gap between row 1 and the docked overflow chip on row 2.
  const TAG_ROW_GAP = 6;
  // -------- Layout constants --------
  const containerW = rootW;
  const cupW = space.heroImageW;
  const cupH = cupW * 1.4;
  // Hero is a fixed-height tiger mural that never scales. Only the white
  // sheet sliding up over it changes what's visible.
  const HERO_INIT_H = 270;
  // Initial cup position — 75% over tiger, 25% in white sheet across the seam.
  // The cup PNGs are ~0.77:1 (W:H), so when rendered with `contain` in a
  // cupW × cupH box (W:H = 0.71), the image fits to width and the visible cup
  // height is roughly cupW × 1.3.
  const HERO_TX = containerW - 36 - cupW;
  // RealCup: 0.77:1 PNG fills the cupW × cupH box to ~1.3 cupW vertically.
  // SpinCup: 1:1 webp fits width inside cupW × cupH, then the cup body itself
  // only occupies ~85% of the rendered square, so the actual visible cup is
  // ~0.85 cupW tall. Using the wrong ratio causes the docked cup bottom to
  // mis-align with the content seam by ~0.3 cupW × DOCK_SCALE.
  const visibleCupH = hasSpinFrames(drink.image) ? cupW * 0.85 : cupW * 1.3;
  const sheetSeamY = HERO_INIT_H - 20;
  const HERO_TY = sheetSeamY - 0.75 * visibleCupH - (cupH - visibleCupH) / 2;

  // -------- White veil parallax + cup dock --------
  // During the parallax phase, the white veil rises just enough to cover the
  // top 30% of the tiger, shifting focus from the mural to the drink and the
  // customizations below. The cup tracks the veil's seam vertically (always
  // 40% white / 60% tiger) and slides from the right edge to horizontal
  // center. After the phase, the cup continues scrolling off with the content.
  const PARALLAX_END = 100;
  // Scroll-linked 360° spin: starts just after the cup docks, runs over
  // SPIN_DISTANCE px of scroll. Frame index is mutated directly on the
  // <img> ref (no React re-render) from the scrollY listener below.
  const SPIN_FRAMES = getSpinFrameCount(drink.image) || 96;
  const SPIN_START = 0;
  // Veil ends up covering 30% of the tiger from the bottom. Subtract the 20px
  // already covered initially (sheet/hero overlap) to get the net rise.
  const VEIL_RISE = HERO_INIT_H * 0.3 - (HERO_INIT_H - sheetSeamY);
  const DOCK_TX = (containerW - cupW) / 2;
  const DOCK_SCALE = 1.15;
  // cupTranslateY at parallax end keeps the 75/25 ratio across the new seam,
  // accounting for scale (visible cup shrinks proportionally around its center).
  // seam − cup_center = (0.5 − 0.25) * (scale * visibleCupH) = 0.25 * scale * VH.
  const dockTranslateY =
    sheetSeamY - VEIL_RISE - 0.25 * DOCK_SCALE * visibleCupH - cupH / 2;
  // Where the docked cup's visible bottom sits in screen y. The hero shrinks
  // to this value so the ScrollView starts right under the docked cup,
  // eliminating the dead white space between cup and content.
  const dockedCupBottomY = sheetSeamY - VEIL_RISE + 0.25 * DOCK_SCALE * visibleCupH;

  // Linear interpolation for the dock animations. Ease-out would settle the
  // cup to slope 0 at PARALLAX_END, then the post-dock scroll would resume at
  // slope -1 — that 100% rate jump reads as a "bounce" right after the cup
  // sticks. Linear keeps the in-parallax cup slope at ~-0.756 px/scroll px,
  // so the transition to the natural -1 slope is only a ~24% rate change.
  const DOCK_EASE_SAMPLES = 16;
  const dockEaseInputs: number[] = [];
  const dockEaseProgress: number[] = [];
  for (let i = 0; i <= DOCK_EASE_SAMPLES; i++) {
    const t = i / DOCK_EASE_SAMPLES;
    dockEaseInputs.push(t * PARALLAX_END);
    dockEaseProgress.push(t);
  }
  const dockEase = (from: number, to: number) =>
    scrollY.interpolate({
      inputRange: dockEaseInputs,
      outputRange: dockEaseProgress.map((p) => from + (to - from) * p),
      extrapolate: "clamp",
    });

  const heroHeight = dockEase(HERO_INIT_H, dockedCupBottomY);
  const cupTranslateX = dockEase(HERO_TX, DOCK_TX);
  const cupScale = dockEase(1, DOCK_SCALE);

  // ---- Hero release ----
  // Once the recipe/explore section is approaching the viewport, scroll the
  // entire top stack — hero (mural + title + tags), white veil, and the
  // docked cup — up off-screen as a unit. The hero uses a negative marginTop
  // so its layout space collapses and the recipe section slides up to take
  // over the viewport. The cup and veil translate by the same delta so they
  // stay glued to the hero as it leaves.
  const releaseDefined = exploreOffsetY > 0 && rootH > 0;
  const releaseStart = releaseDefined
    ? Math.max(PARALLAX_END + 60, exploreOffsetY - rootH * 0.55)
    : 0;
  const releaseEnd = releaseStart + 200;

  // Scroll distance over which the cup rotates 360°. Spans the full
  // visible-cup window (dock → stick → release) so the cup keeps spinning
  // as the user scrolls all the way until it's off-screen.
  const SPIN_DISTANCE = releaseDefined ? releaseEnd : 320;
  spinConfigRef.current.start = SPIN_START;
  spinConfigRef.current.distance = SPIN_DISTANCE;
  spinConfigRef.current.frames = SPIN_FRAMES;

  // Helper: extends a dock-eased curve with a linear release segment that
  // pushes the value by `releaseDelta` (negative = up) past releaseStart.
  const dockEaseWithRelease = (from: number, to: number, releaseDelta: number) => {
    if (!releaseDefined) return dockEase(from, to);
    return scrollY.interpolate({
      inputRange: [...dockEaseInputs, releaseStart, releaseEnd],
      outputRange: [
        ...dockEaseProgress.map((p) => from + (to - from) * p),
        to,
        to + releaseDelta,
      ],
      extrapolate: "clamp",
    });
  };

  const cupTranslateY = dockEaseWithRelease(HERO_TY, dockTranslateY, -dockedCupBottomY);
  const veilTranslateY = dockEaseWithRelease(0, -VEIL_RISE, -dockedCupBottomY);
  const heroMarginTop = releaseDefined
    ? scrollY.interpolate({
        inputRange: [releaseStart, releaseEnd],
        outputRange: [0, -dockedCupBottomY],
        extrapolate: "clamp",
      })
    : 0;

  // Content trails the docking cup with the same ease-out curve so the gap
  // between cup_bottom and content_top stays constant. With matching easing
  // on hero + cup, the formula reduces to translateY(s) = s − 38.5 · y(t).
  const initialCupBottomY = HERO_TY + cupH / 2 + visibleCupH / 2;
  const cupHeroInitialDelta = initialCupBottomY - HERO_INIT_H; // 38.5
  const contentTranslateY = scrollY.interpolate({
    inputRange: dockEaseInputs,
    outputRange: dockEaseInputs.map(
      (input, i) => input - cupHeroInitialDelta * dockEaseProgress[i],
    ),
    extrapolate: "clamp",
  });

  return (
    <View style={styles.root} onLayout={onRootLayout}>
      {/* Sticky hero — mural + title. Shrinks during parallax so the ScrollView
          extends upward and sits right under the docked cup; the mural image
          inside stays at full HERO_INIT_H and is clipped by overflow:hidden. */}
      <Animated.View
        style={[styles.hero, { height: heroHeight, marginTop: heroMarginTop }]}
        pointerEvents="box-none"
      >
        <View
          pointerEvents="none"
          style={[styles.heroMural, { height: HERO_INIT_H }]}
        >
          <Image
            source={{ uri: "/warmtiger.png" }}
            style={[styles.muralImage, { height: HERO_INIT_H }]}
            resizeMode="cover"
            accessibilityIgnoresInvertColors
          />
        </View>
        <Pressable style={styles.heroBack} onPress={onBack} hitSlop={8}>
          <ChevronLeft size={24} />
        </Pressable>
        <View style={styles.heroContent} pointerEvents="box-none">
          <Animated.View
            style={[
              styles.titleBlock,
              {
                transform: [
                  { translateX: titleTranslateX },
                  { translateY: titleTranslateY },
                  { scale: titleScale },
                ],
              },
            ]}
          >
            <Text style={styles.title}>{drink.name}</Text>
            <View style={styles.tagsBlock}>
              {/* Row 1 — every chip rendered exactly once. The overflow chip
                  fades out in place but keeps its layout slot, so static
                  chips never reflow. */}
              <View style={styles.tagsRow}>
                {drink.tags.map((t, i) => {
                  const isOverflow =
                    hasOverflow && i === drink.tags.length - 1;
                  return (
                    <Animated.View
                      key={`r1-${t.label}`}
                      onLayout={onTagChipLayout(t.label)}
                      style={isOverflow ? { opacity: tagsInlineOpacity } : null}
                    >
                      <TagChip tag={t} />
                    </Animated.View>
                  );
                })}
              </View>
              {/* Row 2 — absolutely positioned just below row 1 (with a small
                  gap so the chips don't touch). Pure opacity fade — no clip
                  reveal, so the chip just appears in place rather than
                  sliding up from below. */}
              {overflowChip ? (
                <Animated.View
                  style={[
                    styles.tagsRow,
                    {
                      position: "absolute",
                      top: tagChipHeight + TAG_ROW_GAP,
                      left: 0,
                      opacity: tagsWrappedOpacity,
                    },
                  ]}
                >
                  <TagChip tag={overflowChip} />
                </Animated.View>
              ) : null}
            </View>
          </Animated.View>
          {drink.hasRecipeLink ? (
            <View ref={recipeRowRef} style={[styles.recipeRow, sweepMaskStyle]}>
              <CupQuestionIcon size={20} />
              <Text style={styles.recipeText}>Recipe/Calories/Allergens</Text>
              <ChevronRight size={14} color={colors.textPrimary} />
            </View>
          ) : null}
          <View ref={priceRowRef} style={[styles.priceRow, sweepMaskStyle]}>
            <Image
              source={{ uri: assetPath("/bopomofo/price-525.png") }}
              style={styles.priceImage}
              resizeMode="contain"
              accessibilityLabel={`$${drink.price.toFixed(2)}`}
            />
          </View>
        </View>
      </Animated.View>

      {/* White veil — slides up over the tiger faster than the inner content
          scrolls. Sits between the hero and the ScrollView so it visually
          covers the tiger while content stays scrollable. */}
      <Animated.View
        pointerEvents="none"
        style={[styles.whiteVeil, { transform: [{ translateY: veilTranslateY }] }]}
      />

      <Animated.ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false },
        )}
      >
        {/* White sheet — content scrolls normally. The visible white edge
            sliding over the tiger is provided by the veil layer above. */}
        <Animated.View
          style={[
            styles.sheet,
            { transform: [{ translateY: contentTranslateY }] },
          ]}
        >
          <Animated.View style={{ opacity: realFade }}>
            {/* Variant thumbnails (conditional) */}
            {drink.variants ? (
              <View style={styles.variantRow}>
                {drink.variants.map((v) => (
                  <VariantThumb
                    key={v.id}
                    variant={v}
                    active={v.id === activeVariantId}
                    onPress={() => swapVariant(v)}
                  />
                ))}
              </View>
            ) : null}

            <Animated.View style={{ opacity: bodyFade }}>
              {/* Description */}
              <View style={styles.descBlock}>
                <Text style={styles.description} numberOfLines={3} ellipsizeMode="tail">
                  {drink.description}
                </Text>
                <View style={styles.showMoreRow}>
                  <Text style={styles.showMore}>Show More</Text>
                  <ChevronDown size={14} color={colors.textSecondary} />
                </View>
              </View>

              {/* Cup Specification (conditional) */}
              {drink.cupSpecs && drink.cupSpecs.length >= 2 ? (
                <View
                  style={styles.cupSpecSection}
                  onLayout={onCupSpecLayout}
                >
                  <Text style={styles.sectionHeader}>Cup Specification</Text>
                  <View style={styles.cupSpecRow}>
                    {drink.cupSpecs.map((c, i) => {
                      const selected = c.isDefault;
                      return (
                        <View
                          key={c.label}
                          style={[
                            styles.cupSpecCard,
                            selected && styles.cupSpecCardSelected,
                          ]}
                        >
                          <CupIllustration drinkId={c.illustration} size={28} cupOnly />
                          <Text
                            style={[
                              styles.cupSpecLabel,
                              selected && styles.cupSpecLabelSelected,
                            ]}
                          >
                            {c.label}
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                </View>
              ) : null}

              {/* What's Customizable */}
              <View style={styles.section}>
                <Text style={styles.sectionHeader}>What&apos;s Customizable</Text>
                <View style={{ gap: space.rowGap }}>
                  {drink.customizations.map((c) => (
                    <CustomizationRow
                      key={c.label}
                      customization={c}
                      selectedValue={selectedOptions[c.label] ?? c.defaultValue}
                      isExpanded={expandedKey === c.label}
                      isFaded={expandedKey !== null && expandedKey !== c.label}
                      onToggle={() =>
                        setExpandedKey((prev) => (prev === c.label ? null : c.label))
                      }
                      onSelect={(opt) => {
                        setSelectedOptions((prev) => ({ ...prev, [c.label]: opt }));
                        setExpandedKey(null);
                      }}
                    />
                  ))}
                </View>
              </View>

              {/* More Options pill */}
              {drink.hasMoreOptions ? (
                <View style={styles.morePillWrap}>
                  <View style={styles.morePill}>
                    <Text style={styles.morePillText}>More Options</Text>
                    <ChevronDown size={14} color="#FFFFFF" />
                  </View>
                </View>
              ) : null}
            </Animated.View>
          </Animated.View>

          {/* Cream Explore section */}
          <Animated.View
            style={[styles.exploreOuter, { opacity: bodyFade }]}
            onLayout={onExploreLayout}
          >
            <View style={styles.exploreInner}>
              <Text style={styles.exploreEyebrow}>Explore More Natural Recipes</Text>
              <Text style={styles.exploreH2}>{drink.explore.name}</Text>
              <Text style={styles.exploreBody}>{drink.explore.description}</Text>

              {drink.explore.allergyReminder ? (
                <View style={styles.allergyRow}>
                  <Text style={styles.allergyEyebrow}>Allergy Reminder</Text>
                  <View style={styles.allergyChip}>
                    <Text style={styles.allergyChipText}>
                      {drink.explore.allergyReminder}
                    </Text>
                  </View>
                </View>
              ) : null}

              {drink.explore.layers && drink.explore.layers.length > 0 ? (
                <LayeredCrossSection
                  layers={drink.explore.layers}
                  scrollY={scrollY}
                  sectionAbsY={exploreOffsetY}
                  viewportH={rootH}
                />
              ) : (
                <CrossSection
                  drinkId={drink.image}
                  callouts={drink.explore.callouts}
                />
              )}
              <Text style={styles.imageCaption}>
                *Image displayed is for illustration purposes only.
              </Text>

              <NutritionTable drink={drink} />

              <View style={styles.disclaimerBlock}>
                {disclaimers.map((d) => (
                  <Text key={d} style={styles.disclaimer}>
                    {d}
                  </Text>
                ))}
              </View>

              <View style={styles.naturalBlock}>
                <Text style={styles.naturalWord}>NATURAL</Text>
                <Text style={styles.naturalSub}>No Artificial Creamer</Text>
                <Text style={styles.naturalSub}>No Artificial Flavor</Text>
              </View>
            </View>
          </Animated.View>
        </Animated.View>
        <View style={{ height: 120 }} />
      </Animated.ScrollView>

      {/* Screen-anchored cup overlay — tracks the seam at 40% white / 60% tiger. */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.cupOverlay,
          {
            width: cupW,
            height: cupH,
            opacity: realFade,
            transform: [
              { translateX: cupTranslateX },
              { translateY: cupTranslateY },
              { scale: cupScale },
            ],
          },
        ]}
      >
        <View style={styles.heroCupStroke}>
          {hasSpinFrames(drink.image) ? (
            <SpinCup
              ref={spinRef}
              drinkId={drink.image}
              frameCount={SPIN_FRAMES}
              size={space.heroImageW}
            />
          ) : (
            <RealCup drinkId={drink.image} size={space.heroImageW} />
          )}
        </View>
        {drink.badge ? (
          <View style={styles.heroBadge}>
            <DrinkBadge badge={drink.badge} size={36} />
          </View>
        ) : null}
      </Animated.View>

      {/* Sticky bottom CTA bar */}
      <BottomCta price={drink.price} />
    </View>
  );
});

// -----------------------------------------------------------------------------
// Variant thumbnail.
// -----------------------------------------------------------------------------
function VariantThumb({
  variant,
  active,
  onPress,
}: {
  variant: Variant;
  active: boolean;
  onPress: () => void;
}) {
  const opacity = useRef(new Animated.Value(active ? 1 : 0.7)).current;
  const tapOpacity = useRef(new Animated.Value(1)).current;
  if (active) {
    Animated.timing(opacity, { toValue: 1, duration: 120, useNativeDriver: false }).start();
  } else {
    Animated.timing(opacity, { toValue: 0.7, duration: 120, useNativeDriver: false }).start();
  }
  return (
    <Pressable
      onPress={() => {
        if (active) return;
        Animated.timing(tapOpacity, {
          toValue: 0.1,
          duration: motion.variant.thumbFade,
          useNativeDriver: false,
        }).start(() => {
          tapOpacity.setValue(1);
          onPress();
        });
      }}
    >
      <Animated.View
        style={[
          variantStyles.outer,
          active && variantStyles.active,
          { opacity: tapOpacity },
        ]}
      >
        <Animated.View style={{ opacity }}>
          <RealCup drinkId={variant.thumbnail} size={36} />
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
}
const variantStyles = StyleSheet.create({
  outer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#F4F4F4",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.divider,
    overflow: "hidden",
  },
  active: {
    borderWidth: 1.5,
    borderColor: colors.textPrimary,
    backgroundColor: "#FFFFFF",
  },
});

// -----------------------------------------------------------------------------
// Customization row — eyebrow label + value, expands inline to a refined
// dropdown list. Other rows fade to 0.32 while one is expanded so the user's
// focus stays on the active selection.
// -----------------------------------------------------------------------------
function CustomizationRow({
  customization,
  selectedValue,
  isExpanded,
  isFaded,
  onToggle,
  onSelect,
}: {
  customization: { label: string; defaultValue: string; options: string[] };
  selectedValue: string;
  isExpanded: boolean;
  isFaded: boolean;
  onToggle: () => void;
  onSelect: (opt: string) => void;
}) {
  const heightAnim = useRef(new Animated.Value(0)).current;
  const expandAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const [naturalH, setNaturalH] = useState(0);

  const onOptionsLayout = useCallback(
    (e: LayoutChangeEvent) => {
      const h = e.nativeEvent.layout.height;
      if (h > 0 && h !== naturalH) {
        setNaturalH(h);
        if (isExpanded) heightAnim.setValue(h);
      }
    },
    [naturalH, isExpanded, heightAnim],
  );

  useEffect(() => {
    // Symmetric ease-in-out — slow entry, near-linear middle (the "normal"
    // speed the user calibrated to), slow exit. Same curve on every channel
    // so the rounded outline morphs as one piece.
    const ease = Easing.bezier(0.65, 0, 0.35, 1);
    Animated.parallel([
      Animated.timing(heightAnim, {
        toValue: isExpanded ? naturalH : 0,
        duration: 380,
        easing: ease,
        useNativeDriver: false,
      }),
      Animated.timing(expandAnim, {
        toValue: isExpanded ? 1 : 0,
        duration: 380,
        easing: ease,
        useNativeDriver: false,
      }),
      Animated.timing(fadeAnim, {
        toValue: isFaded ? 0.32 : 1,
        duration: 180,
        easing: Easing.out(Easing.quad),
        useNativeDriver: false,
      }),
    ]).start();
  }, [isExpanded, isFaded, naturalH, heightAnim, expandAnim, fadeAnim]);

  const arrowRotate = expandAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });
  const animatedBorderColor = expandAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.divider, colors.textPrimary],
  });
  const animatedBgColor = expandAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.bgPage, "#FCFCFA"],
  });
  // Header label/value cross-fade + shrink: when the row expands, the selected
  // value fades out, the header height collapses to a compact section-title
  // size, and the label translates down + darkens so it reads as an
  // intentional subheader rather than a stray eyebrow stuck in the corner.
  const headerValueOpacity = expandAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });
  const headerHeight = expandAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [52, 38],
  });
  // Push the label down so it lands at vertical centre of the collapsed
  // 38px header (header_center − natural_label_top ≈ 19 − 9 = 10).
  const headerLabelTranslateY = expandAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 10],
  });
  // Subheader colour — jumps from the faded eyebrow grey to the same dark
  // tone the option text uses, so the label reads as a real heading.
  const headerLabelColor = expandAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.textTertiary, colors.textPrimary],
  });

  return (
    <Animated.View
      style={[
        customRowStyles.outer,
        {
          opacity: fadeAnim,
          borderColor: animatedBorderColor,
          backgroundColor: animatedBgColor,
          // Offset white-highlight + dark-trace shadow that matches the tag
          // chip language. Only present when expanded — gives a subtle pop
          // so the active selection card reads as elevated. RN Web transition
          // lets it fade in/out alongside the border-color tween.
          boxShadow: isExpanded
            ? `2.5px 2.5px 0 -0.67px #FFFFFF, 2.5px 2.5px 0 0 ${colors.textPrimary}`
            : "none",
          transitionProperty: "box-shadow",
          transitionDuration: "380ms",
          transitionTimingFunction: "cubic-bezier(0.65, 0, 0.35, 1)",
        } as any,
      ]}
    >
      <Pressable onPress={onToggle} hitSlop={4}>
        <Animated.View
          style={[
            customRowStyles.header,
            { height: headerHeight, minHeight: 0, overflow: "hidden" },
          ]}
        >
          <View style={{ flex: 1 }}>
            <Animated.Text
              style={[
                customRowStyles.label,
                {
                  color: headerLabelColor,
                  transform: [{ translateY: headerLabelTranslateY }],
                },
              ]}
            >
              {customization.label.toUpperCase()}
            </Animated.Text>
            <Animated.Text
              style={[customRowStyles.value, { opacity: headerValueOpacity }]}
              numberOfLines={1}
            >
              {selectedValue}
            </Animated.Text>
          </View>
          <Animated.View style={{ transform: [{ rotate: arrowRotate }] }}>
            <ChevronDown size={14} color={colors.textTertiary} weight={1.4} />
          </Animated.View>
        </Animated.View>
      </Pressable>
      <Animated.View
        style={[customRowStyles.optionsClip, { height: heightAnim }]}
      >
        <View style={customRowStyles.optionsInner} onLayout={onOptionsLayout}>
          <View style={customRowStyles.divider} />
          {customization.options.map((opt, i) => {
            const checked = opt === selectedValue;
            return (
              <Pressable
                key={opt}
                onPress={() => onSelect(opt)}
                style={[
                  customRowStyles.optionRow,
                  i === 0 && customRowStyles.optionRowFirst,
                  i === customization.options.length - 1 &&
                    customRowStyles.optionRowLast,
                  i > 0 && customRowStyles.optionRowDivider,
                ]}
                hitSlop={2}
              >
                <Text
                  style={[
                    customRowStyles.optionLabel,
                    checked && customRowStyles.optionLabelChecked,
                  ]}
                >
                  {opt}
                </Text>
                <View style={customRowStyles.checkSlot}>
                  {checked ? <CheckIcon size={13} color={colors.textPrimary} weight={1.9} /> : null}
                </View>
              </Pressable>
            );
          })}
        </View>
      </Animated.View>
    </Animated.View>
  );
}
const customRowStyles = StyleSheet.create({
  outer: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: "hidden",
  },
  header: {
    paddingTop: 9,
    paddingBottom: 11,
    paddingHorizontal: 16,
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  label: {
    fontFamily: fontFamily.body,
    fontSize: 9.5,
    fontWeight: "700",
    letterSpacing: 0.7,
    color: colors.textTertiary,
    lineHeight: 12,
    marginBottom: 3,
  },
  value: {
    fontFamily: fontFamily.body,
    fontSize: 13.5,
    fontWeight: "600",
    letterSpacing: -0.1,
    color: colors.textPrimary,
    lineHeight: 17,
  },
  optionsClip: {
    overflow: "hidden",
  },
  optionsInner: {
    paddingTop: 0,
    paddingBottom: 6,
  },
  divider: {
    height: 1,
    backgroundColor: colors.dividerSoft,
    marginHorizontal: 16,
    marginBottom: 2,
  },
  optionRow: {
    paddingVertical: 9,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    minHeight: 36,
  },
  optionRowFirst: {
    paddingTop: 10,
  },
  optionRowLast: {
    paddingBottom: 10,
  },
  optionRowDivider: {
    borderTopWidth: 1,
    borderTopColor: colors.dividerSoft,
    marginHorizontal: 16,
  },
  optionLabel: {
    flex: 1,
    fontFamily: fontFamily.body,
    fontSize: 13,
    fontWeight: "500",
    letterSpacing: -0.1,
    color: colors.textSecondary,
    lineHeight: 17,
  },
  optionLabelChecked: {
    fontWeight: "700",
    color: colors.textPrimary,
  },
  checkSlot: {
    width: 14,
    height: 14,
    alignItems: "center",
    justifyContent: "center",
  },
});

// -----------------------------------------------------------------------------
// Nutrition table + caffeine indicator.
// -----------------------------------------------------------------------------
function NutritionTable({ drink }: { drink: Drink }) {
  const rows = [
    { label: "Energy (Cal)", value: drink.nutrition.energy },
    { label: "Protein (g)", value: drink.nutrition.protein },
    { label: "Total Carbohydrate (g)", value: drink.nutrition.carbs },
    { label: "Total Fat (g)", value: drink.nutrition.fat },
    { label: "Tea polyphenols (mg)", value: drink.nutrition.teaPolyphenols },
  ];
  return (
    <View style={tableStyles.outer}>
      <View style={tableStyles.headerRow}>
        <Text style={tableStyles.headerLeft}>{`Preparation\nMethod`}</Text>
        <Text style={tableStyles.headerRight}>{`Recommended Ice level -\nNo additional sugar (/cup)`}</Text>
      </View>
      {rows.map((r) =>
        r.value === null || r.value === undefined ? null : (
          <View key={r.label} style={tableStyles.dataRow}>
            <Text style={tableStyles.dataLabel}>{r.label}</Text>
            <Text style={tableStyles.dataVal}>{r.value}</Text>
          </View>
        ),
      )}
      <View style={tableStyles.caffeineRow}>
        <View style={tableStyles.caffeinePill}>
          {[0, 1, 2].map((i) => {
            const isActive = i === 2 && drink.nutrition.caffeineLevel === "green";
            return (
              <View
                key={i}
                style={[
                  tableStyles.caffeineDot,
                  {
                    backgroundColor: isActive
                      ? colors.caffeineGreen
                      : colors.caffeineDotDim,
                  },
                ]}
              />
            );
          })}
        </View>
        <View style={tableStyles.caffeineLabels}>
          <Text style={tableStyles.caffeineEyebrow}>Caffeine Indicator</Text>
          <Text style={tableStyles.caffeineHead}>Green Light (Light Caffeine)</Text>
          <Text style={tableStyles.caffeineSub}>
            Caffeine ≈ {drink.nutrition.caffeineMgPerCup} mg/cup
          </Text>
        </View>
      </View>
      <View style={tableStyles.linkRow}>
        <Text style={tableStyles.linkText} numberOfLines={2}>
          Click Here For Standard Drink Preparation Details And Other Information
        </Text>
        <View style={tableStyles.linkChev}>
          <ChevronRight size={12} color={colors.textPrimary} />
        </View>
      </View>
    </View>
  );
}
const tableStyles = StyleSheet.create({
  outer: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: colors.divider,
    borderRadius: 8,
    backgroundColor: "#FCFCF6",
    overflow: "hidden",
  },
  headerRow: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
    backgroundColor: "#F0F0EA",
  },
  headerLeft: {
    flex: 1,
    fontFamily: fontFamily.body,
    fontSize: type.nutritionHeader.size,
    fontWeight: type.nutritionHeader.weight,
    color: colors.textSecondary,
    lineHeight: type.nutritionHeader.lineHeight,
  },
  headerRight: {
    flex: 1,
    textAlign: "right",
    fontFamily: fontFamily.body,
    fontSize: type.nutritionHeader.size,
    fontWeight: type.nutritionHeader.weight,
    color: colors.textSecondary,
    lineHeight: type.nutritionHeader.lineHeight,
  },
  dataRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  dataLabel: {
    fontFamily: fontFamily.body,
    fontSize: type.nutritionLabel.size,
    color: colors.textSecondary,
  },
  dataVal: {
    fontFamily: fontFamily.body,
    fontSize: type.nutritionValue.size,
    fontWeight: type.nutritionValue.weight,
    color: colors.textPrimary,
  },
  caffeineRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 14,
    paddingHorizontal: 14,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  caffeinePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: colors.caffeinePillBg,
    borderRadius: 999,
  },
  caffeineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  caffeineLabels: { flex: 1 },
  caffeineEyebrow: {
    fontFamily: fontFamily.body,
    fontSize: type.caffeineEyebrow.size,
    fontWeight: type.caffeineEyebrow.weight,
    color: colors.textTertiary,
    letterSpacing: type.caffeineEyebrow.tracking,
    marginBottom: 1,
  },
  caffeineHead: {
    fontFamily: fontFamily.body,
    fontSize: type.caffeineLabel.size,
    fontWeight: type.caffeineLabel.weight,
    color: colors.textPrimary,
  },
  caffeineSub: {
    fontFamily: fontFamily.body,
    fontSize: type.caffeineSub.size,
    color: colors.textTertiary,
    marginTop: 1,
  },
  linkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  linkText: {
    flex: 1,
    textAlign: "center",
    fontFamily: fontFamily.body,
    fontSize: 12,
    color: colors.textSecondary,
  },
  linkChev: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: colors.divider,
    alignItems: "center",
    justifyContent: "center",
  },
});

// -----------------------------------------------------------------------------
// Bottom CTA bar.
// -----------------------------------------------------------------------------
function BottomCta({ price }: { price: number }) {
  const [qty, setQty] = useState(1);
  return (
    <View style={ctaStyles.bar}>
      <View style={ctaStyles.row}>
        <Text style={ctaStyles.price}>${price.toFixed(2)}</Text>
        <View style={ctaStyles.qtyRow}>
          <Pressable
            style={ctaStyles.minus}
            onPress={() => setQty((n) => Math.max(1, n - 1))}
            hitSlop={8}
          >
            <MinusIcon />
          </Pressable>
          <Text style={ctaStyles.qty}>{qty}</Text>
          <Pressable
            style={ctaStyles.plus}
            onPress={() => setQty((n) => n + 1)}
            hitSlop={8}
          >
            <PlusIcon />
          </Pressable>
        </View>
      </View>
      <View style={ctaStyles.btnDisabled}>
        <Text style={ctaStyles.btnText}>Add to Bag</Text>
      </View>
    </View>
  );
}
const ctaStyles = StyleSheet.create({
  bar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.bgPage,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  price: {
    fontFamily: fontFamily.body,
    fontSize: type.bottomBarPrice.size,
    fontWeight: type.bottomBarPrice.weight,
    color: colors.textPrimary,
  },
  qtyRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  minus: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.divider,
    alignItems: "center",
    justifyContent: "center",
  },
  qty: {
    fontFamily: fontFamily.body,
    fontSize: type.qty.size,
    fontWeight: type.qty.weight,
    color: colors.textPrimary,
    minWidth: 14,
    textAlign: "center",
  },
  plus: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.accentCta,
    alignItems: "center",
    justifyContent: "center",
  },
  btnDisabled: {
    height: space.ctaHeight,
    backgroundColor: colors.ctaDisabled,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  btnText: {
    fontFamily: fontFamily.body,
    fontSize: type.addToBag.size,
    fontWeight: type.addToBag.weight,
    color: colors.ctaDisabledText,
  },
});

// -----------------------------------------------------------------------------
// Screen styles.
// -----------------------------------------------------------------------------
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bgPage,
  },
  notFound: {
    fontFamily: fontFamily.body,
    fontSize: 16,
    color: colors.textSecondary,
    padding: 32,
  },

  scroll: {
    flex: 1,
    // Soften the top edge so content fades as it slides under the docked
    // cup zone instead of getting hard-clipped.
    maskImage: "linear-gradient(to bottom, transparent 0, #000 32px)",
    WebkitMaskImage: "linear-gradient(to bottom, transparent 0, #000 32px)",
  } as any,
  scrollContent: { paddingBottom: 0 },

  // Sticky hero — fixed at the top of the screen with shrinking height.
  hero: {
    width: "100%",
    backgroundColor: "#F4ECDD",
    paddingHorizontal: space.pagePad,
    paddingTop: 12,
    overflow: "hidden",
  },
  heroMural: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  muralImage: {
    width: "100%",
    height: "100%",
    opacity: 0.75,
  },
  heroBack: {
    width: 32,
    height: 32,
    alignItems: "flex-start",
    justifyContent: "center",
    zIndex: 2,
  },
  heroContent: {
    paddingTop: 24,
    paddingRight: 180,
  },
  titleBlock: {
    // Anchor scale to the top-left so the block shrinks toward the corner
    // instead of pulling away from it.
    transformOrigin: "top left",
  } as any,
  title: {
    fontFamily: fontFamily.display,
    fontSize: type.drinkTitle.size,
    fontWeight: type.drinkTitle.weight,
    letterSpacing: type.drinkTitle.tracking,
    lineHeight: type.drinkTitle.lineHeight,
    color: colors.textPrimary,
    marginBottom: 4,
    // Thin white traced outline around the glyphs so the title stays legible
    // over the tiger mural — narrower than the cup's 1.5px stroke.
    filter:
      "drop-shadow(1px 0 0 #FFFFFF) drop-shadow(-1px 0 0 #FFFFFF) drop-shadow(0 1px 0 #FFFFFF) drop-shadow(0 -1px 0 #FFFFFF) drop-shadow(0.7px 0.7px 0 #FFFFFF) drop-shadow(-0.7px -0.7px 0 #FFFFFF) drop-shadow(0.7px -0.7px 0 #FFFFFF) drop-shadow(-0.7px 0.7px 0 #FFFFFF)",
  } as any,
  tagsBlock: {
    marginBottom: 16,
    alignSelf: "flex-start",
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "nowrap",
    gap: 4,
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
  // Brushed-ink "$5.25" graphic. Aspect ratio of the source is ~1.9:1, so a
  // 95×50 box renders it crisply at roughly the same visual weight as the old
  // text price.
  priceImage: { width: 66.5, height: 35 },
  cupOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    alignItems: "center",
    justifyContent: "flex-start",
    zIndex: 5,
  },
  clawPlaceholder: {
    position: "absolute",
    top: -20,
    left: -30,
    right: -30,
    bottom: -10,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "rgba(255, 255, 255, 0.85)",
    borderRadius: 999,
    backgroundColor: "rgba(255, 255, 255, 0.04)",
  },
  heroCupStroke: {
    // Chain drop-shadows to fake a 1.5px white stroke around the cup silhouette.
    // RN Web passes `filter` straight through to CSS.
    filter:
      "drop-shadow(1.5px 0 0 #FFFFFF) drop-shadow(-1.5px 0 0 #FFFFFF) drop-shadow(0 1.5px 0 #FFFFFF) drop-shadow(0 -1.5px 0 #FFFFFF) drop-shadow(1px 1px 0 #FFFFFF) drop-shadow(-1px -1px 0 #FFFFFF) drop-shadow(1px -1px 0 #FFFFFF) drop-shadow(-1px 1px 0 #FFFFFF)",
  } as any,
  heroBadge: {
    position: "absolute",
    top: -2,
    right: -8,
    zIndex: 1,
  },

  // White veil — full-bleed white panel that lives between the hero and the
  // ScrollView. Slides up over the tiger to cover it as the user scrolls.
  whiteVeil: {
    position: "absolute",
    top: 270 - 20,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.bgPage,
    borderTopLeftRadius: radii.sheet,
    borderTopRightRadius: radii.sheet,
  },

  // Sheet — purely a layout wrapper for content. Its visible white edge
  // is provided by the whiteVeil layer above.
  sheet: {
    position: "relative",
    marginTop: -20,
    paddingTop: 60,
    paddingHorizontal: space.pagePad,
  },

  // Variant thumbs
  variantRow: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 18,
  },

  // Description block
  descBlock: { marginBottom: 24 },
  description: {
    fontFamily: fontFamily.body,
    fontSize: type.description.size,
    color: colors.textPrimary,
    lineHeight: type.description.lineHeight,
  },
  showMoreRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 8,
  },
  showMore: {
    fontFamily: fontFamily.body,
    fontSize: type.showMore.size,
    fontWeight: type.showMore.weight,
    color: colors.textSecondary,
  },

  // Section
  section: { marginBottom: 24 },
  sectionHeader: {
    fontFamily: fontFamily.body,
    fontSize: type.sectionHeader.size,
    fontWeight: type.sectionHeader.weight,
    lineHeight: type.sectionHeader.lineHeight,
    color: colors.textPrimary,
    marginBottom: 14,
  },

  // Cup spec
  cupSpecSection: { marginBottom: 24 },
  cupSpecRow: { flexDirection: "row", gap: 12 },
  cupSpecCard: {
    flex: 1,
    height: space.cupSpecH,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.divider,
    backgroundColor: colors.bgPage,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  cupSpecCardSelected: {
    borderColor: colors.textPrimary,
    borderWidth: 2,
  },
  cupSpecLabel: {
    fontFamily: fontFamily.body,
    fontSize: type.cupSpec.size,
    fontWeight: type.cupSpec.weight,
    color: colors.textPrimary,
  },
  cupSpecLabelSelected: {
    fontWeight: type.cupSpecActive.weight,
  },

  // More options pill
  morePillWrap: {
    alignItems: "center",
    marginTop: 8,
    marginBottom: 32,
  },
  morePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.accentCta,
    paddingVertical: space.pillPadV,
    paddingHorizontal: space.pillPadH,
    borderRadius: 999,
  },
  morePillText: {
    fontFamily: fontFamily.body,
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },

  // Cream Explore section (full bleed via negative margin)
  exploreOuter: {
    backgroundColor: colors.bgExplore,
    marginHorizontal: -space.pagePad,
    paddingTop: 32,
    paddingBottom: 40,
  },
  exploreInner: {
    paddingHorizontal: space.pagePad,
  },
  exploreEyebrow: {
    fontFamily: fontFamily.body,
    fontSize: type.exploreEyebrow.size,
    fontWeight: type.exploreEyebrow.weight,
    letterSpacing: type.exploreEyebrow.tracking,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  exploreH2: {
    fontFamily: fontFamily.body,
    fontSize: type.exploreH2.size,
    fontWeight: type.exploreH2.weight,
    color: colors.textPrimary,
    lineHeight: type.exploreH2.lineHeight,
    marginBottom: 10,
  },
  exploreBody: {
    fontFamily: fontFamily.body,
    fontSize: type.exploreBody.size,
    color: colors.textSecondary,
    lineHeight: type.exploreBody.lineHeight,
    marginBottom: 14,
  },
  allergyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  allergyEyebrow: {
    fontFamily: fontFamily.body,
    fontSize: 11,
    color: colors.textTertiary,
  },
  allergyChip: {
    paddingVertical: 4,
    paddingHorizontal: 14,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.tagBorder,
  },
  allergyChipText: {
    fontFamily: fontFamily.body,
    fontSize: 12,
    fontWeight: "500",
    color: colors.textPrimary,
  },
  imageCaption: {
    fontFamily: fontFamily.body,
    fontSize: type.imageCaption.size,
    color: colors.textTertiary,
    marginTop: 4,
    textAlign: "left",
  },

  // Disclaimers
  disclaimerBlock: {
    marginTop: 28,
    gap: 4,
  },
  disclaimer: {
    fontFamily: fontFamily.body,
    fontSize: type.disclaimer.size,
    color: colors.textTertiary,
    lineHeight: type.disclaimer.lineHeight,
  },

  // NATURAL footer
  naturalBlock: {
    alignItems: "center",
    marginTop: 32,
    marginBottom: 8,
  },
  naturalWord: {
    fontFamily: fontFamily.body,
    fontSize: type.natural.size,
    fontWeight: type.natural.weight,
    letterSpacing: type.natural.tracking,
    color: colors.textPrimary,
  },
  naturalSub: {
    fontFamily: fontFamily.body,
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
});
