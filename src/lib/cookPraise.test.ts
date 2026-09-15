import {
  COOK_PRAISE_TITLES,
  nextCookPraise,
  pickCookPraise,
  resetCookPraiseForTests,
} from './cookPraise';

describe('cook praise titles', () => {
  beforeEach(() => {
    resetCookPraiseForTests();
  });

  it('keeps a short rotating catalog of praise, not the old cryptic heading', () => {
    expect(COOK_PRAISE_TITLES.length).toBeGreaterThanOrEqual(8);
    const unique = new Set(COOK_PRAISE_TITLES);
    expect(unique.size).toBe(COOK_PRAISE_TITLES.length);

    for (const title of COOK_PRAISE_TITLES) {
      expect(title.toLowerCase()).not.toContain('stayed food');
      expect(title.endsWith('.')).toBe(true);
      expect(title.length).toBeGreaterThan(12);
      expect(title.length).toBeLessThan(48);
    }
  });

  it('picks from the catalog and skips the last title', () => {
    const excluded = COOK_PRAISE_TITLES[0];
    for (let i = 0; i < 40; i += 1) {
      expect(pickCookPraise(excluded)).not.toBe(excluded);
    }
  });

  it('does not repeat the same praise on consecutive cooks', () => {
    const seen: string[] = [];
    for (let i = 0; i < 20; i += 1) {
      seen.push(nextCookPraise());
    }
    for (let i = 1; i < seen.length; i += 1) {
      expect(seen[i]).not.toBe(seen[i - 1]);
    }
    expect(seen.every((title) => COOK_PRAISE_TITLES.includes(title as (typeof COOK_PRAISE_TITLES)[number]))).toBe(
      true,
    );
  });

  it('honors an injected random source', () => {
    expect(pickCookPraise(null, () => 0)).toBe(COOK_PRAISE_TITLES[0]);
    expect(pickCookPraise(null, () => 0.99)).toBe(COOK_PRAISE_TITLES[COOK_PRAISE_TITLES.length - 1]);
  });
});
