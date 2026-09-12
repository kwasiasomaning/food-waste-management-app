export type TabName = 'tonight' | 'pantry' | 'scan' | 'shop' | 'impact';

export type Route =
  | { name: 'onboarding' }
  | { name: 'tabs'; tab: TabName }
  | { name: 'recipe'; id: string }
  | { name: 'settings' }
  | { name: 'cooked'; recipeId: string; savedUsd: number; savedKg: number };
