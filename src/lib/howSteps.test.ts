import { getIngredient } from '../data/ingredients';
import { RECIPES } from '../data/recipes';
import type { Diet, PantryItem } from '../types';
import { addDaysIso } from './dates';
import { howSteps } from './howSteps';
import { isRequired, suggestDinners } from './matching';
import { fetchDummyjsonMeals, fetchThemealdbMeals } from './mealSources';
import { starterPantry } from './starterPantry';

const COOKING_HINT =
  /\b(heat|cook|fry|boil|bake|roast|grill|toast|toss|stir|mix|mash|slice|add|pour|simmer|sweat|brown|sear|wilt|blend|steam|spread|pile|fold|scramble|char|render|reheat|warm|season|beat|press|lay|top|build|return|cover|crack|oil|pat|strip|massage|cut|sizzle|serve|eat|rest|flip|drain|wait|soften|tip|finish|salt|cube|get)\b/i;

const SKIP_HOW_WORDS = new Set(['leftover', 'canned', 'frozen', 'ground', 'fresh', 'white', 'ish']);

function item(ingredientId: string, days: number): PantryItem {
  return {
    id: `p_${ingredientId}`,
    ingredientId,
    addedAt: new Date().toISOString(),
    expiresAt: addDaysIso(days),
    source: 'manual',
  };
}

function expectDisplayableHow(steps: string[], label: string) {
  expect(steps.length).toBeGreaterThanOrEqual(2);
  steps.forEach((step, index) => {
    expect(`${label}: ${step}`).toEqual(expect.stringContaining(step));
    expect(step).toBe(step.trim());
    expect(step.length).toBeGreaterThanOrEqual(12);
    expect(step.length).toBeLessThanOrEqual(400);
    expect(step).not.toMatch(/^(?:step\s*)?\d+\s*[.):-]/i);
    expect(step).toMatch(/^[A-Z]/);
    expect(step).toMatch(/[.!?]$/);
    expect(step).not.toMatch(/<\/?[a-z]|\*\*/i);
    expect(`${index + 1}. ${step}`).not.toMatch(/^\d+\. \d+[.)]/);
  });
  expect(steps.join(' ')).toMatch(COOKING_HINT);
  expect(new Set(steps).size).toBe(steps.length);
  expect(howSteps(steps)).toEqual(steps);
}

function howMentionsIngredient(how: string, ingredientId: string): boolean {
  const ingredient = getIngredient(ingredientId);
  const blob = how.toLowerCase();
  const words = [ingredient.name, ...ingredient.aliases, ...ingredient.id.split('-')]
    .flatMap((value) => value.toLowerCase().split(/\s+/))
    .filter((word) => word.length >= 3 && !SKIP_HOW_WORDS.has(word));
  if (['cheddar', 'parmesan', 'mozzarella', 'feta'].includes(ingredientId)) {
    words.push('cheese');
  }
  const tokens = new Set(words);
  for (const word of words) {
    if (word.endsWith('s') && word.length > 4) tokens.add(word.slice(0, -1));
  }
  return [...tokens].some((word) => blob.includes(word));
}

function jsonResponse(body: unknown): Response {
  return { ok: true, json: async () => body } as Response;
}

