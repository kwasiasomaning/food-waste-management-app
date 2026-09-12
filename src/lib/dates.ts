import type { Ingredient, PantryItem, Urgency } from '../types';

export const DAY_MS = 86_400_000;

export function nowIso(date = new Date()): string {
  return date.toISOString();
}

export function addDaysIso(days: number, from = new Date()): string {
  return new Date(from.getTime() + days * DAY_MS).toISOString();
}

export function daysUntil(iso: string, now = Date.now()): number {
  return (new Date(iso).getTime() - now) / DAY_MS;
}

export function urgencyOf(
  item: PantryItem,
  ingredient: Ingredient,
  now = Date.now(),
): Urgency {
  if (ingredient.isStaple) return 'staple';
  const days = daysUntil(item.expiresAt, now);
  if (days <= 1.25) return 'tonight';
  if (days <= 4) return 'soon';
  return 'fresh';
}

export function expiryLabel(iso: string, now = Date.now()): string {
  const days = daysUntil(iso, now);
  if (days < 0) return 'Past its best';
  if (days < 0.6) return 'Tonight';
  if (days < 1.4) return 'Tomorrow';
  if (days < 2.4) return 'In 2 days';
  return `In ${Math.round(days)} days`;
}

export function prettyDate(iso = nowIso()): string {
  return new Date(iso).toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

export function uid(prefix = 'id'): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}
