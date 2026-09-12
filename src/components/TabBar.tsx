import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { TabName } from '../navigation';
import { colors, fonts } from '../theme';
import { FridgeMark } from './FridgeMark';

const SIDE_TABS: { key: Exclude<TabName, 'scan'>; label: string; icon: string }[] = [
  { key: 'tonight', label: 'Tonight', icon: '🍽️' },
  { key: 'pantry', label: 'Pantry', icon: '🧊' },
  { key: 'shop', label: 'Shop', icon: '🛒' },
  { key: 'impact', label: 'Saved', icon: '🌱' },
];

export function TabBar({
  tab,
  onChange,
  onSnap,
  onRoll,
}: {
  tab: TabName;
  onChange: (tab: TabName) => void;
  onSnap: () => void;
  onRoll: () => void;
}) {
  return (
    <View style={styles.bar}>
      <SideTab item={SIDE_TABS[0]} active={tab === 'tonight'} onPress={() => onChange('tonight')} />
      <SideTab item={SIDE_TABS[1]} active={tab === 'pantry'} onPress={() => onChange('pantry')} />

      <View style={styles.snapCol}>
        <Pressable
          onPress={onSnap}
          onLongPress={onRoll}
          delayLongPress={350}
          style={({ pressed }) => [styles.fridgeBtn, pressed && styles.fridgePressed]}
          accessibilityRole="button"
          accessibilityLabel="Snap the fridge"
        >
          <FridgeMark size={28} />
        </Pressable>
        <Pressable onPress={() => onChange('scan')} hitSlop={6}>
          <Text style={[styles.label, tab === 'scan' && styles.labelActive]}>Add</Text>
        </Pressable>
      </View>

      <SideTab item={SIDE_TABS[2]} active={tab === 'shop'} onPress={() => onChange('shop')} />
      <SideTab item={SIDE_TABS[3]} active={tab === 'impact'} onPress={() => onChange('impact')} />
    </View>
  );
}

function SideTab({
  item,
  active,
  onPress,
}: {
  item: { key: string; label: string; icon: string };
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={styles.item}>
      <Text style={styles.icon}>{item.icon}</Text>
      <Text style={[styles.label, active && styles.labelActive]}>{item.label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: colors.line,
    backgroundColor: colors.cream,
    paddingTop: 8,
    paddingBottom: 12,
    paddingHorizontal: 4,
  },
  item: { flex: 1, alignItems: 'center', gap: 3, paddingBottom: 2 },
  icon: { fontSize: 16 },
  snapCol: {
    width: 56,
    alignItems: 'center',
    marginTop: -10,
  },
  fridgeBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fridgePressed: { opacity: 0.75, transform: [{ scale: 0.96 }] },
  label: {
    fontFamily: fonts.sansSemi,
    fontSize: 11,
    color: colors.inkSoft,
    marginTop: 2,
  },
  labelActive: { color: colors.ink },
});
