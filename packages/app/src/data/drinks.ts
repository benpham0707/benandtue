// Bopomofo Cafe menu data — drawn from the live menu at bopomofocafe.com/menu.
// Drinks with real PNG photography live in apps/web/public/bopomofo/; the rest
// fall through to the procedural CupIllustration via the RealCup wrapper.

import type {
  Category,
  CrossSectionCallout,
  Customization,
  Drink,
  DrinkStub,
  Section,
} from "../types";

// -----------------------------------------------------------------------------
// Sidebar sections — exact menu copy.
// -----------------------------------------------------------------------------
export const sections: { id: Category; label: string }[] = [
  { id: "classic-teas", label: "Classic Teas" },
  { id: "premium-signatures", label: "Premium Signatures" },
  { id: "premium-matcha", label: "Premium Matcha" },
  { id: "premium-espresso", label: "Premium Espresso" },
];

// -----------------------------------------------------------------------------
// Customization presets.
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
const milkChoice: Customization = {
  label: "Milk",
  defaultValue: "Whole Milk (Default)",
  options: ["Whole Milk (Default)", "Oat Milk", "Almond Milk"],
};
const teaStrength: Customization = {
  label: "Tea Strength",
  defaultValue: "Standard",
  options: ["Light", "Standard", "Extra"],
};
const pudding: Customization = {
  label: "Pudding",
  defaultValue: "Default (With Pudding)",
  options: ["Default (With Pudding)", "No Pudding"],
};
const foamCap: Customization = {
  label: "Cream Foam",
  defaultValue: "Default",
  options: ["Default", "Light", "Extra"],
};

