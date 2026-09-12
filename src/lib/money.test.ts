import { COUNTRIES, CURRENCY_MAP, currencyForCountry } from '../data/places';
import { convertUsd, formatMoney } from './money';

describe('places data', () => {
  it('maps every country to a known currency', () => {
    const missing = COUNTRIES.filter((country) => !CURRENCY_MAP[country.currency]).map(
      (country) => country.code,
    );
    expect(missing).toEqual([]);
  });

  it('returns a country default currency', () => {
    expect(currencyForCountry('GH')).toBe('GHS');
    expect(currencyForCountry('GB')).toBe('GBP');
    expect(currencyForCountry('nope')).toBe('USD');
  });
});

describe('convertUsd', () => {
  it('leaves dollars unchanged', () => {
    expect(convertUsd(4.2, 'USD')).toBe(4.2);
  });

  it('converts into another currency', () => {
    expect(convertUsd(10, 'GBP')).toBeCloseTo(7.4);
    expect(convertUsd(10, 'GHS')).toBeCloseTo(122);
  });
});

describe('formatMoney', () => {
  it('keeps the original US dollar format by default', () => {
    expect(formatMoney(4.2)).toBe('$4.20');
  });

  it('shows the selected currency symbol after conversion', () => {
    expect(formatMoney(10, 'GBP', 'GB')).toMatch(/£/);
    expect(formatMoney(10, 'EUR', 'DE')).toMatch(/€|EUR/);
    expect(formatMoney(10, 'GHS', 'GH')).toMatch(/GH₵|GHS/);
  });
});
