import type { GroceryOrder, PantryItem, ShopItem } from '../../types';
import { itemsFromIds } from '../starterPantry';

export function applyGroceryOrder(
  state: {
    pantry: PantryItem[];
    shop: ShopItem[];
    groceryOrders: GroceryOrder[];
  },
  order: GroceryOrder,
): {
  pantry: PantryItem[];
  shop: ShopItem[];
  groceryOrders: GroceryOrder[];
} {
  const ids = order.lines.map((line) => line.ingredientId);
  const existing = new Set(state.pantry.map((item) => item.ingredientId));
  const fresh = itemsFromIds(
    ids.filter((id) => !existing.has(id)),
    'shop',
  );
  return {
    pantry: [...state.pantry, ...fresh],
    shop: state.shop.filter((item) => !ids.includes(item.ingredientId)),
    groceryOrders: [order, ...state.groceryOrders],
  };
}
