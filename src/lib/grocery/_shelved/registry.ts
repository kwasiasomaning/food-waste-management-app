import type { GroceryProvider, GroceryProviderId } from '../types';
import { uberEatsGroceryProvider } from './uberEatsGrocery';

const providers: GroceryProvider[] = [uberEatsGroceryProvider];

export function groceryProviders(): GroceryProvider[] {
  return providers;
}

export function groceryProvider(id?: GroceryProviderId | null): GroceryProvider {
  return providers.find((provider) => provider.id === id) ?? uberEatsGroceryProvider;
}

export function registerGroceryProvider(provider: GroceryProvider): void {
  const index = providers.findIndex((row) => row.id === provider.id);
  if (index >= 0) {
    providers[index] = provider;
    return;
  }
  providers.push(provider);
}
