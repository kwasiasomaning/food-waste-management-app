import type { Category, Ingredient } from '../types';

function i(
  id: string,
  name: string,
  category: Category,
  emoji: string,
  defaultDays: number,
  costUsd: number,
  kg: number,
  extras: Partial<Ingredient> = {},
): Ingredient {
  const vegan = extras.vegan ?? (category === 'produce' || category === 'pantry' || category === 'frozen');
  const vegetarian = extras.vegetarian ?? (vegan || category === 'dairy');
  return {
    id,
    name,
    aliases: extras.aliases ?? [],
    category,
    emoji,
    defaultDays,
    isStaple: extras.isStaple,
    vegan,
    vegetarian,
    costUsd,
    kg,
  };
}

export const INGREDIENTS: Ingredient[] = [
  i('spinach', 'Spinach', 'produce', '🥬', 3, 3.2, 0.15, { aliases: ['baby spinach', 'greens'] }),
  i('kale', 'Kale', 'produce', '🥬', 4, 3.0, 0.16),
  i('lettuce', 'Lettuce', 'produce', '🥗', 4, 2.4, 0.2),
  i('tomato', 'Tomatoes', 'produce', '🍅', 4, 2.8, 0.35, { aliases: ['tomato'] }),
  i('cucumber', 'Cucumber', 'produce', '🥒', 5, 1.6, 0.3),
  i('bell-pepper', 'Bell pepper', 'produce', '🫑', 6, 1.8, 0.2, { aliases: ['capsicum', 'pepper'] }),
  i('onion', 'Onion', 'produce', '🧅', 14, 0.8, 0.2, { aliases: ['yellow onion'] }),
  i('garlic', 'Garlic', 'produce', '🧄', 21, 0.4, 0.04, { isStaple: true }),
  i('ginger', 'Ginger', 'produce', '🫚', 18, 0.7, 0.05),
  i('carrot', 'Carrots', 'produce', '🥕', 10, 1.4, 0.3),
  i('celery', 'Celery', 'produce', '🥬', 7, 1.5, 0.25),
  i('potato', 'Potatoes', 'produce', '🥔', 14, 2.0, 0.5),
  i('sweet-potato', 'Sweet potato', 'produce', '🍠', 12, 1.8, 0.4),
  i('broccoli', 'Broccoli', 'produce', '🥦', 5, 2.2, 0.3),
  i('zucchini', 'Zucchini', 'produce', '🥒', 5, 1.7, 0.25, { aliases: ['courgette'] }),
  i('mushroom', 'Mushrooms', 'produce', '🍄', 4, 2.6, 0.2),
  i('avocado', 'Avocado', 'produce', '🥑', 3, 2.2, 0.2),
  i('lemon', 'Lemon', 'produce', '🍋', 10, 0.8, 0.1),
  i('lime', 'Lime', 'produce', '🍋', 9, 0.6, 0.08),
  i('apple', 'Apples', 'produce', '🍎', 12, 2.0, 0.3),
  i('banana', 'Bananas', 'produce', '🍌', 4, 1.2, 0.25),
  i('cabbage', 'Cabbage', 'produce', '🥬', 10, 1.6, 0.5),
  i('corn', 'Corn', 'produce', '🌽', 4, 1.5, 0.2),
  i('scallion', 'Scallions', 'produce', '🌱', 6, 1.0, 0.08, { aliases: ['green onion', 'spring onion'] }),
  i('cilantro', 'Cilantro', 'produce', '🌿', 4, 1.2, 0.04, { aliases: ['coriander'] }),
  i('parsley', 'Parsley', 'produce', '🌿', 5, 1.1, 0.04),
  i('basil', 'Basil', 'produce', '🌿', 4, 1.8, 0.04),
  i('chili', 'Chili', 'produce', '🌶️', 8, 0.5, 0.03, { aliases: ['scotch bonnet', 'ata rodo', 'kpakpo shito'] }),
  i('plantain', 'Plantain', 'produce', '🍌', 5, 1.6, 0.3, { aliases: ['ripe plantain', 'plantains'] }),
  i('yam', 'Yam', 'produce', '🍠', 14, 2.2, 0.5, { aliases: ['white yam', 'puna yam'] }),
  i('okra', 'Okra', 'produce', '🥬', 4, 1.8, 0.25, { aliases: ['okro'] }),

  i('milk', 'Milk', 'dairy', '🥛', 6, 2.4, 0.5, { vegan: false, vegetarian: true }),
  i('yogurt', 'Yogurt', 'dairy', '🥣', 7, 2.2, 0.4, { vegan: false, vegetarian: true, aliases: ['plain yogurt'] }),
  i('butter', 'Butter', 'dairy', '🧈', 21, 3.0, 0.2, { vegan: false, vegetarian: true }),
  i('cheddar', 'Cheddar', 'dairy', '🧀', 14, 3.5, 0.2, { vegan: false, vegetarian: true }),
  i('parmesan', 'Parmesan', 'dairy', '🧀', 24, 4.0, 0.1, { vegan: false, vegetarian: true }),
  i('mozzarella', 'Mozzarella', 'dairy', '🧀', 8, 3.2, 0.2, { vegan: false, vegetarian: true }),
  i('feta', 'Feta', 'dairy', '🧀', 10, 3.4, 0.15, { vegan: false, vegetarian: true }),
  i('eggs', 'Eggs', 'dairy', '🥚', 14, 3.8, 0.4, { vegan: false, vegetarian: true }),
  i('sour-cream', 'Sour cream', 'dairy', '🥛', 8, 2.0, 0.2, { vegan: false, vegetarian: true }),

  i('chicken-thighs', 'Chicken thighs', 'protein', '🍗', 3, 7.5, 0.6, { vegan: false, vegetarian: false }),
  i('chicken-breast', 'Chicken breast', 'protein', '🍗', 3, 8.0, 0.5, { vegan: false, vegetarian: false }),
  i('ground-beef', 'Ground beef', 'protein', '🥩', 2, 8.5, 0.45, { vegan: false, vegetarian: false }),
  i('bacon', 'Bacon', 'protein', '🥓', 7, 5.0, 0.2, { vegan: false, vegetarian: false }),
  i('salmon', 'Salmon', 'protein', '🐟', 2, 11.0, 0.35, { vegan: false, vegetarian: false }),
  i('tuna', 'Canned tuna', 'protein', '🐟', 720, 2.2, 0.16, { vegan: false, vegetarian: false }),
  i('tofu', 'Tofu', 'protein', '🧈', 7, 2.8, 0.4, { vegan: true, vegetarian: true }),
  i('shrimp', 'Shrimp', 'protein', '🦐', 2, 9.0, 0.3, { vegan: false, vegetarian: false }),
  i('ham', 'Ham', 'protein', '🍖', 5, 4.5, 0.2, { vegan: false, vegetarian: false }),

  i('rice', 'Rice', 'pantry', '🍚', 360, 2.0, 0.4, { isStaple: false }),
  i('pasta', 'Pasta', 'pantry', '🍝', 360, 1.6, 0.4),
  i('bread', 'Bread', 'pantry', '🍞', 4, 3.0, 0.4),
  i('tortillas', 'Tortillas', 'pantry', '🌮', 8, 2.5, 0.3),
  i('oats', 'Oats', 'pantry', '🌾', 180, 2.2, 0.4),
  i('canned-tomatoes', 'Canned tomatoes', 'pantry', '🍅', 540, 1.6, 0.4),
  i('chickpeas', 'Chickpeas', 'pantry', '🫘', 540, 1.4, 0.4),
  i('black-beans', 'Black beans', 'pantry', '🫘', 540, 1.4, 0.4),
  i('black-eyed-peas', 'Black-eyed peas', 'pantry', '🫘', 540, 1.4, 0.4, {
    aliases: ['black eyed peas', 'black-eyed beans', 'cowpeas'],
  }),
  i('lentils', 'Lentils', 'pantry', '🫘', 540, 1.5, 0.4),
  i('coconut-milk', 'Coconut milk', 'pantry', '🥥', 540, 2.0, 0.4),
  i('peanut-butter', 'Peanut butter', 'pantry', '🥜', 180, 3.2, 0.3),
  i('soy-sauce', 'Soy sauce', 'pantry', '🫙', 540, 2.4, 0.3, { isStaple: true }),
  i('stock', 'Stock', 'pantry', '🍲', 360, 2.0, 0.5, { isStaple: true, aliases: ['broth'] }),
  i('olive-oil', 'Olive oil', 'pantry', '🫒', 360, 8.0, 0.4, { isStaple: true }),
  i('palm-oil', 'Palm oil', 'pantry', '🫙', 360, 4.5, 0.4, { aliases: ['red palm oil', 'zomi'] }),
  i('vinegar', 'Vinegar', 'pantry', '🫙', 540, 2.0, 0.3, { isStaple: true }),
  i('honey', 'Honey', 'pantry', '🍯', 720, 4.0, 0.2, { vegan: false, vegetarian: true }),
  i('salt', 'Salt', 'pantry', '🧂', 2000, 1.0, 0.2, { isStaple: true }),
  i('pepper', 'Black pepper', 'pantry', '⚫', 2000, 2.0, 0.05, { isStaple: true }),
  i('cumin', 'Cumin', 'pantry', '\u{1F33F}', 720, 2.0, 0.04, { isStaple: true }),
  i('paprika', 'Paprika', 'pantry', '🌶️', 720, 2.0, 0.04, { isStaple: true }),
  i('chili-flakes', 'Chili flakes', 'pantry', '🌶️', 720, 1.8, 0.03, { isStaple: true }),

  i('frozen-peas', 'Frozen peas', 'frozen', '🟢', 180, 1.8, 0.3),
  i('frozen-berries', 'Frozen berries', 'frozen', '🫐', 180, 3.5, 0.3),

  i('leftover-rice', 'Leftover rice', 'leftovers', '🍚', 2, 1.5, 0.3, { vegan: true, vegetarian: true }),
  i('leftover-pasta', 'Leftover pasta', 'leftovers', '🍝', 2, 1.4, 0.3, { vegan: true, vegetarian: true }),
  i('leftover-chicken', 'Leftover chicken', 'leftovers', '🍗', 2, 4.0, 0.25, { vegan: false, vegetarian: false }),
  i('leftover-roast-veg', 'Roast vegetables', 'leftovers', '🥕', 2, 2.0, 0.25, { vegan: true, vegetarian: true }),
];

