import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { WasteBrief } from '../data/wasteBriefs';
import { colors, fonts, radius } from '../theme';

export function WasteBriefCard({
  brief,
  onDismiss,
}: {
  brief: WasteBrief;
  onDismiss: () => void;
}) {
  return (
    <View style={styles.card} accessibilityRole="text">
      <View style={styles.head}>
        <Text style={styles.source}>{brief.source}</Text>
        <Pressable onPress={onDismiss} hitSlop={10} accessibilityRole="button" accessibilityLabel="Dismiss">
          <Text style={styles.dismiss}>Dismiss</Text>
        </Pressable>
      </View>
      <Text style={[styles.body, brief.kind === 'quote' && styles.quote]}>{brief.text}</Text>
      <Text style={styles.cite}>{brief.cite}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.sageSoft,
    borderRadius: radius.md,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.line,
  },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  dismiss: {
    fontFamily: fonts.sansSemi,
    fontSize: 12,
    color: colors.inkSoft,
  },
  source: {
    fontFamily: fonts.sansBold,
    fontSize: 11,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: colors.sage,
  },
  body: {
    fontFamily: fonts.sans,
    color: colors.ink,
    fontSize: 16,
    lineHeight: 23,
    marginTop: 6,
  },
  quote: {
    fontFamily: fonts.displayItalic,
    fontSize: 18,
    lineHeight: 25,
  },
  cite: {
    fontFamily: fonts.sans,
    color: colors.inkSoft,
    fontSize: 12,
    marginTop: 8,
  },
});
