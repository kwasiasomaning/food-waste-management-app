import type { ImageSourcePropType } from 'react-native';

import type { FoodPhotoId, IngredientPhotoId } from '../lib/foodPhoto';

export type { FoodPhotoId, IngredientPhotoId };

export const FOOD_PHOTOS: Record<FoodPhotoId, ImageSourcePropType> = {
  table: require('../../assets/food/table.png'),
  greens: require('../../assets/food/greens.png'),
  bread: require('../../assets/food/bread.png'),
  bowl: require('../../assets/food/bowl.png'),
  citrus: require('../../assets/food/citrus.png'),
  shelf: require('../../assets/food/shelf.png'),
  plate: require('../../assets/food/plate.png'),
};

export const INGREDIENT_PHOTOS: Record<IngredientPhotoId, ImageSourcePropType> = {
  'ing-greens': require('../../assets/food/ing-greens.png'),
  'ing-tomato': require('../../assets/food/ing-tomato.png'),
  'ing-lemon': require('../../assets/food/ing-lemon.png'),
  'ing-onion': require('../../assets/food/ing-onion.png'),
  'ing-carrot': require('../../assets/food/ing-carrot.png'),
  'ing-eggs': require('../../assets/food/ing-eggs.png'),
  'ing-dairy': require('../../assets/food/ing-dairy.png'),
  'ing-bread': require('../../assets/food/ing-bread.png'),
  'ing-chicken': require('../../assets/food/ing-chicken.png'),
  'ing-fish': require('../../assets/food/ing-fish.png'),
  'ing-grain': require('../../assets/food/ing-grain.png'),
  'ing-oil': require('../../assets/food/ing-oil.png'),
  'ing-beans': require('../../assets/food/ing-beans.png'),
};
