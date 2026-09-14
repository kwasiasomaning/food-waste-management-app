import { CUISINE_MAP, isCuisine } from '../data/cuisines';
import type { Cuisine, Recipe, ScoredRecipe } from '../types';

const AREA_TO_CUISINE: Record<string, Cuisine> = {
  american: 'american',
  canadian: 'american',
  british: 'british',
  irish: 'british',
  jamaican: 'caribbean',
  chinese: 'chinese',
  french: 'french',
  greek: 'greek',
  indian: 'indian',
  italian: 'italian',
  japanese: 'japanese',
  korean: 'korean',
  mexican: 'mexican',
  egyptian: 'middle-eastern',
  turkish: 'middle-eastern',
  moroccan: 'moroccan',
  spanish: 'spanish',
  thai: 'thai',
  vietnamese: 'vietnamese',
};

const DUMMYJSON_TO_CUISINE: Record<string, Cuisine> = {
  american: 'american',
  hawaiian: 'american',
  asian: 'chinese',
  chinese: 'chinese',
  greek: 'greek',
  indian: 'indian',
  pakistani: 'indian',
  italian: 'italian',
  japanese: 'japanese',
  korean: 'korean',
  mediterranean: 'mediterranean',
  mexican: 'mexican',
  turkish: 'middle-eastern',
  lebanese: 'middle-eastern',
  moroccan: 'moroccan',
  spanish: 'spanish',
  thai: 'thai',
  vietnamese: 'vietnamese',
};

const EXPAND: Record<Cuisine, Cuisine[]> = {
  any: [],
  american: ['american'],
  british: ['british'],
  caribbean: ['caribbean'],
  chinese: ['chinese'],
  french: ['french'],
  greek: ['greek'],
  indian: ['indian'],
  italian: ['italian'],
  japanese: ['japanese'],
  korean: ['korean'],
  mediterranean: ['mediterranean', 'italian', 'greek', 'spanish'],
  mexican: ['mexican'],
  'middle-eastern': ['middle-eastern', 'moroccan'],
  moroccan: ['moroccan'],
  spanish: ['spanish'],
  thai: ['thai'],
  vietnamese: ['vietnamese'],
};

export function cuisineFromArea(area: string | undefined): Cuisine | undefined {
  if (!area) return undefined;
  return AREA_TO_CUISINE[area.trim().toLowerCase()];
}

export function cuisineFromDummyjson(
  name: string | undefined,
  tags: string[] = [],
): Cuisine | undefined {
  const direct = DUMMYJSON_TO_CUISINE[(name ?? '').trim().toLowerCase()];
  if (direct) return direct;
  for (const tag of tags) {
    const mapped = DUMMYJSON_TO_CUISINE[tag.trim().toLowerCase()];
    if (mapped) return mapped;
  }
  return undefined;
}

export function cuisineMatches(recipeCuisine: Cuisine | undefined, wanted: Cuisine): boolean {
  if (!wanted || wanted === 'any') return true;
  if (!recipeCuisine) return false;
  return EXPAND[wanted].includes(recipeCuisine);
}

export function themealdbAreas(cuisine: Cuisine): string[] {
  if (cuisine === 'any') return [];
  return CUISINE_MAP[cuisine]?.areas ?? [];
}

export function dummyjsonCuisineNames(cuisine: Cuisine): string[] {
  if (cuisine === 'any') return [];
  return CUISINE_MAP[cuisine]?.dummyjson ?? [];
}

export function pickCuisineFirst(
  rows: ScoredRecipe[],
  cuisine: Cuisine,
  limit: number,
): ScoredRecipe[] {
  if (cuisine === 'any' || limit <= 0) return rows.slice(0, limit);
  const matched = rows.filter((row) => cuisineMatches(row.recipe.cuisine, cuisine));
  if (matched.length >= limit) return matched.slice(0, limit);
  const rest = rows.filter((row) => !cuisineMatches(row.recipe.cuisine, cuisine));
  return [...matched, ...rest].slice(0, limit);
}

export function recipeHasCuisine(recipe: Recipe, cuisine: Cuisine): boolean {
  return cuisineMatches(recipe.cuisine, cuisine);
}

export { isCuisine };
