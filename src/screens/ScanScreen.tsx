import * as ImagePicker from 'expo-image-picker';
import { useMemo, useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button, Pill } from '../components/ui';
import {
  CATEGORY_LABEL,
  COMMON_FRIDGE,
  INGREDIENTS,
  searchIngredients,
} from '../data/ingredients';
import type { TabName } from '../navigation';
import { useKitchen } from '../store/kitchen';
import { colors, fonts, radius } from '../theme';
import type { Category } from '../types';

const CATS: Category[] = ['produce', 'dairy', 'protein', 'pantry', 'leftovers', 'frozen'];

export function ScanScreen({ onDone }: { onDone: (tab: TabName) => void }) {
  const addIngredients = useKitchen((s) => s.addIngredients);
  const pantry = useKitchen((s) => s.pantry);
  const have = new Set(pantry.map((item) => item.ingredientId));
  const [query, setQuery] = useState('');
  const [cat, setCat] = useState<Category | 'all'>('all');
  const [picked, setPicked] = useState<string[]>([]);
  const [photo, setPhoto] = useState<string | null>(null);
  const [mode, setMode] = useState<'catalog' | 'photo'>('catalog');

  const visible = useMemo(() => {
    const found = searchIngredients(query);
    if (cat === 'all') return found.filter((item) => !item.isStaple);
    return found.filter((item) => item.category === cat);
  }, [query, cat]);

  const toggle = (id: string) => {
    setPicked((current) =>
      current.includes(id) ? current.filter((row) => row !== id) : [...current, id],
    );
  };

  const save = () => {
    if (!picked.length) return;
    addIngredients(picked, photo ? 'scan' : 'manual');
    setPicked([]);
    setPhoto(null);
    onDone('tonight');
  };

  const openPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.6,
    });
    if (result.canceled || !result.assets[0]) return;
    setPhoto(result.assets[0].uri);
    setMode('photo');
    setPicked((current) => {
      const next = new Set(current);
      for (const id of COMMON_FRIDGE) {
        if (!have.has(id)) next.add(id);
      }
      return [...next];
    });
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.head}>
        <Text style={styles.title}>{mode === 'photo' ? 'What is in the photo?' : 'Add the fridge'}</Text>
        <Text style={styles.sub}>
          {mode === 'photo'
            ? 'Start from what most kitchens have. Uncheck anything you do not see.'
            : 'Tap what you already have. No typing required unless you want it.'}
        </Text>
      </View>

      {mode === 'catalog' ? (
        <View style={styles.tools}>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search spinach, leftover rice…"
            placeholderTextColor={colors.inkSoft}
            style={styles.search}
          />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cats}>
            <Pill label="All" active={cat === 'all'} onPress={() => setCat('all')} />
            {CATS.map((item) => (
              <Pill
                key={item}
                label={CATEGORY_LABEL[item]}
                active={cat === item}
                onPress={() => setCat(item)}
              />
            ))}
          </ScrollView>
          <Pressable onPress={openPhoto}>
            <Text style={styles.photoLink}>Or use a fridge photo</Text>
          </Pressable>
        </View>
      ) : null}

      {photo ? <Image source={{ uri: photo }} style={styles.photo} /> : null}

      <ScrollView contentContainerStyle={styles.grid} showsVerticalScrollIndicator={false}>
        {(mode === 'photo'
          ? INGREDIENTS.filter(
              (item) =>
                (COMMON_FRIDGE as readonly string[]).includes(item.id) || picked.includes(item.id),
            )
          : visible
        ).map(
          (item) => {
            const on = picked.includes(item.id);
            const already = have.has(item.id);
            return (
              <Pressable
                key={item.id}
                onPress={() => toggle(item.id)}
                style={[styles.cell, on && styles.cellOn, already && styles.cellHave]}
              >
                <Text style={styles.emoji}>{item.emoji}</Text>
                <Text style={styles.cellName}>{item.name}</Text>
                {already ? <Text style={styles.have}>In pantry</Text> : null}
              </Pressable>
            );
          },
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.count}>{picked.length} selected</Text>
        <View style={styles.actions}>
          {mode === 'photo' ? (
            <Button variant="ghost" label="Catalog" onPress={() => setMode('catalog')} />
          ) : (
            <Button
              variant="ghost"
              label="Typical fridge"
              onPress={() =>
                setPicked((current) => {
                  const next = new Set(current);
                  for (const id of COMMON_FRIDGE) {
                    if (!have.has(id)) next.add(id);
                  }
                  return [...next];
                })
              }
            />
          )}
          <Button label={picked.length ? 'Add to pantry' : 'Add something'} onPress={save} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.paper },
  head: { paddingHorizontal: 20, paddingTop: 8 },
  title: { fontFamily: fonts.display, fontSize: 32, color: colors.ink },
  sub: { fontFamily: fonts.sans, color: colors.inkSoft, marginTop: 6, marginBottom: 10 },
  tools: { paddingHorizontal: 20, gap: 10, marginBottom: 8 },
  search: {
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
  cats: { gap: 8, paddingRight: 20 },
  photoLink: { fontFamily: fonts.sansSemi, color: colors.terracotta },
  photo: { height: 120, marginHorizontal: 20, borderRadius: radius.md, marginBottom: 8 },
  grid: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  cell: {
    width: '31%',
    flexGrow: 1,
    minWidth: 96,
    backgroundColor: colors.cream,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 10,
    alignItems: 'center',
    gap: 4,
  },
  cellOn: { borderColor: colors.terracotta, backgroundColor: '#F8E4D8' },
  cellHave: { opacity: 0.7 },
  emoji: { fontSize: 26 },
  cellName: { fontFamily: fonts.sansSemi, fontSize: 12, color: colors.ink, textAlign: 'center' },
  have: { fontFamily: fonts.sans, fontSize: 10, color: colors.sage },
  footer: {
    borderTopWidth: 1,
    borderTopColor: colors.line,
    padding: 16,
    backgroundColor: colors.cream,
    gap: 10,
  },
  count: { fontFamily: fonts.sansSemi, color: colors.inkSoft },
  actions: { gap: 8 },
});
