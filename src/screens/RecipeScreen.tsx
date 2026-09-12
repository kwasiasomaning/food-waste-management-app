import * as Haptics from 'expo-haptics';
import { Image, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { IngredientStill } from '../components/IngredientStill';
import { Button } from '../components/ui';
import { getIngredient } from '../data/ingredients';
import { findRecipe } from '../lib/mealCache';
import { recipeImageSource } from '../lib/recipeImage';
import { scoreRecipe } from '../lib/matching';
import { scaleAmount, servingLabel } from '../lib/servings';
import { useKitchen } from '../store/kitchen';
import { colors, fonts, radius } from '../theme';

export function RecipeScreen({
  id,
  onBack,
  onCooked,
}: {
  id: string;
  onBack: () => void;
  onCooked: (payload: { recipeId: string; savedUsd: number; savedKg: number }) => void;
}) {
  const pantry = useKitchen((s) => s.pantry);
  const diet = useKitchen((s) => s.settings.diet);
  const householdSize = useKitchen((s) => s.settings.householdSize);
  const addToShop = useKitchen((s) => s.addToShop);
  const cookRecipe = useKitchen((s) => s.cookRecipe);
  const recipe = findRecipe(id);

  if (!recipe) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={styles.title}>Recipe gone missing.</Text>
        <Button label="Back" onPress={onBack} />
      </SafeAreaView>
    );
  }

  const scored = scoreRecipe(recipe, pantry, diet);
  const have = new Set(scored?.have ?? []);
  const missing = new Set(scored?.missing ?? []);

  const cook = async () => {
    const meal = cookRecipe(recipe.id);
    if (!meal) return;
    if (Platform.OS !== 'web') {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    onCooked({ recipeId: meal.recipeId, savedUsd: meal.savedUsd, savedKg: meal.savedKg });
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Pressable onPress={onBack}>
          <Text style={styles.back}>← Tonight</Text>
        </Pressable>
        <Image source={recipeImageSource(recipe)} resizeMode="cover" style={styles.hero} />
        <Text style={styles.title}>{recipe.title}</Text>
        <Text style={styles.sub}>{recipe.subtitle}</Text>
        <Text style={styles.meta}>
          {recipe.minutes} min · {servingLabel(householdSize)}
        </Text>
        <Text style={styles.rescue}>{recipe.rescue}</Text>

        <Text style={styles.section}>In the pan</Text>
        {recipe.ingredients.map((line) => {
          const ingredient = getIngredient(line.ingredientId);
          const owned = have.has(line.ingredientId) || ingredient.isStaple;
          const need = missing.has(line.ingredientId);
          return (
            <View key={line.ingredientId + line.amount} style={styles.ing}>
              <IngredientStill ingredientId={ingredient.id} size={40} radius={10} />
              <View style={{ flex: 1 }}>
                <Text style={styles.ingName}>{ingredient.name}</Text>
                <Text style={styles.ingAmt}>
                  {scaleAmount(line.amount, recipe.servings, householdSize)}
                  {line.optional ? ' · if you have it' : ''}
                </Text>
              </View>
              {need ? (
                <Pressable onPress={() => addToShop(line.ingredientId, `For ${recipe.title}`)}>
                  <Text style={styles.shop}>Shop</Text>
                </Pressable>
              ) : (
                <Text style={[styles.flag, owned && { color: colors.sage }]}>
                  {owned ? 'Have' : line.optional ? 'Optional' : ''}
                </Text>
              )}
            </View>
          );
        })}

        <Text style={styles.section}>How</Text>
        {recipe.steps.map((step, index) => (
          <View key={step} style={styles.step}>
            <Text style={styles.num}>{index + 1}</Text>
            <Text style={styles.stepText}>{step}</Text>
          </View>
        ))}
      </ScrollView>
      <View style={styles.footer}>
        <Button label="I made this" onPress={cook} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.paper },
  scroll: { padding: 20, paddingBottom: 32 },
  back: { fontFamily: fonts.sansSemi, color: colors.terracotta, marginBottom: 12 },
  hero: {
    width: '100%',
    height: 168,
    borderRadius: radius.lg,
    backgroundColor: colors.paperDeep,
  },
  title: { fontFamily: fonts.display, fontSize: 32, lineHeight: 36, color: colors.ink, marginTop: 16 },
  sub: { fontFamily: fonts.sans, fontSize: 17, color: colors.inkSoft, marginTop: 8 },
  meta: { fontFamily: fonts.sansSemi, color: colors.ink, marginTop: 8 },
  rescue: {
    fontFamily: fonts.sans,
    color: colors.terracottaDeep,
    marginTop: 12,
    marginBottom: 8,
    lineHeight: 22,
  },
  section: {
    fontFamily: fonts.display,
    fontSize: 22,
    color: colors.ink,
    marginTop: 22,
    marginBottom: 10,
  },
  ing: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  ingName: { fontFamily: fonts.sansSemi, color: colors.ink },
  ingAmt: { fontFamily: fonts.sans, color: colors.inkSoft, fontSize: 13 },
  shop: { fontFamily: fonts.sansBold, color: colors.terracotta },
  flag: { fontFamily: fonts.sansSemi, color: colors.inkSoft, fontSize: 12 },
  step: { flexDirection: 'row', gap: 12, marginBottom: 14 },
  num: {
    fontFamily: fonts.display,
    fontSize: 20,
    color: colors.terracotta,
    width: 22,
  },
  stepText: { flex: 1, fontFamily: fonts.sans, fontSize: 16, lineHeight: 23, color: colors.ink },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    backgroundColor: colors.cream,
  },
});
