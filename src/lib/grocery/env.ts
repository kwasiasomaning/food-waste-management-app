export function groceryBackendBase(): string | null {
  const base = process.env.EXPO_PUBLIC_GROCERY_API_BASE?.trim();
  return base ? base.replace(/\/$/, '') : null;
}

export function groceryPartnerUrl(
  base: string,
  providerId: string,
  kind: 'quotes' | 'orders',
): string {
  return `${base}/grocery/${providerId}/${kind}`;
}
