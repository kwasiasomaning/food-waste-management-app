import { ingredientIdFromName, searchTermForIngredient, urgentSearchTerms } from './mealMatch';

describe('ingredientIdFromName', () => {
  it('maps common recipe-line names onto the pantry catalog', () => {
    expect(ingredientIdFromName('chicken breast')).toBe('chicken-breast');
    expect(ingredientIdFromName('Baby spinach')).toBe('spinach');
    expect(ingredientIdFromName('minced beef')).toBe('ground-beef');
    expect(ingredientIdFromName('Fettuccine pasta')).toBe('pasta');
    expect(ingredientIdFromName('olive oil')).toBe('olive-oil');
    expect(ingredientIdFromName('Scotch bonnet')).toBe('chili');
    expect(ingredientIdFromName('ripe plantain')).toBe('plantain');
    expect(ingredientIdFromName('black-eyed peas')).toBe('black-eyed-peas');
    expect(ingredientIdFromName('red palm oil')).toBe('palm-oil');
    expect(ingredientIdFromName('okro')).toBe('okra');
    expect(ingredientIdFromName('white yam')).toBe('yam');
  });
});

describe('urgentSearchTerms', () => {
  it('turns dying pantry items into API search words', () => {
    expect(searchTermForIngredient('chicken-thighs')).toBe('chicken');
    expect(
      urgentSearchTerms([{ ingredientId: 'spinach' }, { ingredientId: 'leftover-rice' }], 2),
    ).toEqual(['spinach', 'rice']);
  });
});
