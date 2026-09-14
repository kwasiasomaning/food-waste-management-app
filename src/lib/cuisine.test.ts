import { cuisineLabel } from '../data/cuisines';
import type { Cuisine, ScoredRecipe } from '../types';
import {
  cuisineFromArea,
  cuisineFromDummyjson,
  cuisineMatches,
  pickCuisineFirst,
  themealdbAreas,
} from './cuisine';

function scored(id: string, score: number, cuisine?: Cuisine): ScoredRecipe {
  return {
    recipe: {
      id,
      title: id,
      subtitle: '',
      minutes: 20,
      servings: 2,
      diet: 'vegetarian',
      emoji: '🍳',
      plate: '#ccc',
      ingredients: [],
      steps: ['Cook.'],
      rescue: '',
      cuisine,
    },
    score,
    have: [],
    missing: [],
    expiringUsed: [],
    soonUsed: [],
    matchRatio: 1,
  };
}

describe('cuisine mapping', () => {
  it('maps ThemealDB areas and DummyJSON cuisine names', () => {
    expect(cuisineFromArea('Italian')).toBe('italian');
    expect(cuisineFromArea('Jamaican')).toBe('caribbean');
    expect(cuisineFromArea('Egyptian')).toBe('middle-eastern');
    expect(cuisineFromDummyjson('Pakistani')).toBe('indian');
    expect(cuisineFromDummyjson('Asian', ['Stir-fry'])).toBe('chinese');
    expect(cuisineFromDummyjson(undefined, ['Italian'])).toBe('italian');
    expect(themealdbAreas('mediterranean')).toEqual(['Italian', 'Greek', 'Spanish']);
    expect(cuisineLabel('italian')).toBe('Italian');
  });

  it('treats Italian as Mediterranean, but not the reverse', () => {
    expect(cuisineMatches('italian', 'mediterranean')).toBe(true);
    expect(cuisineMatches('mediterranean', 'italian')).toBe(false);
    expect(cuisineMatches('chinese', 'italian')).toBe(false);
    expect(cuisineMatches(undefined, 'any')).toBe(true);
    expect(cuisineMatches(undefined, 'italian')).toBe(false);
  });
});

describe('pickCuisineFirst', () => {
  it('keeps matching cuisine dinners ahead of the rest of the fridge', () => {
    const rows = [
      scored('fried-rice', 90, 'chinese'),
      scored('aglio', 40, 'italian'),
      scored('frittata', 38, 'italian'),
      scored('oats', 20),
    ];
    const picked = pickCuisineFirst(rows, 'italian', 3);
    expect(picked.map((row) => row.recipe.id)).toEqual(['aglio', 'frittata', 'fried-rice']);
  });
});
