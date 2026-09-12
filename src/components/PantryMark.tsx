import { StyleSheet, View } from 'react-native';

import { colors } from '../theme';

export function PantryMark({ active = false }: { active?: boolean }) {
  const stroke = active ? colors.ink : colors.inkSoft;
  return (
    <View style={styles.wrap} accessibilityElementsHidden>
      <View style={[styles.frame, { borderColor: stroke }]}>
        <View style={[styles.shelf, { backgroundColor: stroke }]} />
        <View style={[styles.shelf, styles.shelfLow, { backgroundColor: stroke }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: 20,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  frame: {
    width: 16,
    height: 15,
    borderWidth: 1.6,
    borderRadius: 2,
    overflow: 'hidden',
  },
  shelf: {
    position: 'absolute',
    left: 2,
    right: 2,
    top: 4,
    height: 1.4,
    opacity: 0.9,
  },
  shelfLow: { top: 8.5 },
});
