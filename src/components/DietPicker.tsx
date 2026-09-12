import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { DIET_LABEL, OTHER_DIETS, PILL_DIETS, isPillDiet } from '../data/diets';
import type { Diet } from '../types';
import { colors, fonts, radius } from '../theme';
import { Pill } from './ui';

export function DietPicker({
  value,
  onChange,
}: {
  value: Diet;
  onChange: (diet: Diet) => void;
}) {
  const [open, setOpen] = useState(false);
  const otherSelected = !isPillDiet(value);

  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        {PILL_DIETS.map((diet) => (
          <Pill
            key={diet}
            label={DIET_LABEL[diet]}
            active={value === diet}
            onPress={() => onChange(diet)}
          />
        ))}
        <Pressable
          onPress={() => setOpen(true)}
          style={[styles.drop, otherSelected && styles.dropActive]}
          accessibilityRole="button"
          accessibilityLabel="Other dietary needs"
        >
          <Text style={[styles.dropText, otherSelected && styles.dropTextActive]}>
            {otherSelected ? DIET_LABEL[value] : 'More'} ▾
          </Text>
        </Pressable>
      </View>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <Pressable style={styles.sheet} onPress={() => undefined}>
            <Text style={styles.sheetTitle}>Other dietary needs</Text>
            <ScrollView style={styles.list} keyboardShouldPersistTaps="handled">
              {OTHER_DIETS.map((diet) => {
                const active = value === diet;
                return (
                  <Pressable
                    key={diet}
                    onPress={() => {
                      onChange(diet);
                      setOpen(false);
                    }}
                    style={[styles.option, active && styles.optionActive]}
                  >
                    <Text style={[styles.optionText, active && styles.optionTextActive]}>
                      {DIET_LABEL[diet]}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginTop: 8, marginBottom: 8 },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  drop: {
    borderRadius: radius.pill,
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: colors.cream,
    borderWidth: 1,
    borderColor: colors.line,
  },
  dropActive: {
    backgroundColor: colors.ink,
    borderColor: colors.ink,
  },
  dropText: {
    fontFamily: fonts.sansSemi,
    color: colors.ink,
    fontSize: 14,
  },
  dropTextActive: { color: colors.cream },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(27, 23, 19, 0.45)',
    justifyContent: 'center',
    padding: 24,
  },
  sheet: {
    backgroundColor: colors.cream,
    borderRadius: radius.lg,
    maxHeight: '72%',
    paddingTop: 16,
    overflow: 'hidden',
  },
  sheetTitle: {
    fontFamily: fonts.display,
    fontSize: 22,
    color: colors.ink,
    paddingHorizontal: 18,
    marginBottom: 8,
  },
  list: { paddingHorizontal: 10, paddingBottom: 12 },
  option: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: radius.sm,
  },
  optionActive: { backgroundColor: colors.paperDeep },
  optionText: {
    fontFamily: fonts.sansSemi,
    fontSize: 16,
    color: colors.ink,
  },
  optionTextActive: { color: colors.terracottaDeep },
});
