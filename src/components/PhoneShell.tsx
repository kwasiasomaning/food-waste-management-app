import type { ReactNode } from 'react';
import { Platform, StyleSheet, useWindowDimensions, View } from 'react-native';

import { colors } from '../theme';

export function PhoneShell({ children }: { children: ReactNode }) {
  const { width } = useWindowDimensions();
  const framed = Platform.OS === 'web' && width >= 520;

  if (!framed) {
    return <View style={styles.fill}>{children}</View>;
  }

  return (
    <View style={styles.stage}>
      <View style={styles.device}>
        <View style={styles.notch} />
        <View style={styles.screen}>{children}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1, backgroundColor: colors.paper },
  stage: {
    flex: 1,
    backgroundColor: colors.wood,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
  },
  device: {
    width: 390,
    height: 844,
    backgroundColor: colors.ink,
    borderRadius: 44,
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.45,
    shadowRadius: 40,
    shadowOffset: { width: 0, height: 18 },
  },
  notch: {
    position: 'absolute',
    top: 16,
    alignSelf: 'center',
    width: 118,
    height: 28,
    borderRadius: 16,
    backgroundColor: '#0C0A08',
    zIndex: 4,
  },
  screen: {
    flex: 1,
    backgroundColor: colors.paper,
    borderRadius: 34,
    overflow: 'hidden',
  },
});
