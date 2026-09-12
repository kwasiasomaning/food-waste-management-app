import { estimateSavings, estimateWaste, formatKg, formatMoney, mealsEquivalent } from './savings';

describe('estimateWaste', () => {
  it('counts the full grocery price of a binned item', () => {
    expect(estimateWaste('spinach')).toEqual({ lostUsd: 3.2, lostKg: 0.15 });
  });

  it('ignores staples', () => {
    expect(estimateWaste('salt')).toEqual({ lostUsd: 0, lostKg: 0 });
  });
});

describe('estimateSavings', () => {
  it('ignores staples and unknown ids', () => {
    expect(estimateSavings(['salt', 'olive-oil', 'nope'])).toEqual({
      savedUsd: 0,
      savedKg: 0,
    });
  });

  it('counts perishable ingredients once', () => {
    const once = estimateSavings(['spinach', 'eggs']);
    const twice = estimateSavings(['spinach', 'eggs', 'spinach']);
    expect(once).toEqual(twice);
    expect(once.savedUsd).toBeGreaterThan(2);
    expect(once.savedKg).toBeGreaterThan(0.1);
  });
});

describe('formatters', () => {
  it('formats money and small weights', () => {
    expect(formatMoney(4.2)).toBe('$4.20');
    expect(formatKg(0.25)).toBe('250 g');
    expect(formatKg(1.5)).toBe('1.5 kg');
    expect(mealsEquivalent(0.8)).toBe(2);
  });
});
