import { WASTE_BRIEFS } from '../data/wasteBriefs';
import { dismissWasteBrief, isWasteBriefDismissed, pickWasteBrief } from './wasteBrief';

describe('waste briefs', () => {
  it('has sourced copy for every brief', () => {
    expect(WASTE_BRIEFS.length).toBeGreaterThanOrEqual(8);
    for (const brief of WASTE_BRIEFS) {
      expect(brief.id).toBeTruthy();
      expect(brief.text.length).toBeGreaterThan(20);
      expect(brief.source).toBeTruthy();
      expect(brief.cite).toBeTruthy();
    }
    const ids = WASTE_BRIEFS.map((brief) => brief.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('returns a brief from the catalog', () => {
    const picked = pickWasteBrief();
    expect(WASTE_BRIEFS.some((brief) => brief.id === picked.id)).toBe(true);
  });

  it('skips the last brief when picking again', () => {
    const excluded = WASTE_BRIEFS[0].id;
    for (let i = 0; i < 30; i += 1) {
      expect(pickWasteBrief(excluded).id).not.toBe(excluded);
    }
  });

  it('remembers a dismiss for the session', () => {
    dismissWasteBrief();
    expect(isWasteBriefDismissed()).toBe(true);
  });
});
