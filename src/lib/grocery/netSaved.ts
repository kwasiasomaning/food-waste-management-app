import type { CookedMeal, GroceryOrder, UsedItem } from '../../types';

export function grocerySpendUsd(orders: GroceryOrder[]): number {
  return Math.round(orders.reduce((sum, order) => sum + order.totalUsd, 0) * 100) / 100;
}

export function moneyKeptUsd(cooked: CookedMeal[], used: UsedItem[]): number {
  const cookedUsd = cooked.reduce((sum, meal) => sum + meal.savedUsd, 0);
  const usedUsd = used.reduce((sum, item) => sum + item.savedUsd, 0);
  return Math.round((cookedUsd + usedUsd) * 100) / 100;
}

export function moneySavedAfterGroceryUsd(
  cooked: CookedMeal[],
  used: UsedItem[],
  orders: GroceryOrder[],
): number {
  return Math.round((moneyKeptUsd(cooked, used) - grocerySpendUsd(orders)) * 100) / 100;
}
