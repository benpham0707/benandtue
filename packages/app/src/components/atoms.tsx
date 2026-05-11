// Tiny presentational atoms shared across the menu and detail screens.

import { memo } from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";
import Svg, { Circle, Path } from "./svg";
import { colors, fontFamily, type } from "../theme/tokens";
import type { Badge as BadgeT, Tag } from "../types";

// -----------------------------------------------------------------------------
// Tag chip — three styles per FRAME 15/16.
// -----------------------------------------------------------------------------
export const TagChip = memo(function TagChip({ tag }: { tag: Tag }) {
  const isPositive = tag.style === "positive";
  const isAllergen = tag.style === "allergen";
  return (
    <View
      style={[
        tagStyles.chip,
        isPositive && tagStyles.positive,
        isAllergen && tagStyles.allergen,
      ]}
    >
      <Text
        style={[
          tagStyles.text,
          isPositive && tagStyles.textPositive,
          isAllergen && tagStyles.textAllergen,
        ]}
      >
        {tag.label}
      </Text>
    </View>
  );
});

const tagStyles = StyleSheet.create({
  // Sized ~60% of the original chip (40% smaller, per spec) with a darker
  // outline + text so the chips read clearly over the warm tiger mural.
  chip: {
    paddingVertical: 2.5,
    paddingHorizontal: 7,
    borderRadius: 3.5,
    borderWidth: 1,
    borderColor: "#6E6E6E",
    backgroundColor: colors.tagFill,
    // Slightly displaced white "highlight" shadow — same shape as the chip,
    // offset down-right to pop the chip off the tiger mural. The negative-
    // spread white sits inside a same-shape colored shadow, leaving ~0.67px
    // of the tag's border color showing as a thin trace around the highlight.
    boxShadow:
      "1.7px 1.7px 0 -0.67px #FFFFFF, 1.7px 1.7px 0 0 #6E6E6E",
  } as any,
  positive: {
    borderColor: colors.tagBorderPositive,
    boxShadow: `1.7px 1.7px 0 -0.67px #FFFFFF, 1.7px 1.7px 0 0 ${colors.tagBorderPositive}`,
  } as any,
  allergen: {
    borderColor: "#7A7A7A",
    boxShadow: "1.7px 1.7px 0 -0.67px #FFFFFF, 1.7px 1.7px 0 0 #7A7A7A",
  } as any,
  text: {
    fontFamily: fontFamily.body,
    fontSize: 7.5,
    fontWeight: type.tag.weight,
    letterSpacing: 0.12,
    color: "#2A2A2A",
    lineHeight: 10,
  },
  textPositive: { color: colors.tagTextPositive },
  textAllergen: { color: "#444444" },
});

// -----------------------------------------------------------------------------
// Calorie / Lactose-Free badge — circular disc, semi-white fill, thin outline.
// -----------------------------------------------------------------------------
export const DrinkBadge = memo(function DrinkBadge({
  badge,
  size = 36,
}: {
  badge: BadgeT;
  size?: number;
}) {
  const dim = size;
  return (
    <View style={[badgeStyles.disc, { width: dim, height: dim, borderRadius: dim / 2 }]}>
      {badge.kind === "calories" ? (
        <>
          <Text style={badgeStyles.calVal}>{badge.value}</Text>
          <Text style={badgeStyles.calLbl}>Cal</Text>
        </>
      ) : (
        <>
          <Text style={badgeStyles.lactose}>LACTOSE</Text>
          <Text style={badgeStyles.lactose}>FREE</Text>
        </>
      )}
    </View>
  );
});

const badgeStyles = StyleSheet.create({
  disc: {
    backgroundColor: colors.badgeBg,
    borderWidth: 1,
    borderColor: colors.badgeBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  calVal: {
    fontFamily: fontFamily.body,
    fontSize: 11,
    fontWeight: "600",
    color: colors.textPrimary,
    lineHeight: 12,
  },
  calLbl: {
    fontFamily: fontFamily.body,
    fontSize: 8,
    fontWeight: "500",
    color: colors.textSecondary,
    lineHeight: 10,
    letterSpacing: 0.2,
  },
  lactose: {
    fontFamily: fontFamily.body,
    fontSize: 8,
    fontWeight: "600",
    color: colors.textPrimary,
    lineHeight: 9,
    letterSpacing: 0.4,
  },
});

// -----------------------------------------------------------------------------
// Price tag — big numerals, smaller raised "$".
// -----------------------------------------------------------------------------
export function PriceTag({
  amount,
  align = "left",
  style,
}: {
  amount: number;
  align?: "left" | "center";
  style?: ViewStyle;
}) {
  const [whole, frac] = amount.toFixed(2).split(".");
  return (
    <View style={[priceStyles.row, align === "center" && priceStyles.center, style]}>
      <Text style={priceStyles.symbol}>$</Text>
      <View style={priceStyles.gap} />
      <Text style={priceStyles.whole}>{whole}</Text>
      <Text style={priceStyles.dot}>.</Text>
      <Text style={priceStyles.frac}>{frac}</Text>
    </View>
  );
}

const priceStyles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "flex-end" },
  center: { justifyContent: "center" },
  symbol: {
    fontFamily: fontFamily.body,
    fontSize: type.priceSymbol.size,
    fontWeight: type.priceSymbol.weight,
    color: colors.textPrimary,
    lineHeight: type.priceSymbol.lineHeight,
    paddingBottom: 4,
  },
  gap: { width: 3 },
  whole: {
    fontFamily: fontFamily.body,
    fontSize: type.priceMain.size,
    fontWeight: type.priceMain.weight,
    color: colors.textPrimary,
    lineHeight: type.priceMain.lineHeight,
    letterSpacing: type.priceMain.tracking,
  },
  dot: {
    fontFamily: fontFamily.body,
    fontSize: type.priceMain.size,
    fontWeight: type.priceMain.weight,
    color: colors.textPrimary,
    lineHeight: type.priceMain.lineHeight,
  },
  frac: {
    fontFamily: fontFamily.body,
    fontSize: type.priceMain.size,
    fontWeight: type.priceMain.weight,
    color: colors.textPrimary,
    lineHeight: type.priceMain.lineHeight,
  },
});

