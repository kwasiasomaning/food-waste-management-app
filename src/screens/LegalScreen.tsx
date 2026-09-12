import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  LEGAL_UPDATED,
  PRIVACY_SECTIONS,
  PRIVACY_VERSION,
  TERMS_SECTIONS,
  TERMS_VERSION,
} from '../data/legal';
import { colors, fonts } from '../theme';

export function LegalScreen({
  doc,
  onBack,
}: {
  doc: 'privacy' | 'terms';
  onBack: () => void;
}) {
  const privacy = doc === 'privacy';
  const sections = privacy ? PRIVACY_SECTIONS : TERMS_SECTIONS;
  const version = privacy ? PRIVACY_VERSION : TERMS_VERSION;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Pressable onPress={onBack} hitSlop={8} style={styles.backWrap}>
        <Text style={styles.back}>← Back</Text>
      </Pressable>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{privacy ? 'Privacy policy' : 'Terms of use'}</Text>
        <Text style={styles.meta}>
          Version {version} · Updated {LEGAL_UPDATED}
        </Text>
        {sections.map((section) => (
          <Text key={section.heading} style={styles.block}>
            <Text style={styles.heading}>{section.heading}.{'\n'}</Text>
            {section.body}
          </Text>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.paper },
  backWrap: { paddingHorizontal: 20, paddingTop: 4 },
  back: { fontFamily: fonts.sansSemi, color: colors.terracotta },
  scroll: { padding: 20, paddingBottom: 48 },
  title: { fontFamily: fonts.display, fontSize: 34, color: colors.ink, marginBottom: 6 },
  meta: { fontFamily: fonts.sansSemi, color: colors.inkSoft, marginBottom: 18 },
  block: {
    fontFamily: fonts.sans,
    color: colors.ink,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  heading: { fontFamily: fonts.sansBold, color: colors.ink },
});
