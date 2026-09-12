import { useEffect, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { parseHouseholdSize } from '../lib/household';
import { colors, fonts, radius } from '../theme';

export function HouseholdInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  const [text, setText] = useState(String(value));

  useEffect(() => {
    setText(String(value));
  }, [value]);

  return (
    <View style={styles.wrap}>
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
        accessibilityLabel="Who is home for dinner"
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginTop: 10, marginBottom: 8, alignSelf: 'flex-start' },
  input: {
    minWidth: 88,
    backgroundColor: colors.cream,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontFamily: fonts.display,
    fontSize: 28,
    color: colors.ink,
    textAlign: 'center',
  },
});
