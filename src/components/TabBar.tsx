import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { TabName } from '../navigation';
import { colors, fonts } from '../theme';

const SIDE_TABS: { key: Exclude<TabName, 'scan'>; label: string; icon: string }[] = [
  { key: 'tonight', label: 'Tonight', icon: '🍽️' },
  { key: 'pantry', label: 'Pantry', icon: '🧊' },
  { key: 'shop', label: 'Shop', icon: '🧺' },
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
        <View style={styles.snapRow}>
          <Pressable
            onPress={onRoll}
            style={styles.roll}
            accessibilityRole="button"
            accessibilityLabel="Upload a fridge photo"
          >
            <View style={styles.rollPic} />
            <View style={styles.rollHill} />
          </Pressable>
          <Pressable
            onPress={onSnap}
            style={({ pressed }) => [styles.shutter, pressed && styles.shutterPressed]}
            accessibilityRole="button"
            accessibilityLabel="Take a fridge photo"
          >
            <View style={styles.shutterRing}>
              <View style={styles.shutterLens} />
            </View>
          </Pressable>
        </View>
        <Pressable onPress={() => onChange('scan')} hitSlop={6}>
          <Text style={[styles.label, tab === 'scan' && styles.labelActive]}>Snap</Text>
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
    paddingTop: 10,
    paddingBottom: 12,
    paddingHorizontal: 4,
  },
  item: { flex: 1, alignItems: 'center', gap: 3, paddingBottom: 2 },
  icon: { fontSize: 16 },
  snapCol: {
    width: 108,
    alignItems: 'center',
    marginTop: -28,
  },
  snapRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  roll: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: colors.paperDeep,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'flex-end',
    overflow: 'hidden',
    marginBottom: 6,
  },
  rollPic: {
    position: 'absolute',
    top: 6,
    left: 7,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.amber,
  },
  rollHill: {
    width: 22,
    height: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: colors.sage,
    opacity: 0.7,
  },
  shutter: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: colors.terracotta,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.terracottaDeep,
    shadowOpacity: 0.28,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  shutterPressed: { transform: [{ scale: 0.96 }], backgroundColor: colors.terracottaDeep },
  shutterRing: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: colors.cream,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterLens: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.terracottaDeep,
  },
  label: {
    fontFamily: fonts.sansSemi,
    fontSize: 11,
    color: colors.inkSoft,
    marginTop: 3,
  },
  labelActive: { color: colors.ink },
});
