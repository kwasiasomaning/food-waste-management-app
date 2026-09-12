import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DietPicker } from '../components/DietPicker';
import { HouseholdInput } from '../components/HouseholdInput';
import { SettingPicker } from '../components/SettingPicker';
import { Button } from '../components/ui';
import { COUNTRIES, CURRENCIES, currencyForCountry } from '../data/places';
import { countryLabel, currencyLabel } from '../lib/money';
import { useKitchen } from '../store/kitchen';
import { colors, fonts } from '../theme';

const COUNTRY_OPTIONS = COUNTRIES.map((country) => ({
  value: country.code,
  label: countryLabel(country.code),
  detail: country.currency,
}));

const CURRENCY_OPTIONS = CURRENCIES.map((currency) => ({
  value: currency.code,
  label: currencyLabel(currency.code),
  detail: currency.symbol,
}));

export function SettingsScreen({ onBack }: { onBack: () => void }) {
  const settings = useKitchen((s) => s.settings);
  const updateSettings = useKitchen((s) => s.updateSettings);
  const resetKitchen = useKitchen((s) => s.resetKitchen);
  const country = settings.country ?? 'US';
  const currency = settings.currency ?? 'USD';

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Pressable onPress={onBack}>
        <Text style={styles.back}>← Tonight</Text>
      </Pressable>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Settings</Text>
      <Text style={styles.label}>Diet</Text>
      <DietPicker value={settings.diet} onChange={(diet) => updateSettings({ diet })} />
      <Text style={styles.label}>Who is home for dinner?</Text>
      <HouseholdInput
        value={settings.householdSize}
        onChange={(householdSize) => updateSettings({ householdSize })}
      />
      <Text style={styles.label}>Country</Text>
      <SettingPicker
        title="Country"
        value={country}
        options={COUNTRY_OPTIONS}
        onChange={(next) =>
          updateSettings({ country: next, currency: currencyForCountry(next) })
        }
      />
      <Text style={styles.label}>Currency</Text>
      <SettingPicker
        title="Currency"
        value={currency}
        options={CURRENCY_OPTIONS}
        onChange={(next) => updateSettings({ currency: next })}
      />
      <Text style={styles.hint}>
        Grocery savings start from typical US prices, then show in this currency.
      </Text>
      <View style={{ height: 24 }} />
      <Button
        variant="ghost"
        label="Reset kitchen"
        onPress={resetKitchen}
      />
      <Text style={styles.about}>
        Tonight is a household food-waste app. It ranks dinners by what expires first. It will not
        end hunger. It will use the spinach.
      </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.paper },
  scroll: { padding: 20, paddingBottom: 40 },
  back: { fontFamily: fonts.sansSemi, color: colors.terracotta, marginBottom: 12, marginHorizontal: 20, marginTop: 0 },
  title: { fontFamily: fonts.display, fontSize: 36, color: colors.ink, marginBottom: 20 },
  label: { fontFamily: fonts.display, fontSize: 22, color: colors.ink, marginTop: 8 },
  hint: {
    fontFamily: fonts.sans,
    color: colors.inkSoft,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 2,
  },
  about: {
    fontFamily: fonts.sans,
    color: colors.inkSoft,
    marginTop: 20,
    lineHeight: 22,
  },
});
