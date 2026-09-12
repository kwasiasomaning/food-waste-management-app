import type { ImageSourcePropType } from 'react-native';

import type { FoodPhotoId } from '../lib/foodPhoto';

export type { FoodPhotoId };

export const FOOD_PHOTOS: Record<FoodPhotoId, ImageSourcePropType> = {
  table: require('../../assets/food/table.png'),
  greens: require('../../assets/food/greens.png'),
  bread: require('../../assets/food/bread.png'),
  bowl: require('../../assets/food/bowl.png'),
  citrus: require('../../assets/food/citrus.png'),
  shelf: require('../../assets/food/shelf.png'),
  plate: require('../../assets/food/plate.png'),
};
