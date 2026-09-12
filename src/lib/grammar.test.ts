import { countedNoun } from './grammar';

describe('countedNoun', () => {
  it('uses the singular label for one', () => {
    expect(countedNoun(1, 'dinner cooked', 'dinners cooked')).toBe('dinner cooked');
    expect(countedNoun(1, 'item used', 'items used')).toBe('item used');
    expect(countedNoun(1, 'item binned', 'items binned')).toBe('item binned');
    expect(countedNoun(1, 'meal thrown away', 'meals thrown away')).toBe('meal thrown away');
  });

  it('uses the plural label for zero and many', () => {
    expect(countedNoun(0, 'dinner cooked', 'dinners cooked')).toBe('dinners cooked');
    expect(countedNoun(2, 'dinner cooked', 'dinners cooked')).toBe('dinners cooked');
    expect(countedNoun(2, 'item used', 'items used')).toBe('items used');
    expect(countedNoun(3, 'item binned', 'items binned')).toBe('items binned');
    expect(countedNoun(4, 'meal thrown away', 'meals thrown away')).toBe('meals thrown away');
  });
});
