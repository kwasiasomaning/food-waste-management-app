import { getIngredient } from '../../data/ingredients';

/** Uber Eats Android package. Universal / app links for www.ubereats.com open this app. */
export const UBER_EATS_ANDROID_PACKAGE = 'com.ubercab.eats';
export const UBER_EATS_SCHEME = 'ubereats:';

export type UberEatsLinking = {
  canOpenURL: (url: string) => Promise<boolean>;
  openURL: (url: string) => Promise<void>;
};

export type UberEatsHandoff = {
  itemName: string;
  opened: 'app' | 'web';
  url: string;
};

export function groceryItemQuery(itemName: string): string {
  return itemName.trim().replace(/\s+/g, ' ');
}

export function uberEatsGroceryItemName(ingredientId: string): string {
  return getIngredient(ingredientId).name;
}

/**
 * Native scheme used when Uber Eats is installed.
 * `q` is the grocery item; `vertical=SHOP` is Uber's grocery/retail search.
 * `item_name` is passed through so the item is on the URL even if search UI only reads `q`.
 */
export function uberEatsAppBasketUrl(itemName: string): string {
  const q = encodeURIComponent(groceryItemQuery(itemName));
  return `ubereats://search?client_id=eats&q=${q}&vertical=SHOP&item_name=${q}`;
}

/** Universal link — opens the Uber Eats app when installed, otherwise the grocery search page. */
export function uberEatsWebBasketUrl(itemName: string): string {
  const q = encodeURIComponent(groceryItemQuery(itemName));
  return `https://www.ubereats.com/search?q=${q}&vertical=SHOP&sc=SEARCH_SUGGESTION`;
}

/** Android intent that prefers the Uber Eats package, then the same grocery search on the web. */
export function uberEatsAndroidIntentUrl(itemName: string): string {
  const query = groceryItemQuery(itemName);
  const encoded = encodeURIComponent(query);
  const fallback = encodeURIComponent(uberEatsWebBasketUrl(query));
  return `intent://search?client_id=eats&q=${encoded}&vertical=SHOP&item_name=${encoded}#Intent;scheme=ubereats;package=${UBER_EATS_ANDROID_PACKAGE};S.browser_fallback_url=${fallback};end`;
}

async function canOpen(linking: UberEatsLinking, url: string): Promise<boolean> {
  try {
    return await linking.canOpenURL(url);
  } catch {
    return false;
  }
}

async function tryOpen(linking: UberEatsLinking, url: string): Promise<boolean> {
  try {
    await linking.openURL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Open Uber Eats with one grocery item so the user can add it to their basket.
 * Uber does not publish a third-party "add to cart" API, so we hand the item
 * name into the app's grocery search (the same path as a shared product search).
 */
export async function openUberEatsToAddItem(
  itemName: string,
  deps: { platform: string; linking: UberEatsLinking },
): Promise<UberEatsHandoff> {
  const query = groceryItemQuery(itemName);
  if (!query) {
    throw new Error('Nothing to add in Uber Eats.');
  }

  const webUrl = uberEatsWebBasketUrl(query);
  const appUrl = uberEatsAppBasketUrl(query);
  const { platform, linking } = deps;

  if (platform === 'web') {
    const openedWeb = await tryOpen(linking, webUrl);
    if (!openedWeb) throw new Error('Could not open Uber Eats.');
    return { itemName: query, opened: 'web', url: webUrl };
  }

  const installed = await canOpen(linking, `${UBER_EATS_SCHEME}//`);
  if (installed) {
    const openedApp = await tryOpen(linking, appUrl);
    if (openedApp) return { itemName: query, opened: 'app', url: appUrl };
  }

  if (platform === 'android') {
    const intentUrl = uberEatsAndroidIntentUrl(query);
    const openedIntent = await tryOpen(linking, intentUrl);
    if (openedIntent) return { itemName: query, opened: 'app', url: intentUrl };
  }

  // Universal link still launches the app when it is installed but the custom scheme is blocked.
  const openedFallback = await tryOpen(linking, installed ? appUrl : webUrl);
  if (openedFallback) {
    return { itemName: query, opened: installed ? 'app' : 'web', url: installed ? appUrl : webUrl };
  }

  const openedWeb = await tryOpen(linking, webUrl);
  if (!openedWeb) throw new Error('Could not open Uber Eats.');
  return { itemName: query, opened: 'web', url: webUrl };
}
