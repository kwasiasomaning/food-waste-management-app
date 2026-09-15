/**
 * Shelved Uber Eats grocery checkout. Not routed from App in Tonight v1.
 */
import { useEffect, useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

import { DeliveryAddress } from '../../components/_shelved/DeliveryAddress';
import { FoodStill } from '../../components/FoodStill';
import { Button } from '../../components/ui';
import { groceryOrderStatusLabel } from '../../lib/grocery/status';
import { dropoffFromSettings, isDropoffReady } from '../../lib/grocery/_shelved/catalog';
import { groceryProvider } from '../../lib/grocery/_shelved/registry';
import { formatMoney } from '../../lib/savings';
import { useKitchen } from '../../store/kitchen';
import { colors, fonts, radius } from '../../theme';
import type { GroceryOrder, GroceryQuote } from '../../types';

export function GroceryCheckoutScreen({
  ingredientIds,
  onBack,
  onDone,
}: {
  ingredientIds: string[];
  onBack: () => void;
  onDone: () => void;
}) {
  const settings = useKitchen((s) => s.settings);
  const updateSettings = useKitchen((s) => s.updateSettings);
  const recordGroceryOrder = useKitchen((s) => s.recordGroceryOrder);
  const currency = settings.currency ?? 'USD';
  const money = (value: number) => formatMoney(value, currency);
  const providerId = settings.groceryProviderId;
  const provider = groceryProvider(providerId);
  const dropoff = dropoffFromSettings(settings);
  const idsKey = ingredientIds.join(',');
  const country = settings.country ?? 'US';

  const [quote, setQuote] = useState<GroceryQuote | null>(null);
  const [order, setOrder] = useState<GroceryOrder | null>(null);
  const [quoting, setQuoting] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ready = isDropoffReady(dropoff);

  useEffect(() => {
    if (!idsKey) return;
    const partner = groceryProvider(providerId);
    const basket = idsKey.split(',').filter(Boolean);
    const dest = { line1: dropoff.line1, city: dropoff.city, postal: dropoff.postal };
    let active = true;
    const timer = setTimeout(() => {
      setQuoting(true);
      setError(null);
      void partner
        .quote({ ingredientIds: basket, dropoff: dest, country })
        .then((next) => {
          if (active) setQuote(next);
        })
        .catch((issue: unknown) => {
          if (!active) return;
          setError(issue instanceof Error ? issue.message : 'Could not quote this order.');
        })
        .finally(() => {
          if (active) setQuoting(false);
        });
    }, 220);
    return () => {
      active = false;
      clearTimeout(timer);
      setQuoting(false);
    };
  }, [idsKey, dropoff.line1, dropoff.city, dropoff.postal, providerId, country]);

  const place = async () => {
    if (!quote || !ready || placing) return;
    setPlacing(true);
    setError(null);
    try {
      const placed = await groceryProvider(providerId).place(quote);
      recordGroceryOrder(placed);
      setOrder(placed);
      if (Platform.OS !== 'web') {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (issue: unknown) {
      setError(issue instanceof Error ? issue.message : 'Could not place this grocery order.');
    } finally {
      setPlacing(false);
    }
  };

  const names = useMemo(
    () => (order ?? quote)?.lines.map((line) => line.name).join(', ') ?? '',
    [order, quote],
  );

  if (!ingredientIds.length) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.top}>
          <Pressable onPress={onBack} hitSlop={8}>
            <Text style={styles.back}>← Shop</Text>
          </Pressable>
        </View>
        <Text style={[styles.title, { paddingHorizontal: 20 }]}>Nothing to deliver.</Text>
        <View style={{ padding: 20 }}>
          <Button label="Back to Shop" onPress={onBack} />
        </View>
      </SafeAreaView>
    );
  }

  if (order) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <FoodStill id="citrus" height={120} />
          <Text style={styles.kicker}>{groceryOrderStatusLabel(order.status)}</Text>
          <Text style={styles.title}>On the way.</Text>
          <Text style={styles.lede}>
            {provider.label} has {names}. They land in Pantry so Tonight can cook. {money(order.totalUsd)}{' '}
            comes off Money Saved.
          </Text>
          <View style={styles.ticket}>
            <Text style={styles.store}>{order.storeName}</Text>
            <Text style={styles.meta}>
              About {order.etaMinutes} min · {order.externalOrderId}
            </Text>
            {order.lines.map((line) => (
              <View key={line.sku} style={styles.line}>
                <Text style={styles.lineName}>
                  {line.quantity} × {line.name}
                </Text>
                <Text style={styles.lineAmt}>{money(line.lineTotalUsd)}</Text>
              </View>
            ))}
            <View style={styles.line}>
              <Text style={styles.lineName}>Delivery</Text>
              <Text style={styles.lineAmt}>{money(order.deliveryFeeUsd)}</Text>
            </View>
            <View style={styles.line}>
              <Text style={styles.lineName}>Service</Text>
              <Text style={styles.lineAmt}>{money(order.serviceFeeUsd)}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Order total</Text>
              <Text style={styles.totalAmt}>{money(order.totalUsd)}</Text>
            </View>
            <Text style={styles.drop}>{order.dropoffLabel}</Text>
          </View>
          <Button label="See Saved" onPress={onDone} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.top}>
        <Pressable onPress={onBack} hitSlop={8}>
          <Text style={styles.back}>← Shop</Text>
        </Pressable>
      </View>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <Text style={styles.kicker}>{provider.label}</Text>
          <Text style={styles.title}>Deliver</Text>
          <Text style={styles.lede}>
            The bits dinner is missing, at the door in minutes. Tonight never stores a payment card.
          </Text>

          {quote ? (
            <View style={styles.ticket}>
              <Text style={styles.store}>{quote.storeName}</Text>
              <Text style={styles.meta}>
                About {quote.etaMinutes} min
                {quoting ? ' · updating' : quote.live ? ' · live quote' : ' · sandbox quote'}
              </Text>
              {quote.lines.map((line) => (
                <View key={line.sku} style={styles.line}>
                  <Text style={styles.lineName}>
                    {line.quantity} × {line.name}
                  </Text>
                  <Text style={styles.lineAmt}>{money(line.lineTotalUsd)}</Text>
                </View>
              ))}
              <View style={styles.line}>
                <Text style={styles.lineName}>Delivery</Text>
                <Text style={styles.lineAmt}>{money(quote.deliveryFeeUsd)}</Text>
              </View>
              <View style={styles.line}>
                <Text style={styles.lineName}>Service</Text>
                <Text style={styles.lineAmt}>{money(quote.serviceFeeUsd)}</Text>
              </View>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Order total</Text>
                <Text style={styles.totalAmt}>{money(quote.totalUsd)}</Text>
              </View>
            </View>
          ) : (
            <Text style={styles.lede}>{quoting ? 'Pricing the ticket…' : 'Add a drop-off to price this order.'}</Text>
          )}

          <Text style={styles.section}>Drop-off</Text>
          <Text style={styles.hint}>Street, city, and postal code only. No GPS.</Text>
          <DeliveryAddress
            value={dropoff}
            onChange={(next) =>
              updateSettings({
                deliveryLine1: next.line1,
                deliveryCity: next.city,
                deliveryPostal: next.postal,
              })
            }
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}
          {!ready ? (
            <Text style={styles.hint}>Fill the drop-off so {provider.label} knows where to stop.</Text>
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>
      <View style={styles.footer}>
        <Button
          label={
            quote
              ? placing
                ? 'Placing order…'
                : `Place ${provider.label} order · ${money(quote.totalUsd)}`
              : 'Place order'
          }
          onPress={() => void place()}
          disabled={!quote || !ready || placing}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.paper },
  top: {
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 4,
  },
  scroll: { padding: 20, paddingTop: 12, paddingBottom: 48, gap: 12 },
  back: { fontFamily: fonts.sansSemi, color: colors.terracotta },
  kicker: { fontFamily: fonts.sansSemi, color: colors.inkSoft },
  title: { fontFamily: fonts.display, fontSize: 36, color: colors.ink },
  lede: { fontFamily: fonts.sans, color: colors.inkSoft, lineHeight: 22 },
  ticket: {
    backgroundColor: colors.cream,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 16,
    gap: 8,
  },
  store: { fontFamily: fonts.sansSemi, fontSize: 16, color: colors.ink },
  meta: { fontFamily: fonts.sansSemi, color: colors.inkSoft, fontSize: 13 },
  line: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  lineName: { fontFamily: fonts.sans, color: colors.ink, flex: 1 },
  lineAmt: { fontFamily: fonts.sansSemi, color: colors.ink },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: colors.line,
    paddingTop: 10,
    marginTop: 4,
  },
  totalLabel: { fontFamily: fonts.sansBold, color: colors.ink },
  totalAmt: { fontFamily: fonts.sansBold, color: colors.ink },
  drop: { fontFamily: fonts.sans, color: colors.inkSoft, fontSize: 13, marginTop: 4 },
  section: { fontFamily: fonts.display, fontSize: 24, color: colors.ink, marginTop: 8 },
  hint: { fontFamily: fonts.sans, color: colors.inkSoft, fontSize: 13, lineHeight: 19 },
  error: { fontFamily: fonts.sansSemi, color: colors.terracottaDeep, lineHeight: 20 },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    backgroundColor: colors.cream,
  },
});
