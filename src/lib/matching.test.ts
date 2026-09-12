import { INGREDIENT_MAP } from '../data/ingredients';
import { RECIPES } from '../data/recipes';
import type { PantryItem } from '../types';
import { addDaysIso } from './dates';
import { dietAllows, scoreRecipe, suggestDinners } from './matching';
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

describe('dietAllows', () => {
  it('lets omnivores see everything', () => {
    expect(dietAllows('vegan', 'omnivore')).toBe(true);
    expect(dietAllows('omnivore', 'omnivore')).toBe(true);
  });

  it('hides meat from vegetarians and vegans', () => {
    expect(dietAllows('omnivore', 'vegetarian')).toBe(false);
    expect(dietAllows('vegetarian', 'vegan')).toBe(false);
    expect(dietAllows('vegan', 'vegan')).toBe(true);
  });
});

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
    expect(suggestions.every((row) => row.recipe.diet === 'vegan')).toBe(true);
  });
});
