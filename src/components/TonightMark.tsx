import { StyleSheet, View } from 'react-native';

import { colors } from '../theme';

export function TonightMark({ active = false }: { active?: boolean }) {
  const stroke = active ? colors.ink : colors.inkSoft;
  return (
    <View style={styles.wrap} accessibilityElementsHidden>
      <View style={[styles.plate, { borderColor: stroke }]}>
        <View style={[styles.rim, { borderColor: stroke }]} />
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
  plate: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1.6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rim: {
    width: 7,
    height: 7,
    borderRadius: 4,
    borderWidth: 1.4,
    opacity: 0.85,
  },
});
