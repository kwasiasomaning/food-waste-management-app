import { formatCookQty, parseCookNumber, scaleAmount, servingLabel } from './servings';

describe('scaleAmount', () => {
  it('scales a recipe written for 2 up to 3 people', () => {
    expect(scaleAmount('2', 2, 3)).toBe('3');
    expect(scaleAmount('6', 2, 3)).toBe('9');
    expect(scaleAmount('200g', 2, 3)).toBe('300g');
    expect(scaleAmount('1 handful', 2, 3)).toBe('1½ handful');
    expect(scaleAmount('1/2, sliced', 2, 3)).toBe('¾, sliced');
  });

  it('leaves qualitative amounts alone', () => {
    expect(scaleAmount('a heap', 2, 3)).toBe('a heap');
    expect(scaleAmount('a few slices, if you have it', 2, 3)).toBe('a few slices, if you have it');
    expect(scaleAmount('to taste', 2, 4)).toBe('to taste');
  });

  it('does not change amounts when the household matches the recipe', () => {
    expect(scaleAmount('2', 2, 2)).toBe('2');
  });
});

describe('cook numbers', () => {
  it('parses mixed numbers and formats friendly fractions', () => {
    expect(parseCookNumber('1 1/2')).toBe(1.5);
    expect(formatCookQty(1.5)).toBe('1½');
    expect(formatCookQty(3)).toBe('3');
  });

  it('labels servings from household size', () => {
    expect(servingLabel(1)).toBe('serves 1');
    expect(servingLabel(3)).toBe('serves 3');
  });
});
