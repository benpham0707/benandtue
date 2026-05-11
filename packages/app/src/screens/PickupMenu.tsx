// Pickup menu — Frame 01/12/13.
// Anatomy: dark band header → white content area split into 88px sidebar +
// 2-col grid → sticky "store closed" toast at the bottom.

import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Animated,
  Easing,
  type LayoutChangeEvent,
  type LayoutRectangle,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  ActiveBar,
  ChevronLeft,
  ChevronRight,
  DrinkBadge,
  MagnifierIcon,
  MenuPrice,
  StarIcon,
} from "../components/atoms";
import { RealCup } from "../components/RealCup";
import { menuSections, sections } from "../data/drinks";
import { colors, fontFamily, motion, radii, space, type } from "../theme/tokens";
import type { DrinkStub } from "../types";

export type SourceRect = LayoutRectangle & { drink: DrinkStub };

export type PickupMenuHandle = {
  /** Used by the morph: returns the absolute on-screen rect of a drink card's image. */
  measureDrinkRect: (id: string) => SourceRect | null;
};

type Props = {
  onTapDrink: (drink: DrinkStub, rect: SourceRect) => void;
  /** Set true while the morph is running to dim non-selected cards' images. */
  morphProgress?: Animated.Value;
  /** The id of the drink the user just tapped (used for press fade + selection). */
  pressedId?: string | null;
};

export const PickupMenu = forwardRef<PickupMenuHandle, Props>(function PickupMenu(
  { onTapDrink, morphProgress, pressedId },
  ref,
) {
  const [activeId, setActiveId] = useState<string>(menuSections[0]!.id);
  const sectionOffsets = useRef<Record<string, number>>({});
  const cardRectsRef = useRef<Record<string, LayoutRectangle>>({});
  const scrollRef = useRef<ScrollView | null>(null);
  const programmatic = useRef(false);
  const containerRef = useRef<View | null>(null);
  const containerOffset = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useImperativeHandle(ref, () => ({
    measureDrinkRect: (id) => {
      const rect = cardRectsRef.current[id];
      const drink = findDrink(id);
      if (!rect || !drink) return null;
      return { ...rect, drink };
    },
  }), []);

  const onSectionLayout = useCallback(
    (id: string) => (e: LayoutChangeEvent) => {
      sectionOffsets.current[id] = e.nativeEvent.layout.y;
    },
    [],
  );

  const onScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (programmatic.current) return;
      const y = e.nativeEvent.contentOffset.y + 20;
      let best = menuSections[0]!.id;
      for (const s of menuSections) {
        const off = sectionOffsets.current[s.id];
        if (off !== undefined && off <= y) best = s.id;
      }
      if (best !== activeId) setActiveId(best);
    },
    [activeId],
  );

  const onSelectCategory = useCallback((id: string) => {
    setActiveId(id);
    const y = sectionOffsets.current[id];
    if (y === undefined) return;
    programmatic.current = true;
    scrollRef.current?.scrollTo({ y, animated: true });
    setTimeout(() => {
      programmatic.current = false;
    }, 420);
  }, []);

  const captureContainerOffset = useCallback(() => {
    // measureInWindow translates to viewport coords on RN Web.
    containerRef.current?.measureInWindow?.((x, y) => {
      containerOffset.current = { x, y };
    });
  }, []);

  return (
    <View
      style={styles.root}
      ref={containerRef}
      onLayout={captureContainerOffset}
    >
      <DarkBand />

      <View style={styles.body}>
        <Sidebar activeId={activeId} onSelect={onSelectCategory} />

        <ScrollView
          ref={scrollRef}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          onScroll={onScroll}
          scrollEventThrottle={16}
        >
          {menuSections.map((sec) => (
            <View
              key={sec.id}
              onLayout={onSectionLayout(sec.id)}
              style={styles.section}
            >
              <Text style={styles.sectionHeader}>{sec.label}</Text>
              <View style={styles.grid}>
                {sec.drinks.map((d) => (
                  <DrinkCardCell
                    key={d.id}
                    drink={d}
                    pressedId={pressedId}
                    morphProgress={morphProgress}
                    onMeasure={(rect) => {
                      // Convert the cell's absolute rect to overlay coords.
                      // We rely on measureInWindow.
                    }}
                    onLayoutImage={(node) => {
                      node?.measureInWindow?.((x, y, width, height) => {
                        cardRectsRef.current[d.id] = { x, y, width, height };
                        console.log("[PickupMenu] measured", d.id, { x, y, width, height });
                      });
                    }}
                    onPress={() => {
                      const rect = cardRectsRef.current[d.id];
                      console.log("[PickupMenu] press", d.id, "rect:", rect);
                      if (!rect) return;
                      onTapDrink(d, { ...rect, drink: d });
                    }}
                  />
                ))}
                {/* Section with odd item count: leave bottom-right empty (Frame 12). */}
                {sec.drinks.length % 2 === 1 ? <View style={styles.cell} /> : null}
              </View>
            </View>
          ))}
          <View style={styles.toastBleed} />
        </ScrollView>
      </View>

      <StoreClosedToast />
    </View>
  );
});

