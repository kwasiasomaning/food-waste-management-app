import { WASTE_BRIEFS, type WasteBrief } from '../data/wasteBriefs';

let sessionBrief: WasteBrief | null = null;
let dismissed = false;

export function pickWasteBrief(excludeId?: string | null): WasteBrief {
  const pool = WASTE_BRIEFS.filter((brief) => brief.id !== excludeId);
  const list = pool.length > 0 ? pool : WASTE_BRIEFS;
  return list[Math.floor(Math.random() * list.length)];
}

export function wasteBriefForSession(): WasteBrief {
  if (!sessionBrief) sessionBrief = pickWasteBrief();
  return sessionBrief;
}

export function isWasteBriefDismissed(): boolean {
  return dismissed;
}

export function dismissWasteBrief(): void {
  dismissed = true;
}
