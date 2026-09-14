export type FoodPhotoId = 'table' | 'greens' | 'bread' | 'bowl' | 'citrus' | 'shelf' | 'plate';

export type IngredientPhotoId =
  | 'ing-greens'
  | 'ing-tomato'
  | 'ing-lemon'
  | 'ing-onion'
  | 'ing-carrot'
  | 'ing-pepper'
  | 'ing-cucumber'
  | 'ing-potato'
  | 'ing-sweet-potato'
  | 'ing-broccoli'
  | 'ing-zucchini'
  | 'ing-mushroom'
  | 'ing-avocado'
  | 'ing-apple'
  | 'ing-banana'
  | 'ing-corn'
  | 'ing-ginger'
  | 'ing-chili'
  | 'ing-cabbage'
  | 'ing-celery'
  | 'ing-berries'
  | 'ing-peas'
  | 'ing-eggs'
  | 'ing-dairy'
  | 'ing-yogurt'
  | 'ing-bread'
  | 'ing-tortilla'
  | 'ing-chicken'
  | 'ing-beef'
  | 'ing-pork'
  | 'ing-fish'
  | 'ing-shrimp'
  | 'ing-tofu'
  | 'ing-grain'
  | 'ing-oil'
  | 'ing-beans'
  | 'ing-roast';

const INGREDIENT_FAMILIES: Record<IngredientPhotoId, readonly string[]> = {
  'ing-greens': ['spinach', 'kale', 'lettuce', 'scallion', 'cilantro', 'parsley', 'basil'],
  'ing-tomato': ['tomato', 'canned-tomatoes'],
  'ing-lemon': ['lemon', 'lime'],
  'ing-onion': ['onion', 'garlic'],
  'ing-carrot': ['carrot'],
  'ing-pepper': ['bell-pepper'],
  'ing-cucumber': ['cucumber'],
  'ing-potato': ['potato', 'yam'],
  'ing-sweet-potato': ['sweet-potato'],
  'ing-broccoli': ['broccoli'],
  'ing-zucchini': ['zucchini', 'okra'],
  'ing-mushroom': ['mushroom'],
  'ing-avocado': ['avocado'],
  'ing-apple': ['apple'],
  'ing-banana': ['banana', 'plantain'],
  'ing-corn': ['corn'],
  'ing-ginger': ['ginger'],
  'ing-chili': ['chili', 'paprika', 'chili-flakes'],
  'ing-cabbage': ['cabbage'],
  'ing-celery': ['celery'],
  'ing-berries': ['frozen-berries'],
  'ing-peas': ['frozen-peas'],
  'ing-eggs': ['eggs'],
  'ing-dairy': ['milk', 'butter', 'cheddar', 'parmesan', 'mozzarella', 'feta', 'sour-cream'],
  'ing-yogurt': ['yogurt'],
  'ing-bread': ['bread', 'oats'],
  'ing-tortilla': ['tortillas'],
  'ing-chicken': ['chicken-thighs', 'chicken-breast', 'leftover-chicken'],
  'ing-beef': ['ground-beef'],
  'ing-pork': ['bacon', 'ham'],
  'ing-fish': ['salmon', 'tuna'],
  'ing-shrimp': ['shrimp'],
  'ing-tofu': ['tofu'],
  'ing-grain': ['rice', 'pasta', 'leftover-rice', 'leftover-pasta'],
  'ing-oil': [
    'olive-oil',
    'palm-oil',
    'soy-sauce',
    'vinegar',
    'honey',
    'coconut-milk',
    'stock',
    'salt',
    'pepper',
    'cumin',
  ],
  'ing-beans': ['chickpeas', 'black-beans', 'black-eyed-peas', 'lentils', 'peanut-butter'],
  'ing-roast': ['leftover-roast-veg'],
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
      return 'ing-peas';
    default:
      return 'ing-greens';
  }
}

export function photoForIngredient(ingredient: { id: string; category?: string }): IngredientPhotoId {
  return INGREDIENT_PHOTO_BY_ID[ingredient.id] ?? photoFallback(ingredient.category);
}

export function hasMappedIngredientPhoto(id: string): boolean {
  return Object.hasOwn(INGREDIENT_PHOTO_BY_ID, id);
}

export type MealPhotoId =
  | 'meal-frittata'
  | 'meal-toast'
  | 'meal-fried-rice'
  | 'meal-chicken'
  | 'meal-tacos'
  | 'meal-shakshuka'
  | 'meal-pasta'
  | 'meal-soup'
  | 'meal-fish'
  | 'meal-stirfry'
  | 'meal-melt'
  | 'meal-bowl'
  | 'meal-noodles'
  | 'meal-beans'
  | 'meal-caprese';

export function photoForRecipe(recipe: { id: string; title: string; emoji?: string }): MealPhotoId {
  const hay = `${recipe.id} ${recipe.title}`.toLowerCase();
  if (/taco|quesadilla/.test(hay)) return 'meal-tacos';
  if (/shakshuka|egg-stew|egg stew/.test(hay)) return 'meal-shakshuka';
  if (/jollof/.test(hay)) return 'meal-fried-rice';
  if (/efo|kontomire|okra/.test(hay)) return 'meal-soup';
  if (/suya/.test(hay)) return 'meal-chicken';
  if (/red-red|red red/.test(hay)) return 'meal-beans';
  if (/yam-egg|yam and egg/.test(hay)) return 'meal-frittata';
  if (/frittata|zucchini-eggs|feta-eggs|corn-eggs|roast-veg|bacon-potato/.test(hay)) {
    return 'meal-frittata';
  }
  if (/toast|tomato-bread|avocado|ham-egg|apple-cheddar/.test(hay)) return 'meal-toast';
  if (/fried.?rice/.test(hay)) return 'meal-fried-rice';
  if (/grilled.?cheese|melt|broccoli-cheddar/.test(hay)) return 'meal-melt';
  if (/noodle|peanut-noodles|cabbage-noodles/.test(hay)) return 'meal-noodles';
  if (/pasta|aglio|spaghetti/.test(hay)) return 'meal-pasta';
  if (/soup|lentil|coconut-lentil|carrot-ginger/.test(hay)) return 'meal-soup';
  if (/salmon|shrimp/.test(hay)) return 'meal-fish';
  if (/stir|tofu/.test(hay)) return 'meal-stirfry';
  if (/yogurt|oat|banana-oat|cucumber-rice/.test(hay)) return 'meal-bowl';
  if (/chickpea|black-bean|kale-beans|bean/.test(hay)) return 'meal-beans';
  if (/mozzarella|caprese/.test(hay)) return 'meal-caprese';
  if (/chicken/.test(hay)) return 'meal-chicken';
  return 'meal-pasta';
}
