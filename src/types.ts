export type Category =
  | 'produce'
  | 'dairy'
  | 'protein'
  | 'pantry'
  | 'frozen'
  | 'leftovers';

export type Diet = 'omnivore' | 'vegetarian' | 'vegan';
export type Urgency = 'tonight' | 'soon' | 'fresh' | 'staple';
export type ItemSource = 'scan' | 'manual' | 'starter' | 'shop';

export type Ingredient = {
  id: string;
  name: string;
  aliases: string[];
  category: Category;
  emoji: string;
  defaultDays: number;
  isStaple?: boolean;
  vegan: boolean;
  vegetarian: boolean;
  costUsd: number;
  kg: number;
};

export type RecipeIngredient = {
  ingredientId: string;
  amount: string;
  optional?: boolean;
};

export type Recipe = {
  id: string;
  title: string;
  subtitle: string;
  minutes: number;
  servings: number;
  diet: Diet;
  emoji: string;
  plate: string;
  ingredients: RecipeIngredient[];
  steps: string[];
  rescue: string;
};

export type PantryItem = {
  id: string;
  ingredientId: string;
  addedAt: string;
  expiresAt: string;
  source: ItemSource;
};

export type CookedMeal = {
  id: string;
  recipeId: string;
  title: string;
  cookedAt: string;
  usedIngredientIds: string[];
  savedUsd: number;
  savedKg: number;
};

export type ShopItem = {
  ingredientId: string;
  reason: string;
  checked: boolean;
};

export type Settings = {
  diet: Diet;
  householdSize: number;
  onboardingDone: boolean;
};

export type ScoredRecipe = {
  recipe: Recipe;
  score: number;
  have: string[];
  missing: string[];
  expiringUsed: string[];
  soonUsed: string[];
  matchRatio: number;
};
