import { useState, type ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DietPicker } from '../components/DietPicker';
import { HouseholdInput } from '../components/HouseholdInput';
import { SettingPicker } from '../components/SettingPicker';
import { COUNTRIES, COUNTRY_MAP, CURRENCIES, CURRENCY_MAP } from '../data/places';
import { deliverExport } from '../lib/auth/exportData';
import { countryLabel, currencyLabel } from '../lib/money';
import { useAuth } from '../store/auth';
import { useKitchen } from '../store/kitchen';
import { colors, fonts, radius } from '../theme';

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

export function SettingsScreen({
  onBack,
  onOpenLegal,
}: {
  onBack: () => void;
  onOpenLegal: (doc: 'privacy' | 'terms') => void;
}) {
  const settings = useKitchen((s) => s.settings);
  const updateSettings = useKitchen((s) => s.updateSettings);
  const resetKitchen = useKitchen((s) => s.resetKitchen);
  const session = useAuth((s) => s.session);
  const logout = useAuth((s) => s.logout);
  const deleteAccount = useAuth((s) => s.deleteAccount);
  const exportPayload = useAuth((s) => s.exportPayload);
  const [note, setNote] = useState<string | null>(null);
  const [resetAsk, setResetAsk] = useState(false);
  const [deleteAsk, setDeleteAsk] = useState(false);

  const country = settings.country ?? 'US';
  const currency = settings.currency ?? 'USD';
  const flag = COUNTRY_MAP[country]?.flag ?? '🌐';
  const countryName = COUNTRY_MAP[country]?.name ?? country;
  const currencyInfo = CURRENCY_MAP[currency];
  const displayName = session?.name?.trim() || 'Kitchen';
  const initial = displayName.slice(0, 1).toUpperCase();

  const download = async () => {
    const payload = exportPayload();
    if (!payload) {
      setNote('Sign in to download your data.');
      return;
    }
    try {
      const result = await deliverExport('tonight-data.json', payload);
      setNote(
        result === 'downloaded'
          ? 'A copy of your kitchen was saved to this device.'
          : 'Your data was copied to the clipboard.',
      );
    } catch {
      setNote('Could not export on this device. Try again from a browser.');
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.top}>
        <Pressable onPress={onBack} hitSlop={8}>
          <Text style={styles.back}>← Tonight</Text>
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.kicker}>How this house eats</Text>
        <Text style={styles.title}>Settings</Text>

        <Card>
          <View style={styles.profile}>
            <View style={styles.avatar}>
              <Text style={styles.avatarLetter}>{initial}</Text>
            </View>
            <View style={styles.profileCopy}>
              <Text style={styles.profileName}>{displayName}</Text>
              <Text style={styles.profileEmail}>{session?.email ?? 'Signed out'}</Text>
            </View>
          </View>
        </Card>

        <Card title="My Location" hint="Country and money stay independent.">
          <SettingPicker
            title="Country"
            value={country}
            options={COUNTRY_OPTIONS}
            onChange={(next) => updateSettings({ country: next })}
          >
            <View style={styles.pickRow}>
              <View style={styles.pickCopy}>
                <Text style={styles.pickLabel}>Country</Text>
                <Text style={styles.pickValue}>
                  {flag}  {countryName}
                </Text>
              </View>
              <Text style={styles.chevron}>▾</Text>
            </View>
          </SettingPicker>
          <View style={styles.divider} />
          <SettingPicker
            title="Currency"
            value={currency}
            options={CURRENCY_OPTIONS}
            onChange={(next) => updateSettings({ currency: next })}
          >
            <View style={styles.pickRow}>
              <View style={styles.pickCopy}>
                <Text style={styles.pickLabel}>Currency</Text>
                <Text style={styles.pickValue}>
                  {currencyInfo?.symbol ?? currency}  {currencyInfo?.name ?? currency}
                </Text>
              </View>
              <Text style={styles.chevron}>▾</Text>
            </View>
          </SettingPicker>
        </Card>

        <Card title="Dinner" hint="Tonight only suggests what this table can eat.">
          <Text style={styles.fieldLabel}>Diet</Text>
          <DietPicker value={settings.diet} onChange={(diet) => updateSettings({ diet })} />
          <Text style={styles.fieldLabel}>Who is home for dinner?</Text>
          <HouseholdInput
            value={settings.householdSize}
            onChange={(householdSize) => updateSettings({ householdSize })}
          />
        </Card>

        <Card title="This device">
          <ActionRow label="Download my data" onPress={() => void download()} />
          <View style={styles.divider} />
          <ActionRow label="Sign out" onPress={() => void logout()} />
          {note ? <Text style={styles.note}>{note}</Text> : null}
        </Card>

        <Card title="Start over" tone="warn">
          {resetAsk ? (
            <View style={styles.confirm}>
              <Text style={styles.confirmCopy}>
                This clears the pantry, shop, and cooked list on this device. The account stays.
              </Text>
              <ActionRow
                label="Reset the kitchen"
                danger
                onPress={() => {
                  resetKitchen();
                  setResetAsk(false);
                  setNote('Kitchen cleared.');
                }}
              />
              <Pressable onPress={() => setResetAsk(false)} hitSlop={6}>
                <Text style={styles.link}>Keep the kitchen</Text>
              </Pressable>
            </View>
          ) : (
            <ActionRow label="Reset the kitchen" onPress={() => setResetAsk(true)} />
          )}
          <View style={styles.divider} />
          {deleteAsk ? (
            <View style={styles.confirm}>
              <Text style={styles.confirmCopy}>
                This permanently deletes your account and kitchen on this device. Store rules
                require this to live in the app, not only by email.
              </Text>
              <ActionRow
                label="Delete my account"
                danger
                onPress={() => {
                  void deleteAccount();
                }}
              />
              <Pressable onPress={() => setDeleteAsk(false)} hitSlop={6}>
                <Text style={styles.link}>Keep my account</Text>
              </Pressable>
            </View>
          ) : (
            <ActionRow label="Delete my account" danger onPress={() => setDeleteAsk(true)} />
          )}
        </Card>

        <Text style={styles.about}>
          Tonight ranks dinners by what expires first. It will not end hunger. It will use the
          spinach.
        </Text>
        <View style={styles.legalRow}>
          <Pressable onPress={() => onOpenLegal('privacy')} hitSlop={6}>
            <Text style={styles.link}>Privacy policy</Text>
          </Pressable>
          <Text style={styles.legalDot}>·</Text>
          <Pressable onPress={() => onOpenLegal('terms')} hitSlop={6}>
            <Text style={styles.link}>Terms of use</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Card({
  title,
  hint,
  tone,
  children,
}: {
  title?: string;
  hint?: string;
  tone?: 'warn';
  children: ReactNode;
}) {
  return (
    <View style={[styles.card, tone === 'warn' && styles.cardWarn]}>
      {title ? <Text style={styles.cardTitle}>{title}</Text> : null}
      {hint ? <Text style={styles.cardHint}>{hint}</Text> : null}
      {children}
    </View>
  );
}

function ActionRow({
  label,
  onPress,
  danger,
}: {
  label: string;
  onPress: () => void;
  danger?: boolean;
}) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.action, pressed && { opacity: 0.7 }]}>
      <Text style={[styles.actionLabel, danger && styles.actionDanger]}>{label}</Text>
      <Text style={[styles.actionGo, danger && styles.actionDanger]}>›</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.paper },
  top: {
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 4,
  },
  scroll: { padding: 20, paddingBottom: 48, gap: 14 },
  back: { fontFamily: fonts.sansSemi, color: colors.terracotta },
  kicker: { fontFamily: fonts.sansSemi, color: colors.inkSoft },
  title: { fontFamily: fonts.display, fontSize: 36, color: colors.ink, marginBottom: 4 },
  card: {
    backgroundColor: colors.cream,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 16,
  },
  cardWarn: {
    backgroundColor: '#FBF6F1',
    borderColor: '#E4D2C4',
  },
  cardTitle: {
    fontFamily: fonts.display,
    fontSize: 22,
    color: colors.ink,
    marginBottom: 4,
  },
  cardHint: {
    fontFamily: fonts.sans,
    color: colors.inkSoft,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 10,
  },
  profile: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.sageSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLetter: { fontFamily: fonts.display, fontSize: 26, color: colors.sage },
  profileCopy: { flex: 1 },
  profileName: { fontFamily: fonts.display, fontSize: 24, color: colors.ink },
  profileEmail: { fontFamily: fonts.sans, color: colors.inkSoft, marginTop: 2 },
  legalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
    paddingHorizontal: 4,
    paddingBottom: 8,
  },
  legalDot: { fontFamily: fonts.sans, color: colors.inkSoft },
  link: { fontFamily: fonts.sansSemi, color: colors.terracotta },
  pickRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 10,
  },
  pickCopy: { flex: 1 },
  pickLabel: { fontFamily: fonts.sans, fontSize: 12, color: colors.inkSoft },
  pickValue: { fontFamily: fonts.sansSemi, fontSize: 16, color: colors.ink, marginTop: 2 },
  chevron: { fontFamily: fonts.sansSemi, color: colors.inkSoft, fontSize: 16 },
  divider: {
    height: 1,
    backgroundColor: colors.line,
    marginVertical: 4,
  },
  fieldLabel: {
    fontFamily: fonts.sansSemi,
    fontSize: 13,
    color: colors.inkSoft,
    marginTop: 6,
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  actionLabel: { fontFamily: fonts.sansSemi, fontSize: 16, color: colors.ink },
  actionGo: { fontFamily: fonts.sans, fontSize: 22, color: colors.inkSoft, lineHeight: 22 },
  actionDanger: { color: colors.terracottaDeep },
  note: { fontFamily: fonts.sans, color: colors.sage, marginTop: 8, lineHeight: 20 },
  confirm: { gap: 10, paddingVertical: 4 },
  confirmCopy: { fontFamily: fonts.sans, color: colors.inkSoft, lineHeight: 21 },
  about: {
    fontFamily: fonts.sans,
    color: colors.inkSoft,
    lineHeight: 22,
    marginTop: 6,
    paddingHorizontal: 4,
  },
});
