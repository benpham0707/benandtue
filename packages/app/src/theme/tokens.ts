// Bopomofo design tokens. Values come from BOPOMOFO_MENU_SPEC.md §2.
// Flat constants only — no theme provider, no nested objects.

export const colors = {
  bgAppDark: "#2A2A2A",
  bgPage: "#FFFFFF",
  bgStage: "#EFEFEF",
  bgExplore: "#F4F4EA",

  textPrimary: "#1A1A1A",
  textSecondary: "#7A7A7A",
  textTertiary: "#B8B8B8",
  textOnDark: "#FFFFFF",
  textOnDarkDim: "#9A9A9A",

  tagBorder: "#D0D0D0",
  tagBorderPositive: "#3D9342",
  tagTextPositive: "#2F7B33",
  // Warm off-white fill so chips stay legible over the tiger mural.
  tagFill: "#FAF5E8",

  badgeBg: "rgba(255,255,255,0.85)",
  badgeBorder: "rgba(0,0,0,0.10)",

  accentCta: "#1A1A1A",
  ctaDisabled: "#C5C5C5",
  ctaDisabledText: "#FFFFFF",

  divider: "#E5E5E5",
  dividerSoft: "#EFEFEF",

  sidebarActiveText: "#1A1A1A",
  sidebarInactiveText: "#A8A8A8",
  sidebarActiveBar: "#1A1A1A",

  starGold: "#E8B84B",

  caffeineGreen: "#7CC04A",
  caffeineDotDim: "#D5D5D5",
  caffeinePillBg: "#F5F5F5",

  skeleton: "#EAEAEA",
  skeletonDeep: "#DCDCDC",
} as const;

export type ColorToken = keyof typeof colors;

// Typography. RN ignores tracking on most platforms but RN Web honors it.
export const fontFamily = {
  body: 'Nunito, -apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif',
  display: 'Recoleta, "Recoleta-Regular", Georgia, "Times New Roman", serif',
} as const;

export const type = {
  drinkTitle: { size: 24, weight: "700" as const, tracking: -0.3, lineHeight: 30 },
  sectionHeader: { size: 17, weight: "700" as const, tracking: -0.1, lineHeight: 22 },
  exploreH2: { size: 20, weight: "700" as const, tracking: -0.2, lineHeight: 26 },
  priceMain: { size: 22, weight: "700" as const, tracking: -0.4, lineHeight: 26 },
  priceSymbol: { size: 14, weight: "600" as const, tracking: 0, lineHeight: 18 },
  cardName: { size: 13, weight: "700" as const, tracking: -0.1, lineHeight: 17 },
  cardPrice: { size: 13, weight: "700" as const, tracking: -0.1, lineHeight: 17 },
  tag: { size: 11, weight: "500" as const, tracking: 0.2, lineHeight: 14 },
  customLabel: { size: 11, weight: "400" as const, tracking: 0, lineHeight: 14 },
  customValue: { size: 14, weight: "600" as const, tracking: 0, lineHeight: 18 },
  sidebar: { size: 13, weight: "600" as const, tracking: -0.1, lineHeight: 17 },
  sidebarActive: { size: 13, weight: "800" as const, tracking: -0.1, lineHeight: 17 },
  disclaimer: { size: 11, weight: "400" as const, tracking: 0, lineHeight: 16 },
  natural: { size: 14, weight: "500" as const, tracking: 8, lineHeight: 18 },
  pickUp: { size: 18, weight: "600" as const, tracking: 0.5, lineHeight: 22 },
  bottomBarPrice: { size: 18, weight: "700" as const, tracking: 0, lineHeight: 22 },
  addToBag: { size: 16, weight: "600" as const, tracking: 0.2, lineHeight: 20 },
  storeName: { size: 16, weight: "600" as const, tracking: 0, lineHeight: 20 },
  bandSubtitle: { size: 13, weight: "400" as const, tracking: 0, lineHeight: 18 },
  recipeLink: { size: 13, weight: "500" as const, tracking: 0, lineHeight: 18 },
  description: { size: 14, weight: "400" as const, tracking: 0, lineHeight: 21 },
  showMore: { size: 13, weight: "500" as const, tracking: 0, lineHeight: 18 },
  exploreEyebrow: { size: 12, weight: "500" as const, tracking: 0.3, lineHeight: 16 },
  exploreBody: { size: 13, weight: "400" as const, tracking: 0, lineHeight: 19 },
  callout: { size: 12, weight: "500" as const, tracking: 0, lineHeight: 16 },
  calloutEyebrow: { size: 9, weight: "500" as const, tracking: 0.2, lineHeight: 12 },
  imageCaption: { size: 10, weight: "400" as const, tracking: 0, lineHeight: 14 },
  nutritionHeader: { size: 11, weight: "500" as const, tracking: 0, lineHeight: 14 },
  nutritionLabel: { size: 13, weight: "400" as const, tracking: 0, lineHeight: 17 },
  nutritionValue: { size: 14, weight: "600" as const, tracking: 0, lineHeight: 18 },
  caffeineEyebrow: { size: 10, weight: "500" as const, tracking: 0.2, lineHeight: 13 },
  caffeineLabel: { size: 13, weight: "500" as const, tracking: 0, lineHeight: 17 },
  caffeineSub: { size: 12, weight: "400" as const, tracking: 0, lineHeight: 16 },
  badge: { size: 9, weight: "600" as const, tracking: 0.3, lineHeight: 11 },
  cupSpec: { size: 13, weight: "500" as const, tracking: 0, lineHeight: 17 },
  cupSpecActive: { size: 13, weight: "600" as const, tracking: 0, lineHeight: 17 },
  qty: { size: 16, weight: "600" as const, tracking: 0, lineHeight: 20 },
} as const;

