import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DietPicker } from '../components/DietPicker';
import { HouseholdInput } from '../components/HouseholdInput';
import { LocaleIcons } from '../components/LocaleIcons';
import { Button } from '../components/ui';
import { useKitchen } from '../store/kitchen';
import { colors, fonts } from '../theme';

export function SettingsScreen({ onBack }: { onBack: () => void }) {
  const settings = useKitchen((s) => s.settings);
  const updateSettings = useKitchen((s) => s.updateSettings);
  const resetKitchen = useKitchen((s) => s.resetKitchen);

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
        <Text style={styles.label}>Diet</Text>
        <DietPicker value={settings.diet} onChange={(diet) => updateSettings({ diet })} />
        <Text style={styles.label}>Who is home for dinner?</Text>
        <HouseholdInput
          value={settings.householdSize}
          onChange={(householdSize) => updateSettings({ householdSize })}
        />
        <View style={{ height: 24 }} />
        <Button variant="ghost" label="Reset kitchen" onPress={resetKitchen} />
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
  about: {
    fontFamily: fonts.sans,
    color: colors.inkSoft,
    marginTop: 20,
    lineHeight: 22,
  },
});
