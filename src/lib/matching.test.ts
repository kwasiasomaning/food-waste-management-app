import { INGREDIENT_MAP } from '../data/ingredients';
import { RECIPES } from '../data/recipes';
import type { PantryItem } from '../types';
import { addDaysIso } from './dates';
import { tagsFor } from '../data/ingredientTags';
import { scoreRecipe, suggestDinners } from './matching';
import { starterPantry } from './starterPantry';

function item(ingredientId: string, days: number): PantryItem {
  return {
    id: `p_${ingredientId}`,
    ingredientId,
    addedAt: new Date().toISOString(),
    expiresAt: addDaysIso(days),
    source: 'manual',
  };
}

describe('scoreRecipe', () => {
  it('ranks the dinner that uses dying food first', () => {
    const pantry = [
      item('spinach', 0.5),
      item('eggs', 10),
      item('onion', 12),
      item('pasta', 200),
    ];
    const frittata = RECIPES.find((row) => row.id === 'spinach-frittata');
    const pasta = RECIPES.find((row) => row.id === 'aglio-spinach-pasta');
    expect(frittata && pasta).toBeTruthy();
    const a = scoreRecipe(frittata!, pantry, 'omnivore');
    const b = scoreRecipe(pasta!, pantry, 'omnivore');
    expect(a?.expiringUsed).toContain('spinach');
    expect(a!.score).toBeGreaterThan(0);
    expect(b!.score).toBeGreaterThan(0);
  });

  it('does not treat staples as missing', () => {
    const pantry = [item('eggs', 5), item('spinach', 2), item('onion', 8)];
    const scored = scoreRecipe(
      RECIPES.find((row) => row.id === 'spinach-frittata')!,
      pantry,
      'vegetarian',
    );
    expect(scored).not.toBeNull();
    expect(scored!.missing).not.toContain('salt');
    expect(scored!.missing).not.toContain('pepper');
  });

  it('returns null when the diet does not allow the recipe', () => {
    const pantry = [item('chicken-thighs', 1), item('lemon', 4)];
    const scored = scoreRecipe(
      RECIPES.find((row) => row.id === 'chicken-rice-bowl')!,
      pantry,
      'vegan',
    );
    expect(scored).toBeNull();
  });

  it('returns null when more than two required items are missing', () => {
    const pantry = [item('eggs', 4)];
    const scored = scoreRecipe(
      RECIPES.find((row) => row.id === 'beef-pasta')!,
      pantry,
      'omnivore',
    );
    expect(scored).toBeNull();
  });
});

describe('recipe catalog', () => {
  it('only references known ingredients', () => {
    for (const recipe of RECIPES) {
      for (const line of recipe.ingredients) {
        expect(INGREDIENT_MAP[line.ingredientId]).toBeDefined();
      }
    }
  });
});

describe('suggestDinners', () => {
  it('returns three cookable dinners from a typical fridge', () => {
    const suggestions = suggestDinners(starterPantry(), 'omnivore', 3);
    expect(suggestions).toHaveLength(3);
    expect(suggestions[0].have.length).toBeGreaterThan(0);
    expect(suggestions[0].expiringUsed.length + suggestions[0].soonUsed.length).toBeGreaterThan(0);
    const ids = suggestions.map((row) => row.recipe.id);
    expect(new Set(ids).size).toBe(3);
  });

  it('only returns vegan dinners for vegans', () => {
    const suggestions = suggestDinners(starterPantry(), 'vegan', 5);
    expect(suggestions.length).toBeGreaterThan(0);
    const banned = new Set(['meat', 'poultry', 'pork', 'beef', 'seafood', 'shellfish', 'dairy', 'egg', 'honey']);
    for (const row of suggestions) {
      for (const line of row.recipe.ingredients) {
        if (line.optional) continue;
        expect(tagsFor(line.ingredientId).some((tag) => banned.has(tag))).toBe(false);
      }
    }
  });

  it('lets pescatarians use fish dinners from a typical fridge when they fit', () => {
    const suggestions = suggestDinners(
      [...starterPantry(), item('salmon', 1), item('tuna', 20)],
      'pescatarian',
      8,
    );
    expect(suggestions.every((row) => !row.recipe.ingredients.some((line) => line.ingredientId.includes('chicken') || line.ingredientId === 'ground-beef' || line.ingredientId === 'bacon'))).toBe(true);
  });

  it('puts Italian pantry dinners first when that cuisine is chosen', () => {
    const suggestions = suggestDinners(starterPantry(), 'omnivore', 3, Date.now(), 'italian');
    expect(suggestions.length).toBeGreaterThan(0);
    expect(suggestions.every((row) => row.recipe.cuisine === 'italian')).toBe(true);
    expect(suggestions.some((row) => row.recipe.id === 'spinach-frittata' || row.recipe.id === 'aglio-spinach-pasta')).toBe(true);
  });

  it('puts Nigerian pantry dinners first when that cuisine is chosen', () => {
    const suggestions = suggestDinners(starterPantry(), 'omnivore', 3, Date.now(), 'nigerian');
    expect(suggestions).toHaveLength(3);
    expect(suggestions.every((row) => row.recipe.cuisine === 'nigerian')).toBe(true);
    expect(suggestions.some((row) => row.recipe.id === 'efo-spinach-stew' || row.recipe.id === 'tomato-jollof')).toBe(
      true,
    );
  });

  it('puts Ghanaian pantry dinners first when that cuisine is chosen', () => {
    const suggestions = suggestDinners(starterPantry(), 'omnivore', 3, Date.now(), 'ghanaian');
    expect(suggestions).toHaveLength(3);
    expect(suggestions.every((row) => row.recipe.cuisine === 'ghanaian')).toBe(true);
    expect(
      suggestions.some((row) => row.recipe.id === 'kontomire-stew' || row.recipe.id === 'ghanaian-jollof'),
    ).toBe(true);
  });

  it('still fills from the fridge when too few cuisine matches exist', () => {
    const suggestions = suggestDinners(starterPantry(), 'omnivore', 3, Date.now(), 'japanese');
    expect(suggestions).toHaveLength(3);
    expect(suggestions[0].have.length).toBeGreaterThan(0);
  });
});
