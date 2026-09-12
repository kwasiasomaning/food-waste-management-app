import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { TabName } from '../navigation';
import { colors, fonts } from '../theme';

const TABS: { key: TabName; label: string; icon: string }[] = [
  { key: 'tonight', label: 'Tonight', icon: '🍽️' },
  { key: 'pantry', label: 'Pantry', icon: '🧊' },
  { key: 'scan', label: 'Add', icon: '+' },
  { key: 'shop', label: 'Shop', icon: '🧺' },
  { key: 'impact', label: 'Saved', icon: '🌱' },
];

export function TabBar({
  tab,
  onChange,
}: {
  tab: TabName;
  onChange: (tab: TabName) => void;
}) {
  return (
    <View style={styles.bar}>
      {TABS.map((item) => {
        const active = item.key === tab;
        const scan = item.key === 'scan';
        return (
          <Pressable
            key={item.key}
            onPress={() => onChange(item.key)}
            style={styles.item}
          >
            <View style={[scan && styles.scan, scan && active && styles.scanActive]}>
              <Text style={[styles.icon, scan && styles.scanIcon]}>{item.icon}</Text>
            </View>
            <Text style={[styles.label, active && styles.labelActive]}>{item.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.line,
    backgroundColor: colors.cream,
    paddingTop: 8,
    paddingBottom: 14,
    paddingHorizontal: 6,
  },
  item: { flex: 1, alignItems: 'center', gap: 3 },
  icon: { fontSize: 16 },
  scan: {
    width: 42,
    height: 42,
    marginTop: -18,
    borderRadius: 21,
    backgroundColor: colors.terracotta,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanActive: { backgroundColor: colors.terracottaDeep },
  scanIcon: { color: colors.cream, fontSize: 24, lineHeight: 26, marginTop: -2 },
  label: {
    fontFamily: fonts.sansSemi,
    fontSize: 11,
    color: colors.inkSoft,
  },
  labelActive: { color: colors.ink },
});
