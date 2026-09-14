import { useEffect, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, fonts, radius } from '../theme';

export const SHOP_TOAST_MS = 2200;

export function FlashToast({
  label,
  accessibilityLabel,
  onHidden,
}: {
  label: string;
  accessibilityLabel?: string;
  onHidden?: () => void;
}) {
  const onHiddenRef = useRef(onHidden);
  onHiddenRef.current = onHidden;

  useEffect(() => {
    const hide = setTimeout(() => onHiddenRef.current?.(), SHOP_TOAST_MS);
    return () => clearTimeout(hide);
  }, []);

  return (
    <View
      testID="shop-added-toast"
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
      accessibilityLabel={accessibilityLabel ?? label}
      style={styles.toast}
    >
      <Text style={styles.text} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  toast: {
    backgroundColor: colors.sageSoft,
    borderRadius: radius.pill,
    paddingVertical: 8,
    paddingHorizontal: 12,
    maxWidth: 152,
    justifyContent: 'center',
  },
  text: {
    fontFamily: fonts.sansSemi,
    fontSize: 12,
    color: colors.sage,
  },
});
