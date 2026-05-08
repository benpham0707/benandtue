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

const RECIPES: Record<string, Recipe> = {
  "coconut-mango-blue": {
    layers: [
      { color: "#F2C24A", topping: true, weight: 14 },
      { color: "#9DCBE8", weight: 28 },
      { color: "#F8DA70", weight: 18 },
      { color: "#9DCBE8", weight: 22 },
      { color: "#F8DA70", weight: 18 },
    ],
    logo: true,
  },
  "mango-grapefruit-boom": {
    layers: [
      { color: "#F4B65B", topping: true, weight: 16 },
      { color: "#FFFFFF", weight: 18 },
      { color: "#F2A742", weight: 32 },
      { color: "#E48732", weight: 34 },
    ],
    logo: true,
  },
  "coconut-mango-boom": {
    layers: [
      { color: "#F2BD46", topping: true, weight: 16 },
      { color: "#FFFFFF", weight: 22 },
      { color: "#F4C040", weight: 26 },
      { color: "#FFFFFF", weight: 18 },
      { color: "#F4C040", weight: 18 },
    ],
    logo: true,
  },
  "golden-oolong-yuzu": {
    layers: [
      { color: "#F0C147", topping: true, weight: 12 },
      { color: "#F8E58A", weight: 36 },
      { color: "#F2CD3F", weight: 52 },
    ],
    logo: true,
  },
  "pistachio-cloud-jasmine-coconut": {
    layers: [
      { color: "#A6C45A", topping: true, weight: 16 },
      { color: "#D4D75E", weight: 18 },
      { color: "#F4D770", weight: 24 },
      { color: "#F1C854", weight: 42 },
    ],
    logo: true,
  },
  "kale-boost-tea": {
    layers: [
      { color: "#9FBE5E", topping: true, weight: 12 },
      { color: "#7FB857", weight: 88 },
    ],
    cap: "transparent",
    logo: true,
  },
  "king-jasmine-guava": {
    layers: [
      { color: "#F8E2D6", topping: true, weight: 18 },
      { color: "#F0CFC2", weight: 30 },
      { color: "#E0A89A", weight: 52 },
    ],
    logo: true,
  },
  "yingde-cheese-milk-tea": {
    layers: [
      { color: "#F4E2BD", topping: true, weight: 22 },
      { color: "#5A3522", weight: 78 },
    ],
    logo: true,
  },
  "mochi-yingde-black-milk-tea": {
    layers: [
      { color: "#FFFFFF", topping: true, weight: 14 },
      { color: "#241910", weight: 86 },
    ],
    logo: true,
  },
  "triple-supreme-matcha-latte": {
    layers: [
      { color: "#A8C95E", topping: true, weight: 12 },
      { color: "#B5D178", weight: 24 },
      { color: "#90B255", weight: 64 },
    ],
    logo: true,
  },
  "jasmine-milk-tea": {
    layers: [
      { color: "#EFDDB7", weight: 100 },
    ],
    cap: "#E5D5B5",
    logo: true,
  },
  "cloud-matcha-latte": {
    layers: [
      { color: "#FFFFFF", topping: true, weight: 26 },
      { color: "#A8C95E", weight: 74 },
    ],
    logo: true,
  },
  "cloud-crisp-grape": {
    layers: [
      { color: "#F8F4ED", topping: true, weight: 28 },
      { color: "#5C2238", weight: 72 },
    ],
    logo: true,
  },
  "crisp-grape-boom": {
    layers: [
      { color: "#7B1F35", topping: true, weight: 16 },
      { color: "#5A152A", weight: 84 },
    ],
    logo: true,
  },
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
  const recipe = RECIPES[drinkId] ?? RECIPES["coconut-mango-blue"]!;
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
