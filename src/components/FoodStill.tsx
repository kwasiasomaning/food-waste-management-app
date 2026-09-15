import { Image, StyleSheet, type ImageSourcePropType, type ImageStyle, type StyleProp } from 'react-native';

import { FOOD_PHOTOS, ONBOARDING_PHOTOS } from '../data/foodPhotos';
import type { FoodPhotoId, OnboardingStillId } from '../lib/foodPhoto';
import { radius as radii } from '../theme';

export function FoodStill({
  id,
  source,
  height = 140,
  radius = radii.lg,
  style,
}: {
  id?: FoodPhotoId | OnboardingStillId;
  source?: ImageSourcePropType;
  height?: number;
  radius?: number;
  style?: StyleProp<ImageStyle>;
}) {
  const resolved =
    source ??
    (id ? ONBOARDING_PHOTOS[id as OnboardingStillId] ?? FOOD_PHOTOS[id as FoodPhotoId] : undefined);
  if (!resolved) return null;

  return (
    <Image
      source={resolved}
      accessibilityIgnoresInvertColors
      resizeMode="cover"
      style={[styles.image, { height, borderRadius: radius }, style]}
    />
  );
}

const styles = StyleSheet.create({
  image: {
    width: '100%',
    backgroundColor: '#E8DCCB',
  },
});
