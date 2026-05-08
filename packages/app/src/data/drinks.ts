// Mock drink data. Strings (titles, tags, descriptions, customization labels,
// defaults, nutrition values, disclaimers) are verbatim from FRAME_BY_FRAME_SPEC.md
// and BOPOMOFO_MENU_SPEC.md so the visuals match the recording.
//
// `image` is a recipe key — the CupIllustration component looks up colour layers
// by id. No PNG assets are shipped with this demo build; the design team needs
// to swap in transparent cup PNGs per drink (see asset checklist in the prompt).

import type {
  Category,
  CrossSectionCallout,
  Customization,
  Drink,
  DrinkStub,
  Section,
  Variant,
} from "../types";

// -----------------------------------------------------------------------------
// Categories (sidebar order — Frame 01).
// -----------------------------------------------------------------------------
export const sections: { id: Category; label: string }[] = [
  { id: "in-season", label: "In Season" },
  { id: "staff-picks", label: "Staff Picks" },
  { id: "matcha", label: "Matcha" },
  { id: "superfood-fruit", label: "Superfood Tea/Fruit Tea" },
  { id: "teamix-tea", label: "Teamix / Tea" },
  { id: "bobo-milk-tea", label: "Bobo Milk Tea" },
  { id: "extra", label: "Extra" },
];

// -----------------------------------------------------------------------------
// Stub data (menu-only drinks). The 5 with full detail-screen data are merged
// in via the `detailedDrinks` map below.
// -----------------------------------------------------------------------------
const stubs: DrinkStub[] = [
  // In Season — Frame 12
  { id: "golden-oolong-yuzu", name: "Golden Oolong Yuzu", price: 7.49, image: "golden-oolong-yuzu", badge: { kind: "calories", value: 90 }, category: "in-season" },
  { id: "pistachio-cloud-jasmine-coconut", name: "Pistachio Cloud Jasmine Coconut", price: 7.99, image: "pistachio-cloud-jasmine-coconut", category: "in-season" },
  { id: "king-jasmine-guava", name: "King Jasmine Guava", price: 7.99, image: "king-jasmine-guava", badge: { kind: "calories", value: 150 }, category: "in-season" },

  // Staff Picks — Frame 13
  { id: "yingde-cheese-milk-tea", name: "Yingde Cheese Milk Tea", price: 7.49, image: "yingde-cheese-milk-tea", category: "staff-picks" },
  { id: "mochi-yingde-black-milk-tea", name: "Mochi Yingde Black Milk Tea", price: 7.49, image: "mochi-yingde-black-milk-tea", category: "staff-picks" },
  { id: "kale-boost-tea", name: "Kale Boost Tea", price: 7.99, image: "kale-boost-tea", badge: { kind: "calories", value: 150 }, category: "staff-picks" },
  { id: "coconut-mango-boom", name: "Coconut Mango Boom", price: 6.99, image: "coconut-mango-boom", badge: { kind: "lactose-free" }, category: "staff-picks" },
  { id: "triple-supreme-matcha-latte", name: "Triple Supreme Matcha Latte", price: 7.99, image: "triple-supreme-matcha-latte", category: "staff-picks" },
  { id: "jasmine-milk-tea", name: "Jasmine Milk Tea", price: 6.49, image: "jasmine-milk-tea", badge: { kind: "calories", value: 110 }, category: "staff-picks" },

  // Matcha
  { id: "triple-supreme-matcha-latte-2", name: "Triple Supreme Matcha Latte", price: 7.99, image: "triple-supreme-matcha-latte", category: "matcha" },
  { id: "cloud-matcha-latte", name: "Cloud Matcha Latte", price: 7.99, image: "cloud-matcha-latte", category: "matcha" },

  // Superfood Tea/Fruit Tea — Frame 01
  { id: "kale-boost-tea-2", name: "Kale Boost Tea", price: 7.99, image: "kale-boost-tea", badge: { kind: "calories", value: 150 }, category: "superfood-fruit" },
  { id: "coconut-mango-blue", name: "Coconut Mango Blue", price: 6.99, image: "coconut-mango-blue", category: "superfood-fruit" },
  { id: "mango-grapefruit-boom", name: "Mango Grapefruit Boom", price: 7.99, image: "mango-grapefruit-boom", badge: { kind: "lactose-free" }, category: "superfood-fruit" },
  { id: "coconut-mango-boom-2", name: "Coconut Mango Boom", price: 6.99, image: "coconut-mango-boom", badge: { kind: "lactose-free" }, category: "superfood-fruit" },
  { id: "cloud-crisp-grape", name: "Cloud Crisp Grape", price: 7.99, image: "cloud-crisp-grape", category: "superfood-fruit" },
  { id: "crisp-grape-boom", name: "Crisp Grape Boom", price: 7.49, image: "crisp-grape-boom", badge: { kind: "calories", value: 120 }, category: "superfood-fruit" },

  // Teamix / Tea
  { id: "golden-oolong-yuzu-2", name: "Golden Oolong Yuzu", price: 7.49, image: "golden-oolong-yuzu", badge: { kind: "calories", value: 90 }, category: "teamix-tea" },

  // Bobo Milk Tea
  { id: "yingde-cheese-milk-tea-2", name: "Yingde Cheese Milk Tea", price: 7.49, image: "yingde-cheese-milk-tea", category: "bobo-milk-tea" },
  { id: "jasmine-milk-tea-2", name: "Jasmine Milk Tea", price: 6.49, image: "jasmine-milk-tea", badge: { kind: "calories", value: 110 }, category: "bobo-milk-tea" },

  // Extra
  { id: "kale-boost-tea-3", name: "Kale Boost Tea", price: 7.99, image: "kale-boost-tea", badge: { kind: "calories", value: 150 }, category: "extra" },
];

