import { useEffect, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { MAX_HOUSEHOLD_DIGITS, householdDigits, parseHouseholdSize } from '../lib/household';
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
      <View style={[styles.other, !preset && styles.otherActive]}>
        <TextInput
          value={text}
          onChangeText={(raw) => {
            const digits = householdDigits(raw);
            setText(digits);
            if (digits.length) onChange(parseHouseholdSize(digits, value));
          }}
          onBlur={() => {
            const next = parseHouseholdSize(text, value);
            onChange(next);
            setText(PRESETS.includes(next as (typeof PRESETS)[number]) ? '' : String(next));
          }}
          keyboardType="default"
          inputMode="numeric"
          maxLength={MAX_HOUSEHOLD_DIGITS}
          placeholder="Other"
          placeholderTextColor={!preset ? colors.cream : colors.inkSoft}
          accessibilityLabel="Other household size"
          multiline={false}
          underlineColorAndroid="transparent"
          style={[styles.otherInput, !preset && styles.otherInputActive]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
    marginBottom: 8,
  },
  other: {
    width: 80,
    height: 36,
    flexGrow: 0,
    flexShrink: 0,
    position: 'relative',
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.cream,
    justifyContent: 'center',
    overflow: 'visible',
  },
  otherActive: {
    backgroundColor: colors.ink,
    borderColor: colors.ink,
  },
  otherInput: {
    ...StyleSheet.absoluteFill,
    margin: 0,
    paddingHorizontal: 6,
    paddingVertical: 0,
    fontFamily: fonts.sansSemi,
    fontSize: 14,
    color: colors.ink,
    textAlign: 'center',
    backgroundColor: 'transparent',
  },
  otherInputActive: {
    color: colors.cream,
  },
});
