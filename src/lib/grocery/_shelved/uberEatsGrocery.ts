/** Shelved Uber Eats Grocery provider. Not registered in Tonight v1. */
import { groceryStoreName } from './catalog';
import { createPartnerGroceryProvider } from './createPartnerProvider';

type FetchLike = typeof fetch;

export function createUberEatsGroceryProvider(fetchImpl: FetchLike = fetch) {
  return createPartnerGroceryProvider({
    id: 'uber-eats-grocery',
    label: 'Uber Eats Grocery',
    storeName: groceryStoreName,
    fetchImpl,
  });
}

export const uberEatsGroceryProvider = createUberEatsGroceryProvider();
