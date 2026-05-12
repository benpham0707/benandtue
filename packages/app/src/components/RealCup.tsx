// Renders the real Bopomofo cup PNG when one is available; falls back to the
// procedural CupIllustration otherwise. Public PNG paths live in the web app's
// /public/bopomofo/ folder. Native (Expo) builds will need require()'d assets
// or a remote CDN — out of scope for the web demo.

import { memo } from "react";
import { Image, View } from "react-native";
import { CupIllustration } from "./CupIllustration";
import { assetPath } from "../utils/assetPath";

const REAL_IMAGES: Record<string, string> = {
  "jasmine-tea": assetPath("/bopomofo/jasmine-tea.png"),
  "jasmine-milk-tea": assetPath("/bopomofo/jasmine-milk-tea.png"),
  "assam-tea": assetPath("/bopomofo/assam-tea.png"),
  "assam-milk-tea": assetPath("/bopomofo/assam-milk-tea.png"),
  "honey-roasted-oolong-tea": assetPath("/bopomofo/honey-roasted-oolong-tea.png"),
  "brown-sugar-pudding-milk-tea": assetPath("/bopomofo/brown-sugar-pudding-milk-tea.png"),
  "strawberry-basil-ginger-lemonade": assetPath("/bopomofo/strawberry-basil-ginger-lemonade.png"),
  "strawberry-corn-milk": assetPath("/bopomofo/strawberry-corn-milk.png"),
  "hey-sesame-milk": assetPath("/bopomofo/hey-sesame-milk.png"),
  "matcha-guava-latte": assetPath("/bopomofo/matcha-guava-latte.png"),
};

type Props = {
  drinkId: string;
  size: number;
  withLogo?: boolean;
  cupOnly?: boolean;
};

function RealCupInner({ drinkId, size, withLogo = true, cupOnly = false }: Props) {
  if (cupOnly) return <CupIllustration drinkId={drinkId} size={size} cupOnly />;

  const uri = REAL_IMAGES[drinkId];
  if (!uri) return <CupIllustration drinkId={drinkId} size={size} withLogo={withLogo} />;

  const height = size * 1.4;
  return (
    <View style={{ width: size, height, alignItems: "center", justifyContent: "center" }}>
      <Image
        source={{ uri }}
        style={{ width: size, height }}
        resizeMode="contain"
        accessibilityIgnoresInvertColors
      />
    </View>
  );
}

export const RealCup = memo(RealCupInner);

export function hasRealImage(drinkId: string): boolean {
  return drinkId in REAL_IMAGES;
}
