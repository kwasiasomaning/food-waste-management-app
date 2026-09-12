import { StyleSheet, Text, View } from 'react-native';

import { COUNTRIES, COUNTRY_MAP, CURRENCIES, CURRENCY_MAP } from '../data/places';
import { countryLabel, currencyLabel } from '../lib/money';
import { useKitchen } from '../store/kitchen';
import { colors, fonts } from '../theme';
import { SettingPicker } from './SettingPicker';

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

export function LocaleIcons() {
  const country = useKitchen((s) => s.settings.country ?? 'US');
  const currency = useKitchen((s) => s.settings.currency ?? 'USD');
  const updateSettings = useKitchen((s) => s.updateSettings);
  const flag = COUNTRY_MAP[country]?.flag ?? '🌐';
  const symbol = CURRENCY_MAP[currency]?.symbol ?? currency;

  return (
    <View style={styles.row}>
      <SettingPicker
        title="Country"
        value={country}
        options={COUNTRY_OPTIONS}
        onChange={(next) => updateSettings({ country: next })}
      >
        <Text style={styles.flag}>{flag}</Text>
      </SettingPicker>
      <SettingPicker
        title="Currency"
        value={currency}
        options={CURRENCY_OPTIONS}
        onChange={(next) => updateSettings({ currency: next })}
      >
        <Text style={styles.symbol}>{symbol}</Text>
      </SettingPicker>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  flag: { fontSize: 18, lineHeight: 22 },
  symbol: {
    fontFamily: fonts.sansBold,
    fontSize: 13,
    color: colors.ink,
    lineHeight: 18,
  },
});
