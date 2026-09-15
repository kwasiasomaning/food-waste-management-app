import type { GroceryOrderStatus } from './types';

export function groceryOrderStatusLabel(status: GroceryOrderStatus): string {
  switch (status) {
    case 'confirmed':
      return 'Confirmed';
    case 'shopping':
      return 'Shopper picking';
    case 'out_for_delivery':
      return 'On the way';
    case 'delivered':
      return 'Delivered';
    case 'failed':
      return 'Did not go through';
  }
}
