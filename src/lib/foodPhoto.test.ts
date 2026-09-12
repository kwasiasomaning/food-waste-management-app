import { INGREDIENTS } from '../data/ingredients';

import { hasMappedIngredientPhoto, photoForIngredient, photoForRecipe } from './foodPhoto';

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

describe('photoForIngredient', () => {
  it('maps families to editorial stills instead of emoji', () => {
    expect(photoForIngredient({ id: 'spinach' })).toBe('ing-greens');
    expect(photoForIngredient({ id: 'tomato' })).toBe('ing-tomato');
    expect(photoForIngredient({ id: 'eggs' })).toBe('ing-eggs');
    expect(photoForIngredient({ id: 'cheddar' })).toBe('ing-dairy');
    expect(photoForIngredient({ id: 'salmon' })).toBe('ing-fish');
    expect(photoForIngredient({ id: 'leftover-rice' })).toBe('ing-grain');
    expect(photoForIngredient({ id: 'chickpeas' })).toBe('ing-beans');
    expect(photoForIngredient({ id: 'olive-oil' })).toBe('ing-oil');
  });

  it('covers every catalog ingredient', () => {
    for (const item of INGREDIENTS) {
      expect(hasMappedIngredientPhoto(item.id)).toBe(true);
      expect(photoForIngredient(item).startsWith('ing-')).toBe(true);
    }
  });

  it('falls back by category for unknown ids', () => {
    expect(photoForIngredient({ id: 'mystery-cheese', category: 'dairy' })).toBe('ing-dairy');
    expect(photoForIngredient({ id: 'mystery-veg' })).toBe('ing-carrot');
  });
});