// -----------------------------------------------------------------------------
// Inline cents-style menu price (smaller — for grid cards).
// -----------------------------------------------------------------------------
export function MenuPrice({ amount }: { amount: number }) {
  return (
    <Text style={menuPriceStyles.txt}>
      ${amount.toFixed(2)}
    </Text>
  );
}

const menuPriceStyles = StyleSheet.create({
  txt: {
    fontFamily: fontFamily.body,
    fontSize: type.cardPrice.size,
    fontWeight: type.cardPrice.weight,
    color: colors.textPrimary,
    lineHeight: type.cardPrice.lineHeight,
  },
});

// -----------------------------------------------------------------------------
// Icons (inline SVG so we don't pull a runtime icon set).
// -----------------------------------------------------------------------------
export function ChevronLeft({ size = 24, color = colors.textPrimary, weight = 1.8 }: { size?: number; color?: string; weight?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M15 5 L8 12 L15 19" stroke={color} strokeWidth={weight} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function ChevronRight({ size = 16, color = colors.textPrimary, weight = 1.6 }: { size?: number; color?: string; weight?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M9 5 L16 12 L9 19" stroke={color} strokeWidth={weight} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function ChevronDown({ size = 16, color = colors.textPrimary, weight = 1.6 }: { size?: number; color?: string; weight?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M5 9 L12 16 L19 9" stroke={color} strokeWidth={weight} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function MagnifierIcon({ size = 18, color = colors.textOnDark }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={11} cy={11} r={6} stroke={color} strokeWidth={1.8} />
      <Path d="M16 16 L20 20" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  );
}

export function StarIcon({ size = 16, color = colors.starGold }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M12 2 L14.7 8.6 L21.8 9.3 L16.4 14 L18.1 21 L12 17.4 L5.9 21 L7.6 14 L2.2 9.3 L9.3 8.6 Z" fill={color} />
    </Svg>
  );
}

export function CupQuestionIcon({ size = 22, color = colors.textPrimary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M6 6 L18 6 L17 20 Q16.6 21.4 15.2 21.4 L8.8 21.4 Q7.4 21.4 7 20 Z" stroke={color} strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M5 6 L19 6" stroke={color} strokeWidth={1.4} strokeLinecap="round" />
      <Path d="M10.5 11 Q12 10 13 11.5 Q13.5 12.4 12.5 13.2 Q11.6 13.8 11.6 14.6" stroke={color} strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
      <Circle cx={11.6} cy={16.6} r={0.7} fill={color} />
    </Svg>
  );
}

export function PlusIcon({ size = 14, color = "#FFFFFF" }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 5 L12 19 M5 12 L19 12" stroke={color} strokeWidth={2.2} strokeLinecap="round" />
    </Svg>
  );
}

export function MinusIcon({ size = 14, color = colors.textPrimary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M5 12 L19 12" stroke={color} strokeWidth={2.2} strokeLinecap="round" />
    </Svg>
  );
}

export function CheckIcon({ size = 12, color = colors.textPrimary, weight = 1.9 }: { size?: number; color?: string; weight?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 12 12" fill="none">
      <Path d="M2.4 6.4 L5 9 L9.6 3.4" stroke={color} strokeWidth={weight} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

// -----------------------------------------------------------------------------
// Sidebar active bar — thin dark line that sits on the divider, height matches
// the active label so it reads as part of the text block.
// -----------------------------------------------------------------------------
export function ActiveBar() {
  return <View style={activeBarStyles.bar} />;
}
const activeBarStyles = StyleSheet.create({
  bar: {
    position: "absolute",
    right: -0.5,
    top: "50%",
    width: 1.5,
    height: 38,
    marginTop: -19,
    borderRadius: 1,
    backgroundColor: colors.sidebarActiveBar,
  },
});