// -----------------------------------------------------------------------------
// Customization presets (small grammar of reusable rows).
// -----------------------------------------------------------------------------
const sweetener: Customization = {
  label: "Sugar-Free Sweetener",
  defaultValue: "Optional",
  options: ["Optional", "Add Sugar-Free Sweetener"],
};
const ice: Customization = {
  label: "Ice",
  defaultValue: "Default",
  options: ["No Ice", "Less Ice", "Default", "Extra Ice"],
};
const sugar: Customization = {
  label: "Sugar",
  defaultValue: "Less Sugar (Default)",
  options: ["No Sugar", "30% Sugar", "Less Sugar (Default)", "Standard"],
};
const teaPreference: Customization = {
  label: "Tea Preference",
  defaultValue: "Jasmine Green Tea (Recommend)",
  options: ["Jasmine Green Tea (Recommend)", "Oolong Tea", "Black Tea"],
};
const coconutMilkJelly: Customization = {
  label: "Coconut Milk Jelly",
  defaultValue: "Default (With Coconut Milk Jelly)",
  options: ["Default (With Coconut Milk Jelly)", "No Coconut Milk Jelly"],
};
const sago: Customization = {
  label: "Sago",
  defaultValue: "Default (With Sago)",
  options: ["Default (With Sago)", "No Sago"],
};
const choiceOfSlushie: Customization = {
  label: "Choice Of",
  defaultValue: "Slushie",
  options: ["Slushie", "Iced"],
};
const cloudServing: Customization = {
  label: "Cloud Serving",
  defaultValue: "In Drink",
  options: ["In Drink", "On Top"],
};

// -----------------------------------------------------------------------------
// Variant constellations.
// -----------------------------------------------------------------------------
const blueOrangeYellowVariants: Variant[] = [
  { id: "coconut-mango-blue", thumbnail: "coconut-mango-blue" },
  { id: "mango-grapefruit-boom", thumbnail: "mango-grapefruit-boom" },
  { id: "coconut-mango-boom", thumbnail: "coconut-mango-boom" },
];

