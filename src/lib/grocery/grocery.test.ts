import { groceryLines, groceryServiceFeeUsd, groceryUnitPriceUsd, isDropoffReady } from './catalog';
import { applyGroceryOrder } from './applyOrder';
import { grocerySpendUsd, moneySavedAfterGroceryUsd } from './netSaved';
import { groceryProvider, groceryProviders, registerGroceryProvider } from './registry';
import { shopIdsForDelivery } from './shopSelection';
import { createUberEatsGroceryProvider } from './providers/uberEatsGrocery';
import type { GroceryOrder } from './types';

describe('grocery catalog', () => {
  it('marks a drop-off ready only when the address is filled', () => {
    expect(isDropoffReady({ line1: '12', city: 'A', postal: '1' })).toBe(false);
    expect(isDropoffReady({ line1: '12 Oak Street', city: 'Austin', postal: '78701' })).toBe(true);
  });

  it('prices pantry staples onto an Uber Eats grocery ticket', () => {
    const spinach = groceryUnitPriceUsd('spinach');
    expect(spinach).toBe(3.46);
    const lines = groceryLines(['spinach', 'spinach', 'eggs']);
    expect(lines).toHaveLength(2);
    expect(lines[0].sku).toBe('ue-groc-spinach');
    expect(groceryServiceFeeUsd(10)).toBe(0.99);
  });
});

describe('shop delivery selection', () => {
  it('sends ticked items when any are ticked, otherwise the whole list', () => {
    expect(shopIdsForDelivery([])).toEqual([]);
    expect(
      shopIdsForDelivery([
        { ingredientId: 'spinach', reason: 'dinner', checked: false },
        { ingredientId: 'eggs', reason: 'dinner', checked: false },
      ]),
    ).toEqual(['spinach', 'eggs']);
    expect(
      shopIdsForDelivery([
        { ingredientId: 'spinach', reason: 'dinner', checked: true },
        { ingredientId: 'eggs', reason: 'dinner', checked: false },
      ]),
    ).toEqual(['spinach']);
  });
});

describe('net money saved', () => {
  it('deducts itemized grocery spend from cooked and used savings', () => {
    const cooked = [{ savedUsd: 10 } as never];
    const used = [{ savedUsd: 2 } as never];
    const orders = [{ totalUsd: 5.5 }, { totalUsd: 1.25 }] as never;
    expect(grocerySpendUsd(orders)).toBe(6.75);
    expect(moneySavedAfterGroceryUsd(cooked, used, orders)).toBe(5.25);
  });

  it('can take Money Saved below zero when delivery costs more than kept groceries', () => {
    expect(moneySavedAfterGroceryUsd([{ savedUsd: 2 } as never], [], [{ totalUsd: 9 } as never])).toBe(
      -7,
    );
  });
});

