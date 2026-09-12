import { INGREDIENTS } from '../data/ingredients';

const SEARCH_TERM: Record<string, string> = {
  'chicken-thighs': 'chicken',
  'chicken-breast': 'chicken',
  'leftover-chicken': 'chicken',
  'leftover-rice': 'rice',
  'leftover-pasta': 'pasta',
  'leftover-roast-veg': 'vegetable',
  'canned-tomatoes': 'tomato',
  'ground-beef': 'beef',
  'bell-pepper': 'pepper',
  'sweet-potato': 'potato',
  'frozen-peas': 'peas',
  'frozen-berries': 'berry',
  mozzarella: 'tomato',
};

const ALIAS_TO_ID: Record<string, string> = {
  'chicken breast': 'chicken-breast',
  'chicken breasts': 'chicken-breast',
  'chicken thigh': 'chicken-thighs',
  'chicken thighs': 'chicken-thighs',
  chicken: 'chicken-thighs',
  'minced beef': 'ground-beef',
  'ground beef': 'ground-beef',
  beef: 'ground-beef',
  spinach: 'spinach',
  'baby spinach': 'spinach',
  tomato: 'tomato',
  tomatoes: 'tomato',
  'cherry tomatoes': 'tomato',
  'canned tomatoes': 'canned-tomatoes',
  'chopped tomatoes': 'canned-tomatoes',
  rice: 'rice',
  'cooked rice': 'leftover-rice',
  pasta: 'pasta',
  spaghetti: 'pasta',
  fettuccine: 'pasta',
  bread: 'bread',
  'sourdough': 'bread',
  egg: 'eggs',
  eggs: 'eggs',
  onion: 'onion',
  onions: 'onion',
  garlic: 'garlic',
  carrot: 'carrot',
  carrots: 'carrot',
  lemon: 'lemon',
  yogurt: 'yogurt',
  yoghurt: 'yogurt',
  cheddar: 'cheddar',
  'cheddar cheese': 'cheddar',
  parmesan: 'parmesan',
  'parmesan cheese': 'parmesan',
  mozzarella: 'mozzarella',
  feta: 'feta',
  butter: 'butter',
  milk: 'milk',
  'olive oil': 'olive-oil',
  'soy sauce': 'soy-sauce',
  tofu: 'tofu',
  salmon: 'salmon',
  shrimp: 'shrimp',
  prawns: 'shrimp',
  tuna: 'tuna',
  bacon: 'bacon',
  ham: 'ham',
  chickpeas: 'chickpeas',
  'chick peas': 'chickpeas',
  'garbanzo beans': 'chickpeas',
  lentils: 'lentils',
  'black beans': 'black-beans',
  mushroom: 'mushroom',
  mushrooms: 'mushroom',
  avocado: 'avocado',
  broccoli: 'broccoli',
  zucchini: 'zucchini',
  courgette: 'zucchini',
  cucumber: 'cucumber',
  cabbage: 'cabbage',
  kale: 'kale',
  lettuce: 'lettuce',
  basil: 'basil',
  cilantro: 'cilantro',
  coriander: 'cilantro',
  parsley: 'parsley',
  ginger: 'ginger',
  chili: 'chili',
  chilli: 'chili',
  'bell pepper': 'bell-pepper',
  'red pepper': 'bell-pepper',
  capsicum: 'bell-pepper',
  potato: 'potato',
  potatoes: 'potato',
  'sweet potato': 'sweet-potato',
  tortillas: 'tortillas',
  tortilla: 'tortillas',
  oats: 'oats',
  oatmeal: 'oats',
  banana: 'banana',
  bananas: 'banana',
  apple: 'apple',
  apples: 'apple',
  corn: 'corn',
  peas: 'frozen-peas',
  'peanut butter': 'peanut-butter',
  'coconut milk': 'coconut-milk',
  honey: 'honey',
  stock: 'stock',
  broth: 'stock',
};

function tidyName(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/\([^)]*\)/g, ' ')
    .replace(/[^a-z\s-]/g, ' ')
    .replace(/\b(fresh|dried|large|small|sliced|diced|minced|grated|chopped|cooked|to taste|for garnish|optional)\b/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function ingredientIdFromName(raw: string): string | undefined {
  const name = tidyName(raw);
  if (!name) return undefined;
  if (ALIAS_TO_ID[name]) return ALIAS_TO_ID[name];

  const words = name.split(' ');
  for (let i = words.length; i >= 1; i -= 1) {
    const slice = words.slice(0, i).join(' ');
    if (ALIAS_TO_ID[slice]) return ALIAS_TO_ID[slice];
  }

  const hit = INGREDIENTS.find((item) => {
    if (item.name.toLowerCase() === name) return true;
    if (item.aliases.some((alias) => alias.toLowerCase() === name)) return true;
    if (name.includes(item.name.toLowerCase())) return true;
    return item.aliases.some((alias) => name.includes(alias.toLowerCase()));
  });
  return hit?.id;
}

export function searchTermForIngredient(id: string): string {
  if (SEARCH_TERM[id]) return SEARCH_TERM[id];
  return id.replace(/-/g, ' ').split(' ')[0];
}

export function urgentSearchTerms(
  pantry: { ingredientId: string }[],
  limit = 3,
): string[] {
  const terms: string[] = [];
  const seen = new Set<string>();
  for (const item of pantry) {
    const term = searchTermForIngredient(item.ingredientId);
    if (!term || seen.has(term)) continue;
    seen.add(term);
    terms.push(term);
    if (terms.length >= limit) break;
  }
  return terms;
}
