import * as ImagePicker from 'expo-image-picker';
import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FridgeMark } from '../components/FridgeMark';
import { WebFridgeCamera } from '../components/WebFridgeCamera';
import { Button, Pill } from '../components/ui';
import {
  CATEGORY_LABEL,
  INGREDIENTS,
  searchIngredients,
} from '../data/ingredients';
import { identifyFridgeContents } from '../lib/fridgeVision';
import type { SnapCommand, TabName } from '../navigation';
import { useKitchen } from '../store/kitchen';
import { colors, fonts, radius } from '../theme';
import type { Category } from '../types';

const CATS: Category[] = ['produce', 'dairy', 'protein', 'pantry', 'leftovers', 'frozen'];

export function ScanScreen({
  onDone,
  snapCommand,
  onSnapHandled,
}: {
  onDone: (tab: TabName) => void;
  snapCommand: SnapCommand | null;
  onSnapHandled: () => void;
}) {
  const addIngredients = useKitchen((s) => s.addIngredients);
  const pantry = useKitchen((s) => s.pantry);
  const have = new Set(pantry.map((item) => item.ingredientId));
  const [query, setQuery] = useState('');
  const [cat, setCat] = useState<Category | 'all'>('all');
  const [picked, setPicked] = useState<string[]>([]);
  const [spotted, setSpotted] = useState<string[]>([]);
  const [photo, setPhoto] = useState<string | null>(null);
  const [mode, setMode] = useState<'catalog' | 'photo'>('catalog');
  const [reading, setReading] = useState(false);
  const [webCamera, setWebCamera] = useState(false);

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
    setSpotted([]);
    setPhoto(null);
    onDone('tonight');
  };

  const applyPhoto = async (uri: string) => {
    setPhoto(uri);
    setMode('photo');
    setReading(true);
    try {
      const found = await identifyFridgeContents(uri);
      const next = found.filter((id) => !have.has(id));
      setSpotted(found);
      setPicked(next);
    } finally {
      setReading(false);
    }
  };

  const takePhoto = async () => {
    if (Platform.OS === 'web' && typeof navigator !== 'undefined' && navigator.mediaDevices) {
      setWebCamera(true);
      return;
    }
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Camera', 'Camera access is needed to photograph the fridge. You can still upload a photo.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      quality: 0.7,
      cameraType: ImagePicker.CameraType.back,
    });
    if (result.canceled || !result.assets[0]) return;
    await applyPhoto(result.assets[0].uri);
  };

  const uploadPhoto = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted && permission.status !== ImagePicker.PermissionStatus.GRANTED) {
      // Web often reports limited/undetermined while still allowing the file picker.
      if (Platform.OS !== 'web') {
        Alert.alert('Photos', 'Photo library access is needed to upload a fridge picture.');
        return;
      }
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.7,
    });
    if (result.canceled || !result.assets[0]) return;
    await applyPhoto(result.assets[0].uri);
  };

  useEffect(() => {
    if (!snapCommand) return;
    const action = snapCommand.action;
    onSnapHandled();
    if (action === 'camera') void takePhoto();
    else void uploadPhoto();
  }, [snapCommand]);

  const photoItems = INGREDIENTS.filter((item) => {
    if (spotted.includes(item.id) || picked.includes(item.id)) return true;
    if (query && visible.some((row) => row.id === item.id)) return true;
    return false;
  });

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.head}>
        {mode === 'catalog' ? (
          <View style={styles.glyph}>
            <FridgeMark size={36} />
          </View>
        ) : null}
        <Text style={styles.title}>{mode === 'photo' ? 'What is in the photo?' : 'Add the fridge'}</Text>
        <Text style={styles.sub}>
          {mode === 'photo'
            ? reading
              ? 'Looking at the shelves…'
              : spotted.length
                ? 'We spotted these. Uncheck anything we got wrong.'
                : 'Hard to read that photo. Tick what you can see, or try another shot.'
            : 'Snap the shelves with the shutter, or tick what you already have.'}
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
        </View>
      ) : null}

      {photo ? <Image source={{ uri: photo }} style={styles.photo} /> : null}

      <ScrollView contentContainerStyle={styles.grid} showsVerticalScrollIndicator={false}>
        {(mode === 'photo' ? photoItems : visible).map((item) => {
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
              {mode === 'photo' && spotted.includes(item.id) ? (
                <Text style={styles.spotted}>Spotted</Text>
              ) : null}
            </Pressable>
          );
        })}
      </ScrollView>

      <WebFridgeCamera
        visible={webCamera}
        onCancel={() => setWebCamera(false)}
        onCapture={(uri) => {
          setWebCamera(false);
          void applyPhoto(uri);
        }}
      />
      <View style={styles.footer}>
        <Text style={styles.count}>{picked.length} selected</Text>
        <View style={styles.actions}>
          {mode === 'photo' ? (
            <View style={styles.photoActions}>
              <Button variant="ghost" label="Retake" onPress={takePhoto} style={{ flex: 1 }} />
              <Button variant="ghost" label="Catalog" onPress={() => setMode('catalog')} style={{ flex: 1 }} />
            </View>
          ) : null}
          <Button label={picked.length ? 'Add to pantry' : 'Add something'} onPress={save} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.paper },
  head: { paddingHorizontal: 20, paddingTop: 8 },
  glyph: { alignItems: 'flex-start', marginBottom: 4 },
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
  spotted: { fontFamily: fonts.sans, fontSize: 10, color: colors.terracotta },
  footer: {
    borderTopWidth: 1,
    borderTopColor: colors.line,
    padding: 16,
    backgroundColor: colors.cream,
    gap: 10,
  },
  count: { fontFamily: fonts.sansSemi, color: colors.inkSoft },
  actions: { gap: 8 },
  photoActions: { flexDirection: 'row', gap: 8 },
});
