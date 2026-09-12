import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button, Display, Pill } from '../components/ui';
import type { Diet } from '../types';
import { useKitchen } from '../store/kitchen';
import { colors, fonts } from '../theme';

export function OnboardingScreen() {
  const completeOnboarding = useKitchen((s) => s.completeOnboarding);
  const [step, setStep] = useState(0);
  const [diet, setDiet] = useState<Diet>('omnivore');
  const [householdSize, setHouseholdSize] = useState<1 | 2 | 4>(2);
  const [seed, setSeed] = useState(true);

  if (step === 0) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.hero}>
          <Text style={styles.kicker}>A dinner app, not a climate lecture</Text>
          <Display style={styles.wordmark} italic>
            Tonight.
          </Display>
          <Text style={styles.lede}>
            Cook what you already have, before it dies. Households waste a billion meals a day.
            Most of that is food someone already paid for.
          </Text>
        </View>
        <Button label="Show me dinner" onPress={() => setStep(1)} />
      </SafeAreaView>
    );
  }

  if (step === 1) {
    return (
      <SafeAreaView style={styles.safe}>
        <Display>One job.</Display>
        <Text style={styles.lede}>
          Snap or tap what is in the kitchen. Tonight picks three dinners that use what expires
          first. Two missing staples is fine. A shopping trip is not the point.
        </Text>
        <View style={styles.points}>
          <Text style={styles.point}>1. Add the fridge, not a meal plan.</Text>
          <Text style={styles.point}>2. Cook the thing that will not last.</Text>
          <Text style={styles.point}>3. Mark it cooked. Watch money stay home.</Text>
        </View>
        <Button label="Set the table" onPress={() => setStep(2)} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.form} showsVerticalScrollIndicator={false}>
        <Display>How do you eat?</Display>
        <View style={styles.row}>
          <Pill label="Everything" active={diet === 'omnivore'} onPress={() => setDiet('omnivore')} />
          <Pill label="Vegetarian" active={diet === 'vegetarian'} onPress={() => setDiet('vegetarian')} />
          <Pill label="Vegan" active={diet === 'vegan'} onPress={() => setDiet('vegan')} />
        </View>
        <Text style={styles.label}>Who is home for dinner?</Text>
        <View style={styles.row}>
          <Pill label="Just me" active={householdSize === 1} onPress={() => setHouseholdSize(1)} />
          <Pill label="Two" active={householdSize === 2} onPress={() => setHouseholdSize(2)} />
          <Pill label="Four" active={householdSize === 4} onPress={() => setHouseholdSize(4)} />
        </View>
        <Text style={styles.label}>Start from a typical fridge?</Text>
        <Text style={styles.hint}>
          Spinach on its last day, leftover rice, chicken, yogurt, bread. You can delete anything.
        </Text>
        <View style={styles.row}>
          <Pill label="Yes — show me tonight" active={seed} onPress={() => setSeed(true)} />
          <Pill label="Empty pantry" active={!seed} onPress={() => setSeed(false)} />
        </View>
      </ScrollView>
      <Button
        label="Open the kitchen"
        onPress={() => completeOnboarding({ diet, householdSize, seed })}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.paper,
    paddingHorizontal: 22,
    paddingBottom: 20,
    justifyContent: 'space-between',
  },
  hero: { flex: 1, justifyContent: 'center' },
  kicker: {
    fontFamily: fonts.sansSemi,
    color: colors.terracotta,
    letterSpacing: 0.4,
    marginBottom: 10,
  },
  wordmark: { fontSize: 64, lineHeight: 68, marginBottom: 16 },
  lede: {
    fontFamily: fonts.sans,
    fontSize: 18,
    lineHeight: 26,
    color: colors.inkSoft,
    marginTop: 12,
  },
  points: { gap: 12, marginVertical: 28 },
  point: {
    fontFamily: fonts.sansSemi,
    fontSize: 17,
    color: colors.ink,
  },
  form: { paddingTop: 12, paddingBottom: 24, gap: 8 },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 18, marginTop: 8 },
  label: {
    fontFamily: fonts.display,
    fontSize: 22,
    color: colors.ink,
    marginTop: 8,
  },
  hint: {
    fontFamily: fonts.sans,
    color: colors.inkSoft,
    marginTop: 4,
  },
});