function findDrink(id: string): DrinkStub | undefined {
  for (const sec of menuSections) {
    for (const d of sec.drinks) if (d.id === id) return d;
  }
  return undefined;
}

// -----------------------------------------------------------------------------
// Dark band header.
// -----------------------------------------------------------------------------
function DarkBand() {
  return (
    <View style={styles.band}>
      <View style={styles.bandTopRow}>
        <View style={styles.bandTopLeft}>
          <ChevronLeft size={22} color={colors.textOnDark} weight={1.6} />
          <Text style={styles.pickUp}>PICK UP</Text>
        </View>
        <View style={styles.searchCircle}>
          <MagnifierIcon size={16} />
        </View>
      </View>

      <View style={styles.brandRow}>
        <StarIcon size={16} />
        <Text style={styles.brandName}>Brea Mall</Text>
        <ChevronRight size={14} color={colors.textOnDark} weight={1.4} />
      </View>
      <Text style={styles.miAway}>15.63 mi away</Text>
      <Text style={styles.tagline}>new style tea, by inspiration</Text>
    </View>
  );
}

// -----------------------------------------------------------------------------
// Sidebar.
// -----------------------------------------------------------------------------
function Sidebar({ activeId, onSelect }: { activeId: string; onSelect: (id: string) => void }) {
  return (
    <View style={styles.sidebar}>
      {menuSections.map((s) => {
        const active = s.id === activeId;
        return (
          <Pressable
            key={s.id}
            style={styles.sideRow}
            onPress={() => onSelect(s.id)}
          >
            <Text
              style={[styles.sideText, active && styles.sideTextActive]}
              numberOfLines={2}
            >
              {s.label}
            </Text>
            {active ? <ActiveBar /> : null}
          </Pressable>
        );
      })}
    </View>
  );
}

// -----------------------------------------------------------------------------
// Drink card cell.
// -----------------------------------------------------------------------------
function DrinkCardCell({
  drink,
  pressedId,
  morphProgress,
  onPress,
  onLayoutImage,
}: {
  drink: DrinkStub;
  pressedId: string | null | undefined;
  morphProgress?: Animated.Value;
  onPress: () => void;
  onMeasure: (rect: LayoutRectangle) => void;
  onLayoutImage: (node: View | null) => void;
}) {
  const isPressed = pressedId === drink.id;
  const isOther = pressedId && !isPressed;

  // Press fade (own card content drops to 0.7 for the first ~80ms).
  const pressOpacity = useRef(new Animated.Value(1)).current;
  if (isPressed) {
    Animated.timing(pressOpacity, {
      toValue: motion.press.cardOpacity,
      duration: motion.press.cardDuration,
      easing: Easing.out(Easing.quad),
      useNativeDriver: false,
    }).start();
  }

  // Other-card fade-to-skeleton, driven by morphProgress.
  const otherImageOpacity = morphProgress
    ? morphProgress.interpolate({
        inputRange: [0, 0.15, 0.7, 1],
        outputRange: [1, 1, 0, 0],
        extrapolate: "clamp",
      })
    : 1;

  const imageNodeRef = useRef<View | null>(null);

  return (
    <Pressable style={styles.cell} onPress={onPress} hitSlop={4}>
      <Animated.View
        style={[styles.cardImageHolder, { opacity: isPressed ? pressOpacity : 1 }]}
      >
        <Animated.View
          ref={(n: any) => {
            imageNodeRef.current = n;
            onLayoutImage(n);
          }}
          onLayout={() => onLayoutImage(imageNodeRef.current)}
          style={[
            styles.cardImageInner,
            isOther ? { opacity: otherImageOpacity } : null,
          ]}
        >
          <RealCup drinkId={drink.image} size={74} />
        </Animated.View>
        {drink.badge ? (
          <View style={styles.cardBadge}>
            <DrinkBadge badge={drink.badge} size={36} />
          </View>
        ) : null}
        {/* Skeleton placeholder revealed when image fades during morph */}
        {isOther ? (
          <Animated.View
            pointerEvents="none"
            style={[
              styles.cardSkeleton,
              {
                opacity: morphProgress
                  ? morphProgress.interpolate({
                      inputRange: [0, 0.3, 0.7, 1],
                      outputRange: [0, 0, 0.6, 0.6],
                      extrapolate: "clamp",
                    })
                  : 0,
              },
            ]}
          />
        ) : null}
      </Animated.View>

      <View style={styles.cardText}>
        <Text style={styles.cardName} numberOfLines={2}>
          {drink.name}
        </Text>
        <MenuPrice amount={drink.price} />
      </View>
    </Pressable>
  );
}

