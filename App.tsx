import {
  Fraunces_400Regular_Italic,
  Fraunces_600SemiBold,
  Fraunces_700Bold,
} from '@expo-google-fonts/fraunces';
import {
  NunitoSans_400Regular,
  NunitoSans_600SemiBold,
  NunitoSans_700Bold,
} from '@expo-google-fonts/nunito-sans';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { PhoneShell } from './src/components/PhoneShell';
import { TabBar } from './src/components/TabBar';
import type { Route, SnapCommand, TabName } from './src/navigation';
import { AuthScreen } from './src/screens/AuthScreen';
import { CookedScreen } from './src/screens/CookedScreen';
import { ImpactScreen } from './src/screens/ImpactScreen';
import { LegalScreen } from './src/screens/LegalScreen';
import { OnboardingScreen } from './src/screens/OnboardingScreen';
import { PantryScreen } from './src/screens/PantryScreen';
import { RecipeScreen } from './src/screens/RecipeScreen';
import { ScanScreen } from './src/screens/ScanScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { ShopScreen } from './src/screens/ShopScreen';
import { TonightScreen } from './src/screens/TonightScreen';
import { useAuth } from './src/store/auth';
import { useKitchen } from './src/store/kitchen';
import { colors } from './src/theme';

SplashScreen.preventAutoHideAsync().catch(() => undefined);

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    Fraunces_400Regular_Italic,
    Fraunces_600SemiBold,
    Fraunces_700Bold,
    NunitoSans_400Regular,
    NunitoSans_600SemiBold,
    NunitoSans_700Bold,
  });
  const hydrated = useKitchen((s) => s.hydrated);
  const setHydrated = useKitchen((s) => s.setHydrated);
  const authHydrated = useAuth((s) => s.hydrated);
  const setAuthHydrated = useAuth((s) => s.setHydrated);
  const session = useAuth((s) => s.session);
  const onboardingDone = useKitchen((s) => s.settings.onboardingDone);
  const [route, setRoute] = useState<Route>({ name: 'auth' });
  const [snapCommand, setSnapCommand] = useState<SnapCommand | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setHydrated();
      setAuthHydrated();
    }, 800);
    return () => clearTimeout(timer);
  }, [setHydrated, setAuthHydrated]);

  useEffect(() => {
    if ((fontsLoaded || fontError) && hydrated && authHydrated) {
      SplashScreen.hideAsync().catch(() => undefined);
    }
  }, [fontsLoaded, fontError, hydrated, authHydrated]);

  useEffect(() => {
    if (!hydrated || !authHydrated) return;
    if (!session) {
      setRoute((current) => (current.name === 'legal' && current.back === 'auth' ? current : { name: 'auth' }));
      return;
    }
    if (!onboardingDone) {
      setRoute({ name: 'onboarding' });
      return;
    }
    setRoute((current) =>
      current.name === 'auth' || current.name === 'onboarding' ? { name: 'tabs', tab: 'tonight' } : current,
    );
  }, [hydrated, authHydrated, session, onboardingDone]);

  if ((!fontsLoaded && !fontError) || !hydrated || !authHydrated) {
    return (
      <View style={styles.boot}>
        <Text style={styles.bootWord}>Tonight.</Text>
      </View>
    );
  }

  const goTab = (tab: TabName) => setRoute({ name: 'tabs', tab });

  return (
    <SafeAreaProvider>
      <PhoneShell>
        <StatusBar style="dark" />
        {route.name === 'auth' ? (
          <AuthScreen onOpenLegal={(doc) => setRoute({ name: 'legal', doc, back: 'auth' })} />
        ) : null}
        {route.name === 'legal' ? (
          <LegalScreen
            doc={route.doc}
            onBack={() => setRoute(route.back === 'settings' ? { name: 'settings' } : { name: 'auth' })}
          />
        ) : null}
        {route.name === 'onboarding' ? <OnboardingScreen /> : null}
        {route.name === 'tabs' ? (
          <View style={styles.app}>
            {route.tab === 'tonight' ? (
              <TonightScreen
                onOpenRecipe={(id) => setRoute({ name: 'recipe', id })}
                onTab={goTab}
                onSettings={() => setRoute({ name: 'settings' })}
              />
            ) : null}
            {route.tab === 'pantry' ? <PantryScreen onTab={goTab} /> : null}
            {route.tab === 'scan' ? (
              <ScanScreen
                onDone={goTab}
                snapCommand={snapCommand}
                onSnapHandled={() => setSnapCommand(null)}
              />
            ) : null}
            {route.tab === 'shop' ? <ShopScreen /> : null}
            {route.tab === 'impact' ? <ImpactScreen /> : null}
            <TabBar
              tab={route.tab}
              onChange={goTab}
              onSnap={() => {
                goTab('scan');
                setSnapCommand({ id: Date.now(), action: 'camera' });
              }}
              onRoll={() => {
                goTab('scan');
                setSnapCommand({ id: Date.now(), action: 'library' });
              }}
            />
          </View>
        ) : null}
        {route.name === 'recipe' ? (
          <RecipeScreen
            id={route.id}
            onBack={() => setRoute({ name: 'tabs', tab: 'tonight' })}
            onCooked={(payload) => setRoute({ name: 'cooked', ...payload })}
          />
        ) : null}
        {route.name === 'settings' ? (
          <SettingsScreen
            onBack={() => setRoute({ name: 'tabs', tab: 'tonight' })}
            onOpenLegal={(doc) => setRoute({ name: 'legal', doc, back: 'settings' })}
          />
        ) : null}
        {route.name === 'cooked' ? (
          <CookedScreen
            recipeId={route.recipeId}
            savedUsd={route.savedUsd}
            savedKg={route.savedKg}
            onDone={() => setRoute({ name: 'tabs', tab: 'impact' })}
          />
        ) : null}
      </PhoneShell>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  boot: {
    flex: 1,
    backgroundColor: colors.paper,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bootWord: {
    fontStyle: 'italic',
    fontSize: 42,
    color: colors.ink,
  },
  app: { flex: 1, backgroundColor: colors.paper },
});
