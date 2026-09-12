import { INGREDIENT_MAP } from '../data/ingredients';

export function estimateWaste(ingredientId: string): { lostUsd: number; lostKg: number } {
  const ingredient = INGREDIENT_MAP[ingredientId];
  if (!ingredient || ingredient.isStaple) return { lostUsd: 0, lostKg: 0 };
  return {
    lostUsd: Math.round(ingredient.costUsd * 100) / 100,
    lostKg: Math.round(ingredient.kg * 100) / 100,
  };
}

export function estimateUse(ingredientId: string): { savedUsd: number; savedKg: number } {
  const { lostUsd, lostKg } = estimateWaste(ingredientId);
  return { savedUsd: lostUsd, savedKg: lostKg };
}

export function estimateSavings(usedIngredientIds: string[]): { savedUsd: number; savedKg: number } {
  const unique = [...new Set(usedIngredientIds)];
  let savedUsd = 0;
  let savedKg = 0;
  for (const id of unique) {
    const ingredient = INGREDIENT_MAP[id];
    if (!ingredient || ingredient.isStaple) continue;
    savedUsd += ingredient.costUsd * 0.55;
    savedKg += ingredient.kg * 0.45;
  }
  return {
    savedUsd: Math.round(savedUsd * 100) / 100,
    savedKg: Math.round(savedKg * 100) / 100,
  };
}

export { formatMoney } from './money';

export function formatKg(value: number): string {
  if (value < 1) return `${Math.round(value * 1000)} g`;
  return `${value.toFixed(1)} kg`;
}

export function mealsEquivalent(savedKg: number): number {
  return Math.max(0, Math.round(savedKg / 0.4));
}
