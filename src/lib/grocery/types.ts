export type GroceryProviderId = string;

export type GroceryDropoff = {
  line1: string;
  city: string;
  postal: string;
};

export type GroceryLine = {
  ingredientId: string;
  name: string;
  sku: string;
  quantity: number;
  unitPriceUsd: number;
  lineTotalUsd: number;
};

export type GroceryQuote = {
  id: string;
  providerId: GroceryProviderId;
  providerLabel: string;
  storeName: string;
  storeId: string;
  etaMinutes: number;
  lines: GroceryLine[];
  subtotalUsd: number;
  deliveryFeeUsd: number;
  serviceFeeUsd: number;
  totalUsd: number;
  dropoff: GroceryDropoff;
  live: boolean;
};

export type GroceryOrderStatus = 'confirmed' | 'shopping' | 'out_for_delivery' | 'delivered' | 'failed';

export type GroceryOrder = {
  id: string;
  providerId: GroceryProviderId;
  providerLabel: string;
  storeName: string;
  placedAt: string;
  etaMinutes: number;
  status: GroceryOrderStatus;
  lines: GroceryLine[];
  subtotalUsd: number;
  deliveryFeeUsd: number;
  serviceFeeUsd: number;
  totalUsd: number;
  externalOrderId: string;
  dropoffLabel: string;
  trackingUrl?: string;
};

export type GroceryQuoteInput = {
  ingredientIds: string[];
  dropoff: GroceryDropoff;
  country: string;
};

export type GroceryProvider = {
  id: GroceryProviderId;
  label: string;
  quote: (input: GroceryQuoteInput) => Promise<GroceryQuote>;
  place: (quote: GroceryQuote) => Promise<GroceryOrder>;
};