describe('howSteps', () => {
  it('keeps house steps as written', () => {
    const house = [
      'Boil pasta in well-salted water.',
      'Toss until glossy. Parmesan and lemon if they are around.',
    ];
    expect(howSteps(house)).toEqual(house);
  });

  it('falls back when instructions are empty', () => {
    expect(howSteps([])).toEqual(['Cook it hot. Season. Eat it tonight.']);
    expect(howSteps('   ')).toEqual(['Cook it hot. Season. Eat it tonight.']);
    expect(howSteps(null)).toEqual(['Cook it hot. Season. Eat it tonight.']);
  });

  it('splits ThemealDB newlines and strips a leading asterisk', () => {
    const raw =
      'Preheat oven to 350° F. Spray a pan.\r\n*Meanwhile, steam the vegetables according to the packet.\r\nToss everything together.';
    expect(howSteps(raw)).toEqual([
      'Preheat oven to 350° F. Spray a pan.',
      'Meanwhile, steam the vegetables according to the packet.',
      'Toss everything together.',
    ]);
  });

  it('splits numbered lists and drops STEP headings so How is not double-numbered', () => {
    const raw = [
      'STEP 1',
      '1. Heat the oil.',
      'STEP 2',
      '2. Add the onions.',
      '3. Simmer until jammy.',
    ].join('\n');
    const steps = howSteps(raw);
    expect(steps).toEqual(['Heat the oil.', 'Add the onions.', 'Simmer until jammy.']);
    expectDisplayableHow(steps, 'numbered stew');
  });

  it('splits an inline 1. 2. 3. paragraph without breaking oven temperatures', () => {
    expect(howSteps('Preheat the oven to 150C/300F/Gas 2. Toss the beef in flour.')).toEqual([
      'Preheat the oven to 150C/300F/Gas 2. Toss the beef in flour.',
    ]);
    expect(howSteps('1. Heat the oil. 2. Add the onions. 3. Serve tonight.')).toEqual([
      'Heat the oil.',
      'Add the onions.',
      'Serve tonight.',
    ]);
  });

  it('strips HTML and markdown from remote copy', () => {
    expect(howSteps('1. Heat the <b>oil</b>.<br/>2. Add **onions** and cook.')).toEqual([
      'Heat the oil.',
      'Add onions and cook.',
    ]);
  });

  it('breaks a single wall of text into readable How steps', () => {
    const raw =
      'Chop the spice paste until fine. Heat the oil in a stew pot and stir-fry until aromatic. Add the beef and coconut milk and simmer, stirring frequently, until the meat is almost cooked. Lower the heat, cover, and cook until the gravy has dried. Serve immediately with steamed rice.';
    const steps = howSteps(raw);
    expect(steps.length).toBeGreaterThanOrEqual(3);
    expectDisplayableHow(steps, 'rendang blob');
  });

  it('ends a remote step with a period so How reads as a sentence', () => {
    expect(howSteps(['Serve with fresh bread', 'Rest the pan'])).toEqual([
      'Serve with fresh bread.',
      'Rest the pan.',
    ]);
  });

  it('splits long ThemealDB sections, including a bare 2/3/4 between paragraphs', () => {
    const raw = [
      'For the dough place lard, warm water and salt in a large kneading bowl and stir. Add flour and oregano and either knead five minutes by hand or with the kneading function of your machine. Let rest covered for at least half an hour or overnight in the fridge.',
      '2',
      'For the filling place tomatoes for about 30 seconds in boiling water, then cool with cold water and peel of skin and cut into cubes. Press garlic through garlic press, cut onions into cubes. Simmer garlic and onions in some olive oil until translucent. Take out onions and garlic and brown the meat at high heat from all sides.',
      '3',
      'Cut dough into half and roll out one half thinly on floured surface. Cut out circles about 12-15cm in diameter. Place filling on one circle and fold over so that you get half moons.',
      '4',
      'Meanwhile preheat oven to 200 degrees Celsius. Brush empanadas with egg wash and bake until golden. Serve warm with chimichurri sauce.',
    ].join('\n\n');
    const steps = howSteps(raw);
    expect(steps.some((step) => /^\d+$/.test(step))).toBe(false);
    expect(steps.length).toBeGreaterThanOrEqual(8);
    expect(steps.every((step) => step.length < 220)).toBe(true);
    expectDisplayableHow(steps, 'empanadas');
    expect(steps.join(' ').toLowerCase()).toMatch(/dough/);
    expect(steps.join(' ').toLowerCase()).toMatch(/filling|meat/);
  });
});