// -----------------------------------------------------------------------------
// Detailed drinks (full detail-screen content).
// -----------------------------------------------------------------------------
const detailed: Record<string, Drink> = {
  // Frame 06, 09 — full data with variants. Caffeine ≈25mg, polyphenols 167
  "coconut-mango-blue": {
    id: "coconut-mango-blue",
    name: "Coconut Mango Blue",
    price: 6.99,
    image: "coconut-mango-blue",
    category: "superfood-fruit",
    tags: [
      { label: "Caffeine Green Light", style: "neutral" },
      { label: "Milk, Tea", style: "neutral" },
    ],
    hasRecipeLink: true,
    description:
      "Summer favorite returns. Blue spirulina, used as a natural colorant, brings its vibrant hue to Coconut Mango Boom. Fresh mango, cut daily, blends with smooth coconut milk, topped with sago simmered for 30 minutes and coconut milk jelly.",
    variants: blueOrangeYellowVariants,
    customizations: [sweetener, ice, sugar, teaPreference, coconutMilkJelly, sago],
    hasMoreOptions: true,
    explore: {
      name: "Coconut Mango Blue",
      description:
        "Summer favorite returns. Blue spirulina, used as a natural colorant, brings its vibrant hue to Coconut Mango Boom. Fresh mango, cut daily, blends with smooth coconut milk, topped with sago simmered for 30 minutes and coconut milk jelly.",
      allergyReminder: "Milk",
      photoUri: "coconut-mango-blue/photo",
      illustrationUri: "coconut-mango-blue/illustration",
      callouts: blueCallouts(),
    },
    nutrition: { energy: 350, protein: 1, carbs: 50, fat: 15, teaPolyphenols: 167, caffeineMgPerCup: 25, caffeineLevel: "green" },
  },

  // Frame 14 — has cup-spec (500/650), variant ring middle.
  "mango-grapefruit-boom": {
    id: "mango-grapefruit-boom",
    name: "Mango Grapefruit Boom",
    price: 7.99,
    image: "mango-grapefruit-boom",
    badge: { kind: "lactose-free" },
    category: "superfood-fruit",
    tags: [
      { label: "Caffeine Green Light", style: "neutral" },
      { label: "Milk, Tea", style: "neutral" },
    ],
    hasRecipeLink: true,
    description:
      "Freshly cut seasonal mangoes paired with handcrafted, freshly cooked Sago. The coconut milk blends smoothly with the mango jasmine tea slushie.Caffeine:Green Light.",
    variants: blueOrangeYellowVariants,
    cupSpecs: [
      { label: "500mL Standard", sizeMl: 500, illustration: "cup-500", isDefault: true },
      { label: "650mL Upgrade", sizeMl: 650, illustration: "cup-650" },
    ],
    customizations: [sweetener, choiceOfSlushie, ice, sugar, teaPreference, coconutMilkJelly, sago],
    hasMoreOptions: true,
    explore: {
      name: "Mango Grapefruit Boom",
      description:
        "Freshly cut seasonal mangoes paired with handcrafted, freshly cooked Sago. The coconut milk blends smoothly with the mango jasmine tea slushie.",
      allergyReminder: "Milk",
      photoUri: "mango-grapefruit-boom/photo",
      illustrationUri: "mango-grapefruit-boom/illustration",
      callouts: boomCallouts(),
    },
    nutrition: { energy: 350, protein: 1, carbs: 50, fat: 15, teaPolyphenols: 134, caffeineMgPerCup: 28, caffeineLevel: "green" },
  },

  // Frame 14 — Coconut Mango Boom with cup spec
  "coconut-mango-boom": {
    id: "coconut-mango-boom",
    name: "Coconut Mango Boom",
    price: 6.99,
    image: "coconut-mango-boom",
    badge: { kind: "lactose-free" },
    category: "staff-picks",
    tags: [
      { label: "Caffeine Green Light", style: "neutral" },
      { label: "Milk, Tea", style: "neutral" },
    ],
    hasRecipeLink: true,
    description:
      "Freshly cut mango blended with coconut milk, complemented by freshly cooked handcrafted sago and coconut milk jelly.Caffeine:Green Light.",
    variants: blueOrangeYellowVariants,
    cupSpecs: [
      { label: "500mL Standard", sizeMl: 500, illustration: "cup-500", isDefault: true },
      { label: "650mL Upgrade", sizeMl: 650, illustration: "cup-650" },
    ],
    customizations: [sweetener, choiceOfSlushie, ice, sugar, teaPreference, coconutMilkJelly, sago],
    hasMoreOptions: true,
    explore: {
      name: "Coconut Mango Boom",
      description:
        "Freshly cut mango blended with coconut milk, complemented by freshly cooked handcrafted sago and coconut milk jelly.",
      allergyReminder: "Milk",
      photoUri: "coconut-mango-boom/photo",
      illustrationUri: "coconut-mango-boom/illustration",
      callouts: boomCallouts(),
    },
    nutrition: { energy: 350, protein: 1, carbs: 50, fat: 15, teaPolyphenols: 134, caffeineMgPerCup: 28, caffeineLevel: "green" },
  },

  // Frame 15 — no variants, no cup spec, Milk-Free positive tag.
  "golden-oolong-yuzu": {
    id: "golden-oolong-yuzu",
    name: "Golden Oolong Yuzu",
    price: 7.49,
    image: "golden-oolong-yuzu",
    badge: { kind: "calories", value: 90 },
    category: "in-season",
    tags: [
      { label: "Caffeine Green Light", style: "neutral" },
      { label: "Milk-Free", style: "positive" },
      { label: "Tea", style: "neutral" },
    ],
    hasRecipeLink: true,
    description:
      "A refreshing teamix. Golden oolong tea brings delicate orchid notes, balanced by the bright sweetness of yuzu. A touch of dried lemon adds a fragrant finish. Caffeine: Green Light.",
    customizations: [sweetener, ice, sugar],
    hasMoreOptions: true,
    explore: {
      name: "Golden Oolong Yuzu",
      description:
        "Golden oolong tea brings delicate orchid notes, balanced by the bright sweetness of yuzu. A touch of dried lemon adds a fragrant finish.",
      photoUri: "golden-oolong-yuzu/photo",
      illustrationUri: "golden-oolong-yuzu/illustration",
      callouts: [
        { label: "Yuzu", eyebrow: "No Artificial Flavor", yPercent: 22 },
        { label: "Golden Oolong Tea", eyebrow: "No Artificial Flavor", yPercent: 50 },
        { label: "Dried Lemon", yPercent: 78 },
      ],
    },
    nutrition: { energy: null, protein: null, carbs: null, fat: null, teaPolyphenols: 465, caffeineMgPerCup: 43, caffeineLevel: "green" },
  },

  // Frame 16 — 2-line title, 3 tags incl. allergen.
  "pistachio-cloud-jasmine-coconut": {
    id: "pistachio-cloud-jasmine-coconut",
    name: "Pistachio Cloud Jasmine Coconut",
    price: 7.99,
    image: "pistachio-cloud-jasmine-coconut",
    category: "in-season",
    tags: [
      { label: "Caffeine Green Light", style: "neutral" },
      { label: "Milk, Tea", style: "neutral" },
      { label: "pistachio", style: "allergen" },
    ],
    hasRecipeLink: true,
    description:
      "100% natural coconut water, 5°F cold chain, paired with green jasmine tea for a natural floral blend, topped with homemade pistachio cloud. Caffeine: Green Light..",
    customizations: [sweetener, ice, sugar, cloudServing],
    hasMoreOptions: true,
    explore: {
      name: "Pistachio Cloud Jasmine Coconut",
      description:
        "100% natural coconut water, 5°F cold chain, paired with green jasmine tea for a natural floral blend, topped with homemade pistachio cloud.",
      allergyReminder: "Pistachio",
      photoUri: "pistachio-cloud-jasmine-coconut/photo",
      illustrationUri: "pistachio-cloud-jasmine-coconut/illustration",
      callouts: [
        { label: "Pistachio Cloud", eyebrow: "No Artificial Creamer", yPercent: 18 },
        { label: "Jasmine Green Tea", eyebrow: "No Artificial Flavor", yPercent: 46 },
        { label: "Coconut Water", eyebrow: "No Artificial Flavor", yPercent: 70 },
        { label: "Real Cane Sugar", yPercent: 90 },
      ],
    },
    nutrition: { energy: 230, protein: 3, carbs: 16, fat: 15, teaPolyphenols: 384, caffeineMgPerCup: 58, caffeineLevel: "green" },
  },
};

