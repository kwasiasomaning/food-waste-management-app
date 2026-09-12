import type { ImageSourcePropType } from 'react-native';

import { MEAL_PHOTOS } from '../data/foodPhotos';
import { photoForRecipe } from './foodPhoto';

export function recipeImageSource(recipe: {
  id: string;
  title: string;
  emoji?: string;
  photoUri?: string;
}): ImageSourcePropType {
  if (recipe.photoUri) return { uri: recipe.photoUri };
  return MEAL_PHOTOS[photoForRecipe(recipe)];
}
