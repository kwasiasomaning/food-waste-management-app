import type { Cuisine, Diet, PantryItem, Recipe, ScoredRecipe } from '../types';
import { pickCuisineFirst } from './cuisine';
import { daysUntil } from './dates';
import { rememberRecipe } from './mealCache';
import { urgentSearchTerms } from './mealMatch';
import { fetchRemoteRecipes } from './mealSources';
import { scoreRecipe, suggestDinners } from './matching';

export function mergeDinnerIdeas(
  groups: ScoredRecipe[][],
  limit = 3,
  cuisine: Cuisine = 'any',
): ScoredRecipe[] {
  const seen = new Set<string>();
  const merged: ScoredRecipe[] = [];
  for (const group of groups) {
    for (const row of group) {
      const titleKey = row.recipe.title.trim().toLowerCase();
      if (seen.has(row.recipe.id) || seen.has(titleKey)) continue;
      seen.add(row.recipe.id);
      seen.add(titleKey);
      rememberRecipe(row.recipe);
      merged.push(row);
    }
  }
  const ranked = merged.sort((a, b) => b.score - a.score || a.missing.length - b.missing.length);
  return pickCuisineFirst(ranked, cuisine, limit);
}

function scoreRemote(recipe: Recipe, pantry: PantryItem[], diet: Diet, now: number): ScoredRecipe | null {
  const scored = scoreRecipe(recipe, pantry, diet, now);
  if (scored) return scored;
  if (!recipe.source || recipe.source === 'house') return null;

  const loose = scoreRecipe(
    {
      ...recipe,
      ingredients: recipe.ingredients.map((line, index) =>
        index < 3 ? line : { ...line, optional: true },
      ),
    },
    pantry,
    diet,
    now,
  );
  return loose;
}

export async function loadDinnerIdeas(
  pantry: PantryItem[],
  diet: Diet,
  limit = 3,
  now = Date.now(),
  fetchImpl: typeof fetch = fetch,
  cuisine: Cuisine = 'any',
): Promise<ScoredRecipe[]> {
  const local = suggestDinners(pantry, diet, limit, now, cuisine);
  if (pantry.length === 0) return local;

  const urgent = pantry
    .slice()
    .sort((a, b) => daysUntil(a.expiresAt, now) - daysUntil(b.expiresAt, now));
  const terms = urgentSearchTerms(urgent, 3);

  try {
    const remoteRecipes = await fetchRemoteRecipes(terms, fetchImpl, 4500, cuisine);
    const remote = remoteRecipes
      .map((recipe) => scoreRemote(recipe, pantry, diet, now))
      .filter((row): row is ScoredRecipe => row !== null);
    if (remote.length === 0) return local;
    return mergeDinnerIdeas([local, remote], limit, cuisine);
  } catch {
    return local;
  }
}
