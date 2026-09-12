import type { Diet, RecipeDiet } from '../types';

export const PILL_DIETS: RecipeDiet[] = ['omnivore', 'vegetarian', 'vegan'];

export const OTHER_DIETS: Diet[] = [
  'pescatarian',
  'no-red-meat',
  'halal',
  'kosher',
  'hindu',
  'gluten-free',
  'dairy-free',
  'low-lactose',
  'nut-free',
  'low-sodium',
  'diabetic',
  'low-fat',
  'low-calorie',
  'no-cilantro',
  'no-alcohol',
  'pregnant',
];

export const DIET_LABEL: Record<Diet, string> = {
  omnivore: 'Omnivore',
  vegetarian: 'Vegetarian',
  vegan: 'Vegan',
  pescatarian: 'Pescatarian',
  'no-red-meat': 'No red meat',
  halal: 'Halal',
  kosher: 'Kosher',
  hindu: 'Hindu',
  'gluten-free': 'Gluten-free',
  'dairy-free': 'Dairy-free',
  'low-lactose': 'Low-lactose',
  'nut-free': 'Nut-free',
  'low-sodium': 'Low-sodium',
  diabetic: 'Diabetic',
  'low-fat': 'Low-fat',
  'low-calorie': 'Low-calorie',
  'no-cilantro': 'No cilantro',
  'no-alcohol': 'No alcohol',
  pregnant: 'Pregnant',
};

export function isPillDiet(diet: Diet): diet is RecipeDiet {
  return PILL_DIETS.includes(diet as RecipeDiet);
}

export function dietLabel(diet: Diet): string {
  return DIET_LABEL[diet];
}
