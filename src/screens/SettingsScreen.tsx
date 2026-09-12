import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { HouseholdInput } from '../components/HouseholdInput';
import { Button, Pill } from '../components/ui';
import { useKitchen } from '../store/kitchen';
import { colors, fonts } from '../theme';
import type { Diet } from '../types';

export function SettingsScreen({ onBack }: { onBack: () => void }) {
  const settings = useKitchen((s) => s.settings);
  const updateSettings = useKitchen((s) => s.updateSettings);
  const resetKitchen = useKitchen((s) => s.resetKitchen);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Pressable onPress={onBack}>
        <Text style={styles.back}>← Tonight</Text>
      </Pressable>
      <Text style={styles.title}>Settings</Text>
      <Text style={styles.label}>Diet</Text>
      <View style={styles.row}>
        {(['omnivore', 'vegetarian', 'vegan'] as Diet[]).map((diet) => (
          <Pill
            key={diet}
            label={diet[0].toUpperCase() + diet.slice(1)}
            active={settings.diet === diet}
            onPress={() => updateSettings({ diet })}
          />
        ))}
      </View>
      <Text style={styles.label}>Who is home for dinner?</Text>
      <HouseholdInput
        value={settings.householdSize}
        onChange={(householdSize) => updateSettings({ householdSize })}
      />
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.paper, padding: 20 },
  back: { fontFamily: fonts.sansSemi, color: colors.terracotta, marginBottom: 12 },
  title: { fontFamily: fonts.display, fontSize: 36, color: colors.ink, marginBottom: 20 },
  label: { fontFamily: fonts.display, fontSize: 22, color: colors.ink, marginTop: 8 },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10, marginBottom: 8 },
  about: {
    fontFamily: fonts.sans,
    color: colors.inkSoft,
    marginTop: 20,
    lineHeight: 22,
  },
});
