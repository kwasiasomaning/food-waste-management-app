import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FoodStill } from '../components/FoodStill';
import { IngredientStill } from '../components/IngredientStill';
import { Button } from '../components/ui';
import { getIngredient } from '../data/ingredients';
import { openShopItemInUberEats } from '../lib/grocery/openOnDevice';
import { shopIdsForDelivery } from '../lib/grocery';
import { missingShopList, suggestDinners } from '../lib/matching';
import { useKitchen } from '../store/kitchen';
import { colors, fonts, radius } from '../theme';

export function ShopScreen({ onAddInUberEats }: { onAddInUberEats: (ingredientIds: string[]) => void }) {
  const pantry = useKitchen((s) => s.pantry);
  const diet = useKitchen((s) => s.settings.diet);
  const cuisine = useKitchen((s) => s.settings.cuisine ?? 'any');
  const shop = useKitchen((s) => s.shop);
  const addMissingToShop = useKitchen((s) => s.addMissingToShop);
  const toggleShop = useKitchen((s) => s.toggleShop);
  const buyChecked = useKitchen((s) => s.buyChecked);
  const clearShop = useKitchen((s) => s.clearShop);
  const deliverIds = shopIdsForDelivery(shop);
  const checkedCount = shop.filter((item) => item.checked).length;
  const [handoffNote, setHandoffNote] = useState<string | null>(null);

  const suggested = missingShopList(suggestDinners(pantry, diet, 3, Date.now(), cuisine));

  const addOneInUberEats = async (ingredientId: string) => {
    try {
      const result = await openShopItemInUberEats(ingredientId);
      const name = getIngredient(ingredientId).name;
      setHandoffNote(
        result.opened === 'app'
          ? `Uber Eats opened with ${name}. Add it to your basket.`
          : `Uber Eats grocery search opened with ${name}. Add it to your basket there.`,
      );
    } catch (issue: unknown) {
      setHandoffNote(issue instanceof Error ? issue.message : 'Could not open Uber Eats.');
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.kicker}>Only what dinner is missing</Text>
        <Text style={styles.title}>Shop</Text>
        <Text style={styles.lede}>
          Not a grocery list. Two staples so you can cook what is already dying at home. Tick what
          you bought in person, or add a missing bit to your Uber Eats basket.
        </Text>

        {shop.length === 0 ? (
          <View style={styles.empty}>
            <FoodStill id="citrus" height={120} />
            <Text style={styles.emptyTitle}>Nothing to buy.</Text>
            <Text style={styles.emptyBody}>
              If Tonight needs one or two things, they land here. You can pull them from tonight’s
              dinners, then add each one in Uber Eats.
            </Text>
            {suggested.length > 0 ? (
              <Button
                label="Add missing bits from tonight"
                onPress={() => addMissingToShop(suggested)}
              />
            ) : null}
          </View>
        ) : (
          <View style={styles.list}>
            {shop.map((item) => {
              const ingredient = getIngredient(item.ingredientId);
              return (
                <View key={item.ingredientId} style={styles.row}>
                  <Pressable
                    onPress={() => toggleShop(item.ingredientId)}
                    style={styles.rowMain}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: item.checked }}
                  >
                    <View style={[styles.box, item.checked && styles.boxOn]}>
                      <Text style={styles.check}>{item.checked ? '✓' : ''}</Text>
                    </View>
                    <IngredientStill ingredientId={ingredient.id} size={36} radius={9} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.name}>{ingredient.name}</Text>
                      <Text style={styles.reason}>{item.reason}</Text>
                    </View>
                  </Pressable>
                  <Pressable
                    onPress={() => void addOneInUberEats(item.ingredientId)}
                    hitSlop={6}
                    style={({ pressed }) => [styles.uberBtn, pressed && { opacity: 0.7 }]}
                    accessibilityRole="button"
                    accessibilityLabel={`Add ${ingredient.name} to Uber Eats basket`}
                  >
                    <Text style={styles.uberLabel}>Add in Uber Eats</Text>
                  </Pressable>
                </View>
              );
            })}
            <Button label="I bought the checked ones" onPress={buyChecked} />
            <Button
              variant="sage"
              label={
                deliverIds.length === 1
                  ? 'Add in Uber Eats'
                  : `Add ${deliverIds.length} in Uber Eats`
              }
              onPress={() => onAddInUberEats(deliverIds)}
            />
            <Text style={styles.hint}>
              {checkedCount > 0
                ? `${checkedCount} ticked ${checkedCount === 1 ? 'item opens' : 'items open'} in Uber Eats so you can add ${checkedCount === 1 ? 'it' : 'them'} to your basket.`
                : 'Nothing ticked — Uber Eats will open with each item on this list.'}
            </Text>
            {handoffNote ? <Text style={styles.note}>{handoffNote}</Text> : null}
            <Button variant="ghost" label="Clear list" onPress={clearShop} />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.paper },
  scroll: { padding: 20, paddingBottom: 40 },
  kicker: { fontFamily: fonts.sansSemi, color: colors.inkSoft },
  title: { fontFamily: fonts.display, fontSize: 36, color: colors.ink },
  lede: { fontFamily: fonts.sans, color: colors.inkSoft, marginTop: 8, marginBottom: 20, lineHeight: 22 },
  empty: { gap: 12, marginTop: 12 },
  emptyTitle: { fontFamily: fonts.display, fontSize: 26, color: colors.ink },
  emptyBody: { fontFamily: fonts.sans, color: colors.inkSoft, fontSize: 16, lineHeight: 23 },
  list: { gap: 10 },
  row: {
    backgroundColor: colors.cream,
    borderRadius: radius.md,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.line,
    gap: 10,
  },
  rowMain: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  box: {
    width: 26,
    height: 26,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxOn: { backgroundColor: colors.sage, borderColor: colors.sage },
  check: { color: colors.cream, fontWeight: '700' },
  name: { fontFamily: fonts.sansSemi, fontSize: 16, color: colors.ink },
  reason: { fontFamily: fonts.sans, color: colors.inkSoft, marginTop: 2 },
  uberBtn: {
    alignSelf: 'flex-start',
    marginLeft: 38,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: radius.sm,
    backgroundColor: colors.sageSoft,
  },
  uberLabel: { fontFamily: fonts.sansSemi, fontSize: 13, color: colors.sage },
  hint: { fontFamily: fonts.sans, color: colors.inkSoft, fontSize: 13, lineHeight: 19, paddingHorizontal: 4 },
  note: { fontFamily: fonts.sansSemi, color: colors.sage, fontSize: 14, lineHeight: 20, paddingHorizontal: 4 },
});
