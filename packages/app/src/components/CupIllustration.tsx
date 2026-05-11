// Procedural cup SVG. Each drink id maps to an ordered top→bottom layer
// recipe (band fills + optional topping cap) so the morph can use the same
// asset at any size without juggling raster files. Drop in real PNGs by
// replacing this component's render path with <Image> and a resolver.

import { memo } from "react";
import Svg, {
  Defs,
  Ellipse,
  G,
  LinearGradient,
  Path,
  Rect,
  Stop,
  ClipPath,
} from "./svg";

type Layer = { color: string; weight?: number; topping?: boolean };
type Recipe = { layers: Layer[]; cap?: string; logo?: boolean };

// Neutral fallback for drinks with no recipe entry — soft tan tea look.
const FALLBACK_RECIPE: Recipe = {
  layers: [
    { color: "#F0E5C4", topping: true, weight: 18 },
    { color: "#C9A36B", weight: 82 },
  ],
  logo: true,
};

// Procedural fallback recipes for the real Bopomofo menu — drinks without
// photography use these. RealCup hands every drink that has a PNG straight to
// <Image>, so these only render for the long tail.
const RECIPES: Record<string, Recipe> = {
  // Classic Teas (placeholders for ones still missing real photography)
  "honey-roasted-oolong-milk-tea": {
    layers: [
      { color: "#F4E2BD", topping: true, weight: 24 },
      { color: "#7A4A2A", weight: 76 },
    ],
    logo: true,
  },

  // Premium Signatures placeholders
  "taro-sweet-milk": {
    layers: [
      { color: "#E9D6E8", topping: true, weight: 22 },
      { color: "#B894C7", weight: 36 },
      { color: "#9D72B6", weight: 42 },
    ],
    logo: true,
  },
  "blueberry-orange-green-tea": {
    layers: [
      { color: "#3F2A6E", topping: true, weight: 14 },
      { color: "#7A8A36", weight: 36 },
      { color: "#E2A044", weight: 50 },
    ],
    logo: true,
  },
  "hojicorn-latte": {
    layers: [
      { color: "#F4E0A8", topping: true, weight: 22 },
      { color: "#C29B5E", weight: 78 },
    ],
    logo: true,
  },
  "hojicha-latte": {
    layers: [
      { color: "#F0E1C0", topping: true, weight: 18 },
      { color: "#A8714A", weight: 82 },
    ],
    logo: true,
  },
  "orange-wang": {
    layers: [
      { color: "#FFFFFF", topping: true, weight: 22 },
      { color: "#F4A53A", weight: 78 },
    ],
    logo: true,
  },

  // Premium Matcha placeholders
  "carrot-matcha-latte": {
    layers: [
      { color: "#F0A14E", topping: true, weight: 24 },
      { color: "#9CB95A", weight: 76 },
    ],
    logo: true,
  },
  "ba-la-matcha": {
    layers: [
      { color: "#FFFFFF", topping: true, weight: 18 },
      { color: "#86A847", weight: 82 },
    ],
    logo: true,
  },
  "matcha-latte": {
    layers: [
      { color: "#F4ECDB", topping: true, weight: 22 },
      { color: "#90B255", weight: 78 },
    ],
    logo: true,
  },
  "matcha-soda": {
    layers: [
      { color: "#A8C95E", topping: true, weight: 14 },
      { color: "#C9DC8A", weight: 86 },
    ],
    logo: true,
  },
  "mint-matcha-latte": {
    layers: [
      { color: "#BFE0CF", topping: true, weight: 22 },
      { color: "#7FA85A", weight: 78 },
    ],
    logo: true,
  },

  // Premium Espresso placeholders
  "brown-sugar-buzz": {
    layers: [
      { color: "#F4E2BD", topping: true, weight: 18 },
      { color: "#3A1F12", weight: 82 },
    ],
    logo: true,
  },
  "shaken-espresso": {
    layers: [
      { color: "#A6764A", topping: true, weight: 14 },
      { color: "#2A160C", weight: 86 },
    ],
    logo: true,
  },
  "coffee-milk-tea": {
    layers: [
      { color: "#E4CFAA", topping: true, weight: 22 },
      { color: "#5C3A22", weight: 78 },
    ],
    logo: true,
  },
  "sprola": {
    layers: [
      { color: "#F4E08A", topping: true, weight: 18 },
      { color: "#D29A36", weight: 82 },
    ],
    logo: true,
  },

  // Cup-spec line-art keys (kept for the cup-only spec cards if any drink ever
  // re-introduces a Cup Specification section).
  "cup-500": {
    layers: [{ color: "#FFFFFF", weight: 100 }],
    cap: "transparent",
  },
  "cup-650": {
    layers: [{ color: "#FFFFFF", weight: 100 }],
    cap: "transparent",
  },
};

