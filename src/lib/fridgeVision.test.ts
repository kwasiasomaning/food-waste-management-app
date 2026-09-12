import { classifyPixel, guessFromColors, guessFromFilename } from './fridgeVision';

describe('guessFromFilename', () => {
  it('picks catalog ingredients named in the file', () => {
    expect(guessFromFilename('file:///photos/spinach-and-eggs-fridge.jpg')).toEqual(
      expect.arrayContaining(['spinach', 'eggs']),
    );
  });

  it('ignores staples and unknown words', () => {
    expect(guessFromFilename('file:///photos/holiday-salt.jpg')).not.toContain('salt');
  });
});

describe('guessFromColors', () => {
  it('maps green and white shelves to leafy and dairy guesses', () => {
    const found = guessFromColors({
      green: 0.2,
      red: 0,
      orange: 0,
      yellow: 0,
      white: 0.15,
      brown: 0,
    });
    expect(found).toEqual(expect.arrayContaining(['spinach', 'milk', 'eggs']));
  });
});

describe('classifyPixel', () => {
  it('buckets obvious fridge colours', () => {
    expect(classifyPixel(40, 140, 50)).toBe('green');
    expect(classifyPixel(190, 40, 40)).toBe('red');
    expect(classifyPixel(230, 230, 225)).toBe('white');
  });
});
