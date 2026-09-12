import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fonts, radius } from '../theme';

export function ConsentCheck({
  checked,
  onToggle,
  label,
  accessibilityLabel,
}: {
  checked: boolean;
  onToggle: () => void;
  label: ReactNode;
  accessibilityLabel: string;
}) {
  return (
    <Pressable
      onPress={onToggle}
      style={styles.row}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      accessibilityLabel={accessibilityLabel}
    >
      <View style={[styles.box, checked && styles.boxOn]}>
        {checked ? <Text style={styles.tick}>✓</Text> : null}
      </View>
      <View style={styles.label}>{label}</View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, paddingVertical: 4 },
  box: {
    width: 22,
    height: 22,
    borderRadius: radius.sm / 2,
    borderWidth: 1.5,
    borderColor: colors.inkSoft,
    backgroundColor: colors.cream,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  boxOn: { backgroundColor: colors.ink, borderColor: colors.ink },
  tick: { color: colors.cream, fontSize: 13, fontFamily: fonts.sansBold, lineHeight: 16 },
  label: { flex: 1 },
});
