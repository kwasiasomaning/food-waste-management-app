import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LocaleIcons } from '../components/LocaleIcons';
import { countedNoun } from '../lib/grammar';
import { formatKg, formatMoney, mealsEquivalent } from '../lib/savings';
import { useKitchen } from '../store/kitchen';
import { colors, fonts, radius, traffic } from '../theme';

export function ImpactScreen() {
  const cooked = useKitchen((s) => s.cooked);
  const wasted = useKitchen((s) => s.wasted ?? []);
  const used = useKitchen((s) => s.used ?? []);
  const currency = useKitchen((s) => s.settings.currency ?? 'USD');
  const money = (value: number) => formatMoney(value, currency);
  const cookedUsd = cooked.reduce((sum, meal) => sum + meal.savedUsd, 0);
  const cookedKg = cooked.reduce((sum, meal) => sum + meal.savedKg, 0);
  const usedUsd = used.reduce((sum, item) => sum + item.savedUsd, 0);
  const usedKg = used.reduce((sum, item) => sum + item.savedKg, 0);
  const savedUsd = Math.round((cookedUsd + usedUsd) * 100) / 100;
  const savedKg = Math.round((cookedKg + usedKg) * 100) / 100;
  const lostUsd = wasted.reduce((sum, item) => sum + item.lostUsd, 0);
  const lostKg = wasted.reduce((sum, item) => sum + item.lostKg, 0);
  const mealsAway = mealsEquivalent(lostKg);
  const net = Math.round((savedUsd - lostUsd) * 100) / 100;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.kicker}>What stayed food, and what did not</Text>
        <View style={styles.top}>
          <Text style={styles.title}>Saved</Text>
          <LocaleIcons />
        </View>

        <View style={styles.split}>
          <HeroBox
            label="Kept"
            amount={formatMoney(savedUsd, currency, { tight: true })}
            detail={`${formatKg(savedKg)} still dinner`}
            ink={colors.sage}
            wash={colors.sageSoft}
          />
          <HeroBox
            label="Walked out"
            amount={formatMoney(lostUsd, currency, { tight: true })}
            detail={`${formatKg(lostKg)} to landfill 😢`}
            ink={traffic.tonight.ink}
            wash={traffic.tonight.wash}
          />
        </View>

        <Text style={styles.net}>
          {net >= 0
            ? `${money(net)} more stayed in the kitchen than left in a bag.`
            : `${money(Math.abs(net))} more walked out the door than you cooked.`}
        </Text>

        <View style={styles.grid}>
          <View style={styles.row}>
            <Stat count={cooked.length} one="dinner cooked" many="dinners cooked" />
            <Stat count={used.length} one="item used" many="items used" />
          </View>
          <View style={styles.row}>
            <Stat count={wasted.length} one="item binned" many="items binned" />
            <Stat count={mealsAway} one="meal thrown away" many="meals thrown away" />
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
              <Text style={styles.mealSave}>{money(meal.savedUsd)}</Text>
            </View>
          ))
        )}

        <Text style={[styles.section, { marginTop: 28 }]}>Items Used</Text>
        {used.length === 0 ? (
          <Text style={styles.empty}>
            When you finish something, mark it Used in Pantry. The grocery money stays here so it
            counts as kept.
          </Text>
        ) : (
          used.map((item) => (
            <View key={item.id} style={styles.meal}>
              <View>
                <Text style={styles.mealTitle}>{item.name}</Text>
                <Text style={styles.mealMeta}>
                  {new Date(item.usedAt).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                  })}
                  {item.savedKg ? ` · ${formatKg(item.savedKg)}` : ''}
                </Text>
              </View>
              <Text style={styles.mealSave}>{money(item.savedUsd)}</Text>
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
              <Text style={styles.mealLose}>{money(item.lostUsd)}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function HeroBox({
  label,
  amount,
  detail,
  ink,
  wash,
}: {
  label: string;
  amount: string;
  detail: string;
  ink: string;
  wash: string;
}) {
  return (
    <View style={[styles.hero, { backgroundColor: wash }]}>
      <Text style={styles.heroEyebrow}>{label}</Text>
      <View style={styles.heroLine}>
        <Text style={[styles.heroMetric, styles.heroAmount, { color: ink }]} numberOfLines={1}>
          {amount}
        </Text>
        <Text style={[styles.heroMetric, styles.heroDetail, { color: ink }]} numberOfLines={1}>
          {detail}
        </Text>
      </View>
    </View>
  );
}

function Stat({ count, one, many }: { count: number; one: string; many: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statNum}>{count}</Text>
      <Text style={styles.statCap}>{countedNoun(count, one, many)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.paper },
  scroll: { padding: 20, paddingBottom: 40 },
  kicker: { fontFamily: fonts.sansSemi, color: colors.inkSoft },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 16,
  },
  title: { fontFamily: fonts.display, fontSize: 36, color: colors.ink, flex: 1 },
  split: { flexDirection: 'row', alignItems: 'stretch', gap: 10, marginBottom: 12 },
  hero: {
    flex: 1,
    minWidth: 0,
    borderRadius: radius.lg,
    paddingVertical: 14,
    paddingHorizontal: 12,
    minHeight: 84,
    justifyContent: 'space-between',
  },
  heroEyebrow: {
    fontFamily: fonts.sansBold,
    fontSize: 11,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: colors.inkSoft,
  },
  heroLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
    minHeight: 20,
  },
  heroMetric: {
    fontFamily: fonts.sansSemi,
    fontSize: 15,
    lineHeight: 20,
    fontVariant: ['tabular-nums'],
  },
  heroAmount: {
    flexGrow: 0,
    flexShrink: 0,
  },
  heroDetail: {
    flex: 1,
    minWidth: 0,
  },
  net: {
    fontFamily: fonts.sans,
    color: colors.inkSoft,
    lineHeight: 22,
    marginBottom: 16,
  },
  grid: { gap: 8, marginBottom: 24 },
  row: { flexDirection: 'row', gap: 8 },
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
