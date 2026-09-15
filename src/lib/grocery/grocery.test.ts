import { applyGroceryOrder } from './applyOrder';
import { grocerySpendUsd, moneySavedAfterGroceryUsd } from './netSaved';
import type { GroceryOrder } from './types';

describe('net money saved', () => {
  it('deducts itemized shop spend from cooked and used savings', () => {
    const cooked = [{ savedUsd: 10 } as never];
    const used = [{ savedUsd: 2 } as never];
    const orders = [{ totalUsd: 5.5 }, { totalUsd: 1.25 }] as never;
    expect(grocerySpendUsd(orders)).toBe(6.75);
    expect(moneySavedAfterGroceryUsd(cooked, used, orders)).toBe(5.25);
  });

  it('can take Money Saved below zero when shop spend costs more than kept food', () => {
    expect(moneySavedAfterGroceryUsd([{ savedUsd: 2 } as never], [], [{ totalUsd: 9 } as never])).toBe(
      -7,
    );
  });
});

describe('shop ledger', () => {
  it('moves ordered ingredients into the pantry and prepends the ticket', () => {
    const order: GroceryOrder = {
      id: 'groc-1',
      providerId: 'sandbox',
      providerLabel: 'Shop ticket',
      storeName: 'Neighborhood market',
      placedAt: '2026-09-15T00:00:00.000Z',
      etaMinutes: 22,
      status: 'out_for_delivery',
      lines: [
        {
          ingredientId: 'spinach',
          name: 'Spinach',
          sku: 'groc-spinach',
          quantity: 1,
          unitPriceUsd: 3.46,
          lineTotalUsd: 3.46,
        },
      ],
      subtotalUsd: 3.46,
      deliveryFeeUsd: 4.99,
      serviceFeeUsd: 0.66,
      totalUsd: 9.11,
      externalOrderId: 'TEST',
      dropoffLabel: '12 Oak Street, Austin, 78701',
    };
    const next = applyGroceryOrder(
      {
        pantry: [],
        shop: [
          { ingredientId: 'spinach', reason: 'For pasta', checked: false },
          { ingredientId: 'eggs', reason: 'For pasta', checked: false },
        ],
        groceryOrders: [],
      },
      order,
    );
    expect(next.pantry.map((item) => item.ingredientId)).toEqual(['spinach']);
    expect(next.pantry[0].source).toBe('shop');
    expect(next.shop.map((item) => item.ingredientId)).toEqual(['eggs']);
    expect(next.groceryOrders[0].id).toBe('groc-1');
    expect(next.groceryOrders[0].lines[0].name).toBe('Spinach');
  });
});
