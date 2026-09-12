export type FoodPhotoId = 'table' | 'greens' | 'bread' | 'bowl' | 'citrus' | 'shelf' | 'plate';

export type IngredientPhotoId =
  | 'ing-greens'
  | 'ing-tomato'
  | 'ing-lemon'
  | 'ing-onion'
  | 'ing-carrot'
  | 'ing-eggs'
  | 'ing-dairy'
  | 'ing-bread'
  | 'ing-chicken'
  | 'ing-fish'
  | 'ing-grain'
  | 'ing-oil'
  | 'ing-beans';

const INGREDIENT_FAMILIES: Record<IngredientPhotoId, readonly string[]> = {
  'ing-greens': [
    'spinach',
    'kale',
    'lettuce',
    'celery',
    'cabbage',
    'scallion',
    'cilantro',
    'parsley',
    'basil',
    'frozen-peas',
  ],
  'ing-tomato': ['tomato', 'canned-tomatoes', 'chili', 'paprika', 'chili-flakes'],
  'ing-lemon': ['lemon', 'lime', 'apple', 'banana', 'corn', 'frozen-berries'],
  'ing-onion': ['onion', 'garlic', 'ginger'],
  'ing-carrot': [
    'carrot',
    'potato',
    'sweet-potato',
    'broccoli',
    'zucchini',
    'cucumber',
    'avocado',
    'bell-pepper',
    'mushroom',
    'leftover-roast-veg',
  ],
  'ing-eggs': ['eggs'],
  'ing-dairy': ['milk', 'yogurt', 'butter', 'cheddar', 'parmesan', 'mozzarella', 'feta', 'sour-cream'],
  'ing-bread': ['bread', 'tortillas', 'oats'],
  'ing-chicken': [
    'chicken-thighs',
    'chicken-breast',
    'leftover-chicken',
    'ground-beef',
    'bacon',
    'ham',
  ],
  'ing-fish': ['salmon', 'tuna', 'shrimp'],
  'ing-grain': ['rice', 'pasta', 'leftover-rice', 'leftover-pasta'],
  'ing-oil': [
    'olive-oil',
    'soy-sauce',
    'vinegar',
    'honey',
    'coconut-milk',
    'stock',
    'salt',
    'pepper',
    'cumin',
  ],
  'ing-beans': ['chickpeas', 'black-beans', 'lentils', 'tofu', 'peanut-butter'],
};

const INGREDIENT_PHOTO_BY_ID: Record<string, IngredientPhotoId> = Object.fromEntries(
  (Object.entries(INGREDIENT_FAMILIES) as [IngredientPhotoId, readonly string[]][]).flatMap(
    ([photo, ids]) => ids.map((id) => [id, photo]),
  ),
);

function photoFallback(category?: string): IngredientPhotoId {
  switch (category) {
    case 'dairy':
      return 'ing-dairy';
    case 'protein':
      return 'ing-chicken';
    case 'pantry':
      return 'ing-oil';
    case 'leftovers':
      return 'ing-grain';
    case 'frozen':
      return 'ing-greens';
    default:
      return 'ing-carrot';
  }
}

export function photoForIngredient(ingredient: { id: string; category?: string }): IngredientPhotoId {
  return INGREDIENT_PHOTO_BY_ID[ingredient.id] ?? photoFallback(ingredient.category);
}

export function hasMappedIngredientPhoto(id: string): boolean {
  return Object.hasOwn(INGREDIENT_PHOTO_BY_ID, id);
}

export function photoForRecipe(recipe: { id: string; title: string; emoji: string }): FoodPhotoId {
  const hay = `${recipe.id} ${recipe.title} ${recipe.emoji}`.toLowerCase();
  if (/bread|toast|tomato|quesadilla|taco|mozzarella|caprese|🍞|🍅|🌮/.test(hay)) return 'bread';
  if (/rice|bowl|noodle|pasta|soup|lentil|stew|risotto|🍚|🍝|🍲|🥣/.test(hay)) return 'bowl';
  if (/spin|kale|green|salad|broccoli|cabbage|zucchini|herb|🥬|🥦|🌿/.test(hay)) return 'greens';
  if (/egg|frittata|shakshuka|🍳/.test(hay)) return 'greens';
  if (/lemon|citrus|salmon|shrimp|fish|🍋|🐟|🦐/.test(hay)) return 'citrus';
  return 'plate';
}
