import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { getIngredient } from '../data/ingredients';
import { DEFAULT_COUNTRY, DEFAULT_CURRENCY } from '../data/places';
import { uid } from '../lib/dates';
import { findRecipe } from '../lib/mealCache';
import { parseHouseholdSize } from '../lib/household';
import { applyGroceryOrder } from '../lib/grocery/applyOrder';
import { estimateSavings, estimateUse, estimateWaste } from '../lib/savings';
import { itemsFromIds } from '../lib/starterPantry';
import type { KitchenSlice } from '../lib/auth/kitchenVault';
import type {
  BinnedItem,
  CookedMeal,
  Diet,
  GroceryOrder,
  PantryItem,
  Settings,
  ShopItem,
  UsedItem,
} from '../types';

export type KitchenState = {
  hydrated: boolean;
  settings: Settings;
  pantry: PantryItem[];
  cooked: CookedMeal[];
  wasted: BinnedItem[];
  used: UsedItem[];
  shop: ShopItem[];
  groceryOrders: GroceryOrder[];
  setHydrated: () => void;
  completeOnboarding: (input: {
    diet: Diet;
    householdSize: number;
    ingredientIds?: string[];
    source?: PantryItem['source'];
  }) => void;
  updateSettings: (patch: Partial<Settings>) => void;
  addIngredients: (ingredientIds: string[], source: PantryItem['source']) => void;
  removePantry: (id: string) => void;
  binPantry: (id: string) => BinnedItem | null;
  markUsed: (id: string) => UsedItem | null;
  consumeIngredients: (ingredientIds: string[]) => void;
  setExpiryDays: (id: string, daysFromNow: number) => void;
  cookRecipe: (recipeId: string) => CookedMeal | null;
  addToShop: (ingredientId: string, reason: string) => void;
  addMissingToShop: (items: { ingredientId: string; reason: string }[]) => void;
  toggleShop: (ingredientId: string) => void;
  buyChecked: () => void;
  recordGroceryOrder: (order: GroceryOrder) => void;
  clearShop: () => void;
  resetKitchen: () => void;
  kitchenSlice: () => KitchenSlice;
  replaceKitchen: (slice: KitchenSlice) => void;
  claimKitchen: (ownerId: string) => void;
  emptyForAccount: (input: { ownerId: string; country: string; currency?: string }) => void;
};

const defaultSettings: Settings = {
  diet: 'omnivore',
  householdSize: 2,
  onboardingDone: false,
  country: DEFAULT_COUNTRY,
  currency: DEFAULT_CURRENCY,
  groceryProviderId: 'uber-eats-grocery',
};

export const useKitchen = create<KitchenState>()(
  persist(
    (set, get) => ({
      hydrated: false,
      settings: defaultSettings,
      pantry: [],
      cooked: [],
      wasted: [],
      used: [],
      shop: [],
      groceryOrders: [],
      setHydrated: () => set({ hydrated: true }),
      completeOnboarding: ({ diet, householdSize, ingredientIds = [], source = 'manual' }) =>
        set((state) => ({
          settings: {
            ...defaultSettings,
            country: state.settings.country,
            currency: state.settings.currency,
            ownerId: state.settings.ownerId,
            diet,
            householdSize: parseHouseholdSize(String(householdSize), 1),
            onboardingDone: true,
          },
          pantry: itemsFromIds(ingredientIds, source),
        })),
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
      binPantry: (id) => {
        const item = get().pantry.find((row) => row.id === id);
        if (!item) return null;
        const ingredient = getIngredient(item.ingredientId);
        const { lostUsd, lostKg } = estimateWaste(item.ingredientId);
        const record: BinnedItem = {
          id: uid('binned'),
          ingredientId: item.ingredientId,
          name: ingredient.name,
          binnedAt: new Date().toISOString(),
          lostUsd,
          lostKg,
        };
        set((state) => ({
          pantry: state.pantry.filter((row) => row.id !== id),
          wasted: [record, ...state.wasted],
        }));
        return record;
      },
      markUsed: (id) => {
        const item = get().pantry.find((row) => row.id === id);
        if (!item) return null;
        const ingredient = getIngredient(item.ingredientId);
        const { savedUsd, savedKg } = estimateUse(item.ingredientId);
        const record: UsedItem = {
          id: uid('used'),
          ingredientId: item.ingredientId,
          name: ingredient.name,
          usedAt: new Date().toISOString(),
          savedUsd,
          savedKg,
        };
        set((state) => ({
          pantry: state.pantry.filter((row) => row.id !== id),
          used: [record, ...state.used],
        }));
        return record;
      },
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
        const recipe = findRecipe(recipeId);
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
      recordGroceryOrder: (order) =>
        set((state) =>
          applyGroceryOrder(
            {
              pantry: state.pantry,
              shop: state.shop,
              groceryOrders: state.groceryOrders ?? [],
            },
            order,
          ),
        ),
      clearShop: () => set({ shop: [] }),
      resetKitchen: () =>
        set((state) => ({
          settings: {
            ...defaultSettings,
            country: state.settings.country,
            currency: state.settings.currency,
            ownerId: state.settings.ownerId,
            onboardingDone: state.settings.onboardingDone,
            diet: state.settings.diet,
            householdSize: state.settings.householdSize,
            deliveryLine1: state.settings.deliveryLine1,
            deliveryCity: state.settings.deliveryCity,
            deliveryPostal: state.settings.deliveryPostal,
            groceryProviderId: state.settings.groceryProviderId,
          },
          pantry: [],
          cooked: [],
          wasted: [],
          used: [],
          shop: [],
          groceryOrders: [],
        })),
      kitchenSlice: () => {
        const state = get();
        return {
          settings: state.settings,
          pantry: state.pantry,
          cooked: state.cooked,
          wasted: state.wasted,
          used: state.used,
          shop: state.shop,
          groceryOrders: state.groceryOrders ?? [],
        };
      },
      replaceKitchen: (slice) =>
        set({
          settings: slice.settings,
          pantry: slice.pantry,
          cooked: slice.cooked,
          wasted: slice.wasted ?? [],
          used: slice.used ?? [],
          shop: slice.shop,
          groceryOrders: slice.groceryOrders ?? [],
        }),
      claimKitchen: (ownerId) =>
        set((state) => ({
          settings: { ...state.settings, ownerId },
        })),
      emptyForAccount: ({ ownerId, country, currency }) =>
        set({
          settings: {
            ...defaultSettings,
            ownerId,
            country,
            currency: currency ?? defaultSettings.currency,
          },
          pantry: [],
          cooked: [],
          wasted: [],
          used: [],
          shop: [],
          groceryOrders: [],
        }),
    }),
    {
      name: 'tonight.v1',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        settings: state.settings,
        pantry: state.pantry,
        cooked: state.cooked,
        wasted: state.wasted,
        used: state.used,
        shop: state.shop,
        groceryOrders: state.groceryOrders,
      }),
      onRehydrateStorage: () => (state) => {
        if (state && !Array.isArray(state.wasted)) state.wasted = [];
        if (state && !Array.isArray(state.used)) state.used = [];
        if (state && !Array.isArray(state.groceryOrders)) state.groceryOrders = [];
        if (state?.settings) {
          if (!state.settings.country) state.settings.country = DEFAULT_COUNTRY;
          if (!state.settings.currency) state.settings.currency = DEFAULT_CURRENCY;
          if (!state.settings.groceryProviderId) {
            state.settings.groceryProviderId = 'uber-eats-grocery';
          }
        }
        state?.setHydrated();
      },
    },
  ),
);