// -----------------------------------------------------------------------------
// Detail copy + nutrition for the 9 drinks with real photography.
// (Caffeine values are reasonable estimates; replace with real lab data when
// the team delivers it.)
// -----------------------------------------------------------------------------
const detailed: Record<string, Drink> = {
  "jasmine-tea": {
    id: "jasmine-tea",
    name: "Jasmine Tea",
    price: 5.25,
    image: "jasmine-tea",
    category: "classic-teas",
    tags: [
      { label: "Caffeine Yellow Light", style: "neutral" },
      { label: "Milk-Free", style: "positive" },
      { label: "Tea", style: "neutral" },
    ],
    hasRecipeLink: true,
    description:
      "Hand-picked jasmine green tea, brewed slowly to a clean, fragrant infusion. A delicate floral aroma with a smooth, refreshing finish. Caffeine: Yellow Light.",
    customizations: [sweetener, ice, sugar, teaStrength],
    hasMoreOptions: true,
    explore: {
      name: "Jasmine Tea",
      description:
        "Hand-picked jasmine green tea, brewed slowly to a clean, fragrant infusion with a delicate floral aroma.",
      photoUri: "jasmine-tea/photo",
      illustrationUri: "jasmine-tea/illustration",
      callouts: [
        { label: "Jasmine Green Tea", eyebrow: "No Artificial Flavor", yPercent: 30 },
        { label: "Cane Sugar", yPercent: 70 },
      ],
    },
    nutrition: { energy: 70, protein: 0, carbs: 17, fat: 0, teaPolyphenols: 312, caffeineMgPerCup: 38, caffeineLevel: "yellow" },
  },

  "jasmine-milk-tea": {
    id: "jasmine-milk-tea",
    name: "Jasmine Milk Tea",
    price: 5.75,
    image: "jasmine-milk-tea",
    category: "classic-teas",
    tags: [
      { label: "Caffeine Yellow Light", style: "neutral" },
      { label: "Milk, Tea", style: "neutral" },
    ],
    hasRecipeLink: true,
    description:
      "Hand-picked jasmine green tea blended with cold whole milk, finished with a soft milk cap. Floral notes meet clean dairy. Caffeine: Yellow Light.",
    customizations: [sweetener, ice, sugar, milkChoice, foamCap],
    hasMoreOptions: true,
    explore: {
      name: "Jasmine Milk Tea",
      description:
        "Hand-picked jasmine green tea blended with cold whole milk and topped with a soft milk cap.",
      allergyReminder: "Milk",
      photoUri: "jasmine-milk-tea/photo",
      illustrationUri: "jasmine-milk-tea/illustration",
      callouts: [
        { label: "Milk Cap", eyebrow: "No Artificial Creamer", yPercent: 18 },
        { label: "Whole Milk", yPercent: 42 },
        { label: "Jasmine Green Tea", eyebrow: "No Artificial Flavor", yPercent: 70 },
      ],
    },
    nutrition: { energy: 220, protein: 5, carbs: 31, fat: 8, teaPolyphenols: 287, caffeineMgPerCup: 36, caffeineLevel: "yellow" },
  },

  "assam-tea": {
    id: "assam-tea",
    name: "Assam Tea",
    price: 5.25,
    image: "assam-tea",
    category: "classic-teas",
    tags: [
      { label: "Caffeine Yellow Light", style: "neutral" },
      { label: "Milk-Free", style: "positive" },
      { label: "Tea", style: "neutral" },
    ],
    hasRecipeLink: true,
    description:
      "Robust Assam black tea brewed strong, with bold malty notes and a clean finish. Caffeine: Yellow Light.",
    customizations: [sweetener, ice, sugar, teaStrength],
    hasMoreOptions: true,
    explore: {
      name: "Assam Tea",
      description:
        "Robust Assam black tea brewed strong, with bold malty notes and a clean finish.",
      photoUri: "assam-tea/photo",
      illustrationUri: "assam-tea/illustration",
      callouts: [
        { label: "Assam Black Tea", eyebrow: "No Artificial Flavor", yPercent: 35 },
        { label: "Cane Sugar", yPercent: 75 },
      ],
    },
    nutrition: { energy: 80, protein: 0, carbs: 19, fat: 0, teaPolyphenols: 348, caffeineMgPerCup: 52, caffeineLevel: "yellow" },
  },

  "assam-milk-tea": {
    id: "assam-milk-tea",
    name: "Assam Milk Tea",
    price: 5.75,
    image: "assam-milk-tea",
    category: "classic-teas",
    tags: [
      { label: "Caffeine Yellow Light", style: "neutral" },
      { label: "Milk, Tea", style: "neutral" },
    ],
    hasRecipeLink: true,
    description:
      "Robust Assam black tea blended with whole milk for a classic, full-bodied milk tea. Caffeine: Yellow Light.",
    customizations: [sweetener, ice, sugar, milkChoice],
    hasMoreOptions: true,
    explore: {
      name: "Assam Milk Tea",
      description:
        "Robust Assam black tea blended with whole milk for a classic, full-bodied milk tea.",
      allergyReminder: "Milk",
      photoUri: "assam-milk-tea/photo",
      illustrationUri: "assam-milk-tea/illustration",
      callouts: [
        { label: "Whole Milk", yPercent: 22 },
        { label: "Assam Black Tea", eyebrow: "No Artificial Flavor", yPercent: 60 },
      ],
    },
    nutrition: { energy: 240, protein: 5, carbs: 33, fat: 9, teaPolyphenols: 322, caffeineMgPerCup: 50, caffeineLevel: "yellow" },
  },

  "honey-roasted-oolong-tea": {
    id: "honey-roasted-oolong-tea",
    name: "Honey Roasted Oolong Tea",
    price: 5.5,
    image: "honey-roasted-oolong-tea",
    category: "classic-teas",
    tags: [
      { label: "Caffeine Yellow Light", style: "neutral" },
      { label: "Milk-Free", style: "positive" },
      { label: "Tea", style: "neutral" },
    ],
    hasRecipeLink: true,
    description:
      "Roasted oolong tea leaves brewed at 95°C, delivering deep caramel notes and a smooth, toasty finish. Caffeine: Yellow Light.",
    customizations: [sweetener, ice, sugar, teaStrength],
    hasMoreOptions: true,
    explore: {
      name: "Honey Roasted Oolong Tea",
      description:
        "Roasted oolong tea leaves brewed at 95°C, delivering deep caramel notes and a smooth, toasty finish.",
      photoUri: "honey-roasted-oolong-tea/photo",
      illustrationUri: "honey-roasted-oolong-tea/illustration",
      callouts: [
        { label: "Roasted Oolong Tea", eyebrow: "No Artificial Flavor", yPercent: 32 },
        { label: "Cane Sugar", yPercent: 76 },
      ],
    },
    nutrition: { energy: 75, protein: 0, carbs: 18, fat: 0, teaPolyphenols: 402, caffeineMgPerCup: 44, caffeineLevel: "yellow" },
  },

  "brown-sugar-pudding-milk-tea": {
    id: "brown-sugar-pudding-milk-tea",
    name: "Brown Sugar Pudding Milk Tea",
    price: 6.95,
    image: "brown-sugar-pudding-milk-tea",
    category: "premium-signatures",
    tags: [
      { label: "Caffeine Green Light", style: "neutral" },
      { label: "Milk, Tea", style: "neutral" },
      { label: "egg", style: "allergen" },
    ],
    hasRecipeLink: true,
    description:
      "Slow-cooked brown sugar syrup hand-poured into the cup, layered with cold whole milk and finished with house-made pudding. Caffeine: Green Light.",
    customizations: [sweetener, ice, sugar, milkChoice, pudding],
    hasMoreOptions: true,
    explore: {
      name: "Brown Sugar Pudding Milk Tea",
      description:
        "Slow-cooked brown sugar syrup hand-poured into the cup, layered with cold whole milk and finished with house-made pudding.",
      allergyReminder: "Milk, Egg",
      photoUri: "brown-sugar-pudding-milk-tea/photo",
      illustrationUri: "brown-sugar-pudding-milk-tea/illustration",
      callouts: [
        { label: "Whole Milk", yPercent: 14 },
        { label: "House-Made Pudding", eyebrow: "Egg", yPercent: 36 },
        { label: "Brown Sugar Syrup", eyebrow: "Slow-cooked", yPercent: 62 },
        { label: "Black Tea Concentrate", yPercent: 86 },
      ],
    },
    nutrition: { energy: 380, protein: 6, carbs: 58, fat: 12, teaPolyphenols: 240, caffeineMgPerCup: 32, caffeineLevel: "green" },
  },

  "strawberry-basil-ginger-lemonade": {
    id: "strawberry-basil-ginger-lemonade",
    name: "Strawberry Basil Ginger Lemonade",
    price: 6.95,
    image: "strawberry-basil-ginger-lemonade",
    category: "premium-signatures",
    tags: [
      { label: "Caffeine Free", style: "positive" },
      { label: "Milk-Free", style: "positive" },
    ],
    hasRecipeLink: true,
    description:
      "Fresh strawberries muddled with basil leaves and a touch of ginger, balanced by hand-squeezed lemonade. Caffeine: Free.",
    customizations: [sweetener, ice, sugar],
    hasMoreOptions: true,
    explore: {
      name: "Strawberry Basil Ginger Lemonade",
      description:
        "Fresh strawberries muddled with basil leaves and a touch of ginger, balanced by hand-squeezed lemonade.",
      photoUri: "strawberry-basil-ginger-lemonade/photo",
      illustrationUri: "strawberry-basil-ginger-lemonade/illustration",
      callouts: [
        { label: "Fresh Strawberry", eyebrow: "Hand-muddled", yPercent: 18 },
        { label: "Basil Leaf", yPercent: 38 },
        { label: "Ginger Syrup", yPercent: 58 },
        { label: "Hand-Squeezed Lemonade", yPercent: 80 },
      ],
    },
    nutrition: { energy: 180, protein: 0, carbs: 44, fat: 0, teaPolyphenols: null, caffeineMgPerCup: 0, caffeineLevel: "green" },
  },

  "strawberry-corn-milk": {
    id: "strawberry-corn-milk",
    name: "Strawberry Corn Milk",
    price: 6.95,
    image: "strawberry-corn-milk",
    category: "premium-signatures",
    tags: [
      { label: "Caffeine Free", style: "positive" },
      { label: "Milk", style: "neutral" },
    ],
    hasRecipeLink: true,
    description:
      "Sweet corn milk freshly blended with whole milk, topped with a fresh strawberry and a sweet-corn cap. Caffeine: Free.",
    customizations: [sweetener, ice, sugar, milkChoice],
    hasMoreOptions: true,
    explore: {
      name: "Strawberry Corn Milk",
      description:
        "Sweet corn milk freshly blended with whole milk, topped with a fresh strawberry and a sweet-corn cap.",
      allergyReminder: "Milk",
      photoUri: "strawberry-corn-milk/photo",
      illustrationUri: "strawberry-corn-milk/illustration",
      callouts: [
        { label: "Fresh Strawberry", yPercent: 10 },
        { label: "Sweet Corn Cap", eyebrow: "House-made", yPercent: 28 },
        { label: "Whole Milk", yPercent: 56 },
        { label: "Sweet Corn Milk", eyebrow: "Freshly blended", yPercent: 84 },
      ],
    },
    nutrition: { energy: 280, protein: 6, carbs: 42, fat: 9, teaPolyphenols: null, caffeineMgPerCup: 0, caffeineLevel: "green" },
  },

  "matcha-guava-latte": {
    id: "matcha-guava-latte",
    name: "BA - LA Matcha",
    price: 6.95,
    image: "matcha-guava-latte",
    category: "premium-matcha",
    tags: [
      { label: "Caffeine Yellow Light", style: "neutral" },
      { label: "Milk, Tea", style: "neutral" },
    ],
    hasRecipeLink: true,
    description:
      "Ceremonial-grade matcha shaken over fresh guava purée, lifted with steamed whole milk and a fine layer of foam. Caffeine: Yellow Light.",
    customizations: [sweetener, ice, sugar, milkChoice, foamCap],
    hasMoreOptions: true,
    explore: {
      name: "BA - LA Matcha",
      description:
        "Three layers, three sources: cold-pressed guava on the bottom, steamed whole milk in the middle, and ceremonial matcha shaken with ice on top.",
      allergyReminder: "Milk",
      photoUri: "matcha-guava-latte/photo",
      illustrationUri: "matcha-guava-latte/illustration",
      callouts: [],
      // Ordered top → bottom. Sum of heightPct should ≈ 100.
      layers: [
        {
          id: "matcha",
          src: "/bopomofo/recipe-slices/matcha.png",
          label: "Ceremonial Matcha",
          eyebrow: "Uji, Japan · stone-milled",
          heightPct: 38,
        },
        {
          id: "milk",
          src: "/bopomofo/recipe-slices/milk.png",
          label: "Steamed Whole Milk",
          eyebrow: "Local dairy",
          heightPct: 24,
        },
        {
          id: "guava",
          src: "/bopomofo/recipe-slices/guava.png",
          label: "Fresh Guava Purée",
          eyebrow: "Cold-pressed, no sweetener",
          heightPct: 38,
        },
      ],
    },
    nutrition: { energy: 240, protein: 6, carbs: 32, fat: 8, teaPolyphenols: 310, caffeineMgPerCup: 42, caffeineLevel: "yellow" },
  },

  "hey-sesame-milk": {
    id: "hey-sesame-milk",
    name: "Hey Sesame Milk",
    price: 6.95,
    image: "hey-sesame-milk",
    category: "premium-signatures",
    tags: [
      { label: "Caffeine Free", style: "positive" },
      { label: "Milk", style: "neutral" },
      { label: "sesame", style: "allergen" },
    ],
    hasRecipeLink: true,
    description:
      "Stone-ground black sesame paste blended with whole milk for a rich, nutty drink, finished with a soft sesame foam. Caffeine: Free.",
    customizations: [sweetener, ice, sugar, milkChoice, foamCap],
    hasMoreOptions: true,
    explore: {
      name: "Hey Sesame Milk",
      description:
        "Stone-ground black sesame paste blended with whole milk for a rich, nutty drink, finished with a soft sesame foam.",
      allergyReminder: "Milk, Sesame",
      photoUri: "hey-sesame-milk/photo",
      illustrationUri: "hey-sesame-milk/illustration",
      callouts: [
        { label: "Sesame Foam", eyebrow: "Stone-ground", yPercent: 18 },
        { label: "Whole Milk", yPercent: 42 },
        { label: "Black Sesame Paste", eyebrow: "House-made", yPercent: 72 },
      ],
    },
    nutrition: { energy: 360, protein: 8, carbs: 38, fat: 18, teaPolyphenols: null, caffeineMgPerCup: 0, caffeineLevel: "green" },
  },
};

