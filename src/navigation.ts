export type TabName = 'tonight' | 'pantry' | 'scan' | 'shop' | 'impact';

export type SnapCommand = {
  id: number;
  action: 'camera' | 'library';
};

export type LegalDoc = 'privacy' | 'terms';

export type Route =
  | { name: 'auth' }
  | { name: 'legal'; doc: LegalDoc; back: 'auth' | 'settings' }
  | { name: 'onboarding' }
  | { name: 'tabs'; tab: TabName }
  | { name: 'recipe'; id: string }
  | { name: 'settings' }
  | { name: 'cooked'; recipeId: string; savedUsd: number; savedKg: number };