function blueCallouts(): CrossSectionCallout[] {
  return [
    { label: "Mango Puree", yPercent: 8 },
    { label: "Jasmine Green Tea (Slushie)", eyebrow: "No Artificial Flavor", yPercent: 22 },
    { label: "Coconut Milk", eyebrow: "No Artificial Flavor", yPercent: 36 },
    { label: "100% Mango Juice", eyebrow: "No Artificial Flavor", yPercent: 50 },
    { label: "Blue Spirulina Liquid", yPercent: 64 },
    { label: "Sago", yPercent: 76 },
    { label: "Coconut Milk Jelly", yPercent: 86 },
    { label: "Real Cane Sugar", yPercent: 96 },
  ];
}
function boomCallouts(): CrossSectionCallout[] {
  return [
    { label: "Mango Puree", yPercent: 10 },
    { label: "Jasmine Green Tea (Slushie)", eyebrow: "No Artificial Flavor", yPercent: 26 },
    { label: "100% Mango Juice", eyebrow: "No Artificial Flavor", yPercent: 42 },
    { label: "Coconut Milk", eyebrow: "No Artificial Flavor", yPercent: 58 },
    { label: "Coconut Milk Jelly", yPercent: 74 },
    { label: "Sago", yPercent: 86 },
    { label: "Real Cane Sugar", yPercent: 96 },
  ];
}