// -----------------------------------------------------------------------------
// Stubs — every drink that appears in the menu, in section order.
// Drinks that also have a `detailed` entry above will show full detail data
// when tapped; the rest open a minimal detail view derived from the stub.
// -----------------------------------------------------------------------------
const stubs: DrinkStub[] = [
  // Classic Teas
  { id: "jasmine-tea", name: "Jasmine Tea", price: 5.25, image: "jasmine-tea", category: "classic-teas" },
  { id: "jasmine-milk-tea", name: "Jasmine Milk Tea", price: 5.75, image: "jasmine-milk-tea", category: "classic-teas" },
  { id: "assam-tea", name: "Assam Tea", price: 5.25, image: "assam-tea", category: "classic-teas" },
  { id: "assam-milk-tea", name: "Assam Milk Tea", price: 5.75, image: "assam-milk-tea", category: "classic-teas" },
  { id: "honey-roasted-oolong-tea", name: "Honey Roasted Oolong Tea", price: 5.5, image: "honey-roasted-oolong-tea", category: "classic-teas" },
  { id: "honey-roasted-oolong-milk-tea", name: "Honey Roasted Oolong Milk Tea", price: 6.0, image: "honey-roasted-oolong-milk-tea", category: "classic-teas" },

  // Premium Signatures
  { id: "brown-sugar-pudding-milk-tea", name: "Brown Sugar Pudding Milk Tea", price: 6.95, image: "brown-sugar-pudding-milk-tea", category: "premium-signatures" },
  { id: "strawberry-basil-ginger-lemonade", name: "Strawberry Basil Ginger Lemonade", price: 6.95, image: "strawberry-basil-ginger-lemonade", category: "premium-signatures" },
  { id: "taro-sweet-milk", name: "Taro Sweet Milk", price: 6.95, image: "taro-sweet-milk", category: "premium-signatures" },
  { id: "blueberry-orange-green-tea", name: "Blueberry Orange Green Tea", price: 6.95, image: "blueberry-orange-green-tea", category: "premium-signatures" },
  { id: "hojicorn-latte", name: "Hojicorn Latte", price: 6.95, image: "hojicorn-latte", category: "premium-signatures" },
  { id: "hey-sesame-milk", name: "Hey Sesame Milk", price: 6.95, image: "hey-sesame-milk", category: "premium-signatures" },
  { id: "hojicha-latte", name: "Hojicha Latte", price: 6.95, image: "hojicha-latte", category: "premium-signatures" },
  { id: "strawberry-corn-milk", name: "Strawberry Corn Milk", price: 6.95, image: "strawberry-corn-milk", category: "premium-signatures" },
  { id: "orange-wang", name: "Orange Wang!", price: 6.95, image: "orange-wang", category: "premium-signatures" },

  // Premium Matcha
  { id: "carrot-matcha-latte", name: "Carrot Matcha Latte", price: 6.95, image: "carrot-matcha-latte", category: "premium-matcha" },
  { id: "ba-la-matcha", name: "Ba-La Matcha", price: 6.95, image: "ba-la-matcha", category: "premium-matcha" },
  { id: "matcha-latte", name: "Matcha Latte", price: 6.5, image: "matcha-latte", category: "premium-matcha" },
  { id: "matcha-soda", name: "Matcha Soda", price: 6.5, image: "matcha-soda", category: "premium-matcha" },
  { id: "mint-matcha-latte", name: "Mint Matcha Latte", price: 6.95, image: "mint-matcha-latte", category: "premium-matcha" },
  { id: "matcha-guava-latte", name: "BA - LA Matcha", price: 6.95, image: "matcha-guava-latte", category: "premium-matcha" },

  // Premium Espresso
  { id: "brown-sugar-buzz", name: "Brown Sugar Buzz", price: 6.5, image: "brown-sugar-buzz", category: "premium-espresso" },
  { id: "shaken-espresso", name: "Shaken Espresso", price: 5.5, image: "shaken-espresso", category: "premium-espresso" },
  { id: "coffee-milk-tea", name: "Coffee Milk Tea", price: 6.5, image: "coffee-milk-tea", category: "premium-espresso" },
  { id: "sprola", name: "Sprola", price: 6.0, image: "sprola", category: "premium-espresso" },
];

