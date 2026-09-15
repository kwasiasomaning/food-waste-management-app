import { Linking, Platform } from 'react-native';

import { openUberEatsToAddItem, uberEatsGroceryItemName } from './uberEatsApp';

export function openShopItemInUberEats(ingredientId: string) {
  return openUberEatsToAddItem(uberEatsGroceryItemName(ingredientId), {
    platform: Platform.OS,
    linking: {
      canOpenURL: (url) => Linking.canOpenURL(url),
      openURL: (url) => Linking.openURL(url),
    },
  });
}
