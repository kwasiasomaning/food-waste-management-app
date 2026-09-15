import { uid } from '../dates';
import { buildGroceryQuote, dropoffLabel } from './catalog';
import { groceryBackendBase, groceryPartnerUrl } from './env';
import type { GroceryOrder, GroceryProvider, GroceryQuote, GroceryQuoteInput } from './types';

type FetchLike = typeof fetch;

async function postJson<T>(url: string, body: unknown, fetchImpl: FetchLike): Promise<T> {
  const response = await fetchImpl(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    throw new Error(`Grocery partner failed (${response.status}).`);
  }
  return (await response.json()) as T;
}

function sandboxPlace(quote: GroceryQuote): GroceryOrder {
  return {
    id: uid('groc'),
    providerId: quote.providerId,
    providerLabel: quote.providerLabel,
    storeName: quote.storeName,
    placedAt: new Date().toISOString(),
    etaMinutes: quote.etaMinutes,
    status: 'out_for_delivery',
    lines: quote.lines,
    subtotalUsd: quote.subtotalUsd,
    deliveryFeeUsd: quote.deliveryFeeUsd,
    serviceFeeUsd: quote.serviceFeeUsd,
    totalUsd: quote.totalUsd,
    externalOrderId: `${quote.providerId
      .split('-')
      .map((part) => part.slice(0, 1).toUpperCase())
      .join('')}${quote.id.replace(/[^a-zA-Z0-9]/g, '').slice(-8).toUpperCase()}`,
    dropoffLabel: dropoffLabel(quote.dropoff),
  };
}

/**
 * Partner grocery APIs (Uber Eats Grocery, later Instacart / DoorDash) talk to a
 * Tonight backend, never to the consumer app with a client_secret.
 *
 * POST {EXPO_PUBLIC_GROCERY_API_BASE}/grocery/{providerId}/quotes
 *   body: GroceryQuoteInput
 *   response: GroceryQuote
 * POST {EXPO_PUBLIC_GROCERY_API_BASE}/grocery/{providerId}/orders
 *   body: GroceryQuote
 *   response: GroceryOrder
 *
 * If the backend is unset or a quote fails, the in-app sandbox still quotes and
 * places so Shop → dinner delivery stays usable.
 */
export function createPartnerGroceryProvider(options: {
  id: string;
  label: string;
  storeName: (country: string) => string;
  fetchImpl?: FetchLike;
}): GroceryProvider {
  const fetchImpl = options.fetchImpl ?? fetch;
  return {
    id: options.id,
    label: options.label,
    quote: async (input: GroceryQuoteInput) => {
      const base = groceryBackendBase();
      if (base) {
        try {
          const quoted = await postJson<GroceryQuote>(
            groceryPartnerUrl(base, options.id, 'quotes'),
            input,
            fetchImpl,
          );
          return {
            ...quoted,
            live: true,
            providerId: quoted.providerId || options.id,
            providerLabel: quoted.providerLabel || options.label,
          };
        } catch {
          // Fall through to the on-device quote so dinner is not blocked.
        }
      }
      return buildGroceryQuote({
        ...input,
        live: false,
        providerId: options.id,
        providerLabel: options.label,
        storeName: options.storeName(input.country),
      });
    },
    place: async (quote) => {
      const base = groceryBackendBase();
      if (base && quote.live) {
        return postJson<GroceryOrder>(
          groceryPartnerUrl(base, options.id, 'orders'),
          quote,
          fetchImpl,
        );
      }
      return sandboxPlace(quote);
    },
  };
}