export const space = {
  pagePad: 20,
  sectionGap: 24,
  inSection: 12,
  cardImageGap: 8,
  gridGap: 16,
  gridPad: 16,
  tagPadV: 4,
  tagPadH: 10,
  rowHeight: 64,
  rowRadius: 10,
  rowGap: 12,
  cupSpecW: 152,
  cupSpecH: 88,
  pillPadV: 12,
  pillPadH: 24,
  ctaHeight: 52,
  cardImageH: 160,
  heroImageW: 144,
  heroImageH: 202,
  sidebarW: 88,
  sidebarRowH: 80,
  sidebarBarW: 2,
  sidebarBarH: 28,
  bandH: 140,
  toastH: 56,
  stageH: 360,
  stickyHeaderH: 56,
} as const;

export const radii = {
  none: 0,
  xs: 4,
  sm: 6,
  md: 8,
  lg: 10,
  xl: 12,
  sheet: 20,
  pill: 999,
} as const;

export const motion = {
  morph: {
    duration: 320,
    // iOS spring-y feel; cubic-bezier(0.32, 0.72, 0, 1)
    easing: [0.32, 0.72, 0, 1] as const,
  },
  back: {
    duration: 250,
  },
  parallax: {
    titleFadeEnd: 80,
    imageScaleEnd: 200,
    imageFadeEnd: 280,
    stageCollapseEnd: 280,
    compactStart: 80,
    compactFull: 200,
  },
  variant: {
    thumbFade: 50,
    bodyFadeOut: 70,
    bodyFadeIn: 80,
  },
  press: {
    cardOpacity: 0.7,
    cardDuration: 80,
  },
} as const;

// Phone canvas — used by the web demo's PhoneFrame.
export const layout = {
  phoneWidth: 390,
  phoneHeight: 844,
  safeTop: 54,
  safeBottom: 34,
} as const;

export const tokens = { colors, fontFamily, type, space, radii, motion, layout } as const;
export type Tokens = typeof tokens;
