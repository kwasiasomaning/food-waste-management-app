import { householdDigits, parseHouseholdSize } from './household';

describe('parseHouseholdSize', () => {
  it('accepts a free-form positive integer', () => {
    expect(parseHouseholdSize('7')).toBe(7);
    expect(parseHouseholdSize('12')).toBe(12);
    expect(parseHouseholdSize('100')).toBe(100);
  });

  it('strips non-digits and rejects empty or zero', () => {
    expect(parseHouseholdSize('3 people')).toBe(3);
    expect(parseHouseholdSize('')).toBe(1);
    expect(parseHouseholdSize('0')).toBe(1);
  });

  it('caps at 999', () => {
    expect(parseHouseholdSize('2500')).toBe(999);
  });
});

describe('householdDigits', () => {
  it('keeps at most three digits', () => {
    expect(householdDigits('12')).toBe('12');
    expect(householdDigits('8 people')).toBe('8');
    expect(householdDigits('1234')).toBe('123');
  });
});
