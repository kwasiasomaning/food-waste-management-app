const MAX_HOUSEHOLD = 99;

export function parseHouseholdSize(raw: string, fallback = 1): number {
  const parsed = Number.parseInt(raw.replace(/[^\d]/g, ''), 10);
  if (!Number.isFinite(parsed) || parsed < 1) return fallback;
  return Math.min(parsed, MAX_HOUSEHOLD);
}
