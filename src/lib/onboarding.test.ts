import { itemsFromIds } from './starterPantry';
import { suggestDinners } from './matching';

describe('onboarding pantry setup', () => {
  it('builds first dinners from the fridge the person just logged', () => {
    const pantry = itemsFromIds(['spinach', 'eggs', 'bread', 'tomato', 'onion'], 'scan');
    const dinners = suggestDinners(pantry, 'omnivore', 3);
    expect(dinners.length).toBeGreaterThan(0);
    expect(dinners[0].have.length).toBeGreaterThan(0);
  });

  it('stays quiet when the pantry is still empty', () => {
    expect(suggestDinners([], 'omnivore', 3)).toEqual([]);
  });
});
