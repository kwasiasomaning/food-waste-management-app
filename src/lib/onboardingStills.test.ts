import { ONBOARDING_STILL_IDS, pickOnboardingStills } from './onboardingStills';

describe('pickOnboardingStills', () => {
  it('gives each onboarding step a distinct prepared still', () => {
    const picks = pickOnboardingStills(5, 1);
    expect(picks).toHaveLength(5);
    expect(new Set(picks).size).toBe(5);
    for (const id of picks) {
      expect(ONBOARDING_STILL_IDS).toContain(id);
    }
  });

  it('is stable for the same signup seed', () => {
    expect(pickOnboardingStills(5, 42)).toEqual(pickOnboardingStills(5, 42));
  });

  it('rotates to a different set for a new signup', () => {
    expect(pickOnboardingStills(5, 1)).not.toEqual(pickOnboardingStills(5, 2));
    expect(pickOnboardingStills(5, 7)).not.toEqual(pickOnboardingStills(5, 99));
  });
});
