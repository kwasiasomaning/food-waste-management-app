import type { ImageSourcePropType } from 'react-native';

import type {
  FoodPhotoId,
  IngredientPhotoId,
  MealPhotoId,
  OnboardPhotoId,
  OnboardingStillId,
} from '../lib/foodPhoto';

export type { FoodPhotoId, IngredientPhotoId, MealPhotoId, OnboardingStillId };

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
  'ing-pepper': require('../../assets/food/ing-pepper.png'),
  'ing-cucumber': require('../../assets/food/ing-cucumber.png'),
  'ing-potato': require('../../assets/food/ing-potato.png'),
  'ing-sweet-potato': require('../../assets/food/ing-sweet-potato.png'),
  'ing-broccoli': require('../../assets/food/ing-broccoli.png'),
  'ing-zucchini': require('../../assets/food/ing-zucchini.png'),
  'ing-mushroom': require('../../assets/food/ing-mushroom.png'),
  'ing-avocado': require('../../assets/food/ing-avocado.png'),
  'ing-apple': require('../../assets/food/ing-apple.png'),
  'ing-banana': require('../../assets/food/ing-banana.png'),
  'ing-corn': require('../../assets/food/ing-corn.png'),
  'ing-ginger': require('../../assets/food/ing-ginger.png'),
  'ing-chili': require('../../assets/food/ing-chili.png'),
  'ing-cabbage': require('../../assets/food/ing-cabbage.png'),
  'ing-celery': require('../../assets/food/ing-celery.png'),
  'ing-berries': require('../../assets/food/ing-berries.png'),
  'ing-peas': require('../../assets/food/ing-peas.png'),
  'ing-eggs': require('../../assets/food/ing-eggs.png'),
  'ing-dairy': require('../../assets/food/ing-dairy.png'),
  'ing-yogurt': require('../../assets/food/ing-yogurt.png'),
  'ing-bread': require('../../assets/food/ing-bread.png'),
  'ing-tortilla': require('../../assets/food/ing-tortilla.png'),
  'ing-chicken': require('../../assets/food/ing-chicken.png'),
  'ing-beef': require('../../assets/food/ing-beef.png'),
  'ing-pork': require('../../assets/food/ing-pork.png'),
  'ing-fish': require('../../assets/food/ing-fish.png'),
  'ing-shrimp': require('../../assets/food/ing-shrimp.png'),
  'ing-tofu': require('../../assets/food/ing-tofu.png'),
  'ing-grain': require('../../assets/food/ing-grain.png'),
  'ing-oil': require('../../assets/food/ing-oil.png'),
  'ing-beans': require('../../assets/food/ing-beans.png'),
  'ing-roast': require('../../assets/food/ing-roast.png'),
};

export const ONBOARD_PHOTOS: Record<OnboardPhotoId, ImageSourcePropType> = {
  'onboard-spread': require('../../assets/food/onboard-spread.png'),
  'onboard-roast': require('../../assets/food/onboard-roast.png'),
  'onboard-pasta': require('../../assets/food/onboard-pasta.png'),
  'onboard-fish': require('../../assets/food/onboard-fish.png'),
  'onboard-salad': require('../../assets/food/onboard-salad.png'),
  'onboard-curry': require('../../assets/food/onboard-curry.png'),
  'onboard-eggs': require('../../assets/food/onboard-eggs.png'),
  'onboard-stirfry': require('../../assets/food/onboard-stirfry.png'),
};

export const MEAL_PHOTOS: Record<MealPhotoId, ImageSourcePropType> = {
  'meal-frittata': require('../../assets/food/meal-frittata.jpg'),
  'meal-toast': require('../../assets/food/meal-toast.jpg'),
  'meal-fried-rice': require('../../assets/food/meal-fried-rice.jpg'),
  'meal-chicken': require('../../assets/food/meal-chicken.jpg'),
  'meal-tacos': require('../../assets/food/meal-tacos.jpg'),
  'meal-shakshuka': require('../../assets/food/meal-shakshuka.jpg'),
  'meal-pasta': require('../../assets/food/meal-pasta.jpg'),
  'meal-soup': require('../../assets/food/meal-soup.jpg'),
  'meal-fish': require('../../assets/food/meal-fish.jpg'),
  'meal-stirfry': require('../../assets/food/meal-stirfry.jpg'),
  'meal-melt': require('../../assets/food/meal-melt.jpg'),
  'meal-bowl': require('../../assets/food/meal-bowl.jpg'),
  'meal-noodles': require('../../assets/food/meal-noodles.jpg'),
  'meal-beans': require('../../assets/food/meal-beans.jpg'),
  'meal-caprese': require('../../assets/food/meal-caprese.jpg'),
};

export const ONBOARDING_PHOTOS: Record<OnboardingStillId, ImageSourcePropType> = {
  table: FOOD_PHOTOS.table,
  bread: FOOD_PHOTOS.bread,
  bowl: FOOD_PHOTOS.bowl,
  plate: FOOD_PHOTOS.plate,
  ...MEAL_PHOTOS,
  ...ONBOARD_PHOTOS,
};
