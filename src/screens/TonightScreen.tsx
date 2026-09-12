import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { RecipeCard } from '../components/RecipeCard';
import { WasteBriefCard } from '../components/WasteBriefCard';
import { Button, Display } from '../components/ui';
import { INGREDIENT_MAP } from '../data/ingredients';
import { expiryLabel, prettyDate, urgencyOf } from '../lib/dates';
import { missingShopList, suggestDinners } from '../lib/matching';
import { wasteBriefForSession } from '../lib/wasteBrief';
import type { TabName } from '../navigation';
import { useKitchen } from '../store/kitchen';
import { colors, fonts } from '../theme';

export function TonightScreen({
  onOpenRecipe,
  onTab,
  onSettings,
}: {
  onOpenRecipe: (id: string) => void;
  onTab: (tab: TabName) => void;
  onSettings: () => void;
}) {
  const [brief] = useState(wasteBriefForSession);
  const pantry = useKitchen((s) => s.pantry);
  const diet = useKitchen((s) => s.settings.diet);
  const addMissingToShop = useKitchen((s) => s.addMissingToShop);
  const suggestions = suggestDinners(pantry, diet, 3);
  const dying = pantry
    .filter((item) => {
      const ingredient = INGREDIENT_MAP[item.ingredientId];
      return ingredient && urgencyOf(item, ingredient) === 'tonight';
    })
    .map((item) => INGREDIENT_MAP[item.ingredientId]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.top}>
          <Text style={styles.date}>{prettyDate()}</Text>
          <Pressable onPress={onSettings} hitSlop={12}>
            <Text style={styles.gear}>Settings</Text>
          </Pressable>
        </View>
        <Display italic>Tonight.</Display>
        <WasteBriefCard brief={brief} />

        {dying.length > 0 ? (
          <Pressable style={styles.alert} onPress={() => onTab('pantry')}>
            <Text style={styles.alertEyebrow}>Will not last</Text>
            <Text style={styles.alertBody}>
              {dying.map((item) => item.name).join(', ')}
              {dying.length === 1 ? ' should be dinner, not compost.' : ' should be on the plate.'}
            </Text>
          </Pressable>
        ) : null}

        {suggestions.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>The kitchen is quiet.</Text>
            <Text style={styles.emptyBody}>
              Add what you already have. Tonight will rank dinners by what expires first.
            </Text>
            <Button label="Add the fridge" onPress={() => onTab('scan')} />
          </View>
        ) : (
          <View style={styles.list}>
            <RecipeCard
              featured
              scored={suggestions[0]}
              onPress={() => onOpenRecipe(suggestions[0].recipe.id)}
            />
            {suggestions.slice(1).map((row) => (
              <RecipeCard
                key={row.recipe.id}
                scored={row}
                onPress={() => onOpenRecipe(row.recipe.id)}
              />
            ))}
            {missingShopList(suggestions).length > 0 ? (
              <Button
                variant="ghost"
                label="Add the missing bits to Shop"
                onPress={() => {
                  addMissingToShop(missingShopList(suggestions));
                  onTab('shop');
                }}
              />
            ) : null}
          </View>
        )}

        {pantry.length > 0 ? (
          <Text style={styles.foot}>
            {pantry.length} items in the kitchen
            {dying[0]
              ? ` · ${dying[0].name} ${expiryLabel(
                  pantry.find((item) => item.ingredientId === dying[0].id)!.expiresAt,
                ).toLowerCase()}`
              : ''}
          </Text>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.paper },
  scroll: { padding: 20, paddingBottom: 36, gap: 14 },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  date: { fontFamily: fonts.sansSemi, color: colors.inkSoft },
  gear: { fontFamily: fonts.sansSemi, color: colors.terracotta },
  alert: {
    backgroundColor: colors.amberSoft,
    borderRadius: 20,
    padding: 14,
  },
  alertEyebrow: {
    fontFamily: fonts.sansBold,
    color: colors.terracottaDeep,
    fontSize: 12,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  alertBody: {
    fontFamily: fonts.sans,
    color: colors.ink,
    marginTop: 4,
    fontSize: 16,
  },
  list: { gap: 12, marginTop: 4 },
  empty: { gap: 14, marginTop: 24 },
  emptyTitle: { fontFamily: fonts.display, fontSize: 28, color: colors.ink },
  emptyBody: { fontFamily: fonts.sans, color: colors.inkSoft, fontSize: 16, lineHeight: 23 },
  foot: { fontFamily: fonts.sans, color: colors.inkSoft, marginTop: 8 },
});
