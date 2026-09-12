import { getIngredient } from '../data/ingredients';
import type { PantryItem } from '../types';
import { addDaysIso, nowIso, uid } from './dates';

type Seed = { ingredientId: string; days: number };

const TYPICAL_FRIDGE: Seed[] = [
  { ingredientId: 'spinach', days: 0.8 },
  { ingredientId: 'bread', days: 1 },
  { ingredientId: 'leftover-rice', days: 1 },
  { ingredientId: 'yogurt', days: 2 },
  { ingredientId: 'tomato', days: 2 },
  { ingredientId: 'chicken-thighs', days: 2 },
  { ingredientId: 'milk', days: 3 },
  { ingredientId: 'tortillas', days: 4 },
  { ingredientId: 'cheddar', days: 8 },
  { ingredientId: 'eggs', days: 10 },
  { ingredientId: 'lemon', days: 6 },
  { ingredientId: 'carrot', days: 7 },
  { ingredientId: 'onion', days: 12 },
  { ingredientId: 'butter', days: 16 },
  { ingredientId: 'chickpeas', days: 180 },
  { ingredientId: 'pasta', days: 200 },
  { ingredientId: 'canned-tomatoes', days: 200 },
  { ingredientId: 'rice', days: 200 },
  { ingredientId: 'garlic', days: 21 },
  { ingredientId: 'olive-oil', days: 200 },
  { ingredientId: 'soy-sauce', days: 300 },
];

export function starterPantry(now = new Date()): PantryItem[] {
  const addedAt = nowIso(now);
  return TYPICAL_FRIDGE.map((seed) => {
    getIngredient(seed.ingredientId);
    return {
      id: uid('pantry'),
      ingredientId: seed.ingredientId,
      addedAt,
      expiresAt: addDaysIso(seed.days, now),
      source: 'starter' as const,
    };
  });
}

export function itemsFromIds(ingredientIds: string[], source: PantryItem['source'], now = new Date()): PantryItem[] {
  const addedAt = nowIso(now);
  return ingredientIds.map((ingredientId) => {
    const ingredient = getIngredient(ingredientId);
    return {
      id: uid('pantry'),
      ingredientId,
      addedAt,
      expiresAt: addDaysIso(ingredient.defaultDays, now),
      source,
    };
  });
}
