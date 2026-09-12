import { Image, StyleSheet, type ImageStyle, type StyleProp } from 'react-native';

import { FOOD_PHOTOS } from '../data/foodPhotos';
import type { FoodPhotoId } from '../lib/foodPhoto';
import { radius as radii } from '../theme';

export function FoodStill({
  id,
  height = 140,
  radius = radii.lg,
  style,
}: {
  id: FoodPhotoId;
  height?: number;
  radius?: number;
  style?: StyleProp<ImageStyle>;
}) {
  return (
    <Image
      source={FOOD_PHOTOS[id]}
      accessibilityIgnoresInvertColors
      style={[styles.image, { height, borderRadius: radius }, style]}
    />
  );
}

const styles = StyleSheet.create({
  image: {
    width: '100%',
    resizeMode: 'cover',
    backgroundColor: '#E8DCCB',
  },
});