// -----------------------------------------------------------------------------
// Lookups
// -----------------------------------------------------------------------------
const allDrinks: Map<string, Drink | DrinkStub> = new Map();
for (const s of stubs) {
  // Promote to detailed when there's a match (tying menu cells to detail data)
  const detailedById = detailed[s.id] ?? detailed[s.id.replace(/-2$|-3$/, "")];
  allDrinks.set(s.id, detailedById ? { ...detailedById, id: s.id, category: s.category } : s);
}
for (const [id, d] of Object.entries(detailed)) {
  if (!allDrinks.has(id)) allDrinks.set(id, d);
}

export function getDrinkById(id: string): Drink | DrinkStub | undefined {
  return allDrinks.get(id);
}
export function getDetailDrink(id: string): Drink | undefined {
  const base = id.replace(/-2$|-3$/, "");
  return detailed[base];
}
export function isDetailedId(id: string): boolean {
  return Boolean(getDetailDrink(id));
}

export const menuSections: Section[] = sections.map((s) => ({
  id: s.id,
  label: s.label,
  drinks: stubs.filter((d) => d.category === s.id),
}));

// Convenience export for the disclaimer block (BOPOMOFO_MENU_SPEC.md §4.14 verbatim).
export const disclaimers: string[] = [
  "*Caffeine is an approximate value.",
  "*Caffeine tolerance varies by individual. Please choose based on your own condition.",
  "*As various beverages are prepared in our store, trace amounts of other allergens may be present. While we make every effort to prevent cross-contamination, it cannot be entirely avoided. If you have allergies, please make your choices carefully. For any questions, please consult our staff.",
  "*The above data is based on the ice amount and sugar level as shown above. For reference purposes only.",
  "*Actual beverages purchased in store may vary in nutritional information due to customized choices, store preparation, ingredient batches, origin, and supply season;",
  "*We will periodically update drink recipes, which may also affect the above nutritional information.",
  "*2,000 calories a day is used for general nutrition advice, but calorie needs vary.",
  "*Additional nutritional information available upon request.",
];
