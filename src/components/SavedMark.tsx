import { StyleSheet, View } from 'react-native';

import { colors } from '../theme';

export function SavedMark({ active = false }: { active?: boolean }) {
  const stroke = active ? colors.ink : colors.inkSoft;
  return (
    <View style={styles.wrap} accessibilityElementsHidden>
      <View style={[styles.stem, { backgroundColor: stroke }]} />
      <View style={[styles.leaf, styles.leafLeft, { borderColor: stroke }]} />
      <View style={[styles.leaf, styles.leafRight, { borderColor: stroke }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: 20,
    height: 18,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  stem: {
    width: 1.6,
    height: 11,
    borderRadius: 1,
  },
  leaf: {
    position: 'absolute',
    width: 7,
    height: 8,
    borderWidth: 1.5,
    borderRadius: 7,
  },
  leafLeft: {
    left: 2,
    top: 2,
    borderBottomRightRadius: 1,
  },
  leafRight: {
    right: 2,
    top: 5,
    borderBottomLeftRadius: 1,
  },
});