describe('grocery ledger', () => {
  it('moves ordered ingredients into the pantry and prepends the ticket', () => {
    const order: GroceryOrder = {
      id: 'groc-1',
      providerId: 'uber-eats-grocery',
      providerLabel: 'Uber Eats Grocery',
      storeName: 'Neighborhood market',
      placedAt: '2026-09-15T00:00:00.000Z',
      etaMinutes: 22,
      status: 'out_for_delivery',
      lines: groceryLines(['spinach']),
      subtotalUsd: 3.46,
      deliveryFeeUsd: 4.99,
      serviceFeeUsd: 0.66,
      totalUsd: 9.11,
      externalOrderId: 'UETEST',
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

describe('grocery providers', () => {
  it('registers Uber Eats Grocery as the default dinner delivery partner', () => {
    const ids = groceryProviders().map((provider) => provider.id);
    expect(ids).toContain('uber-eats-grocery');
    expect(groceryProvider().id).toBe('uber-eats-grocery');
    expect(groceryProvider('missing').label).toBe('Uber Eats Grocery');
  });

  it('lets a later grocery app register on the same quote-and-place contract', () => {
    registerGroceryProvider({
      id: 'instacart',
      label: 'Instacart',
      quote: async () => {
        throw new Error('unused');
      },
      place: async () => {
        throw new Error('unused');
      },
    });
    expect(groceryProvider('instacart').label).toBe('Instacart');
    expect(groceryProvider('uber-eats-grocery').label).toBe('Uber Eats Grocery');
  });

  it('quotes and places an Uber Eats grocery order for missing dinner bits', async () => {
    const provider = createUberEatsGroceryProvider();
    const quote = await provider.quote({
      ingredientIds: ['spinach', 'eggs'],
      dropoff: { line1: '12 Oak Street', city: 'Austin', postal: '78701' },
      country: 'US',
    });
    expect(quote.providerId).toBe('uber-eats-grocery');
    expect(quote.live).toBe(false);
    expect(quote.etaMinutes).toBeGreaterThanOrEqual(18);
    expect(quote.etaMinutes).toBeLessThanOrEqual(32);
    expect(quote.lines).toHaveLength(2);
    expect(quote.totalUsd).toBe(
      Math.round((quote.subtotalUsd + quote.deliveryFeeUsd + quote.serviceFeeUsd) * 100) / 100,
    );

    const order = await provider.place(quote);
    expect(order.status).toBe('out_for_delivery');
    expect(order.externalOrderId.startsWith('UE')).toBe(true);
    expect(order.dropoffLabel).toContain('Austin');
    expect(order.lines.map((line) => line.name)).toEqual(['Spinach', 'Eggs']);
  });

  it('uses a partner backend when one is configured', async () => {
    const previous = process.env.EXPO_PUBLIC_GROCERY_API_BASE;
    process.env.EXPO_PUBLIC_GROCERY_API_BASE = 'https://grocery.tonight.test';
    const fetchImpl = jest.fn(async (url: RequestInfo) => {
      const href = String(url);
      if (href.endsWith('/grocery/uber-eats-grocery/quotes')) {
        return {
          ok: true,
          json: async () => ({
            id: 'live-quote',
            providerId: 'uber-eats-grocery',
            providerLabel: 'Uber Eats Grocery',
            storeName: 'Live store',
            storeId: 'store-1',
            etaMinutes: 22,
            lines: groceryLines(['tomato']),
            subtotalUsd: 3.02,
            deliveryFeeUsd: 4.99,
            serviceFeeUsd: 0.64,
            totalUsd: 8.65,
            dropoff: { line1: '1 Main', city: 'Austin', postal: '78701' },
            live: true,
          }),
        } as Response;
      }
      return {
        ok: true,
        json: async () => ({
          id: 'live-order',
          providerId: 'uber-eats-grocery',
          providerLabel: 'Uber Eats Grocery',
          storeName: 'Live store',
          placedAt: '2026-09-15T00:00:00.000Z',
          etaMinutes: 22,
          status: 'confirmed',
          lines: groceryLines(['tomato']),
          subtotalUsd: 3.02,
          deliveryFeeUsd: 4.99,
          serviceFeeUsd: 0.64,
          totalUsd: 8.65,
          externalOrderId: 'UE-LIVE',
          dropoffLabel: '1 Main, Austin, 78701',
        }),
      } as Response;
    });
    try {
      const provider = createUberEatsGroceryProvider(fetchImpl as unknown as typeof fetch);
      const quote = await provider.quote({
        ingredientIds: ['tomato'],
        dropoff: { line1: '1 Main', city: 'Austin', postal: '78701' },
        country: 'US',
      });
      expect(quote.live).toBe(true);
      expect(quote.storeName).toBe('Live store');
      const order = await provider.place(quote);
      expect(order.externalOrderId).toBe('UE-LIVE');
      expect(fetchImpl).toHaveBeenCalledTimes(2);
    } finally {
      if (previous === undefined) delete process.env.EXPO_PUBLIC_GROCERY_API_BASE;
      else process.env.EXPO_PUBLIC_GROCERY_API_BASE = previous;
    }
  });
});