// The cup outline is a slightly tapered rectangle: wider at the top, narrower
// at the base. Coordinates live in a 100x140 viewport so consumers can pick
// any size and the proportions stay right.
//
// VB: 100 wide, 140 tall.
// Cup top edge at y=10, bottom at y=130. Top width 84 (x=8..92), bottom width 64 (x=18..82).

const VB_W = 100;
const VB_H = 140;
const TOP_Y = 10;
const BOTTOM_Y = 130;
const TOP_LX = 8;
const TOP_RX = 92;
const BOT_LX = 18;
const BOT_RX = 82;

function bandPath(yTop: number, yBot: number) {
  // Trapezoid clipped horizontally by the cup walls. We compute x at any y
  // by linear interpolation between top and bottom.
  const t1 = (yTop - TOP_Y) / (BOTTOM_Y - TOP_Y);
  const t2 = (yBot - TOP_Y) / (BOTTOM_Y - TOP_Y);
  const lx1 = TOP_LX + (BOT_LX - TOP_LX) * t1;
  const rx1 = TOP_RX + (BOT_RX - TOP_RX) * t1;
  const lx2 = TOP_LX + (BOT_LX - TOP_LX) * t2;
  const rx2 = TOP_RX + (BOT_RX - TOP_RX) * t2;
  return `M${lx1},${yTop} L${rx1},${yTop} L${rx2},${yBot} L${lx2},${yBot} Z`;
}

type Props = {
  drinkId: string;
  size: number; // visual width in px (height auto = size * 1.4)
  withLogo?: boolean;
  cupOnly?: boolean; // for cup-spec line-art renders
};

