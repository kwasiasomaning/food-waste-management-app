import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FoodStill } from '../components/FoodStill';
import { IngredientStill } from '../components/IngredientStill';
import { INGREDIENT_MAP } from '../data/ingredients';
import { expiryLabel, urgencyOf } from '../lib/dates';
import type { TabName } from '../navigation';
import { useKitchen } from '../store/kitchen';
import { colors, fonts, radius, traffic, urgencyCopy } from '../theme';
import type { PantryItem, Urgency } from '../types';

const ORDER: Urgency[] = ['tonight', 'soon', 'fresh', 'staple'];

export function PantryScreen({ onTab }: { onTab: (tab: TabName) => void }) {
  const pantry = useKitchen((s) => s.pantry);
  const markUsed = useKitchen((s) => s.markUsed);
  const binPantry = useKitchen((s) => s.binPantry);
  const setExpiryDays = useKitchen((s) => s.setExpiryDays);

  const groups = ORDER.map((urgency) => ({
    urgency,
    items: pantry.filter((item) => {
      const ingredient = INGREDIENT_MAP[item.ingredientId];
      return ingredient && urgencyOf(item, ingredient) === urgency;
    }),
  })).filter((group) => group.items.length > 0);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.kicker}>What you already paid for</Text>
        <Text style={styles.title}>Pantry</Text>
        {groups.length === 0 ? (
          <View style={styles.empty}>
            <FoodStill id="shelf" height={120} />
            <Text style={styles.emptyTitle}>Nothing logged yet.</Text>
            <Text style={styles.emptyBody}>Add the fridge and Tonight will have something to say.</Text>
            <Pressable style={styles.cta} onPress={() => onTab('scan')}>
              <Text style={styles.ctaText}>Add food</Text>
            </Pressable>
          </View>
        ) : (
          groups.map((group) => (
            <View key={group.urgency} style={styles.group}>
              <Text style={[styles.groupLabel, { color: traffic[group.urgency].ink }]}>
                {urgencyCopy[group.urgency]}
              </Text>
              {group.items.map((item) => (
                <PantryRow
                  key={item.id}
                  item={item}
                  onUsed={() => markUsed(item.id)}
                  onSooner={() => setExpiryDays(item.id, 1)}
                  onBinned={() => binPantry(item.id)}
                />
              ))}
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function PantryRow({
  item,
  onUsed,
  onSooner,
  onBinned,
}: {
  item: PantryItem;
  onUsed: () => void;
  onSooner: () => void;
  onBinned: () => void;
}) {
  const ingredient = INGREDIENT_MAP[item.ingredientId];
  if (!ingredient) return null;
  const urgency = urgencyOf(item, ingredient);
  const light = traffic[urgency];
  return (
    <View style={[styles.row, { backgroundColor: light.wash, borderColor: light.rail }]}>
      <View style={[styles.rail, { backgroundColor: light.rail }]} />
      <IngredientStill ingredientId={ingredient.id} size={48} radius={12} />
      <View style={styles.copy}>
        <Text style={styles.name}>{ingredient.name}</Text>
        <View style={styles.metaRow}>
          <View style={[styles.dot, { backgroundColor: light.rail }]} />
          <Text style={[styles.meta, { color: light.ink }]}>{expiryLabel(item.expiresAt)}</Text>
        </View>
      </View>
      {urgency === 'tonight' ? (
        <Pressable onPress={onBinned} style={[styles.tiny, styles.tinyBin]}>
          <Text style={styles.tinyBinText}>Binned</Text>
        </Pressable>
      ) : (
        <Pressable onPress={onSooner} style={styles.tiny}>
          <Text style={styles.tinyText}>Tonight</Text>
        </Pressable>
      )}
      <Pressable onPress={onUsed} style={styles.tiny}>
        <Text style={styles.tinyText}>Used</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.paper },
  scroll: { padding: 20, paddingBottom: 40 },
  kicker: { fontFamily: fonts.sansSemi, color: colors.inkSoft },
  title: { fontFamily: fonts.display, fontSize: 36, color: colors.ink, marginBottom: 18 },
  group: { marginBottom: 22, gap: 8 },
  groupLabel: {
    fontFamily: fonts.sansBold,
    fontSize: 12,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.cream,
    borderRadius: radius.md,
    paddingVertical: 12,
    paddingRight: 12,
    paddingLeft: 16,
    borderWidth: 1,
    borderColor: colors.line,
    overflow: 'hidden',
  },
  rail: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 5,
  },
  copy: { flex: 1 },
  name: { fontFamily: fonts.sansSemi, fontSize: 16, color: colors.ink },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 3 },
  dot: { width: 7, height: 7, borderRadius: 4 },
  meta: { fontFamily: fonts.sansSemi, fontSize: 13 },
  tiny: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: colors.paperDeep,
  },
  tinyText: { fontFamily: fonts.sansSemi, fontSize: 12, color: colors.ink },
  tinyBin: { backgroundColor: traffic.tonight.wash, borderWidth: 1, borderColor: traffic.tonight.rail },
  tinyBinText: { fontFamily: fonts.sansSemi, fontSize: 12, color: traffic.tonight.ink },
  empty: { marginTop: 24, gap: 12 },
  emptyTitle: { fontFamily: fonts.display, fontSize: 26, color: colors.ink },
  emptyBody: { fontFamily: fonts.sans, color: colors.inkSoft, fontSize: 16 },
  cta: {
    alignSelf: 'flex-start',
    backgroundColor: colors.terracotta,
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  ctaText: { fontFamily: fonts.sansBold, color: colors.cream },
});
