export type Category =
  | 'produce'
  | 'dairy'
  | 'protein'
  | 'pantry'
  | 'frozen'
  | 'leftovers';

export type RecipeDiet = 'omnivore' | 'vegetarian' | 'vegan';

export type Diet =
  | RecipeDiet
  | 'pescatarian'
  | 'no-red-meat'
  | 'halal'
  | 'kosher'
  | 'hindu'
  | 'gluten-free'
  | 'dairy-free'
  | 'low-lactose'
  | 'nut-free'
  | 'low-sodium'
  | 'diabetic'
  | 'low-fat'
  | 'low-calorie'
  | 'no-cilantro'
  | 'no-alcohol'
  | 'pregnant';

export type FoodTag =
  | 'meat'
  | 'poultry'
  | 'pork'
  | 'beef'
  | 'seafood'
  | 'shellfish'
  | 'dairy'
  | 'egg'
  | 'honey'
  | 'gluten'
  | 'nut'
  | 'legume'
  | 'grain'
  | 'high-sugar'
  | 'high-fat'
  | 'fodmap'
  | 'cilantro'
  | 'low-sodium-avoid';
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
  diet: RecipeDiet;
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

export type BinnedItem = {
  id: string;
  ingredientId: string;
  name: string;
  binnedAt: string;
  lostUsd: number;
  lostKg: number;
};

export type UsedItem = {
  id: string;
  ingredientId: string;
  name: string;
  usedAt: string;
  savedUsd: number;
  savedKg: number;
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
  country: string;
  currency: string;
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
