import { shopIdsForDelivery } from './shopSelection';
import {
  groceryItemQuery,
  openUberEatsToAddItem,
  uberEatsAndroidIntentUrl,
  uberEatsAppBasketUrl,
  uberEatsGroceryItemName,
  uberEatsWebBasketUrl,
} from './uberEatsApp';

describe('Uber Eats grocery handoff', () => {
  it('passes the pantry name as a grocery search item', () => {
    expect(uberEatsGroceryItemName('spinach')).toBe('Spinach');
    expect(groceryItemQuery('  baby   spinach ')).toBe('baby spinach');
  });

  it('builds an app URL that carries the grocery item into search', () => {
    const url = uberEatsAppBasketUrl('Spinach');
    expect(url.startsWith('ubereats://search?')).toBe(true);
    expect(url).toContain('client_id=eats');
    expect(url).toContain('q=Spinach');
    expect(url).toContain('item_name=Spinach');
    expect(url).toContain('vertical=SHOP');
  });

  it('encodes spaces in the grocery item name', () => {
    expect(uberEatsAppBasketUrl('Bell pepper')).toContain('q=Bell%20pepper');
    expect(uberEatsAppBasketUrl('Bell pepper')).toContain('item_name=Bell%20pepper');
    expect(uberEatsWebBasketUrl('Bell pepper')).toContain('q=Bell%20pepper');
  });

  it('builds a universal grocery search URL for the same item', () => {
    const url = uberEatsWebBasketUrl('Eggs');
    expect(url.startsWith('https://www.ubereats.com/search?')).toBe(true);
    expect(url).toContain('q=Eggs');
    expect(url).toContain('vertical=SHOP');
  });

  it('builds an Android intent that prefers the Uber Eats package', () => {
    const url = uberEatsAndroidIntentUrl('Yam');
    expect(url.startsWith('intent://search?')).toBe(true);
    expect(url).toContain('package=com.ubercab.eats');
    expect(url).toContain('scheme=ubereats');
    expect(url).toContain('q=Yam');
    expect(url).toContain('item_name=Yam');
  });

  it('opens the Uber Eats app when the phone has it installed', async () => {
    const opened: string[] = [];
    const result = await openUberEatsToAddItem('Spinach', {
      platform: 'ios',
      linking: {
        canOpenURL: async (url) => url.startsWith('ubereats:'),
        openURL: async (url) => {
          opened.push(url);
        },
      },
    });
    expect(result.opened).toBe('app');
    expect(result.itemName).toBe('Spinach');
    expect(opened).toEqual([uberEatsAppBasketUrl('Spinach')]);
  });

  it('uses the Android package intent when the custom scheme is not queryable', async () => {
    const opened: string[] = [];
    const result = await openUberEatsToAddItem('Eggs', {
      platform: 'android',
      linking: {
        canOpenURL: async () => false,
        openURL: async (url) => {
          opened.push(url);
        },
      },
    });
    expect(result.opened).toBe('app');
    expect(opened).toEqual([uberEatsAndroidIntentUrl('Eggs')]);
  });

  it('opens grocery search on the web when this is not a phone', async () => {
    const opened: string[] = [];
    const result = await openUberEatsToAddItem('Milk', {
      platform: 'web',
      linking: {
        canOpenURL: async () => false,
        openURL: async (url) => {
          opened.push(url);
        },
      },
    });
    expect(result.opened).toBe('web');
    expect(opened).toEqual([uberEatsWebBasketUrl('Milk')]);
  });

  it('falls back to the universal link when the app scheme will not open', async () => {
    const result = await openUberEatsToAddItem('Tomatoes', {
      platform: 'ios',
      linking: {
        canOpenURL: async () => false,
        openURL: async (url) => {
          if (url.startsWith('ubereats:')) throw new Error('no handler');
        },
      },
    });
    expect(result.opened).toBe('web');
    expect(result.url).toBe(uberEatsWebBasketUrl('Tomatoes'));
  });

  it('rejects an empty grocery item', async () => {
    await expect(
      openUberEatsToAddItem('   ', {
        platform: 'ios',
        linking: { canOpenURL: async () => true, openURL: async () => undefined },
      }),
    ).rejects.toThrow('Nothing to add in Uber Eats.');
  });
});

describe('shop items sent to Uber Eats', () => {
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