function CupIllustrationInner({ drinkId, size, withLogo = true, cupOnly = false }: Props) {
  const recipe = RECIPES[drinkId] ?? FALLBACK_RECIPE;
  const height = (size * VB_H) / VB_W;

  if (cupOnly) {
    return <CupLineArt drinkId={drinkId} size={size} />;
  }

  // Build banded layers from weights (percentage of internal height).
  const innerTop = TOP_Y + 4;
  const innerBot = BOTTOM_Y - 6;
  const innerH = innerBot - innerTop;
  const totalWeight = recipe.layers.reduce((sum, l) => sum + (l.weight ?? 100), 0) || 100;
  let cursor = innerTop;
  const bands = recipe.layers.map((layer) => {
    const h = (innerH * (layer.weight ?? 100)) / totalWeight;
    const top = cursor;
    cursor += h;
    return { ...layer, top, bot: cursor };
  });

  return (
    <Svg width={size} height={height} viewBox={`0 0 ${VB_W} ${VB_H}`}>
      <Defs>
        <ClipPath id={`cupClip-${drinkId}`}>
          <Path
            d={`M${TOP_LX - 1},${TOP_Y} L${TOP_RX + 1},${TOP_Y} L${BOT_RX + 1},${BOTTOM_Y} L${BOT_LX - 1},${BOTTOM_Y} Z`}
          />
        </ClipPath>
        <LinearGradient id={`shade-${drinkId}`} x1="0" x2="1" y1="0" y2="0">
          <Stop offset="0" stopColor="#000" stopOpacity="0.06" />
          <Stop offset="0.5" stopColor="#000" stopOpacity="0" />
          <Stop offset="1" stopColor="#000" stopOpacity="0.10" />
        </LinearGradient>
      </Defs>

      {/* Liquid bands inside cup */}
      <G clipPath={`url(#cupClip-${drinkId})`}>
        {bands.map((b, i) => (
          <Path key={i} d={bandPath(b.top, b.bot)} fill={b.color} />
        ))}
        {/* Subtle side shading */}
        <Path d={bandPath(innerTop, innerBot)} fill={`url(#shade-${drinkId})`} />
      </G>

      {/* Cup outline */}
      <Path
        d={`M${TOP_LX},${TOP_Y} L${TOP_RX},${TOP_Y} L${BOT_RX},${BOTTOM_Y} L${BOT_LX},${BOTTOM_Y} Z`}
        fill="none"
        stroke="rgba(0,0,0,0.18)"
        strokeWidth={0.8}
      />

      {/* Lid rim */}
      <Ellipse cx={50} cy={TOP_Y} rx={(TOP_RX - TOP_LX) / 2} ry={2.4} fill="none" stroke="rgba(0,0,0,0.22)" strokeWidth={0.8} />
      <Ellipse cx={50} cy={TOP_Y} rx={(TOP_RX - TOP_LX) / 2 - 1.2} ry={1.8} fill="rgba(255,255,255,0.55)" />

      {/* Bottom oval shadow */}
      <Ellipse cx={50} cy={BOTTOM_Y - 0.5} rx={(BOT_RX - BOT_LX) / 2} ry={2.0} fill="none" stroke="rgba(0,0,0,0.14)" strokeWidth={0.8} />

      {/* Cap topping (e.g. cream cloud) — only if the first layer is flagged */}
      {recipe.cap && recipe.cap !== "transparent" ? (
        <Path d={bandPath(TOP_Y, TOP_Y + 12)} fill={recipe.cap} />
      ) : null}

      {/* Bird logo silhouette */}
      {withLogo && recipe.logo ? <BirdLogo /> : null}
    </Svg>
  );
}

function BirdLogo() {
  // Stylised bird — abstract but recognizable at thumbnail size.
  return (
    <G transform="translate(38 60) scale(0.34)">
      <Path
        d="M30,12 C40,8 52,12 56,22 C58,28 56,32 60,36 C66,42 70,52 64,58 C58,64 48,60 42,54 L38,60 L34,52 C24,52 18,46 16,38 C14,30 18,18 30,12 Z"
        fill="#1A1A1A"
      />
      <Path d="M44,28 L52,30" stroke="#FFFFFF" strokeWidth={2} strokeLinecap="round" />
    </G>
  );
}

function CupLineArt({ drinkId, size }: { drinkId: string; size: number }) {
  // Thin line-art cup for the Cup Specification cards.
  const tall = drinkId === "cup-650";
  const h = tall ? 60 : 52;
  const top = 8;
  const bot = top + h;
  const tw = tall ? 22 : 24;
  const bw = tall ? 16 : 18;
  return (
    <Svg width={size} height={size * 1.0} viewBox="0 0 40 60">
      <Path
        d={`M${20 - tw / 2},${top} L${20 + tw / 2},${top} L${20 + bw / 2},${bot} L${20 - bw / 2},${bot} Z`}
        fill="#FFFFFF"
        stroke="#1A1A1A"
        strokeWidth={1}
      />
      <Ellipse cx={20} cy={top} rx={tw / 2} ry={1.8} fill="#FFFFFF" stroke="#1A1A1A" strokeWidth={1} />
      <Rect x={20 - bw / 2} y={bot - 1} width={bw} height={1.4} fill="#1A1A1A" />
    </Svg>
  );
}

export const CupIllustration = memo(CupIllustrationInner);
