import { useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

import { FoodStill } from '../components/FoodStill';
import { IngredientStill } from '../components/IngredientStill';
import { Button } from '../components/ui';
import { getIngredient } from '../data/ingredients';
import { openShopItemInUberEats } from '../lib/grocery/openOnDevice';
import { useKitchen } from '../store/kitchen';
import { colors, fonts, radius } from '../theme';

export function UberEatsBasketScreen({
  ingredientIds,
  onBack,
}: {
  ingredientIds: string[];
  onBack: () => void;
}) {
  const shop = useKitchen((s) => s.shop);
  const buyShopItems = useKitchen((s) => s.buyShopItems);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [openedIds, setOpenedIds] = useState<string[]>([]);

  const ids = ingredientIds.filter((id, index) => ingredientIds.indexOf(id) === index);
  const stillHere = ids.filter((id) => shop.some((item) => item.ingredientId === id));

  const addOne = async (ingredientId: string) => {
    if (busyId) return;
    setBusyId(ingredientId);
    setError(null);
    try {
      const result = await openShopItemInUberEats(ingredientId);
      const name = getIngredient(ingredientId).name;
      setOpenedIds((current) => (current.includes(ingredientId) ? current : [...current, ingredientId]));
      setNote(
        result.opened === 'app'
          ? `Uber Eats opened with ${name}. Add it to your basket, then come back.`
          : `Uber Eats grocery search opened with ${name}. Add it to your basket there.`,
      );
      if (Platform.OS !== 'web') {
        await Haptics.selectionAsync();
      }
    } catch (issue: unknown) {
      setError(issue instanceof Error ? issue.message : 'Could not open Uber Eats.');
    } finally {
      setBusyId(null);
    }
  };

  if (!ids.length) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.top}>
          <Pressable onPress={onBack} hitSlop={8}>
            <Text style={styles.back}>← Shop</Text>
          </Pressable>
        </View>
        <Text style={[styles.title, { paddingHorizontal: 20 }]}>Nothing to add.</Text>
        <View style={{ padding: 20 }}>
          <Button label="Back to Shop" onPress={onBack} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.top}>
        <Pressable onPress={onBack} hitSlop={8}>
          <Text style={styles.back}>← Shop</Text>
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <FoodStill id="citrus" height={100} />
        <Text style={styles.kicker}>Uber Eats</Text>
        <Text style={styles.title}>Add to basket</Text>
        <Text style={styles.lede}>
          Tonight opens Uber Eats with each missing item. Add it to your basket there. Tonight
          cannot drop it in for you — your Uber account holds the cart.
        </Text>

        {stillHere.map((ingredientId) => {
          const ingredient = getIngredient(ingredientId);
          const opened = openedIds.includes(ingredientId);
          return (
            <View key={ingredientId} style={styles.card}>
              <View style={styles.cardTop}>
                <IngredientStill ingredientId={ingredient.id} size={40} radius={10} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.name}>{ingredient.name}</Text>
                  <Text style={styles.meta}>{opened ? 'Opened in Uber Eats' : 'Ready to add'}</Text>
                </View>
              </View>
              <Button
                variant="sage"
                label={
                  busyId === ingredientId
                    ? 'Opening Uber Eats…'
                    : opened
                      ? 'Open Uber Eats again'
                      : 'Add to Uber Eats basket'
                }
                onPress={() => void addOne(ingredientId)}
                disabled={busyId !== null}
              />
              {opened ? (
                <Button
                  variant="ghost"
                  label="It's in my basket"
                  onPress={() => buyShopItems([ingredientId])}
                  disabled={busyId !== null}
                />
              ) : null}
            </View>
          );
        })}

        {stillHere.length === 0 ? (
          <Text style={styles.lede}>Those bits are off the Shop list. Pantry has them when you ticked the basket.</Text>
        ) : null}

        {note ? <Text style={styles.note}>{note}</Text> : null}
        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Button label="Back to Shop" onPress={onBack} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.paper },
  top: {
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 4,
  },
  scroll: { padding: 20, paddingTop: 12, paddingBottom: 48, gap: 12 },
  back: { fontFamily: fonts.sansSemi, color: colors.terracotta },
  kicker: { fontFamily: fonts.sansSemi, color: colors.inkSoft },
  title: { fontFamily: fonts.display, fontSize: 36, color: colors.ink },
  lede: { fontFamily: fonts.sans, color: colors.inkSoft, lineHeight: 22 },
  card: {
    backgroundColor: colors.cream,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 14,
    gap: 10,
  },
  cardTop: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  name: { fontFamily: fonts.sansSemi, fontSize: 18, color: colors.ink },
  meta: { fontFamily: fonts.sans, color: colors.inkSoft, marginTop: 2 },
  note: { fontFamily: fonts.sansSemi, color: colors.sage, lineHeight: 22 },
  error: { fontFamily: fonts.sansSemi, color: colors.terracottaDeep, lineHeight: 20 },
});