describe('house meal How', () => {
  it('is display-ready and mentions the food you actually cook', () => {
    expect(RECIPES.length).toBeGreaterThanOrEqual(40);
    for (const recipe of RECIPES) {
      const steps = howSteps(recipe.steps);
      expect(steps).toEqual(recipe.steps);
      expectDisplayableHow(steps, recipe.title);
      const how = steps.join(' ');
      const required = recipe.ingredients.filter((line) => isRequired(line.ingredientId, line.optional));
      const mentioned = required.filter((line) => howMentionsIngredient(how, line.ingredientId));
      const ratio = mentioned.length / required.length;
      if (ratio < 0.5) {
        throw new Error(
          `${recipe.id} How mentions ${mentioned.map((line) => line.ingredientId).join(', ') || '(none)'} of ${required
            .map((line) => line.ingredientId)
            .join(', ')} — ${how}`,
        );
      }
    }
  });
});

describe('suggested meal How', () => {
  const diets: Diet[] = ['omnivore', 'vegetarian', 'vegan', 'pescatarian'];

  it('shows coherent How on the three dinners from a typical fridge', () => {
    for (const diet of diets) {
      const suggestions = suggestDinners(starterPantry(), diet, 3);
      expect(suggestions.length).toBeGreaterThan(0);
      expect(suggestions.length).toBeLessThanOrEqual(3);
      for (const row of suggestions) {
        expectDisplayableHow(howSteps(row.recipe.steps), `${diet}:${row.recipe.title}`);
      }
    }
  });

  it('keeps a coherent How on every house meal that can be suggested', () => {
    for (const recipe of RECIPES) {
      const diet: Diet =
        recipe.diet === 'vegan' ? 'vegan' : recipe.diet === 'vegetarian' ? 'vegetarian' : 'omnivore';
      const pantry = recipe.ingredients.map((line, index) => item(line.ingredientId, index === 0 ? 0.5 : 5));
      const match = suggestDinners(pantry, diet, RECIPES.length).find((row) => row.recipe.id === recipe.id);
      expect(match).toBeTruthy();
      expectDisplayableHow(howSteps(match!.recipe.steps), recipe.title);
    }
  });
});

describe('remote suggested How', () => {
  it('normalizes ThemealDB instructions before they can be suggested', async () => {
    const fetchImpl: typeof fetch = async (url) => {
      const href = String(url);
      if (href.includes('filter.php')) {
        return jsonResponse({ meals: [{ idMeal: '9001' }] });
      }
      return jsonResponse({
        meals: [
          {
            idMeal: '9001',
            strMeal: 'Numbered Tomato Stew',
            strCategory: 'Vegetarian',
            strMealThumb: 'https://example.com/stew.jpg',
            strInstructions:
              'STEP 1\r\n1. Heat the oil.\r\n2. Add the onions and tomatoes.\r\n3. Simmer 10 minutes and serve.',
            strIngredient1: 'onion',
            strMeasure1: '1',
            strIngredient2: 'tomato',
            strMeasure2: '2',
          },
        ],
      });
    };
    const meals = await fetchThemealdbMeals(['tomato'], fetchImpl, new AbortController().signal);
    expect(meals).toHaveLength(1);
    expectDisplayableHow(meals[0].steps, meals[0].title);
    expect(meals[0].steps).toEqual([
      'Heat the oil.',
      'Add the onions and tomatoes.',
      'Simmer 10 minutes and serve.',
    ]);
  });

  it('passes DummyJSON steps through How unchanged when they are already clean', async () => {
    const fetchImpl: typeof fetch = async () =>
      jsonResponse({
        recipes: [
          {
            id: 7,
            name: 'Lemon Pasta',
            image: 'https://example.com/pasta.jpg',
            cookTimeMinutes: 12,
            servings: 2,
            tags: ['Pasta'],
            ingredients: ['pasta', 'lemon', 'garlic'],
            instructions: [
              'Boil the pasta in salted water.',
              'Warm garlic in oil, then toss with pasta and lemon.',
              'Serve immediately.',
            ],
          },
        ],
      });
    const meals = await fetchDummyjsonMeals(['pasta'], fetchImpl, new AbortController().signal);
    expect(meals).toHaveLength(1);
    expectDisplayableHow(meals[0].steps, meals[0].title);
  });
});
