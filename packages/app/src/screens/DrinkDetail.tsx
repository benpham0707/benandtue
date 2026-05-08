// Drink detail screen — Frames 06/07/14/15/16 + 08/09/10.
// Builds the full anatomy from BOPOMOFO_MENU_SPEC.md §4.

import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {
  Animated,
  type LayoutChangeEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
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
import { CupIllustration } from "../components/CupIllustration";
import { disclaimers, getDetailDrink } from "../data/drinks";
import { colors, fontFamily, motion, radii, space, type } from "../theme/tokens";
import type { Drink, Variant } from "../types";

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

  // Variant body fade — drives §5.4 swap animation.
  const bodyFade = useRef(new Animated.Value(1)).current;
  // Real content opacity — driven externally by the morph (sets to 0 then animates to 1).
  // Defaults to 1 so direct (non-morph) navigation renders fully visible immediately.
  const realFade = useRef(new Animated.Value(1)).current;

  useImperativeHandle(
    ref,
    () => ({
      setRealContentOpacity: (v) => realFade.setValue(v),
    }),
    [realFade],
  );

  // Scroll value for parallax collapse (§4.16 / §5.3).
  const scrollY = useRef(new Animated.Value(0)).current;

  // Cup-spec card height (for the parallax override) — measured at runtime.
  const [cupSpecCardHeight, setCupSpecCardHeight] = useState(0);

  const onCupSpecLayout = useCallback((e: LayoutChangeEvent) => {
    setCupSpecCardHeight(e.nativeEvent.layout.height);
  }, []);

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
  // We compute manual interpolate on the Animated.Value scrollY:
  const titleOpacity = scrollY.interpolate({
    inputRange: [0, motion.parallax.titleFadeEnd],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });
  // For drink image we want s' = max(0, scrollY - offset) when cup-spec exists.
  const imageScrollInput = drink.cupSpecs ? Animated.subtract(scrollY, offset) : scrollY;
  const imageScale = imageScrollInput.interpolate({
    inputRange: [0, motion.parallax.imageScaleEnd],
    outputRange: [1, 0.5],
    extrapolate: "clamp",
  });
  const imageTranslateY = imageScrollInput.interpolate({
    inputRange: [0, motion.parallax.imageScaleEnd],
    outputRange: [0, -40],
    extrapolate: "clamp",
  });
  const imageOpacity = imageScrollInput.interpolate({
    inputRange: [motion.parallax.imageScaleEnd, motion.parallax.imageFadeEnd],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });
  const compactOpacity = scrollY.interpolate({
    inputRange: [motion.parallax.compactStart, motion.parallax.compactFull],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });
  const stageHeight = scrollY.interpolate({
    inputRange: [0, motion.parallax.stageCollapseEnd],
    outputRange: [space.stageH, space.stickyHeaderH],
    extrapolate: "clamp",
  });

  return (
    <View style={styles.root}>
      {/* Compact sticky header — appears as user scrolls past 80px. */}
      <Animated.View
        style={[
          styles.stickyHeader,
          { opacity: compactOpacity },
        ]}
        pointerEvents="box-none"
      >
        <Pressable style={styles.stickyBack} onPress={onBack} hitSlop={8}>
          <ChevronLeft size={20} />
        </Pressable>
        <Text style={styles.stickyTitle} numberOfLines={1}>
          {drink.name}
        </Text>
      </Animated.View>

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
        {/* Hero stage — collapses on scroll. */}
        <Animated.View
          style={[styles.stage, { minHeight: stageHeight as any }]}
        >
          <Pressable style={styles.stageBack} onPress={onBack} hitSlop={8}>
            <ChevronLeft size={24} />
          </Pressable>

          <Animated.View style={[styles.stageContent, { opacity: titleOpacity }]}>
            <Text style={styles.title}>{drink.name}</Text>
            <View style={styles.tags}>
              {drink.tags.map((t) => (
                <TagChip key={t.label} tag={t} />
              ))}
            </View>
            {drink.hasRecipeLink ? (
              <View style={styles.recipeRow}>
                <CupQuestionIcon size={20} />
                <Text style={styles.recipeText}>Recipe/Calories/Allergens</Text>
                <ChevronRight size={14} color={colors.textPrimary} />
              </View>
            ) : null}
            <View style={styles.priceRow}>
              <PriceTag amount={drink.price} />
            </View>
          </Animated.View>

          {/* Drink image — anchored top-right, overlaps the seam. */}
          <Animated.View
            style={[
              styles.heroImage,
              {
                opacity: imageOpacity,
                transform: [{ translateY: imageTranslateY }, { scale: imageScale }],
              },
            ]}
          >
            <CupIllustration drinkId={drink.image} size={space.heroImageW} />
            {drink.badge ? (
              <View style={styles.heroBadge}>
                <DrinkBadge badge={drink.badge} size={36} />
              </View>
            ) : null}
          </Animated.View>
        </Animated.View>

        {/* White sheet — top radius, tucks under the seam */}
        <View style={styles.sheet}>
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
                    <CustomizationRow key={c.label} label={c.label} value={c.defaultValue} />
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
          <Animated.View style={[styles.exploreOuter, { opacity: bodyFade }]}>
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

              <CrossSection
                drinkId={drink.image}
                callouts={drink.explore.callouts}
              />
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
        </View>
        <View style={{ height: 120 }} />
      </Animated.ScrollView>

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
          <CupIllustration drinkId={variant.thumbnail} size={36} />
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
// Customization row.
// -----------------------------------------------------------------------------
function CustomizationRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={customRowStyles.row}>
      <View>
        <Text style={customRowStyles.label}>{label}</Text>
        <Text style={customRowStyles.value}>{value}</Text>
      </View>
      <ChevronDown size={16} color={colors.textPrimary} />
    </View>
  );
}
const customRowStyles = StyleSheet.create({
  row: {
    height: space.rowHeight,
    borderRadius: space.rowRadius,
    borderWidth: 1,
    borderColor: colors.divider,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.bgPage,
  },
  label: {
    fontFamily: fontFamily.body,
    fontSize: type.customLabel.size,
    fontWeight: type.customLabel.weight,
    color: colors.textSecondary,
    lineHeight: type.customLabel.lineHeight,
    marginBottom: 2,
  },
  value: {
    fontFamily: fontFamily.body,
    fontSize: type.customValue.size,
    fontWeight: type.customValue.weight,
    color: colors.textPrimary,
    lineHeight: type.customValue.lineHeight,
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

  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 0 },

  // Hero stage
  stage: {
    backgroundColor: colors.bgStage,
    paddingHorizontal: space.pagePad,
    paddingTop: 12,
    paddingBottom: 40,
    position: "relative",
    overflow: "hidden",
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
  heroImage: {
    position: "absolute",
    right: 14,
    top: 60,
    width: space.heroImageW,
    alignItems: "center",
  },
  heroBadge: {
    position: "absolute",
    top: -2,
    right: -8,
  },

  // Sticky compact header
  stickyHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: space.stickyHeaderH,
    backgroundColor: colors.bgStage,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
    zIndex: 10,
  },
  stickyBack: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 4,
  },
  stickyTitle: {
    fontFamily: fontFamily.body,
    fontSize: 16,
    fontWeight: "600",
    color: colors.textPrimary,
  },

  // White sheet
  sheet: {
    backgroundColor: colors.bgPage,
    borderTopLeftRadius: radii.sheet,
    borderTopRightRadius: radii.sheet,
    marginTop: -20,
    paddingTop: 28,
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
