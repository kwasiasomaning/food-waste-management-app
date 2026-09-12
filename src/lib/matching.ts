import { INGREDIENT_MAP } from '../data/ingredients';
import { RECIPES } from '../data/recipes';
import type { Diet, PantryItem, Recipe, ScoredRecipe } from '../types';
import { daysUntil } from './dates';

export function dietAllows(recipeDiet: Diet, userDiet: Diet): boolean {
  if (userDiet === 'omnivore') return true;
  if (userDiet === 'vegetarian') return recipeDiet !== 'omnivore';
  return recipeDiet === 'vegan';
}

export function isRequired(ingredientId: string, optional?: boolean): boolean {
  if (optional) return false;
  return !INGREDIENT_MAP[ingredientId]?.isStaple;
}

export function pantryIndex(pantry: PantryItem[], now = Date.now()): Map<string, PantryItem> {
  const map = new Map<string, PantryItem>();
  for (const item of pantry) {
    const existing = map.get(item.ingredientId);
    if (!existing || daysUntil(item.expiresAt, now) < daysUntil(existing.expiresAt, now)) {
      map.set(item.ingredientId, item);
    }
  }
  return map;
}

export function scoreRecipe(
  recipe: Recipe,
  pantry: PantryItem[],
  userDiet: Diet,
  now = Date.now(),
): ScoredRecipe | null {
  if (!dietAllows(recipe.diet, userDiet)) return null;

  const index = pantryIndex(pantry, now);
  const required = recipe.ingredients.filter((line) => isRequired(line.ingredientId, line.optional));

  if (required.length === 0) return null;

  const have: string[] = [];
  const missing: string[] = [];
  const expiringUsed: string[] = [];
  const soonUsed: string[] = [];

  for (const line of required) {
    const item = index.get(line.ingredientId);
    if (!item) {
      missing.push(line.ingredientId);
      continue;
    }
    have.push(line.ingredientId);
    const days = daysUntil(item.expiresAt, now);
    if (days <= 1.25) expiringUsed.push(line.ingredientId);
    else if (days <= 4) soonUsed.push(line.ingredientId);
  }

  if (have.length === 0) return null;
  if (missing.length > 2) return null;

  const matchRatio = have.length / required.length;
  const dyingBonus = mostUrgentBonus(pantry, have, now);

  const score =
    expiringUsed.length * 42 +
    soonUsed.length * 16 +
    matchRatio * 30 +
    (2 - missing.length) * 8 +
    dyingBonus +
    (required.length >= 3 ? 3 : 0);

  return {
    recipe,
    score,
    have,
    missing,
    expiringUsed,
    soonUsed,
    matchRatio,
  };
}

function mostUrgentBonus(pantry: PantryItem[], have: string[], now: number): number {
  if (pantry.length === 0 || have.length === 0) return 0;
  const perishable = pantry
    .filter((item) => !INGREDIENT_MAP[item.ingredientId]?.isStaple)
    .slice()
    .sort((a, b) => daysUntil(a.expiresAt, now) - daysUntil(b.expiresAt, now));
  if (perishable.length === 0) return 0;
  const dying = perishable[0];
  return have.includes(dying.ingredientId) && daysUntil(dying.expiresAt, now) <= 4 ? 18 : 0;
}

export function suggestDinners(
  pantry: PantryItem[],
  userDiet: Diet,
  limit = 3,
  now = Date.now(),
): ScoredRecipe[] {
  return RECIPES.map((recipe) => scoreRecipe(recipe, pantry, userDiet, now))
    .filter((row): row is ScoredRecipe => row !== null)
    .sort((a, b) => b.score - a.score || a.missing.length - b.missing.length)
    .slice(0, limit);
}

export function missingShopList(suggestions: ScoredRecipe[]): { ingredientId: string; reason: string }[] {
  const seen = new Set<string>();
  const list: { ingredientId: string; reason: string }[] = [];
  for (const suggestion of suggestions) {
    for (const id of suggestion.missing) {
      if (seen.has(id)) continue;
      seen.add(id);
      list.push({
        ingredientId: id,
        reason: `For ${suggestion.recipe.title}`,
      });
    }
  }
  return list;
}
