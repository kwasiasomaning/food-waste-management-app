import { StyleSheet, View } from 'react-native';

import { colors } from '../theme';

export function ShopMark({ active = false }: { active?: boolean }) {
  const stroke = active ? colors.ink : colors.inkSoft;
  return (
    <View style={styles.wrap} accessibilityElementsHidden>
      <View style={styles.handles}>
        <View style={[styles.handle, { borderColor: stroke }]} />
        <View style={[styles.handle, { borderColor: stroke }]} />
      </View>
      <View style={[styles.bag, { borderColor: stroke }]}>
        <View style={[styles.fold, { backgroundColor: stroke }]} />
      </View>
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
  handles: {
    flexDirection: 'row',
    gap: 4,
    height: 6,
    zIndex: 1,
  },
  handle: {
    width: 6,
    height: 7,
    borderWidth: 1.6,
    borderBottomWidth: 0,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  bag: {
    width: 16,
    height: 11,
    marginTop: -1,
    borderWidth: 1.6,
    borderRadius: 2,
    alignItems: 'center',
  },
  fold: {
    width: 10,
    height: 1.4,
    marginTop: 2.5,
    opacity: 0.85,
  },
});
