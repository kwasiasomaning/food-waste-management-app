import AsyncStorage from '@react-native-async-storage/async-storage';

import type { BinnedItem, CookedMeal, PantryItem, Settings, ShopItem, UsedItem } from '../../types';

export type KitchenSlice = {
  settings: Settings;
  pantry: PantryItem[];
  cooked: CookedMeal[];
  wasted: BinnedItem[];
  used: UsedItem[];
  shop: ShopItem[];
};

const vaultKey = (userId: string) => `tonight.user.${userId}`;

export async function stashKitchen(userId: string, slice: KitchenSlice): Promise<void> {
  await AsyncStorage.setItem(vaultKey(userId), JSON.stringify(slice));
}

export async function loadKitchen(userId: string): Promise<KitchenSlice | null> {
  const raw = await AsyncStorage.getItem(vaultKey(userId));
  if (!raw) return null;
  try {
    return JSON.parse(raw) as KitchenSlice;
  } catch {
    return null;
  }
}

export async function dropKitchen(userId: string): Promise<void> {
  await AsyncStorage.removeItem(vaultKey(userId));
}
