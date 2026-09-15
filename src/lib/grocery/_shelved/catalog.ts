import { getIngredient } from '../../../data/ingredients';
import { COUNTRY_MAP } from '../../../data/places';
import { uid } from '../../dates';
import type { GroceryDropoff, GroceryLine, GroceryProviderId, GroceryQuote } from '../types';

export function roundUsd(value: number): number {
  return Math.round(value * 100) / 100;
}

export function grocerySku(ingredientId: string): string {
  return `ue-groc-${ingredientId}`;
}

export function groceryUnitPriceUsd(ingredientId: string): number {
  const ingredient = getIngredient(ingredientId);
  return roundUsd(ingredient.costUsd * 1.08);
}

export function groceryLines(ingredientIds: string[]): GroceryLine[] {
  const unique = [...new Set(ingredientIds)];
  return unique.map((ingredientId) => {
    const ingredient = getIngredient(ingredientId);
    const unitPriceUsd = groceryUnitPriceUsd(ingredientId);
    return {
      ingredientId,
      name: ingredient.name,
      sku: grocerySku(ingredientId),
      quantity: 1,
      unitPriceUsd,
      lineTotalUsd: unitPriceUsd,
    };
  });
}

export function groceryDeliveryFeeUsd(subtotalUsd: number): number {
  return subtotalUsd >= 35 ? 1.99 : 4.99;
}

export function groceryServiceFeeUsd(subtotalUsd: number): number {
  return roundUsd(subtotalUsd * 0.0499 + 0.49);
}

export function groceryEtaMinutes(ingredientIds: string[]): number {
  const weight = ingredientIds.join('').length;
  return 18 + (weight % 15);
}

export function groceryStoreName(country: string): string {
  const place = COUNTRY_MAP[country]?.name ?? 'your city';
  return `Neighborhood market on Uber Eats · ${place}`;
}

export function dropoffLabel(dropoff: GroceryDropoff): string {
  return [dropoff.line1.trim(), dropoff.city.trim(), dropoff.postal.trim()].filter(Boolean).join(', ');
}

export function dropoffFromSettings(settings: {
  deliveryLine1?: string;
  deliveryCity?: string;
  deliveryPostal?: string;
}): GroceryDropoff {
  return {
    line1: settings.deliveryLine1 ?? '',
    city: settings.deliveryCity ?? '',
    postal: settings.deliveryPostal ?? '',
  };
}

export function isDropoffReady(dropoff: GroceryDropoff): boolean {
  return dropoff.line1.trim().length > 3 && dropoff.city.trim().length > 1 && dropoff.postal.trim().length > 2;
}

export function buildGroceryQuote(input: {
  ingredientIds: string[];
  dropoff: GroceryDropoff;
  country: string;
  live: boolean;
  providerId?: GroceryProviderId;
  providerLabel?: string;
  storeName?: string;
}): GroceryQuote {
  const providerId = input.providerId ?? 'uber-eats-grocery';
  const lines = groceryLines(input.ingredientIds);
  const subtotalUsd = roundUsd(lines.reduce((sum, line) => sum + line.lineTotalUsd, 0));
  const deliveryFeeUsd = groceryDeliveryFeeUsd(subtotalUsd);
  const serviceFeeUsd = groceryServiceFeeUsd(subtotalUsd);
  return {
    id: uid('gquote'),
    providerId,
    providerLabel: input.providerLabel ?? 'Uber Eats Grocery',
    storeName: input.storeName ?? groceryStoreName(input.country),
    storeId: `${providerId}-store-${input.country.toLowerCase()}`,
    etaMinutes: groceryEtaMinutes(input.ingredientIds),
    lines,
    subtotalUsd,
    deliveryFeeUsd,
    serviceFeeUsd,
    totalUsd: roundUsd(subtotalUsd + deliveryFeeUsd + serviceFeeUsd),
    dropoff: {
      line1: input.dropoff.line1.trim(),
      city: input.dropoff.city.trim(),
      postal: input.dropoff.postal.trim(),
    },
    live: input.live,
  };
}
