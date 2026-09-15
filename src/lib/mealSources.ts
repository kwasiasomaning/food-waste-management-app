import { cuisineLabel } from '../data/cuisines';
import { tagsFor } from '../data/ingredientTags';
import type { Cuisine, Recipe, RecipeDiet, RecipeIngredient, RecipeSource } from '../types';
import {
  cuisineFromArea,
  cuisineFromDummyjson,
  dummyjsonCuisineNames,
  themealdbAreas,
} from './cuisine';
import { howSteps } from './howSteps';
import { ingredientIdFromName } from './mealMatch';

export type FetchLike = typeof fetch;

type RemoteMeal = {
  source: RecipeSource;
  id: string;
  title: string;
  photoUri?: string;
  minutes: number;
  servings: number;
  category?: string;
  cuisine?: Cuisine;
  ingredients: { name: string; amount: string }[];
  steps: string[];
};

const MEAT_WORDS = /\b(chicken|beef|pork|bacon|ham|lamb|turkey|sausage|chorizo|steak|meat)\b/i;
const FISH_WORDS = /\b(salmon|tuna|shrimp|prawn|fish|cod|anchovy)\b/i;
const DAIRY_WORDS = /\b(cheese|milk|butter|cream|yogurt|yoghurt|parmesan|cheddar|feta)\b/i;
const EGG_WORDS = /\b(egg|eggs)\b/i;
const SKIP_MEAL_TYPE = /\b(dessert|beverage|cocktail|smoothie)\b/i;
const DINNER_MEAL_TYPE = /\b(dinner|lunch|snack|appetizer|side)\b/i;

function isNonDinnerSweetOrDrink(category?: string, mealTypes: string[] = []): boolean {
  const labels = [...mealTypes, category ?? ''].filter(Boolean);
  if (labels.some((type) => DINNER_MEAL_TYPE.test(type))) return false;
  return labels.some((type) => SKIP_MEAL_TYPE.test(type));
}

function dietFromMeal(meal: RemoteMeal, ingredientIds: string[]): RecipeDiet {
  const category = (meal.category ?? '').toLowerCase();
  if (category === 'vegan') return 'vegan';
  if (category === 'vegetarian') return 'vegetarian';
  const tags = new Set(ingredientIds.flatMap((id) => tagsFor(id)));
  const blob = `${meal.title} ${meal.ingredients.map((row) => row.name).join(' ')}`;
  if (MEAT_WORDS.test(blob) || tags.has('meat') || tags.has('poultry') || tags.has('pork') || tags.has('beef')) {
    return 'omnivore';
  }
  if (FISH_WORDS.test(blob) || tags.has('seafood') || tags.has('shellfish')) return 'omnivore';
  if (DAIRY_WORDS.test(blob) || EGG_WORDS.test(blob) || tags.has('dairy') || tags.has('egg')) {
    return 'vegetarian';
  }
  return 'vegan';
}

function toRecipe(meal: RemoteMeal): Recipe | null {
  const seen = new Set<string>();
  const ingredients: RecipeIngredient[] = [];
  for (const line of meal.ingredients) {
    const id = ingredientIdFromName(line.name);
    if (!id || seen.has(id)) continue;
    seen.add(id);
    ingredients.push({ ingredientId: id, amount: line.amount || 'to taste' });
  }
  if (ingredients.length === 0) return null;
  const diet = dietFromMeal(
    meal,
    ingredients.map((line) => line.ingredientId),
  );
  const label = cuisineLabel(meal.cuisine);
  return {
    id: meal.id,
    title: meal.title,
    subtitle: label
      ? `${label}, using what you already have.`
      : 'From another kitchen, using what you already have.',
    minutes: Math.max(10, meal.minutes || 25),
    servings: meal.servings || 2,
    diet,
    emoji: '🍽️',
    plate: '#E8DCCB',
    ingredients,
    steps: howSteps(meal.steps),
    rescue: 'Suggested because it uses food already in your fridge.',
    source: meal.source,
    photoUri: meal.photoUri,
    cuisine: meal.cuisine,
  };
}

