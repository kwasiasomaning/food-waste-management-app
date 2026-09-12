import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { formatKg, formatMoney, mealsEquivalent } from '../lib/savings';
import { useKitchen } from '../store/kitchen';
import { colors, fonts, radius, traffic } from '../theme';

export function ImpactScreen() {
  const cooked = useKitchen((s) => s.cooked);
  const wasted = useKitchen((s) => s.wasted ?? []);
  const savedUsd = cooked.reduce((sum, meal) => sum + meal.savedUsd, 0);
  const savedKg = cooked.reduce((sum, meal) => sum + meal.savedKg, 0);
  const lostUsd = wasted.reduce((sum, item) => sum + item.lostUsd, 0);
  const lostKg = wasted.reduce((sum, item) => sum + item.lostKg, 0);
  const net = Math.round((savedUsd - lostUsd) * 100) / 100;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.kicker}>What stayed food, and what did not</Text>
        <Text style={styles.title}>Saved</Text>

        <View style={styles.split}>
          <View style={[styles.hero, styles.heroSave]}>
            <Text style={styles.heroEyebrow}>Kept</Text>
            <Text style={[styles.heroNum, { color: colors.sage }]}>{formatMoney(savedUsd)}</Text>
            <Text style={styles.heroCap}>{formatKg(savedKg)} still dinner</Text>
          </View>
          <View style={[styles.hero, styles.heroLose]}>
            <Text style={styles.heroEyebrow}>Walked out</Text>
            <Text style={[styles.heroNum, { color: traffic.tonight.ink }]}>{formatMoney(lostUsd)}</Text>
            <Text style={styles.heroCap}>{formatKg(lostKg)} in the bin</Text>
          </View>
        </View>

        <Text style={styles.net}>
          {net >= 0
            ? `${formatMoney(net)} more stayed in the kitchen than left in a bag.`
            : `${formatMoney(Math.abs(net))} more walked out the door than you cooked.`}
        </Text>

        <View style={styles.row}>
          <View style={styles.stat}>
            <Text style={styles.statNum}>{cooked.length}</Text>
            <Text style={styles.statCap}>dinners cooked</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNum}>{wasted.length}</Text>
            <Text style={styles.statCap}>items binned</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNum}>{mealsEquivalent(lostKg)}</Text>
            <Text style={styles.statCap}>meals thrown away</Text>
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

        <Text style={[styles.section, { marginTop: 28 }]}>Binned</Text>
        {wasted.length === 0 ? (
          <Text style={styles.empty}>
            When something goes in the bin, mark it Binned in Pantry. The grocery money leaves
            this list so it is not invisible.
          </Text>
        ) : (
          wasted.map((item) => (
            <View key={item.id} style={styles.meal}>
              <View>
                <Text style={styles.mealTitle}>{item.name}</Text>
                <Text style={styles.mealMeta}>
                  {new Date(item.binnedAt).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                  })}
                  {item.lostKg ? ` · ${formatKg(item.lostKg)}` : ''}
                </Text>
              </View>
              <Text style={styles.mealLose}>{formatMoney(item.lostUsd)}</Text>
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
  split: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  hero: {
    flex: 1,
    borderRadius: radius.lg,
    padding: 14,
  },
  heroSave: { backgroundColor: colors.sageSoft },
  heroLose: { backgroundColor: traffic.tonight.wash },
  heroEyebrow: {
    fontFamily: fonts.sansBold,
    fontSize: 11,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: colors.inkSoft,
  },
  heroNum: { fontFamily: fonts.display, fontSize: 28, marginTop: 4 },
  heroCap: { fontFamily: fonts.sans, color: colors.ink, marginTop: 4, fontSize: 13 },
  net: {
    fontFamily: fonts.sans,
    color: colors.inkSoft,
    lineHeight: 22,
    marginBottom: 16,
  },
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
  mealLose: { fontFamily: fonts.sansBold, color: traffic.tonight.ink },
});
