import type { ReactNode } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type PressableProps,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';

import { colors, fonts, radius } from '../theme';

export function Display({
  children,
  style,
  italic,
}: {
  children: ReactNode;
  style?: StyleProp<TextStyle>;
  italic?: boolean;
}) {
  return (
    <Text style={[styles.display, italic && { fontFamily: fonts.displayItalic }, style]}>
      {children}
    </Text>
  );
}

export function Body({
  children,
  style,
  muted,
}: {
  children: ReactNode;
  style?: StyleProp<TextStyle>;
  muted?: boolean;
}) {
  return (
    <Text style={[styles.body, muted && { color: colors.inkSoft }, style]}>{children}</Text>
  );
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  style,
  disabled,
}: {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'ghost' | 'sage';
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
}) {
  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        variant === 'primary' && styles.primary,
        variant === 'ghost' && styles.ghost,
        variant === 'sage' && styles.sage,
        disabled && { opacity: 0.45 },
        pressed && !disabled && { opacity: 0.86, transform: [{ scale: 0.99 }] },
        style,
      ]}
    >
      <Text
        style={[
          styles.buttonLabel,
          variant === 'ghost' && { color: colors.ink },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export function Pill({
  label,
  active,
  onPress,
}: {
  label: string;
  active?: boolean;
  onPress?: PressableProps['onPress'];
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.pill, active && styles.pillActive]}
    >
      <Text style={[styles.pillText, active && styles.pillTextActive]}>{label}</Text>
    </Pressable>
  );
}

export function Card({
  children,
  style,
}: {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  display: {
    fontFamily: fonts.display,
    color: colors.ink,
    fontSize: 34,
    lineHeight: 40,
  },
  body: {
    fontFamily: fonts.sans,
    color: colors.ink,
    fontSize: 16,
    lineHeight: 23,
  },
  button: {
    borderRadius: radius.pill,
    paddingVertical: 15,
    paddingHorizontal: 22,
    alignItems: 'center',
  },
  primary: { backgroundColor: colors.terracotta },
  sage: { backgroundColor: colors.sage },
  ghost: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.line,
  },
  buttonLabel: {
    fontFamily: fonts.sansBold,
    color: colors.cream,
    fontSize: 16,
  },
  pill: {
    borderRadius: radius.pill,
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: colors.cream,
    borderWidth: 1,
    borderColor: colors.line,
  },
  pillActive: {
    backgroundColor: colors.ink,
    borderColor: colors.ink,
  },
  pillText: {
    fontFamily: fonts.sansSemi,
    color: colors.ink,
    fontSize: 14,
  },
  pillTextActive: { color: colors.cream },
  card: {
    backgroundColor: colors.cream,
    borderRadius: radius.lg,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.line,
  },
});
