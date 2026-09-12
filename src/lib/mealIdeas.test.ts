import { RECIPES } from '../data/recipes';
import { mergeDinnerIdeas } from './mealIdeas';
import type { ScoredRecipe } from '../types';

function scored(id: string, score: number, source: 'house' | 'themealdb' = 'house'): ScoredRecipe {
  const house = RECIPES.find((row) => row.id === id) ?? RECIPES[0];
  return {
    recipe: source === 'house' ? house : { ...house, id: `remote-${id}`, source, title: house.title + ' extra' },
    score,
    have: ['eggs'],
    missing: [],
    expiringUsed: [],
    soonUsed: [],
    matchRatio: 1,
  };
}

describe('mergeDinnerIdeas', () => {
  it('keeps the highest-scoring unique dinners across sources', () => {
    const merged = mergeDinnerIdeas(
      [
        [scored('spinach-frittata', 40), scored('tomato-bread-supper', 20)],
        [scored('leftover-fried-rice', 50, 'themealdb')],
      ],
      2,
    );
    expect(merged).toHaveLength(2);
    expect(merged[0].recipe.id).toBe('remote-leftover-fried-rice');
    expect(merged[1].recipe.id).toBe('spinach-frittata');
  });
});
