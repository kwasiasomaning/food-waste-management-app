import type { ShopItem } from '../../types';

export function shopIdsForDelivery(shop: ShopItem[]): string[] {
  const checked = shop.filter((item) => item.checked).map((item) => item.ingredientId);
  if (checked.length > 0) return checked;
  return shop.map((item) => item.ingredientId);
}