// -----------------------------------------------------------------------------
// Helpers — build a minimal Drink record from a stub when no detail is on file.
// -----------------------------------------------------------------------------
function fallbackDrink(stub: DrinkStub): Drink {
  return {
    ...stub,
    tags: [],
    hasRecipeLink: false,
    description:
      "Detail copy coming soon. This drink's tasting notes, ingredients, and nutrition will be filled in as the menu data is finalized.",
    customizations: [sweetener, ice, sugar],
    hasMoreOptions: false,
    explore: {
      name: stub.name,
      description: "Detail copy coming soon.",
      photoUri: `${stub.image}/photo`,
      illustrationUri: `${stub.image}/illustration`,
      callouts: [] as CrossSectionCallout[],
    },
    nutrition: { energy: null, protein: null, carbs: null, fat: null, teaPolyphenols: null, caffeineMgPerCup: 0, caffeineLevel: "green" },
  };
}

const allDrinks: Map<string, Drink> = new Map();
for (const s of stubs) {
  const detailedEntry = detailed[s.id];
  allDrinks.set(s.id, detailedEntry ?? fallbackDrink(s));
}

export function getDrinkById(id: string): Drink | undefined {
  return allDrinks.get(id);
}
export function getDetailDrink(id: string): Drink | undefined {
  return allDrinks.get(id);
}
export function isDetailedId(id: string): boolean {
  return id in detailed;
}

export const menuSections: Section[] = sections.map((s) => ({
  id: s.id,
  label: s.label,
  drinks: stubs.filter((d) => d.category === s.id),
}));

// Disclaimer block (verbatim from BOPOMOFO_MENU_SPEC.md §4.14).
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
