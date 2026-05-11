"use client";

import {
  DrinkDetail,
  MorphOverlay,
  PickupMenu,
  type PickupMenuHandle,
  type Rect,
  type SourceRect,
  getDetailDrink,
  motion,
  space,
} from "app";
import { useCallback, useEffect, useRef, useState } from "react";
import { Animated, Easing, View } from "react-native";

type Route =
  | { name: "menu" }
  | { name: "morphing"; drinkId: string; sourceRect: Rect; destRect: Rect }
  | { name: "detail"; drinkId: string };

type Props = {
  initialRoute?: { name: "menu" } | { name: "detail"; drinkId: string };
  /** QA tool — when set, freezes the morph at this 0..1 progress for the given drink. */
  freezeMorph?: { drinkId: string; progress: number };
};

// Choreography constants come from BOPOMOFO_MENU_SPEC.md §5.1.
// `cubic-bezier(0.32, 0.72, 0, 1)` — iOS spring-y feel.
const morphEasing = Easing.bezier(0.32, 0.72, 0, 1);

export function AppDemoShell({ initialRoute, freezeMorph }: Props) {
  const [route, setRoute] = useState<Route>(initialRoute ?? { name: "menu" });
  const [pressedId, setPressedId] = useState<string | null>(null);
  const [containerSize, setContainerSize] = useState({ width: 390, height: 844 });
  const containerRef = useRef<View | null>(null);
  const containerOriginRef = useRef({ x: 0, y: 0 });
  const menuRef = useRef<PickupMenuHandle | null>(null);

  const morphProgress = useRef(new Animated.Value(0)).current;
  const popProgress = useRef(new Animated.Value(0)).current;

  // Capture container origin in viewport coords so we can translate the
  // measured card rect into local-relative coords for the overlay.
  const onContainerLayout = useCallback(() => {
    containerRef.current?.measureInWindow?.((x, y, width, height) => {
      containerOriginRef.current = { x, y };
      setContainerSize({ width, height });
    });
  }, []);

  // Compute the destination rect for the detail page's hero image.
  // Must match DrinkDetail.tsx HERO_TX/HERO_TY so the morph lands seamlessly:
  // 75% of the visible cup sits in the tiger hero, 25% in the white sheet.
  const destRect = useCallback((): Rect => {
    const cupW = space.heroImageW;
    const cupH = cupW * 1.4;
    const HERO_INIT_H = 270;
    const visibleCupH = cupW * 1.3;
    const sheetSeamY = HERO_INIT_H - 20;
    const heroTy = sheetSeamY - 0.75 * visibleCupH - (cupH - visibleCupH) / 2;
    return {
      x: containerSize.width - 36 - cupW,
      y: heroTy,
      width: cupW,
      height: cupH,
    };
  }, [containerSize.width]);

  const onTapDrink = useCallback(
    (drink: { id: string }, sourceWindowRect: SourceRect) => {
      // Press feedback (card opacity dip).
      setPressedId(drink.id);

      // Translate source rect from viewport coords to container-local coords.
      const origin = containerOriginRef.current;
      const localSource: Rect = {
        x: sourceWindowRect.x - origin.x,
        y: sourceWindowRect.y - origin.y,
        width: sourceWindowRect.width,
        height: sourceWindowRect.height,
      };
      const localDest = destRect();

      setRoute({
        name: "morphing",
        drinkId: drink.id,
        sourceRect: localSource,
        destRect: localDest,
      });
    },
    [destRect],
  );

  // Drive the morph progress whenever we enter the morphing phase.
  useEffect(() => {
    if (route.name !== "morphing") return;
    morphProgress.setValue(0);
    if (freezeMorph) {
      morphProgress.setValue(freezeMorph.progress);
      return; // never advance — for QA only
    }
    const anim = Animated.timing(morphProgress, {
      toValue: 1,
      duration: motion.morph.duration,
      easing: morphEasing,
      useNativeDriver: false,
    });
    anim.start(({ finished }) => {
      if (!finished) return;
      // Hand off to the real detail screen.
      setRoute({ name: "detail", drinkId: route.drinkId });
      setPressedId(null);
      morphProgress.setValue(0);
    });
    return () => anim.stop();
  }, [route, morphProgress, freezeMorph]);

  // QA freeze: pre-set the morph route based on the given drink + a synthetic source rect.
  useEffect(() => {
    if (!freezeMorph) return;
    if (containerSize.width === 0) return;
    // Synthetic source rect: centered in the right column, top row of the grid.
    const cellW = (containerSize.width - space.sidebarW) / 2;
    const sourceRect: Rect = {
      x: space.sidebarW + cellW + 10,
      y: 200,
      width: 110,
      height: 154,
    };
    const dest = destRect();
    setPressedId(freezeMorph.drinkId);
    setRoute({
      name: "morphing",
      drinkId: freezeMorph.drinkId,
      sourceRect,
      destRect: dest,
    });
    morphProgress.setValue(freezeMorph.progress);
  }, [freezeMorph, containerSize.width, destRect, morphProgress]);

  const onBack = useCallback(() => {
    Animated.timing(popProgress, {
      toValue: 1,
      duration: motion.back.duration,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (!finished) return;
      setRoute({ name: "menu" });
      popProgress.setValue(0);
    });
  }, [popProgress]);

  const morphRoute = route.name === "morphing" ? route : null;
  const detailRoute = route.name === "detail" ? route : null;
  const morphDrink = morphRoute
    ? getDetailDrink(morphRoute.drinkId) ?? findStub(morphRoute.drinkId)
    : null;

  // Dark band cross-fade (over the menu) — 0.20 → 0.80 of progress.
  const darkBandFade = morphProgress.interpolate({
    inputRange: [0, 0.2, 0.8, 1],
    outputRange: [0, 0, 1, 1],
    extrapolate: "clamp",
  });

  return (
    <View
      ref={containerRef}
      onLayout={onContainerLayout}
      style={{
        flex: 1,
        width: "100%",
        height: "100%",
        overflow: "hidden",
        backgroundColor: "#FFFFFF",
        position: "relative",
      }}
    >
      {/* Menu (always rendered so source rects are measurable). */}
      <View style={{ position: "absolute", top: 0, bottom: 0, left: 0, right: 0 }}>
        <PickupMenu
          ref={menuRef}
          onTapDrink={onTapDrink}
          pressedId={pressedId}
          morphProgress={route.name === "morphing" ? morphProgress : undefined}
        />
      </View>

      {/* Dark band cross-fade — solid gray panel above the dark band. */}
      {morphRoute ? (
        <Animated.View
          pointerEvents="none"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 140,
            backgroundColor: "#EFEFEF",
            opacity: darkBandFade,
          }}
        />
      ) : null}

      {/* Morph overlay (during morphing only). */}
      {morphRoute && morphDrink ? (
        <MorphOverlay
          drink={morphDrink}
          sourceRect={morphRoute.sourceRect}
          destRect={morphRoute.destRect}
          progress={morphProgress}
          containerHeight={containerSize.height}
        />
      ) : null}

      {/* Real detail screen — slides off horizontally on back. */}
      {detailRoute ? (
        <Animated.View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "#FFFFFF",
            transform: [
              {
                translateX: popProgress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, containerSize.width],
                }),
              },
            ],
          }}
        >
          <DrinkDetail drinkId={detailRoute.drinkId} onBack={onBack} />
        </Animated.View>
      ) : null}
    </View>
  );
}

function findStub(id: string) {
  // Walk through menu sections to find a stub with this id.
  // Lazy import to avoid pulling sections at module init.
  const { menuSections } = require("app");
  for (const sec of menuSections) {
    for (const d of sec.drinks) if (d.id === id) return d;
  }
  return undefined;
}
