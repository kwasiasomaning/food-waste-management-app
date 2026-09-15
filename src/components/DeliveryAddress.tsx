import type { ComponentProps } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import type { GroceryDropoff } from '../lib/grocery';
import { colors, fonts, radius } from '../theme';

export function DeliveryAddress({
  value,
  onChange,
}: {
  value: GroceryDropoff;
  onChange: (next: GroceryDropoff) => void;
}) {
  return (
    <View style={styles.wrap}>
      <Field
        label="Street"
        value={value.line1}
        placeholder="12 Oak Street"
        autoComplete="address-line1"
        textContentType="streetAddressLine1"
        onChangeText={(line1) => onChange({ ...value, line1 })}
      />
      <View style={styles.row}>
        <View style={styles.grow}>
          <Field
            label="City"
            value={value.city}
            placeholder="Austin"
            autoComplete="off"
            textContentType="addressCity"
            onChangeText={(city) => onChange({ ...value, city })}
          />
        </View>
        <View style={styles.postal}>
          <Field
            label="Postal"
            value={value.postal}
            placeholder="78701"
            autoComplete="postal-code"
            textContentType="postalCode"
            onChangeText={(postal) => onChange({ ...value, postal })}
          />
        </View>
      </View>
    </View>
  );
}

function Field({
  label,
  value,
  onChangeText,
  placeholder,
  autoComplete,
  textContentType,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  autoComplete?: ComponentProps<typeof TextInput>['autoComplete'];
  textContentType?: ComponentProps<typeof TextInput>['textContentType'];
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.inkSoft}
        autoCapitalize="words"
        autoCorrect={false}
        autoComplete={autoComplete}
        textContentType={textContentType}
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 10 },
  row: { flexDirection: 'row', gap: 10 },
  grow: { flex: 1.4 },
  postal: { flex: 1 },
  field: { gap: 6 },
  label: { fontFamily: fonts.sansSemi, color: colors.ink, fontSize: 14 },
  input: {
    backgroundColor: colors.cream,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontFamily: fonts.sans,
    fontSize: 16,
    color: colors.ink,
  },
});
