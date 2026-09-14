import { fetchDummyjsonMeals, fetchRemoteRecipes, fetchThemealdbMeals } from './mealSources';

function jsonResponse(body: unknown): Response {
  return { ok: true, json: async () => body } as Response;
}

function mealLookup(id: string, area: string, ingredient: string) {
  return {
    idMeal: id,
    strMeal: area === 'Italian' ? 'Spinach Linguine' : 'Fried Rice',
    strMealThumb: `https://example.com/${id}.jpg`,
    strCategory: 'Vegetarian',
    strArea: area,
    strInstructions: 'Boil the pasta.\nToss with spinach.',
    strIngredient1: ingredient,
    strMeasure1: '1 handful',
    strIngredient2: 'onion',
    strMeasure2: '1',
  };
}

describe('fetchThemealdbMeals', () => {
  it('looks up TheMealDB dinners that match both the pantry and the cuisine', async () => {
    const fetchImpl: typeof fetch = async (url) => {
      const href = String(url);
      if (href.includes('filter.php?a=Italian')) {
        return jsonResponse({ meals: [{ idMeal: '111' }, { idMeal: '222' }] });
      }
      if (href.includes('filter.php?i=spinach')) {
        return jsonResponse({ meals: [{ idMeal: '111' }, { idMeal: '999' }] });
      }
      if (href.includes('lookup.php?i=111')) {
        return jsonResponse({ meals: [mealLookup('111', 'Italian', 'spinach')] });
      }
      if (href.includes('lookup.php?i=222')) {
        return jsonResponse({ meals: [mealLookup('222', 'Italian', 'tomato')] });
      }
      throw new Error(`unexpected ${href}`);
    };

    const meals = await fetchThemealdbMeals(['spinach'], fetchImpl, new AbortController().signal, 'italian');
    expect(meals.map((row) => row.id)).toEqual(['themealdb:111', 'themealdb:222']);
    expect(meals[0].cuisine).toBe('italian');
    expect(meals[0].subtitle).toMatch(/Italian/);
    expect(meals[0].steps.length).toBeGreaterThan(0);
  });
});

describe('fetchDummyjsonMeals', () => {
  it('keeps DummyJSON dinners in the chosen cuisine and skips dessert', async () => {
    const fetchImpl: typeof fetch = async (url) => {
      const href = String(url);
      if (href.includes('/recipes?limit=50')) {
        return jsonResponse({
          recipes: [
            {
              id: 46,
              name: 'Pesto Pasta',
              cuisine: 'Italian',
              tags: ['Italian'],
              mealType: ['Dinner'],
              ingredients: ['pasta', 'basil', 'tomato'],
              instructions: ['Boil pasta.', 'Toss with pesto.'],
            },
            {
              id: 23,
              name: 'Italian Tiramisu',
              cuisine: 'Italian',
              tags: ['Tiramisu', 'Italian'],
              mealType: ['Dessert'],
              ingredients: ['espresso', 'sugar'],
              instructions: ['Whip cream.'],
            },
          ],
        });
      }
      if (href.includes('/recipes/search')) {
        return jsonResponse({ recipes: [] });
      }
      throw new Error(`unexpected ${href}`);
    };

    const meals = await fetchDummyjsonMeals(['pasta'], fetchImpl, new AbortController().signal, 'italian');
    expect(meals.map((row) => row.id)).toEqual(['dummyjson:46']);
    expect(meals[0].cuisine).toBe('italian');
  });
});

describe('fetchRemoteRecipes', () => {
  it('still queries TheMealDB by area when the cuisine is set', async () => {
    const seen: string[] = [];
    const fetchImpl: typeof fetch = async (url) => {
      const href = String(url);
      seen.push(href);
      if (href.includes('filter.php?a=Italian')) {
        return jsonResponse({ meals: [{ idMeal: '111' }] });
      }
      if (href.includes('filter.php?i=')) {
        return jsonResponse({ meals: [] });
      }
      if (href.includes('lookup.php?i=111')) {
        return jsonResponse({ meals: [mealLookup('111', 'Italian', 'spinach')] });
      }
      if (href.includes('dummyjson.com')) {
        return jsonResponse({ recipes: [] });
      }
      throw new Error(`unexpected ${href}`);
    };

    const meals = await fetchRemoteRecipes(['spinach'], fetchImpl, 2000, 'italian');
    expect(seen.some((href) => href.includes('filter.php?a=Italian'))).toBe(true);
    expect(meals.some((row) => row.cuisine === 'italian')).toBe(true);
  });
});
