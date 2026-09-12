import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button, Display } from '../components/ui';
import { RECIPES } from '../data/recipes';
import { formatKg, formatMoney } from '../lib/savings';
import { useKitchen } from '../store/kitchen';
import { colors, fonts } from '../theme';

export function CookedScreen({
  recipeId,
  savedUsd,
  savedKg,
  onDone,
}: {
  recipeId: string;
  savedUsd: number;
  savedKg: number;
  onDone: () => void;
}) {
  const recipe = RECIPES.find((row) => row.id === recipeId);
  const currency = useKitchen((s) => s.settings.currency ?? 'USD');
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.center}>
        <Text style={styles.emoji}>{recipe?.emoji ?? '🍽️'}</Text>
        <Display italic>That stayed food.</Display>
        <Text style={styles.body}>
          {recipe?.title ?? 'Dinner'} is cooked. The ingredients came off the pantry so they cannot
          quietly expire behind the milk.
        </Text>
        <View style={styles.nums}>
          <Text style={styles.num}>{formatMoney(savedUsd, currency)}</Text>
          <Text style={styles.cap}>estimated groceries kept</Text>
          <Text style={[styles.num, { marginTop: 16 }]}>{formatKg(savedKg)}</Text>
          <Text style={styles.cap}>not in the bin</Text>
        </View>
      </View>
      <Button label="Back to the kitchen" onPress={onDone} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.paper,
    padding: 22,
    justifyContent: 'space-between',
  },
  center: { flex: 1, justifyContent: 'center' },
  emoji: { fontSize: 64, marginBottom: 12 },
  body: {
    fontFamily: fonts.sans,
    color: colors.inkSoft,
    fontSize: 17,
    lineHeight: 25,
    marginTop: 12,
  },
  nums: { marginTop: 28 },
  num: { fontFamily: fonts.display, fontSize: 40, color: colors.sage },
  cap: { fontFamily: fonts.sans, color: colors.inkSoft, marginTop: 2 },
});
