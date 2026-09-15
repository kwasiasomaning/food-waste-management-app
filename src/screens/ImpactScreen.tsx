import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LocaleIcons } from '../components/LocaleIcons';
import { countedNoun } from '../lib/grammar';
import {
  groceryOrderStatusLabel,
  grocerySpendUsd,
  moneySavedAfterGroceryUsd,
} from '../lib/grocery';
import { formatKg, formatMoney, mealsEquivalent } from '../lib/savings';
import { useKitchen } from '../store/kitchen';
import type { GroceryOrder } from '../types';
import { colors, fonts, radius, traffic } from '../theme';

export function ImpactScreen() {
  const cooked = useKitchen((s) => s.cooked);
  const wasted = useKitchen((s) => s.wasted ?? []);
  const used = useKitchen((s) => s.used ?? []);
  const groceryOrders = useKitchen((s) => s.groceryOrders ?? []);
  const currency = useKitchen((s) => s.settings.currency ?? 'USD');
  const money = (value: number) => formatMoney(value, currency);
  const groceryUsd = grocerySpendUsd(groceryOrders);
  const savedUsd = moneySavedAfterGroceryUsd(cooked, used, groceryOrders);
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
            label="Money Saved"
            amount={formatMoney(savedUsd, currency, { tight: true })}
            detail={groceryUsd > 0 ? `After ${money(groceryUsd)} grocery delivery` : undefined}
            ink={savedUsd >= 0 ? colors.sage : traffic.tonight.ink}
            wash={savedUsd >= 0 ? colors.sageSoft : traffic.tonight.wash}
            large
          />
          <HeroBox
            label="Money Wasted"
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
          <View style={styles.row}>
            <Stat
              count={groceryOrders.length}
              one="grocery delivery"
              many="grocery deliveries"
            />
            <View style={styles.stat}>
              <Text style={styles.statNum}>{money(groceryUsd)}</Text>
              <Text style={styles.statCap}>grocery spend</Text>
            </View>
          </View>
        </View>

        <Text style={styles.section}>Delivered for dinner</Text>
        {groceryOrders.length === 0 ? (
          <Text style={styles.empty}>
            Send Shop through Uber Eats Grocery and the ticket lands here. Money Saved comes down
            by the order total so the kitchen ledger stays honest.
          </Text>
        ) : (
          groceryOrders.map((order) => (
            <GroceryTicket key={order.id} order={order} money={money} />
          ))
        )}

        <Text style={[styles.section, { marginTop: 28 }]}>Cooked</Text>
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

function GroceryTicket({
  order,
  money,
}: {
  order: GroceryOrder;
  money: (value: number) => string;
}) {
  return (
    <View style={styles.ticket}>
      <View style={styles.ticketHead}>
        <View style={{ flex: 1 }}>
          <Text style={styles.mealTitle}>{order.providerLabel}</Text>
          <Text style={styles.mealMeta}>
            {new Date(order.placedAt).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
            })}
            {' · '}
            {groceryOrderStatusLabel(order.status)}
            {' · '}
            {order.externalOrderId}
          </Text>
        </View>
        <Text style={styles.mealLose}>−{money(order.totalUsd)}</Text>
      </View>
      <Text style={styles.ticketStore}>{order.storeName}</Text>
      {order.lines.map((line) => (
        <View key={line.sku} style={styles.ticketLine}>
          <Text style={styles.ticketName}>
            {line.quantity} × {line.name}
          </Text>
          <Text style={styles.ticketAmt}>{money(line.lineTotalUsd)}</Text>
        </View>
      ))}
      <View style={styles.ticketLine}>
        <Text style={styles.ticketName}>Delivery</Text>
        <Text style={styles.ticketAmt}>{money(order.deliveryFeeUsd)}</Text>
      </View>
      <View style={styles.ticketLine}>
        <Text style={styles.ticketName}>Service</Text>
        <Text style={styles.ticketAmt}>{money(order.serviceFeeUsd)}</Text>
      </View>
      {order.dropoffLabel ? <Text style={styles.ticketDrop}>{order.dropoffLabel}</Text> : null}
    </View>
  );
}

function HeroBox({
  label,
  amount,
  detail,
  ink,
  wash,
  large,
}: {
  label: string;
  amount: string;
  detail?: string;
  ink: string;
  wash: string;
  large?: boolean;
}) {
  return (
    <View style={[styles.hero, { backgroundColor: wash }]}>
      <Text style={styles.heroEyebrow}>{label}</Text>
      <Text
        style={[styles.heroAmount, large && styles.heroAmountLarge, { color: ink }]}
        numberOfLines={1}
      >
        {amount}
      </Text>
      {detail ? (
        <Text style={[styles.heroDetail, { color: ink }]} numberOfLines={1}>
          {detail}
        </Text>
      ) : null}
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
  scroll: { padding: 20, paddingBottom: 56 },
  kicker: { fontFamily: fonts.sansSemi, color: colors.inkSoft },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 16,
  },
  title: { fontFamily: fonts.display, fontSize: 36, color: colors.ink, flex: 1 },
  split: { gap: 8, marginBottom: 12 },
  hero: {
    borderRadius: radius.lg,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  heroEyebrow: {
    fontFamily: fonts.sansBold,
    fontSize: 11,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: colors.inkSoft,
  },
  heroAmount: {
    fontFamily: fonts.sansBold,
    fontSize: 22,
    lineHeight: 26,
    marginTop: 8,
    fontVariant: ['tabular-nums'],
  },
  heroAmountLarge: {
    fontFamily: fonts.display,
    fontSize: 36,
    lineHeight: 40,
    marginTop: 6,
  },
  heroDetail: {
    fontFamily: fonts.sans,
    fontSize: 14,
    lineHeight: 18,
    marginTop: 4,
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
  ticket: {
    backgroundColor: colors.cream,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 14,
    marginBottom: 10,
    gap: 6,
  },
  ticketHead: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  ticketStore: { fontFamily: fonts.sans, color: colors.inkSoft, fontSize: 13 },
  ticketLine: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  ticketName: { fontFamily: fonts.sans, color: colors.ink, flex: 1 },
  ticketAmt: { fontFamily: fonts.sansSemi, color: colors.ink },
  ticketDrop: { fontFamily: fonts.sans, color: colors.inkSoft, fontSize: 12, marginTop: 4 },
});
