import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { getIngredient } from '../data/ingredients';
import { RECIPES } from '../data/recipes';
import { uid } from '../lib/dates';
import { parseHouseholdSize } from '../lib/household';
import { estimateSavings } from '../lib/savings';
import { itemsFromIds, starterPantry } from '../lib/starterPantry';
import type { CookedMeal, Diet, PantryItem, Settings, ShopItem } from '../types';

export type KitchenState = {
  hydrated: boolean;
  settings: Settings;
  pantry: PantryItem[];
  cooked: CookedMeal[];
  shop: ShopItem[];
  setHydrated: () => void;
  completeOnboarding: (input: { diet: Diet; householdSize: number; seed: boolean }) => void;
  updateSettings: (patch: Partial<Settings>) => void;
  addIngredients: (ingredientIds: string[], source: PantryItem['source']) => void;
  removePantry: (id: string) => void;
  consumeIngredients: (ingredientIds: string[]) => void;
  setExpiryDays: (id: string, daysFromNow: number) => void;
  cookRecipe: (recipeId: string) => CookedMeal | null;
  addToShop: (ingredientId: string, reason: string) => void;
  addMissingToShop: (items: { ingredientId: string; reason: string }[]) => void;
  toggleShop: (ingredientId: string) => void;
  buyChecked: () => void;
  clearShop: () => void;
  resetKitchen: () => void;
};

const defaultSettings: Settings = {
  diet: 'omnivore',
  householdSize: 2,
  onboardingDone: false,
};

export const useKitchen = create<KitchenState>()(
  persist(
    (set, get) => ({
      hydrated: false,
      settings: defaultSettings,
      pantry: [],
      cooked: [],
      shop: [],
      setHydrated: () => set({ hydrated: true }),
      completeOnboarding: ({ diet, householdSize, seed }) =>
        set({
          settings: {
            diet,
            householdSize: parseHouseholdSize(String(householdSize), 1),
            onboardingDone: true,
          },
          pantry: seed ? starterPantry() : [],
        }),
      updateSettings: (patch) =>
        set((state) => ({
          settings: {
            ...state.settings,
            ...patch,
            householdSize: parseHouseholdSize(
              String(patch.householdSize ?? state.settings.householdSize),
              state.settings.householdSize,
            ),
          },
        })),
      addIngredients: (ingredientIds, source) =>
        set((state) => {
          const existing = new Set(state.pantry.map((item) => item.ingredientId));
          const fresh = itemsFromIds(
            ingredientIds.filter((id) => !existing.has(id)),
            source,
          );
          return { pantry: [...state.pantry, ...fresh] };
        }),
      removePantry: (id) =>
        set((state) => ({ pantry: state.pantry.filter((item) => item.id !== id) })),
      consumeIngredients: (ingredientIds) =>
        set((state) => {
          const consume = new Set(ingredientIds);
          const next: PantryItem[] = [];
          const seen = new Set<string>();
          for (const item of state.pantry) {
            if (consume.has(item.ingredientId) && !seen.has(item.ingredientId)) {
              if (getIngredient(item.ingredientId).isStaple) {
                next.push(item);
              }
              seen.add(item.ingredientId);
              continue;
            }
            next.push(item);
          }
          return { pantry: next };
        }),
      setExpiryDays: (id, daysFromNow) =>
        set((state) => ({
          pantry: state.pantry.map((item) =>
            item.id === id
              ? {
                  ...item,
                  expiresAt: new Date(Date.now() + daysFromNow * 86_400_000).toISOString(),
                }
              : item,
          ),
        })),
      cookRecipe: (recipeId) => {
        const recipe = RECIPES.find((row) => row.id === recipeId);
        if (!recipe) return null;
        const pantryIds = new Set(get().pantry.map((item) => item.ingredientId));
        const used = recipe.ingredients
          .map((line) => line.ingredientId)
          .filter((id) => pantryIds.has(id) && !getIngredient(id).isStaple);
        const { savedUsd, savedKg } = estimateSavings(used);
        const meal: CookedMeal = {
          id: uid('cooked'),
          recipeId,
          title: recipe.title,
          cookedAt: new Date().toISOString(),
          usedIngredientIds: used,
          savedUsd,
          savedKg,
        };
        get().consumeIngredients(used);
        set((state) => ({ cooked: [meal, ...state.cooked] }));
        return meal;
      },
      addToShop: (ingredientId, reason) =>
        set((state) => {
          if (state.shop.some((item) => item.ingredientId === ingredientId)) return state;
          return { shop: [...state.shop, { ingredientId, reason, checked: false }] };
        }),
      addMissingToShop: (items) =>
        set((state) => {
          const have = new Set(state.shop.map((item) => item.ingredientId));
          const extra = items
            .filter((item) => !have.has(item.ingredientId))
            .map((item) => ({ ...item, checked: false }));
          return { shop: [...state.shop, ...extra] };
        }),
      toggleShop: (ingredientId) =>
        set((state) => ({
          shop: state.shop.map((item) =>
            item.ingredientId === ingredientId ? { ...item, checked: !item.checked } : item,
          ),
        })),
      buyChecked: () => {
        const checked = get()
          .shop.filter((item) => item.checked)
          .map((item) => item.ingredientId);
        if (checked.length) get().addIngredients(checked, 'shop');
        set((state) => ({ shop: state.shop.filter((item) => !item.checked) }));
      },
      clearShop: () => set({ shop: [] }),
      resetKitchen: () =>
        set({
          settings: defaultSettings,
          pantry: [],
          cooked: [],
          shop: [],
        }),
    }),
    {
      name: 'tonight.v1',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        settings: state.settings,
        pantry: state.pantry,
        cooked: state.cooked,
        shop: state.shop,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    },
  ),
);
