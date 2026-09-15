export const MAX_HOUSEHOLD = 999;
export const MAX_HOUSEHOLD_DIGITS = 3;

export function parseHouseholdSize(raw: string, fallback = 1): number {
  const parsed = Number.parseInt(raw.replace(/[^\d]/g, ''), 10);
  if (!Number.isFinite(parsed) || parsed < 1) return fallback;
  return Math.min(parsed, MAX_HOUSEHOLD);
}

export function householdDigits(raw: string): string {
  return raw.replace(/[^\d]/g, '').slice(0, MAX_HOUSEHOLD_DIGITS);
}
