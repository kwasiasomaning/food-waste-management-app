import type { MealPhotoId, OnboardPhotoId, OnboardingStillId } from './foodPhoto';

const TABLE_STILLS: OnboardingStillId[] = ['table', 'bread', 'bowl', 'plate'];

const MEAL_STILLS: MealPhotoId[] = [
  'meal-frittata',
  'meal-toast',
  'meal-fried-rice',
  'meal-chicken',
  'meal-tacos',
  'meal-shakshuka',
  'meal-pasta',
  'meal-soup',
  'meal-fish',
  'meal-stirfry',
  'meal-melt',
  'meal-bowl',
  'meal-noodles',
  'meal-beans',
  'meal-caprese',
];

const ONBOARD_STILLS: OnboardPhotoId[] = [
  'onboard-spread',
  'onboard-roast',
  'onboard-pasta',
  'onboard-fish',
  'onboard-salad',
  'onboard-curry',
  'onboard-eggs',
  'onboard-stirfry',
];

export const ONBOARDING_STILL_IDS: readonly OnboardingStillId[] = [
  ...ONBOARD_STILLS,
  ...TABLE_STILLS,
  ...MEAL_STILLS,
];

export const ONBOARDING_STEP_COUNT = 5;

function mulberry32(seed: number): () => number {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

export function newOnboardingStillSeed(): number {
  return (Date.now() ^ Math.floor(Math.random() * 0x7fffffff)) >>> 0;
}

export function pickOnboardingStills(
  count = ONBOARDING_STEP_COUNT,
  seed = newOnboardingStillSeed(),
): OnboardingStillId[] {
  const pool = [...ONBOARDING_STILL_IDS];
  const rand = mulberry32(seed);
  for (let i = pool.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rand() * (i + 1));
    const swap = pool[i];
    pool[i] = pool[j];
    pool[j] = swap;
  }
  if (count <= pool.length) return pool.slice(0, count);
  return Array.from({ length: count }, (_, index) => pool[index % pool.length]);
}