// -----------------------------------------------------------------------------
// Store-closed toast.
// -----------------------------------------------------------------------------
function StoreClosedToast() {
  return (
    <View style={styles.toast} pointerEvents="none">
      <Text style={styles.toastText}>The store is closed.</Text>
    </View>
  );
}

// -----------------------------------------------------------------------------
// Styles.
// -----------------------------------------------------------------------------
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bgPage,
  },

  // Dark band
  band: {
    backgroundColor: colors.bgAppDark,
    paddingTop: 12,
    paddingHorizontal: space.pagePad,
    paddingBottom: 14,
  },
  bandTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 32,
  },
  bandTopLeft: { flexDirection: "row", alignItems: "center", gap: 4 },
  pickUp: {
    fontFamily: fontFamily.body,
    fontSize: type.pickUp.size,
    fontWeight: type.pickUp.weight,
    letterSpacing: type.pickUp.tracking,
    color: colors.textOnDark,
    marginLeft: 2,
  },
  searchCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 8,
  },
  brandName: {
    fontFamily: fontFamily.body,
    fontSize: type.storeName.size,
    fontWeight: type.storeName.weight,
    color: colors.textOnDark,
    lineHeight: type.storeName.lineHeight,
    marginLeft: 2,
  },
  miAway: {
    fontFamily: fontFamily.body,
    fontSize: type.bandSubtitle.size,
    fontWeight: type.bandSubtitle.weight,
    color: colors.textOnDarkDim,
    lineHeight: type.bandSubtitle.lineHeight,
    marginTop: 2,
  },
  tagline: {
    fontFamily: fontFamily.body,
    fontSize: type.bandSubtitle.size,
    color: colors.textOnDarkDim,
    fontStyle: "italic",
    lineHeight: type.bandSubtitle.lineHeight,
    marginTop: 14,
  },

  // Body
  body: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: colors.bgPage,
  },

  // Sidebar
  sidebar: {
    width: space.sidebarW,
    paddingVertical: 32,
    borderRightWidth: 1,
    borderRightColor: colors.divider,
    backgroundColor: colors.bgPage,
    justifyContent: "space-evenly",
  },
  sideRow: {
    paddingVertical: 8,
    paddingHorizontal: 8,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  sideText: {
    fontFamily: fontFamily.body,
    fontSize: type.sidebar.size,
    fontWeight: type.sidebar.weight,
    color: colors.sidebarInactiveText,
    lineHeight: type.sidebar.lineHeight,
    textAlign: "center",
  },
  sideTextActive: {
    color: colors.sidebarActiveText,
    fontWeight: type.sidebarActive.weight,
  },

  // Grid
  list: { flex: 1 },
  listContent: {
    paddingHorizontal: space.gridPad,
    paddingTop: 12,
    paddingBottom: 0,
  },
  section: { marginBottom: 12 },
  sectionHeader: {
    fontFamily: fontFamily.body,
    fontSize: type.sectionHeader.size,
    fontWeight: type.sectionHeader.weight,
    color: colors.textPrimary,
    lineHeight: type.sectionHeader.lineHeight,
    marginTop: 12,
    marginBottom: 8,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    columnGap: space.gridGap,
    rowGap: 8,
  },
  cell: {
    flexBasis: "47%",
    flexGrow: 1,
    flexShrink: 1,
    maxWidth: "50%",
    paddingTop: 8,
    paddingBottom: 16,
    alignItems: "center",
  },
  cardImageHolder: {
    width: 90,
    height: 106,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  cardImageInner: {
    alignItems: "center",
    justifyContent: "center",
  },
  cardBadge: {
    position: "absolute",
    top: 4,
    right: 4,
  },
  cardSkeleton: {
    position: "absolute",
    inset: 14,
    borderRadius: radii.lg,
    backgroundColor: colors.skeleton,
  } as any,
  cardText: {
    width: "100%",
    paddingHorizontal: 8,
    marginTop: -2,
    alignItems: "flex-start",
  },
  cardName: {
    fontFamily: fontFamily.body,
    fontSize: type.cardName.size,
    fontWeight: type.cardName.weight,
    color: colors.textPrimary,
    lineHeight: type.cardName.lineHeight,
    marginBottom: 2,
  },

  // Toast
  toastBleed: { height: 80 },
  toast: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 16,
    height: space.toastH,
    borderRadius: radii.xl,
    backgroundColor: colors.bgAppDark,
    alignItems: "center",
    justifyContent: "center",
    opacity: 0.94,
  },
  toastText: {
    fontFamily: fontFamily.body,
    fontSize: 14,
    fontWeight: "500",
    color: colors.textOnDark,
  },
});
