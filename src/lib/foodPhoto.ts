export type FoodPhotoId = 'table' | 'greens' | 'bread' | 'bowl' | 'citrus' | 'shelf' | 'plate';

export function photoForRecipe(recipe: { id: string; title: string; emoji: string }): FoodPhotoId {
  const hay = `${recipe.id} ${recipe.title} ${recipe.emoji}`.toLowerCase();
  if (/bread|toast|tomato|quesadilla|taco|mozzarella|caprese|🍞|🍅|🌮/.test(hay)) return 'bread';
  if (/rice|bowl|noodle|pasta|soup|lentil|stew|risotto|🍚|🍝|🍲|🥣/.test(hay)) return 'bowl';
  if (/spin|kale|green|salad|broccoli|cabbage|zucchini|herb|🥬|🥦|🌿/.test(hay)) return 'greens';
  if (/egg|frittata|shakshuka|🍳/.test(hay)) return 'greens';
  if (/lemon|citrus|salmon|shrimp|fish|🍋|🐟|🦐/.test(hay)) return 'citrus';
  return 'plate';
}