async function readJson(url: string, fetchImpl: FetchLike, signal: AbortSignal): Promise<unknown> {
  const response = await fetchImpl(url, { signal });
  if (!response.ok) throw new Error(`Request failed ${response.status}`);
  return response.json();
}

function mealDbLines(raw: Record<string, string>): { name: string; amount: string }[] {
  const lines: { name: string; amount: string }[] = [];
  for (let i = 1; i <= 20; i += 1) {
    const name = (raw[`strIngredient${i}`] ?? '').trim();
    const amount = (raw[`strMeasure${i}`] ?? '').trim();
    if (!name) continue;
    lines.push({ name, amount: amount || 'to taste' });
  }
  return lines;
}

async function themealdbFilterIds(
  kind: 'i' | 'a',
  value: string,
  fetchImpl: FetchLike,
  signal: AbortSignal,
): Promise<string[]> {
  const query = kind === 'a' ? `a=${encodeURIComponent(value)}` : `i=${encodeURIComponent(value)}`;
  const list = (await readJson(
    `https://www.themealdb.com/api/json/v1/1/filter.php?${query}`,
    fetchImpl,
    signal,
  )) as { meals?: { idMeal: string }[] | null };
  return (list.meals ?? []).map((row) => row.idMeal);
}

async function lookupThemealdb(
  ids: string[],
  fetchImpl: FetchLike,
  signal: AbortSignal,
): Promise<Recipe[]> {
  const details = await Promise.all(
    ids.map(async (id) => {
      try {
        const body = (await readJson(
          `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`,
          fetchImpl,
          signal,
        )) as { meals?: Record<string, string>[] | null };
        return body.meals?.[0] ?? null;
      } catch {
        return null;
      }
    }),
  );
  const found: Recipe[] = [];
  for (const raw of details) {
    if (!raw) continue;
    if (isNonDinnerSweetOrDrink(raw.strCategory)) continue;
    const recipe = toRecipe({
      source: 'themealdb',
      id: `themealdb:${raw.idMeal}`,
      title: raw.strMeal,
      photoUri: raw.strMealThumb,
      minutes: 30,
      servings: 2,
      category: raw.strCategory,
      cuisine: cuisineFromArea(raw.strArea),
      ingredients: mealDbLines(raw),
      steps: (raw.strInstructions ?? '').split(/\r?\n/).filter((line) => line.trim()),
    });
    if (recipe) found.push(recipe);
  }
  return found;
}

export async function fetchThemealdbMeals(
  terms: string[],
  fetchImpl: FetchLike,
  signal: AbortSignal,
  cuisine: Cuisine = 'any',
): Promise<Recipe[]> {
  const areas = themealdbAreas(cuisine);
  if (areas.length) {
    const areaLists = await Promise.all(
      areas.slice(0, 3).map((area) => themealdbFilterIds('a', area, fetchImpl, signal)),
    );
    const areaIds = new Set(areaLists.flat());
    const preferred: string[] = [];
    const seen = new Set<string>();
    for (const term of terms.slice(0, 3)) {
      const ingredientIds = await themealdbFilterIds('i', term, fetchImpl, signal);
      for (const id of ingredientIds) {
        if (!areaIds.has(id) || seen.has(id)) continue;
        seen.add(id);
        preferred.push(id);
      }
    }
    const rest = [...areaIds].filter((id) => !seen.has(id));
    const ids = [...preferred, ...rest].slice(0, 8);
    return lookupThemealdb(ids, fetchImpl, signal);
  }

  const found = new Map<string, Recipe>();
  for (const term of terms.slice(0, 2)) {
    const ids = (await themealdbFilterIds('i', term, fetchImpl, signal)).slice(0, 4);
    const recipes = await lookupThemealdb(ids, fetchImpl, signal);
    for (const recipe of recipes) found.set(recipe.id, recipe);
  }
  return [...found.values()];
}