export const INGREDIENT_MAP: Record<string, Ingredient> = Object.fromEntries(
  INGREDIENTS.map((item) => [item.id, item]),
);

export function getIngredient(id: string): Ingredient {
  const found = INGREDIENT_MAP[id];
  if (!found) {
    throw new Error(`Unknown ingredient: ${id}`);
  }
  return found;
}

export function searchIngredients(query: string): Ingredient[] {
  const q = query.trim().toLowerCase();
  if (!q) return INGREDIENTS.filter((item) => !item.isStaple);
  return INGREDIENTS.filter((item) => {
    if (item.name.toLowerCase().includes(q)) return true;
    return item.aliases.some((alias) => alias.toLowerCase().includes(q));
  });
}

export const CATEGORY_LABEL: Record<Category, string> = {
  produce: 'Produce',
  dairy: 'Dairy & eggs',
  protein: 'Protein',
  pantry: 'Pantry',
  frozen: 'Frozen',
  leftovers: 'Leftovers',
};

export const COMMON_FRIDGE = [
  'spinach',
  'tomato',
  'milk',
  'eggs',
  'yogurt',
  'bread',
  'leftover-rice',
  'chicken-thighs',
  'cheddar',
  'tortillas',
  'lemon',
  'carrot',
  'onion',
  'butter',
  'cucumber',
  'bell-pepper',
] as const;
