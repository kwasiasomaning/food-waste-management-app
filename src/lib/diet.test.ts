import { RECIPES } from '../data/recipes';
import { dietAllows } from './diet';

function recipe(id: string) {
  const found = RECIPES.find((row) => row.id === id);
  if (!found) throw new Error(id);
  return found;
}

describe('dietAllows', () => {
  it('lets omnivores see meat, fish, and vegan dinners', () => {
    expect(dietAllows(recipe('chicken-rice-bowl'), 'omnivore')).toBe(true);
    expect(dietAllows(recipe('salmon-lemon'), 'omnivore')).toBe(true);
    expect(dietAllows(recipe('chickpea-tomato-skillet'), 'omnivore')).toBe(true);
  });

  it('hides meat and fish from vegetarians and vegans', () => {
    expect(dietAllows(recipe('chicken-rice-bowl'), 'vegetarian')).toBe(false);
    expect(dietAllows(recipe('salmon-lemon'), 'vegetarian')).toBe(false);
    expect(dietAllows(recipe('spinach-frittata'), 'vegetarian')).toBe(true);
    expect(dietAllows(recipe('spinach-frittata'), 'vegan')).toBe(false);
    expect(dietAllows(recipe('tomato-bread-supper'), 'vegan')).toBe(true);
  });

  it('lets pescatarians eat fish but not land meat', () => {
    expect(dietAllows(recipe('salmon-lemon'), 'pescatarian')).toBe(true);
    expect(dietAllows(recipe('tuna-pasta'), 'pescatarian')).toBe(true);
    expect(dietAllows(recipe('chicken-rice-bowl'), 'pescatarian')).toBe(false);
    expect(dietAllows(recipe('tomato-bread-supper'), 'pescatarian')).toBe(true);
  });

  it('filters gluten-free and dairy-free from ingredients', () => {
    expect(dietAllows(recipe('aglio-spinach-pasta'), 'gluten-free')).toBe(false);
    expect(dietAllows(recipe('salmon-lemon'), 'gluten-free')).toBe(true);
    expect(dietAllows(recipe('tomato-bread-supper'), 'dairy-free')).toBe(true);
    expect(dietAllows(recipe('grilled-cheese-tomato'), 'dairy-free')).toBe(false);
  });

  it('blocks pork for halal and beef for hindu', () => {
    expect(dietAllows(recipe('bacon-potato'), 'halal')).toBe(false);
    expect(dietAllows(recipe('chicken-rice-bowl'), 'halal')).toBe(true);
    expect(dietAllows(recipe('beef-pasta'), 'hindu')).toBe(false);
    expect(dietAllows(recipe('chicken-rice-bowl'), 'hindu')).toBe(true);
  });
});
