import { RECIPES } from '../data/recipes';
import type { Recipe } from '../types';

const extras = new Map<string, Recipe>();

export function rememberRecipe(recipe: Recipe): void {
  extras.set(recipe.id, recipe);
}

export function findRecipe(id: string): Recipe | undefined {
  return RECIPES.find((row) => row.id === id) ?? extras.get(id);
}
