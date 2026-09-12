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
    expect(formatMoney(10, 'GBP')).toMatch(/£/);
    expect(formatMoney(10, 'EUR')).toMatch(/€|EUR/);
    expect(formatMoney(10, 'GHS')).toMatch(/GH₵|GHS/);
  });

  it('formats dollars the same regardless of which country is stored', () => {
    expect(formatMoney(10, 'USD')).toBe('$10.00');
  });

  it('keeps tight amounts on one line for wide currency signs', () => {
    expect(formatMoney(10, 'USD', { tight: true })).toBe('$10.00');
    expect(formatMoney(10, 'GHS', { tight: true })).toMatch(/GH₵|GHS/);
    expect(formatMoney(10, 'GHS', { tight: true })).not.toMatch(/\n/);
    expect(formatMoney(20, 'VND', { tight: true })).not.toMatch(/\.\d{2}$/);
  });
});
