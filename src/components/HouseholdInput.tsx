import { useEffect, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { parseHouseholdSize } from '../lib/household';
import { colors, fonts, radius } from '../theme';
import { Pill } from './ui';

const PRESETS = [1, 2, 4] as const;

export function HouseholdInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  const [text, setText] = useState(String(value));
  const preset = PRESETS.includes(value as (typeof PRESETS)[number]);

  useEffect(() => {
    setText(preset ? '' : String(value));
  }, [value, preset]);

  return (
    <View style={styles.wrap}>
      {PRESETS.map((size) => (
        <Pill
          key={size}
          label={String(size)}
          active={value === size}
          onPress={() => onChange(size)}
        />
      ))}
      <TextInput
        value={text}
        onChangeText={(raw) => {
          const digits = raw.replace(/[^\d]/g, '');
          setText(digits);
          if (digits.length) onChange(parseHouseholdSize(digits, value));
        }}
        onBlur={() => {
          const next = parseHouseholdSize(text, value);
          onChange(next);
          setText(String(next));
        }}
        keyboardType="number-pad"
        inputMode="numeric"
        maxLength={2}
        placeholder="Other"
        placeholderTextColor={colors.inkSoft}
        accessibilityLabel="Other household size"
        style={[styles.input, !preset && styles.inputActive]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
    marginBottom: 8,
  },
  input: {
    minWidth: 72,
    backgroundColor: colors.cream,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontFamily: fonts.sansSemi,
    fontSize: 14,
    color: colors.ink,
    textAlign: 'center',
  },
  inputActive: {
    backgroundColor: colors.ink,
    borderColor: colors.ink,
    color: colors.cream,
  },
});
