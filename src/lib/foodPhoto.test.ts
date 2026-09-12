import { photoForRecipe } from './foodPhoto';

describe('photoForRecipe', () => {
  it('picks a still life from the recipe', () => {
    expect(photoForRecipe({ id: 'tomato-bread-supper', title: 'Tomato bread', emoji: '🍞' })).toBe(
      'bread',
    );
    expect(photoForRecipe({ id: 'leftover-fried-rice', title: 'Fried rice', emoji: '🍚' })).toBe(
      'bowl',
    );
    expect(photoForRecipe({ id: 'spinach-frittata', title: 'Spinach frittata', emoji: '🍳' })).toBe(
      'greens',
    );
    expect(photoForRecipe({ id: 'salmon-lemon', title: 'Lemon salmon', emoji: '🐟' })).toBe('citrus');
  });
});
