import { minimumAgeForCountry } from '../../data/legal';
import { hashPassword, passwordsMatch } from './password';
import { isValidEmail, normalizeEmail, passwordIssues } from './validation';

describe('email', () => {
  it('normalizes and accepts a simple address', () => {
    expect(normalizeEmail('  Ada@Kitchen.ORG ')).toBe('ada@kitchen.org');
    expect(isValidEmail('ada@kitchen.org')).toBe(true);
    expect(isValidEmail('not-an-email')).toBe(false);
  });
});

describe('password', () => {
  it('requires length, a letter, and a number', () => {
    expect(passwordIssues('short')).toBe('Use at least 8 characters.');
    expect(passwordIssues('longenough')).toBe('Use a letter and a number.');
    expect(passwordIssues('long3nough')).toBeNull();
  });
});

describe('password hash', () => {
  it('verifies with the same salt and rejects a wrong guess', async () => {
    const hash = await hashPassword('long3nough', 'salt');
    expect(await passwordsMatch('long3nough', 'salt', hash)).toBe(true);
    expect(await passwordsMatch('wrong-pass', 'salt', hash)).toBe(false);
  });
});

describe('age gate', () => {
  it('uses 16 in the UK/EU and 13 elsewhere', () => {
    expect(minimumAgeForCountry('GB')).toBe(16);
    expect(minimumAgeForCountry('DE')).toBe(16);
    expect(minimumAgeForCountry('US')).toBe(13);
    expect(minimumAgeForCountry('GH')).toBe(13);
  });
});
