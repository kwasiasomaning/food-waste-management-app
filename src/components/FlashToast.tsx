import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, fonts, radius } from '../theme';

export const SHOP_TOAST_MS = 4000;

export function FlashToast({
  message,
}: {
  message: { text: string; id: number } | null;
}) {
  const [shown, setShown] = useState<string | null>(null);

  useEffect(() => {
    if (!message) return;
    setShown(message.text);
    const hide = setTimeout(() => setShown(null), SHOP_TOAST_MS);
    return () => clearTimeout(hide);
  }, [message?.id, message?.text]);

  if (!shown) return null;

  return (
    <View
      testID="shop-added-toast"
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
      style={styles.toast}
    >
      <Text style={styles.text}>{shown}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  toast: {
    backgroundColor: colors.sage,
    borderRadius: radius.pill,
    paddingVertical: 15,
    paddingHorizontal: 22,
    marginBottom: 10,
    alignItems: 'center',
  },
  text: {
    fontFamily: fonts.sansSemi,
    fontSize: 16,
    color: colors.cream,
    textAlign: 'center',
  },
});