type DummyjsonRecipe = {
  id: number;
  name: string;
  image?: string;
  cookTimeMinutes?: number;
  prepTimeMinutes?: number;
  servings?: number;
  tags?: string[];
  cuisine?: string;
  mealType?: string[];
  ingredients?: string[];
  instructions?: string[];
};

function dummyjsonToRecipe(row: DummyjsonRecipe): Recipe | null {
  if (isNonDinnerSweetOrDrink(undefined, row.mealType ?? [])) {
    return null;
  }
  return toRecipe({
    source: 'dummyjson',
    id: `dummyjson:${row.id}`,
    title: row.name,
    photoUri: row.image,
    minutes: (row.prepTimeMinutes ?? 0) + (row.cookTimeMinutes ?? 0) || 25,
    servings: row.servings ?? 2,
    category: row.tags?.[0],
    cuisine: cuisineFromDummyjson(row.cuisine, row.tags),
    ingredients: (row.ingredients ?? []).map((name) => ({ name, amount: 'to taste' })),
    steps: row.instructions ?? [],
  });
}

export async function fetchDummyjsonMeals(
  terms: string[],
  fetchImpl: FetchLike,
  signal: AbortSignal,
  cuisine: Cuisine = 'any',
): Promise<Recipe[]> {
  const found = new Map<string, Recipe>();
  const wanted = dummyjsonCuisineNames(cuisine).map((name) => name.toLowerCase());

  if (wanted.length) {
    try {
      const body = (await readJson(
        'https://dummyjson.com/recipes?limit=50',
        fetchImpl,
        signal,
      )) as { recipes?: DummyjsonRecipe[] };
      for (const row of body.recipes ?? []) {
        const name = (row.cuisine ?? '').toLowerCase();
        const tags = (row.tags ?? []).map((tag) => tag.toLowerCase());
        if (!wanted.includes(name) && !tags.some((tag) => wanted.includes(tag))) continue;
        const recipe = dummyjsonToRecipe(row);
        if (recipe) found.set(recipe.id, recipe);
      }
    } catch {
      // Ingredient search below still runs.
    }
  }

  for (const term of terms.slice(0, 2)) {
    const body = (await readJson(
      `https://dummyjson.com/recipes/search?q=${encodeURIComponent(term)}&limit=6`,
      fetchImpl,
      signal,
    )) as { recipes?: DummyjsonRecipe[] };
    for (const row of body.recipes ?? []) {
      if (wanted.length) {
        const name = (row.cuisine ?? '').toLowerCase();
        const tags = (row.tags ?? []).map((tag) => tag.toLowerCase());
        if (!wanted.includes(name) && !tags.some((tag) => wanted.includes(tag))) continue;
      }
      const recipe = dummyjsonToRecipe(row);
      if (recipe) found.set(recipe.id, recipe);
    }
  }
  return [...found.values()];
}

export async function fetchRemoteRecipes(
  terms: string[],
  fetchImpl: FetchLike = fetch,
  timeoutMs = 4500,
  cuisine: Cuisine = 'any',
): Promise<Recipe[]> {
  if (terms.length === 0 && cuisine === 'any') return [];
  const controller = new AbortController();
  const wait = cuisine === 'any' ? timeoutMs : Math.max(timeoutMs, 6000);
  const timer = setTimeout(() => controller.abort(), wait);
  try {
    const settled = await Promise.allSettled([
      fetchThemealdbMeals(terms, fetchImpl, controller.signal, cuisine),
      fetchDummyjsonMeals(terms, fetchImpl, controller.signal, cuisine),
    ]);
    return settled.flatMap((row) => (row.status === 'fulfilled' ? row.value : []));
  } finally {
    clearTimeout(timer);
  }
}
