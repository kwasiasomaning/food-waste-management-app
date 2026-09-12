import { Image, StyleSheet, type ImageStyle, type StyleProp } from 'react-native';

import { INGREDIENT_PHOTOS } from '../data/foodPhotos';
import { photoForIngredient } from '../lib/foodPhoto';

export function IngredientStill({
  ingredientId,
  size = 44,
  radius = 10,
  style,
}: {
  ingredientId: string;
  size?: number;
  radius?: number;
  style?: StyleProp<ImageStyle>;
}) {
  return (
    <Image
      source={INGREDIENT_PHOTOS[photoForIngredient({ id: ingredientId })]}
      accessibilityIgnoresInvertColors
      style={[styles.thumb, { width: size, height: size, borderRadius: radius }, style]}
    />
  );
}

const styles = StyleSheet.create({
  thumb: {
    resizeMode: 'cover',
    backgroundColor: '#E8DCCB',
  },
});
