import { tagsFor } from '../data/ingredientTags';
import type { Recipe, RecipeDiet, RecipeIngredient, RecipeSource } from '../types';
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
  ingredients: { name: string; amount: string }[];
  steps: string[];
};

const MEAT_WORDS = /\b(chicken|beef|pork|bacon|ham|lamb|turkey|sausage|chorizo|steak|meat)\b/i;
const FISH_WORDS = /\b(salmon|tuna|shrimp|prawn|fish|cod|anchovy)\b/i;
const DAIRY_WORDS = /\b(cheese|milk|butter|cream|yogurt|yoghurt|parmesan|cheddar|feta)\b/i;
const EGG_WORDS = /\b(egg|eggs)\b/i;

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
  const steps = meal.steps.map((step) => step.trim()).filter(Boolean);
  return {
    id: meal.id,
    title: meal.title,
    subtitle: 'From another kitchen, using what you already have.',
    minutes: Math.max(10, meal.minutes || 25),
    servings: meal.servings || 2,
    diet,
    emoji: '🍽️',
    plate: '#E8DCCB',
    ingredients,
    steps: steps.length ? steps : ['Cook it hot. Season. Eat it tonight.'],
    rescue: 'Suggested because it uses food already in your fridge.',
    source: meal.source,
    photoUri: meal.photoUri,
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

export async function fetchThemealdbMeals(
  terms: string[],
  fetchImpl: FetchLike,
  signal: AbortSignal,
): Promise<Recipe[]> {
  const found = new Map<string, Recipe>();
  for (const term of terms.slice(0, 2)) {
    const list = (await readJson(
      `https://www.themealdb.com/api/json/v1/1/filter.php?i=${encodeURIComponent(term)}`,
      fetchImpl,
      signal,
    )) as { meals?: { idMeal: string }[] | null };
    const ids = (list.meals ?? []).slice(0, 4).map((row) => row.idMeal);
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
    for (const raw of details) {
      if (!raw) continue;
      const recipe = toRecipe({
        source: 'themealdb',
        id: `themealdb:${raw.idMeal}`,
        title: raw.strMeal,
        photoUri: raw.strMealThumb,
        minutes: 30,
        servings: 2,
        category: raw.strCategory,
        ingredients: mealDbLines(raw),
        steps: (raw.strInstructions ?? '').split(/\r?\n/).filter((line) => line.trim()),
      });
      if (recipe) found.set(recipe.id, recipe);
    }
  }
  return [...found.values()];
}

export async function fetchDummyjsonMeals(
  terms: string[],
  fetchImpl: FetchLike,
  signal: AbortSignal,
): Promise<Recipe[]> {
  const found = new Map<string, Recipe>();
  for (const term of terms.slice(0, 2)) {
    const body = (await readJson(
      `https://dummyjson.com/recipes/search?q=${encodeURIComponent(term)}&limit=6`,
      fetchImpl,
      signal,
    )) as {
      recipes?: {
        id: number;
        name: string;
        image?: string;
        cookTimeMinutes?: number;
        prepTimeMinutes?: number;
        servings?: number;
        tags?: string[];
        ingredients?: string[];
        instructions?: string[];
      }[];
    };
    for (const row of body.recipes ?? []) {
      const recipe = toRecipe({
        source: 'dummyjson',
        id: `dummyjson:${row.id}`,
        title: row.name,
        photoUri: row.image,
        minutes: (row.prepTimeMinutes ?? 0) + (row.cookTimeMinutes ?? 0) || 25,
        servings: row.servings ?? 2,
        category: row.tags?.[0],
        ingredients: (row.ingredients ?? []).map((name) => ({ name, amount: 'to taste' })),
        steps: row.instructions ?? [],
      });
      if (recipe) found.set(recipe.id, recipe);
    }
  }
  return [...found.values()];
}

export async function fetchRemoteRecipes(
  terms: string[],
  fetchImpl: FetchLike = fetch,
  timeoutMs = 4500,
): Promise<Recipe[]> {
  if (terms.length === 0) return [];
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const settled = await Promise.allSettled([
      fetchThemealdbMeals(terms, fetchImpl, controller.signal),
      fetchDummyjsonMeals(terms, fetchImpl, controller.signal),
    ]);
    return settled.flatMap((row) => (row.status === 'fulfilled' ? row.value : []));
  } finally {
    clearTimeout(timer);
  }
}
