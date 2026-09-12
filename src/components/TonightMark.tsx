import { StyleSheet, View } from 'react-native';

import { colors } from '../theme';

export function TonightMark({ active = false }: { active?: boolean }) {
  const stroke = active ? colors.ink : colors.inkSoft;
  return (
    <View style={styles.wrap} accessibilityElementsHidden>
      <View style={styles.fork}>
        <View style={styles.tines}>
          <View style={[styles.tine, { backgroundColor: stroke }]} />
          <View style={[styles.tine, { backgroundColor: stroke }]} />
          <View style={[styles.tine, { backgroundColor: stroke }]} />
        </View>
        <View style={[styles.forkJoin, { backgroundColor: stroke }]} />
        <View style={[styles.handle, { backgroundColor: stroke }]} />
      </View>

      <View style={[styles.plate, { borderColor: stroke }]}>
        <View style={[styles.rim, { borderColor: stroke }]} />
      </View>

      <View style={styles.knife}>
        <View style={[styles.blade, { borderColor: stroke }]} />
        <View style={[styles.guard, { backgroundColor: stroke }]} />
        <View style={[styles.handle, { backgroundColor: stroke }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: 22,
    height: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 1.5,
  },
  fork: {
    width: 5,
    height: 16,
    alignItems: 'center',
    transform: [{ rotate: '-10deg' }],
  },
  tines: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 0.7,
    height: 6.5,
  },
  tine: {
    width: 1.4,
    height: 6.5,
    borderRadius: 1,
  },
  forkJoin: {
    width: 5,
    height: 1.4,
    marginTop: -0.4,
    borderRadius: 1,
  },
  handle: {
    width: 1.5,
    height: 7.5,
    borderRadius: 1,
  },
  plate: {
    width: 11,
    height: 11,
    borderRadius: 6,
    borderWidth: 1.6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rim: {
    width: 4.5,
    height: 4.5,
    borderRadius: 3,
    borderWidth: 1.3,
    opacity: 0.85,
  },
  knife: {
    width: 4,
    height: 16,
    alignItems: 'center',
    transform: [{ rotate: '10deg' }],
  },
  blade: {
    width: 3.2,
    height: 7.5,
    borderWidth: 1.5,
    borderBottomWidth: 0,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 1.2,
  },
  guard: {
    width: 3.4,
    height: 1.4,
    borderRadius: 1,
    marginTop: -0.2,
  },
});
