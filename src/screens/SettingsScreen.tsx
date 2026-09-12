import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DietPicker } from '../components/DietPicker';
import { HouseholdInput } from '../components/HouseholdInput';
import { LocaleIcons } from '../components/LocaleIcons';
import { Button } from '../components/ui';
import { deliverExport } from '../lib/auth/exportData';
import { useAuth } from '../store/auth';
import { useKitchen } from '../store/kitchen';
import { colors, fonts } from '../theme';

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
  const [deleteAsk, setDeleteAsk] = useState(false);

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
          ? 'A copy of your data was saved to this device.'
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
        <LocaleIcons />
      </View>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Settings</Text>

        <Text style={styles.label}>Account</Text>
        <Text style={styles.account}>
          {session?.name ? `${session.name} · ` : ''}
          {session?.email ?? 'Signed out'}
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
        <View style={styles.rowBtns}>
          <Button variant="ghost" label="Download my data" onPress={() => void download()} />
          <Button variant="ghost" label="Sign out" onPress={() => void logout()} />
        </View>
        {note ? <Text style={styles.note}>{note}</Text> : null}

        <Text style={styles.label}>Diet</Text>
        <DietPicker value={settings.diet} onChange={(diet) => updateSettings({ diet })} />
        <Text style={styles.label}>Who is home for dinner?</Text>
        <HouseholdInput
          value={settings.householdSize}
          onChange={(householdSize) => updateSettings({ householdSize })}
        />
        <View style={{ height: 24 }} />
        <Button variant="ghost" label="Reset kitchen" onPress={resetKitchen} />

        {deleteAsk ? (
          <View style={styles.deleteBox}>
            <Text style={styles.deleteCopy}>
              This permanently deletes your account and kitchen on this device. Store rules require
              this to live in the app, not only by email.
            </Text>
            <Button
              label="Delete my account"
              onPress={() => {
                void deleteAccount();
              }}
            />
            <Pressable onPress={() => setDeleteAsk(false)}>
              <Text style={styles.link}>Keep my account</Text>
            </Pressable>
          </View>
        ) : (
          <Pressable onPress={() => setDeleteAsk(true)} style={styles.deleteLaunch}>
            <Text style={styles.deleteLink}>Delete my account</Text>
          </Pressable>
        )}

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
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 4,
  },
  scroll: { padding: 20, paddingBottom: 40 },
  back: { fontFamily: fonts.sansSemi, color: colors.terracotta },
  title: { fontFamily: fonts.display, fontSize: 36, color: colors.ink, marginBottom: 20 },
  label: { fontFamily: fonts.display, fontSize: 22, color: colors.ink, marginTop: 8 },
  account: { fontFamily: fonts.sans, color: colors.inkSoft, marginTop: 6 },
  legalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
    marginBottom: 14,
  },
  legalDot: { fontFamily: fonts.sans, color: colors.inkSoft },
  rowBtns: { gap: 8, marginBottom: 10 },
  link: { fontFamily: fonts.sansSemi, color: colors.terracotta },
  note: { fontFamily: fonts.sans, color: colors.sage, marginBottom: 8, lineHeight: 20 },
  deleteLaunch: { marginTop: 18 },
  deleteLink: { fontFamily: fonts.sansSemi, color: colors.terracottaDeep },
  deleteBox: { marginTop: 18, gap: 10 },
  deleteCopy: { fontFamily: fonts.sans, color: colors.inkSoft, lineHeight: 21 },
  about: {
    fontFamily: fonts.sans,
    color: colors.inkSoft,
    marginTop: 20,
    lineHeight: 22,
  },
});
