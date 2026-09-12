import { tagsFor } from '../data/ingredientTags';
import type { Diet, FoodTag, Recipe } from '../types';

function recipeTags(recipe: Recipe): Set<FoodTag> {
  const tags = new Set<FoodTag>();
  for (const line of recipe.ingredients) {
    if (line.optional) continue;
    for (const tag of tagsFor(line.ingredientId)) tags.add(tag);
  }
  return tags;
}

function hasAny(tags: Set<FoodTag>, banned: FoodTag[]): boolean {
  return banned.some((tag) => tags.has(tag));
}

export function dietAllows(recipe: Recipe, userDiet: Diet): boolean {
  const tags = recipeTags(recipe);

  switch (userDiet) {
    case 'omnivore':
      return true;
    case 'vegetarian':
      return !hasAny(tags, ['meat', 'poultry', 'pork', 'beef', 'seafood', 'shellfish']);
    case 'vegan':
      return (
        dietAllows(recipe, 'vegetarian') && !hasAny(tags, ['dairy', 'egg', 'honey'])
      );
    case 'pescatarian':
      return !hasAny(tags, ['meat', 'poultry', 'pork', 'beef']);
    case 'no-red-meat':
      return !hasAny(tags, ['beef', 'pork']);
    case 'halal':
      return !hasAny(tags, ['pork']);
    case 'kosher':
      if (hasAny(tags, ['pork', 'shellfish'])) return false;
      return !(hasAny(tags, ['meat', 'poultry']) && tags.has('dairy'));
    case 'hindu':
      return !hasAny(tags, ['beef']);
    case 'gluten-free':
      return !tags.has('gluten');
    case 'dairy-free':
    case 'low-lactose':
      return !tags.has('dairy');
    case 'nut-free':
      return !tags.has('nut');
    case 'low-sodium':
      return !tags.has('low-sodium-avoid');
    case 'diabetic':
      return !tags.has('high-sugar');
    case 'low-fat':
    case 'low-calorie':
      return !tags.has('high-fat');
    case 'no-cilantro':
      return !tags.has('cilantro');
    case 'no-alcohol':
    case 'pregnant':
      return true;
    default:
      return true;
  }
}
