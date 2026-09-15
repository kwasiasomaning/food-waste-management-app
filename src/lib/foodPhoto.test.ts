import { INGREDIENTS } from '../data/ingredients';
import { RECIPES } from '../data/recipes';

import { hasMappedIngredientPhoto, photoForIngredient, photoForRecipe } from './foodPhoto';

const WEST_AFRICA_STILLS = {
  'tomato-jollof': 'meal-jollof-ng',
  'nigerian-egg-stew': 'meal-egg-stew-ng',
  'efo-spinach-stew': 'meal-efo',
  'suya-chicken': 'meal-suya',
  'yam-egg-sauce': 'meal-yam-egg',
  'ghanaian-jollof': 'meal-jollof-gh',
  'ghanaian-egg-stew': 'meal-egg-stew-gh',
  'kontomire-stew': 'meal-kontomire',
  'red-red': 'meal-red-red',
  'okra-stew': 'meal-okra-stew',
} as const;

describe('photoForRecipe', () => {
  it('picks a plated meal still that matches the dinner', () => {
    expect(photoForRecipe({ id: 'tomato-bread-supper', title: 'Tomato bread' })).toBe('meal-toast');
    expect(photoForRecipe({ id: 'leftover-fried-rice', title: 'Fried rice' })).toBe(
      'meal-fried-rice',
    );
    expect(photoForRecipe({ id: 'spinach-frittata', title: 'Spinach frittata' })).toBe(
      'meal-frittata',
    );
    expect(photoForRecipe({ id: 'salmon-lemon', title: 'Lemon salmon' })).toBe('meal-fish');
    expect(photoForRecipe({ id: 'chicken-tacos', title: 'Chicken tacos' })).toBe('meal-tacos');
    expect(photoForRecipe({ id: 'tomato-jollof', title: 'Tomato jollof' })).toBe('meal-jollof-ng');
    expect(photoForRecipe({ id: 'nigerian-egg-stew', title: 'Egg stew with rice' })).toBe(
      'meal-egg-stew-ng',
    );
    expect(photoForRecipe({ id: 'efo-spinach-stew', title: 'Spinach pepper stew' })).toBe('meal-efo');
    expect(photoForRecipe({ id: 'suya-chicken', title: 'Suya-spiced chicken' })).toBe('meal-suya');
    expect(photoForRecipe({ id: 'yam-egg-sauce', title: 'Yam and egg sauce' })).toBe('meal-yam-egg');
    expect(photoForRecipe({ id: 'ghanaian-jollof', title: 'Ghanaian jollof' })).toBe('meal-jollof-gh');
    expect(photoForRecipe({ id: 'ghanaian-egg-stew', title: 'Ghanaian egg stew' })).toBe(
      'meal-egg-stew-gh',
    );
    expect(photoForRecipe({ id: 'kontomire-stew', title: 'Kontomire spinach stew' })).toBe(
      'meal-kontomire',
    );
    expect(photoForRecipe({ id: 'red-red', title: 'Red red beans' })).toBe('meal-red-red');
    expect(photoForRecipe({ id: 'okra-stew', title: 'Okra tomato stew' })).toBe('meal-okra-stew');
    expect(photoForRecipe({ id: 'bell-pepper-pasta', title: 'Pasta' })).toBe('meal-pasta');
  });

  it('gives every Nigerian and Ghanaian house dinner its own plated still', () => {
    const west = RECIPES.filter(
      (recipe) => recipe.cuisine === 'nigerian' || recipe.cuisine === 'ghanaian',
    );
    expect(west.map((recipe) => recipe.id).sort()).toEqual(Object.keys(WEST_AFRICA_STILLS).sort());
    for (const recipe of west) {
      expect(photoForRecipe(recipe)).toBe(
        WEST_AFRICA_STILLS[recipe.id as keyof typeof WEST_AFRICA_STILLS],
      );
    }
  });
});

describe('photoForIngredient', () => {
  it('maps families to editorial stills instead of emoji', () => {
    expect(photoForIngredient({ id: 'spinach' })).toBe('ing-greens');
    expect(photoForIngredient({ id: 'tomato' })).toBe('ing-tomato');
    expect(photoForIngredient({ id: 'bell-pepper' })).toBe('ing-pepper');
    expect(photoForIngredient({ id: 'cucumber' })).toBe('ing-cucumber');
    expect(photoForIngredient({ id: 'carrot' })).toBe('ing-carrot');
    expect(photoForIngredient({ id: 'avocado' })).toBe('ing-avocado');
    expect(photoForIngredient({ id: 'broccoli' })).toBe('ing-broccoli');
    expect(photoForIngredient({ id: 'eggs' })).toBe('ing-eggs');
    expect(photoForIngredient({ id: 'cheddar' })).toBe('ing-dairy');
    expect(photoForIngredient({ id: 'yogurt' })).toBe('ing-yogurt');
    expect(photoForIngredient({ id: 'salmon' })).toBe('ing-fish');
    expect(photoForIngredient({ id: 'shrimp' })).toBe('ing-shrimp');
    expect(photoForIngredient({ id: 'ground-beef' })).toBe('ing-beef');
    expect(photoForIngredient({ id: 'leftover-rice' })).toBe('ing-grain');
    expect(photoForIngredient({ id: 'chickpeas' })).toBe('ing-beans');
    expect(photoForIngredient({ id: 'plantain' })).toBe('ing-banana');
    expect(photoForIngredient({ id: 'yam' })).toBe('ing-potato');
    expect(photoForIngredient({ id: 'okra' })).toBe('ing-zucchini');
    expect(photoForIngredient({ id: 'black-eyed-peas' })).toBe('ing-beans');
    expect(photoForIngredient({ id: 'palm-oil' })).toBe('ing-oil');
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
    expect(photoForIngredient({ id: 'mystery-veg' })).toBe('ing-greens');
  });
});
