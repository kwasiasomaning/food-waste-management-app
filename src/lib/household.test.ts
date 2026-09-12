import { parseHouseholdSize } from './household';

describe('parseHouseholdSize', () => {
  it('accepts a free-form positive integer', () => {
    expect(parseHouseholdSize('7')).toBe(7);
    expect(parseHouseholdSize('12')).toBe(12);
  });

  it('strips non-digits and rejects empty or zero', () => {
    expect(parseHouseholdSize('3 people')).toBe(3);
    expect(parseHouseholdSize('')).toBe(1);
    expect(parseHouseholdSize('0')).toBe(1);
  });

  it('caps at 99', () => {
    expect(parseHouseholdSize('250')).toBe(99);
  });
});
