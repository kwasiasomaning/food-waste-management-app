import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FoodStill } from '../components/FoodStill';
import { IngredientStill } from '../components/IngredientStill';
import { Button } from '../components/ui';
import { getIngredient } from '../data/ingredients';
import { missingShopList, suggestDinners } from '../lib/matching';
import { useKitchen } from '../store/kitchen';
import { colors, fonts, radius } from '../theme';

export function ShopScreen() {
  const pantry = useKitchen((s) => s.pantry);
  const diet = useKitchen((s) => s.settings.diet);
  const shop = useKitchen((s) => s.shop);
  const addMissingToShop = useKitchen((s) => s.addMissingToShop);
  const toggleShop = useKitchen((s) => s.toggleShop);
  const buyChecked = useKitchen((s) => s.buyChecked);
  const clearShop = useKitchen((s) => s.clearShop);

  const suggested = missingShopList(suggestDinners(pantry, diet, 3));

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.kicker}>Only what dinner is missing</Text>
        <Text style={styles.title}>Shop</Text>
        <Text style={styles.lede}>
          Not a grocery list. Two staples so you can cook what is already dying at home.
        </Text>

        {shop.length === 0 ? (
          <View style={styles.empty}>
            <FoodStill id="citrus" height={120} />
            <Text style={styles.emptyTitle}>Nothing to buy.</Text>
            <Text style={styles.emptyBody}>
              If Tonight needs one or two things, they land here. You can pull them from tonight’s
              dinners.
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
                <Pressable
                  key={item.ingredientId}
                  onPress={() => toggleShop(item.ingredientId)}
                  style={styles.row}
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
              );
            })}
            <Button label="I bought the checked ones" onPress={buyChecked} />
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
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    backgroundColor: colors.cream,
    borderRadius: radius.md,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.line,
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
});
