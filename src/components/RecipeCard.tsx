import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { FOOD_PHOTOS } from '../data/foodPhotos';
import { getIngredient } from '../data/ingredients';
import { photoForRecipe } from '../lib/foodPhoto';
import type { ScoredRecipe } from '../types';
import { colors, fonts, radius } from '../theme';

export function RecipeCard({
  scored,
  featured,
  onPress,
}: {
  scored: ScoredRecipe;
  featured?: boolean;
  onPress: () => void;
}) {
  const dying = scored.expiringUsed.map((id) => getIngredient(id).name);
  const missing = scored.missing.map((id) => getIngredient(id).name);
  const photo = FOOD_PHOTOS[photoForRecipe(scored.recipe)];

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [featured ? styles.featured : styles.row, pressed && { opacity: 0.92 }]}
    >
      <Image source={photo} resizeMode="cover" style={featured ? styles.plateWide : styles.plate} />
      <View style={featured ? styles.copyFeatured : styles.copy}>
        <Text style={[styles.title, featured && styles.titleFeatured]}>{scored.recipe.title}</Text>
        <Text style={styles.meta}>
          {scored.recipe.minutes} min
          {missing.length === 0 ? ' · nothing to buy' : ` · ${missing.length} to buy`}
        </Text>
        {dying.length > 0 ? (
          <Text style={styles.rescue}>Uses {dying.slice(0, 2).join(' · ')}</Text>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 14,
    padding: 14,
    backgroundColor: colors.cream,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
  },
  featured: {
    backgroundColor: colors.cream,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.line,
    overflow: 'hidden',
  },
  plate: {
    width: 64,
    height: 64,
    borderRadius: radius.md,
    backgroundColor: colors.paperDeep,
  },
  plateWide: {
    height: 148,
    width: '100%',
    backgroundColor: colors.paperDeep,
  },
  copy: { flex: 1, paddingVertical: 4, paddingRight: 4 },
  copyFeatured: { padding: 16, paddingTop: 12 },
  title: {
    fontFamily: fonts.display,
    fontSize: 20,
    color: colors.ink,
    lineHeight: 24,
  },
  titleFeatured: { fontSize: 28, lineHeight: 32 },
  meta: {
    fontFamily: fonts.sans,
    color: colors.inkSoft,
    marginTop: 4,
  },
  rescue: {
    fontFamily: fonts.sansSemi,
    color: colors.terracotta,
    marginTop: 6,
  },
});
