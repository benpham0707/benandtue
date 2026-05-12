// Bopomofo data shape — straight from BOPOMOFO_MENU_SPEC.md §6.

export type TagStyle = "neutral" | "positive" | "allergen";

export type Tag = {
  label: string;
  style: TagStyle;
};

export type Badge =
  | { kind: "calories"; value: number }
  | { kind: "lactose-free" };

export type Variant = {
  id: string; // matches another Drink id
  thumbnail: string;
};

export type CupSpec = {
  label: string; // e.g. "500mL Standard"
  sizeMl: number;
  illustration: string; // line-art cup
  isDefault?: boolean;
};

export type Customization = {
  label: string;
  defaultValue: string;
  options: string[];
};

export type CrossSectionCallout = {
  label: string;
  eyebrow?: string; // "No Artificial Flavor", etc.
  yPercent: number; // 0..100 — where the leader line meets the layer
};

// A single liquid slice for the layered cross-section. Ordered top → bottom.
// `src` is a /public-served PNG with magenta keyed out. `heightPct` is the
// share of the assembled-cup column this layer occupies (sum should ≈ 100).
export type CrossSectionLayer = {
  id: string;
  src: string;
  label: string;
  eyebrow?: string;
  heightPct: number;
};

export type ExploreSection = {
  name: string;
  description: string;
  allergyReminder?: string;
  photoUri: string; // photo half (left of vertical split)
  illustrationUri: string; // illustration half (right of vertical split)
  callouts: CrossSectionCallout[];
  // Optional layered cross-section. When present, DrinkDetail renders the
  // LayeredCrossSection instead of the single-image CrossSection.
  layers?: CrossSectionLayer[];
};

export type Nutrition = {
  energy: number | null;
  protein: number | null;
  carbs: number | null;
  fat: number | null;
  teaPolyphenols: number | null;
  caffeineMgPerCup: number;
  caffeineLevel: "green" | "yellow" | "red";
};

// Real Bopomofo Cafe menu sections (bopomofocafe.com/menu).
export type Category =
  | "classic-teas"
  | "premium-signatures"
  | "premium-matcha"
  | "premium-espresso";

export type DrinkStub = {
  id: string;
  name: string;
  price: number;
  image: string;
  badge?: Badge;
  category: Category;
};

export type Drink = DrinkStub & {
  tags: Tag[];
  hasRecipeLink: boolean;
  description: string;
  variants?: Variant[];
  cupSpecs?: CupSpec[];
  customizations: Customization[];
  hasMoreOptions: boolean;
  explore: ExploreSection;
  nutrition: Nutrition;
};

export type Section = {
  id: Category;
  label: string;
  drinks: DrinkStub[];
};
