import { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';

import { colors, fonts, radius } from '../theme';

export function FlashToast({
  message,
}: {
  message: { text: string; id: number } | null;
}) {
  const opacity = useRef(new Animated.Value(0)).current;
  const [shown, setShown] = useState<string | null>(null);

  useEffect(() => {
    if (!message) return;
    setShown(message.text);
    opacity.setValue(0);
    const anim = Animated.sequence([
      Animated.timing(opacity, { toValue: 1, duration: 160, useNativeDriver: false }),
      Animated.delay(1800),
      Animated.timing(opacity, { toValue: 0, duration: 280, useNativeDriver: false }),
    ]);
    anim.start(({ finished }) => {
      if (finished) setShown(null);
    });
    return () => anim.stop();
  }, [message?.id, message?.text, opacity]);

  if (!shown) return null;

  return (
    <Animated.View
      pointerEvents="none"
      accessibilityLiveRegion="polite"
      style={[styles.toast, { opacity }]}
    >
      <Text style={styles.text}>{shown}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 100,
    backgroundColor: colors.sage,
    borderRadius: radius.md,
    paddingVertical: 14,
    paddingHorizontal: 16,
    zIndex: 50,
    elevation: 8,
    shadowColor: '#1B1713',
    shadowOpacity: 0.22,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  text: {
    fontFamily: fonts.sansSemi,
    fontSize: 16,
    color: colors.cream,
    textAlign: 'center',
  },
});
