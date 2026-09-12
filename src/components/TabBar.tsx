import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { TabName } from '../navigation';
import { colors, fonts } from '../theme';
import { FridgeMark } from './FridgeMark';
import { PantryMark } from './PantryMark';
import { SavedMark } from './SavedMark';
import { ShopMark } from './ShopMark';
import { TonightMark } from './TonightMark';

const SIDE_TABS: {
  key: Exclude<TabName, 'scan'>;
  label: string;
  Mark: typeof TonightMark;
}[] = [
  { key: 'tonight', label: 'Tonight', Mark: TonightMark },
  { key: 'pantry', label: 'Pantry', Mark: PantryMark },
  { key: 'shop', label: 'Shop', Mark: ShopMark },
  { key: 'impact', label: 'Saved', Mark: SavedMark },
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
      <SideTab
        label={SIDE_TABS[0].label}
        active={tab === 'tonight'}
        onPress={() => onChange('tonight')}
        mark={<TonightMark active={tab === 'tonight'} />}
      />
      <SideTab
        label={SIDE_TABS[1].label}
        active={tab === 'pantry'}
        onPress={() => onChange('pantry')}
        mark={<PantryMark active={tab === 'pantry'} />}
      />

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

      <SideTab
        label={SIDE_TABS[2].label}
        active={tab === 'shop'}
        onPress={() => onChange('shop')}
        mark={<ShopMark active={tab === 'shop'} />}
      />
      <SideTab
        label={SIDE_TABS[3].label}
        active={tab === 'impact'}
        onPress={() => onChange('impact')}
        mark={<SavedMark active={tab === 'impact'} />}
      />
    </View>
  );
}

function SideTab({
  label,
  active,
  onPress,
  mark,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
  mark: ReactNode;
}) {
  return (
    <Pressable onPress={onPress} style={styles.item}>
      {mark}
      <Text style={[styles.label, active && styles.labelActive]}>{label}</Text>
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
