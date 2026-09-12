import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { PRIVACY_VERSION, TERMS_VERSION, minimumAgeForCountry } from '../data/legal';
import { dropKitchen, loadKitchen, stashKitchen } from '../lib/auth/kitchenVault';
import { hashPassword, passwordsMatch, randomSalt } from '../lib/auth/password';
import {
  displayNameIssues,
  isValidEmail,
  normalizeEmail,
  passwordIssues,
} from '../lib/auth/validation';
import { uid } from '../lib/dates';
import type { Account, Session } from '../types';
import { useKitchen } from './kitchen';

export type AuthState = {
  hydrated: boolean;
  accounts: Account[];
  session: Session | null;
  setHydrated: () => void;
  register: (input: {
    email: string;
    password: string;
    confirm: string;
    name: string;
    country: string;
    ageOk: boolean;
    privacyOk: boolean;
    termsOk: boolean;
  }) => Promise<string | null>;
  login: (input: { email: string; password: string }) => Promise<string | null>;
  logout: () => Promise<void>;
  deleteAccount: () => Promise<void>;
  wipeDevice: () => Promise<void>;
  exportPayload: () => Record<string, unknown> | null;
};

function publicAccount(account: Account) {
  return {
    id: account.id,
    email: account.email,
    name: account.name,
    createdAt: account.createdAt,
    country: account.country,
    consent: account.consent,
  };
}

async function parkActiveKitchen() {
  const ownerId = useKitchen.getState().settings.ownerId;
  if (!ownerId) return;
  await stashKitchen(ownerId, useKitchen.getState().kitchenSlice());
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      hydrated: false,
      accounts: [],
      session: null,
      setHydrated: () => set({ hydrated: true }),
      register: async ({
        email,
        password,
        confirm,
        name,
        country,
        ageOk,
        privacyOk,
        termsOk,
      }) => {
        const normalized = normalizeEmail(email);
        if (!isValidEmail(normalized)) return 'Enter a valid email address.';
        const nameError = displayNameIssues(name);
        if (nameError) return nameError;
        const passwordError = passwordIssues(password);
        if (passwordError) return passwordError;
        if (password !== confirm) return 'Those passwords do not match.';
        if (!ageOk) return `Confirm you are at least ${minimumAgeForCountry(country)}.`;
        if (!privacyOk) return 'Please read and accept the privacy policy.';
        if (!termsOk) return 'Please read and accept the terms.';
        if (get().accounts.some((account) => account.email === normalized)) {
          return 'That email already has an account on this device. Log in instead.';
        }

        const salt = randomSalt();
        const account: Account = {
          id: uid('user'),
          email: normalized,
          name: name.trim(),
          passwordSalt: salt,
          passwordHash: await hashPassword(password, salt),
          createdAt: new Date().toISOString(),
          country,
          consent: {
            privacyVersion: PRIVACY_VERSION,
            termsVersion: TERMS_VERSION,
            acceptedAt: new Date().toISOString(),
            ageAttested: true,
            ageMinimum: minimumAgeForCountry(country),
          },
        };

        await parkActiveKitchen();
        const kitchen = useKitchen.getState();
        if (!kitchen.settings.ownerId) {
          kitchen.claimKitchen(account.id);
          if (kitchen.settings.country !== country) {
            kitchen.updateSettings({ country });
          }
        } else {
          kitchen.emptyForAccount({ ownerId: account.id, country });
        }

        set((state) => ({
          accounts: [...state.accounts, account],
          session: { userId: account.id, email: account.email, name: account.name },
        }));
        return null;
      },
      login: async ({ email, password }) => {
        const normalized = normalizeEmail(email);
        const account = get().accounts.find((row) => row.email === normalized);
        if (!account) return 'No account on this device uses that email.';
        const ok = await passwordsMatch(password, account.passwordSalt, account.passwordHash);
        if (!ok) return 'That password is not right.';

        await parkActiveKitchen();
        const stored = await loadKitchen(account.id);
        if (stored) useKitchen.getState().replaceKitchen(stored);
        else useKitchen.getState().emptyForAccount({ ownerId: account.id, country: account.country });

        set({ session: { userId: account.id, email: account.email, name: account.name } });
        return null;
      },
      logout: async () => {
        await parkActiveKitchen();
        const kitchen = useKitchen.getState();
        kitchen.emptyForAccount({
          ownerId: 'none',
          country: kitchen.settings.country,
          currency: kitchen.settings.currency,
        });
        kitchen.updateSettings({ ownerId: undefined, onboardingDone: false });
        set({ session: null });
      },
      deleteAccount: async () => {
        const session = get().session;
        if (!session) return;
        await dropKitchen(session.userId);
        useKitchen.getState().emptyForAccount({
          ownerId: session.userId,
          country: useKitchen.getState().settings.country,
          currency: useKitchen.getState().settings.currency,
        });
        useKitchen.getState().updateSettings({ ownerId: undefined, onboardingDone: false });
        set((state) => ({
          accounts: state.accounts.filter((account) => account.id !== session.userId),
          session: null,
        }));
      },
      wipeDevice: async () => {
        await Promise.all(get().accounts.map((account) => dropKitchen(account.id)));
        useKitchen.getState().emptyForAccount({
          ownerId: 'none',
          country: useKitchen.getState().settings.country,
          currency: useKitchen.getState().settings.currency,
        });
        useKitchen.getState().updateSettings({ ownerId: undefined, onboardingDone: false });
        set({ accounts: [], session: null });
      },
      exportPayload: () => {
        const session = get().session;
        if (!session) return null;
        const account = get().accounts.find((row) => row.id === session.userId);
        if (!account) return null;
        return {
          exportedAt: new Date().toISOString(),
          privacyVersion: PRIVACY_VERSION,
          termsVersion: TERMS_VERSION,
          account: publicAccount(account),
          kitchen: useKitchen.getState().kitchenSlice(),
        };
      },
    }),
    {
      name: 'tonight.auth.v1',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        accounts: state.accounts,
        session: state.session,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    },
  ),
);
