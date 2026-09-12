import { useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { colors, fonts, radius } from '../theme';

export type SettingOption = {
  value: string;
  label: string;
  detail?: string;
};

export function SettingPicker({
  title,
  value,
  options,
  onChange,
}: {
  title: string;
  value: string;
  options: SettingOption[];
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const selected = options.find((option) => option.value === value);
  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return options;
    return options.filter((option) =>
      [option.label, option.detail, option.value].some((part) =>
        (part ?? '').toLowerCase().includes(needle),
      ),
    );
  }, [options, query]);

  return (
    <View style={styles.wrap}>
      <Pressable
        onPress={() => setOpen(true)}
        style={styles.trigger}
        accessibilityRole="button"
        accessibilityLabel={title}
      >
        <Text style={styles.triggerText}>{selected?.label ?? value}</Text>
        <Text style={styles.chevron}>▾</Text>
      </Pressable>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <Pressable
          style={styles.backdrop}
          onPress={() => {
            setQuery('');
            setOpen(false);
          }}
        >
          <Pressable style={styles.sheet} onPress={() => undefined}>
            <Text style={styles.sheetTitle}>{title}</Text>
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search"
              placeholderTextColor={colors.inkSoft}
              autoCorrect={false}
              style={styles.search}
            />
            <ScrollView style={styles.list} keyboardShouldPersistTaps="handled">
              {visible.map((option) => {
                const active = option.value === value;
                return (
                  <Pressable
                    key={option.value}
                    onPress={() => {
                      onChange(option.value);
                      setQuery('');
                      setOpen(false);
                    }}
                    style={[styles.option, active && styles.optionActive]}
                  >
                    <Text style={[styles.optionText, active && styles.optionTextActive]}>
                      {option.label}
                    </Text>
                    {option.detail ? (
                      <Text style={[styles.detail, active && styles.optionTextActive]}>
                        {option.detail}
                      </Text>
                    ) : null}
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
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.cream,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.md,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  triggerText: { fontFamily: fonts.sansSemi, fontSize: 16, color: colors.ink, flex: 1 },
  chevron: { fontFamily: fonts.sansSemi, color: colors.inkSoft, marginLeft: 8 },
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
  search: {
    marginHorizontal: 14,
    marginBottom: 8,
    backgroundColor: colors.paper,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontFamily: fonts.sans,
    fontSize: 16,
    color: colors.ink,
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
  detail: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.inkSoft,
    marginTop: 2,
  },
});
