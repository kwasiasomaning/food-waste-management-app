import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { formatKg, formatMoney, mealsEquivalent } from '../lib/savings';
import { useKitchen } from '../store/kitchen';
import { colors, fonts, radius } from '../theme';

export function ImpactScreen() {
  const cooked = useKitchen((s) => s.cooked);
  const savedUsd = cooked.reduce((sum, meal) => sum + meal.savedUsd, 0);
  const savedKg = cooked.reduce((sum, meal) => sum + meal.savedKg, 0);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.kicker}>Food that stayed food</Text>
        <Text style={styles.title}>Saved</Text>
        <View style={styles.hero}>
          <Text style={styles.heroNum}>{formatMoney(savedUsd)}</Text>
          <Text style={styles.heroCap}>kept in the kitchen, not the bin</Text>
        </View>
        <View style={styles.row}>
          <View style={styles.stat}>
            <Text style={styles.statNum}>{cooked.length}</Text>
            <Text style={styles.statCap}>dinners cooked</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNum}>{formatKg(savedKg)}</Text>
            <Text style={styles.statCap}>not wasted</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNum}>{mealsEquivalent(savedKg)}</Text>
            <Text style={styles.statCap}>meals worth</Text>
          </View>
        </View>
        <Text style={styles.section}>Cooked</Text>
        {cooked.length === 0 ? (
          <Text style={styles.empty}>
            Cook tonight’s dinner and the savings show up here. No leaderboard. No guilt streak.
          </Text>
        ) : (
          cooked.map((meal) => (
            <View key={meal.id} style={styles.meal}>
              <View>
                <Text style={styles.mealTitle}>{meal.title}</Text>
                <Text style={styles.mealMeta}>
                  {new Date(meal.cookedAt).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                  })}
                </Text>
              </View>
              <Text style={styles.mealSave}>{formatMoney(meal.savedUsd)}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.paper },
  scroll: { padding: 20, paddingBottom: 40 },
  kicker: { fontFamily: fonts.sansSemi, color: colors.inkSoft },
  title: { fontFamily: fonts.display, fontSize: 36, color: colors.ink, marginBottom: 16 },
  hero: {
    backgroundColor: colors.sageSoft,
    borderRadius: radius.lg,
    padding: 20,
    marginBottom: 12,
  },
  heroNum: { fontFamily: fonts.display, fontSize: 48, color: colors.sage },
  heroCap: { fontFamily: fonts.sans, color: colors.ink, marginTop: 4 },
  row: { flexDirection: 'row', gap: 8, marginBottom: 24 },
  stat: {
    flex: 1,
    backgroundColor: colors.cream,
    borderRadius: radius.md,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.line,
  },
  statNum: { fontFamily: fonts.display, fontSize: 22, color: colors.ink },
  statCap: { fontFamily: fonts.sans, color: colors.inkSoft, fontSize: 12, marginTop: 4 },
  section: { fontFamily: fonts.display, fontSize: 24, color: colors.ink, marginBottom: 10 },
  empty: { fontFamily: fonts.sans, color: colors.inkSoft, lineHeight: 23 },
  meal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  mealTitle: { fontFamily: fonts.sansSemi, color: colors.ink, fontSize: 16 },
  mealMeta: { fontFamily: fonts.sans, color: colors.inkSoft, marginTop: 2 },
  mealSave: { fontFamily: fonts.sansBold, color: colors.sage },
});
