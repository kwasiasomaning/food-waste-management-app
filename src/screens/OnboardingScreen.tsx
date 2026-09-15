import { useEffect, useMemo, useState } from 'react';
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

import { DietPicker } from '../components/DietPicker';
import { FoodStill } from '../components/FoodStill';
import { FridgeMark } from '../components/FridgeMark';
import { HouseholdInput } from '../components/HouseholdInput';
import { IngredientStill } from '../components/IngredientStill';
import { RecipeCard } from '../components/RecipeCard';
import { WebFridgeCamera } from '../components/WebFridgeCamera';
import { Button, Display } from '../components/ui';
import { COMMON_FRIDGE, INGREDIENT_MAP, searchIngredients } from '../data/ingredients';
import { takeFridgePhoto, uploadFridgePhoto } from '../lib/fridgePhoto';
import { identifyFridgeContents } from '../lib/fridgeVision';
import type { OnboardingStillId } from '../lib/foodPhoto';
import { loadDinnerIdeas } from '../lib/mealIdeas';
import { suggestDinners } from '../lib/matching';
import { pickOnboardingStills } from '../lib/onboardingStills';
import { itemsFromIds } from '../lib/starterPantry';
import { useKitchen } from '../store/kitchen';
import { colors, fonts, radius } from '../theme';
import type { Diet, ItemSource, ScoredRecipe } from '../types';

export function OnboardingScreen() {
  const completeOnboarding = useKitchen((s) => s.completeOnboarding);
  const [stills] = useState(pickOnboardingStills);
  const [step, setStep] = useState(0);
  const [diet, setDiet] = useState<Diet>('omnivore');
  const [householdSize, setHouseholdSize] = useState(2);
  const [picked, setPicked] = useState<string[]>([]);
  const [source, setSource] = useState<ItemSource>('manual');

  const finish = () => {
    completeOnboarding({ diet, householdSize, ingredientIds: picked, source });
  };

  if (step === 0) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.hero}>
          <FoodStill id={stills[0]} height={176} style={styles.heroStill} />
          <Text style={styles.kicker}>A dinner app, not a climate lecture</Text>
          <Display style={styles.wordmark} italic>
            Tonight.
          </Display>
          <Text style={styles.lede}>
            Cook what you already have, before it dies. Households waste a billion meals a day.
            Most of that is food someone already paid for.
          </Text>
        </View>
        <Button label="Show me dinner" onPress={() => setStep(1)} />
      </SafeAreaView>
    );
  }

  if (step === 1) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.hero}>
          <FoodStill id={stills[1]} height={196} style={styles.heroStill} />
          <Display>One job.</Display>
          <Text style={styles.lede}>
            Photograph the fridge, or tick a list. Tonight ranks three dinners from what expires
            first. Two missing staples is fine. A shopping trip is not the point.
          </Text>
          <View style={styles.points}>
            <Text style={styles.point}>1. Snap the fridge, or pick from a list.</Text>
            <Text style={styles.point}>2. See dinners from that pantry, tonight.</Text>
            <Text style={styles.point}>3. Cook the thing that will not last.</Text>
          </View>
        </View>
        <Button label="Set the table" onPress={() => setStep(2)} />
      </SafeAreaView>
    );
  }

  if (step === 2) {
    return (
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.form} showsVerticalScrollIndicator={false}>
          <FoodStill id={stills[2]} height={156} style={styles.heroStill} />
          <Display>How do you eat?</Display>
          <DietPicker value={diet} onChange={setDiet} />
          <Text style={styles.label}>Who is home for dinner?</Text>
          <HouseholdInput value={householdSize} onChange={setHouseholdSize} />
        </ScrollView>
        <Button label="Build the pantry" onPress={() => setStep(3)} />
      </SafeAreaView>
    );
  }

  if (step === 3) {
    return (
      <PantrySetup
        still={stills[3]}
        picked={picked}
        onChange={setPicked}
        onSource={setSource}
        onNext={() => setStep(4)}
      />
    );
  }

  return (
    <MealPreview
      still={stills[4]}
      diet={diet}
      ingredientIds={picked}
      onBack={() => setStep(3)}
      onDone={finish}
    />
  );
}

function PantrySetup({
  still,
  picked,
  onChange,
  onSource,
  onNext,
}: {
  still: OnboardingStillId;
  picked: string[];
  onChange: (ids: string[]) => void;
  onSource: (source: ItemSource) => void;
  onNext: () => void;
}) {
  const [query, setQuery] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [spotted, setSpotted] = useState<string[]>([]);
  const [reading, setReading] = useState(false);
  const [webCamera, setWebCamera] = useState(false);

  const list = useMemo(() => {
    const found = searchIngredients(query);
    if (query.trim()) return found.filter((item) => !item.isStaple);
    const common = COMMON_FRIDGE.map((id) => INGREDIENT_MAP[id]).filter(Boolean);
    const extra = found.filter((item) => !item.isStaple && !common.some((row) => row.id === item.id));
    return [...common, ...extra];
  }, [query]);

  const toggle = (id: string) => {
    onChange(picked.includes(id) ? picked.filter((row) => row !== id) : [...picked, id]);
  };

  const applyPhoto = async (uri: string) => {
    setPhoto(uri);
    setReading(true);
    onSource('scan');
    try {
      const found = await identifyFridgeContents(uri);
      setSpotted(found);
      onChange([...new Set([...picked, ...found])]);
    } finally {
      setReading(false);
    }
  };

  const takePhoto = async () => {
    const result = await takeFridgePhoto();
    if (result.kind === 'web-camera') {
      setWebCamera(true);
      return;
    }
    if (result.kind === 'uri') await applyPhoto(result.uri);
  };

  const uploadPhoto = async () => {
    const result = await uploadFridgePhoto();
    if (result.kind === 'uri') await applyPhoto(result.uri);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.pantryScroll} showsVerticalScrollIndicator={false}>
        <FoodStill id={still} height={148} style={styles.heroStill} />
        <FridgeMark size={36} />
        <Display style={styles.pantryTitle}>What's inside your fridge Tonight</Display>
        <Text style={styles.lede}>
          Photograph the shelves. Tonight will tick what it can see. Or skip the camera and pick
          from the list.
        </Text>

        <View style={styles.photoActions}>
          <Button label="Photograph the fridge" onPress={() => void takePhoto()} />
          <Button variant="ghost" label="Upload a photo" onPress={() => void uploadPhoto()} />
        </View>

        {photo ? <Image source={{ uri: photo }} style={styles.photo} /> : null}
        {reading ? <Text style={styles.hint}>Looking at the shelves…</Text> : null}
        {spotted.length > 0 && !reading ? (
          <Text style={styles.hint}>We spotted {spotted.length}. Uncheck anything we got wrong.</Text>
        ) : null}

        <Text style={styles.label}>Or tick what you already have</Text>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search spinach, leftover rice…"
          placeholderTextColor={colors.inkSoft}
          style={styles.search}
        />
        <View style={styles.grid}>
          {list.map((item) => {
            const on = picked.includes(item.id);
            return (
              <Pressable
                key={item.id}
                onPress={() => toggle(item.id)}
                style={[styles.cell, on && styles.cellOn]}
              >
                <IngredientStill ingredientId={item.id} size={52} radius={12} />
                <Text style={styles.cellName}>{item.name}</Text>
                {spotted.includes(item.id) ? <Text style={styles.spotted}>Spotted</Text> : null}
              </Pressable>
            );
          })}
        </View>
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
        <Text style={styles.count}>{picked.length} in the pantry</Text>
        <Button
          label={picked.length ? "See tonight's dinners" : 'Skip for now'}
          onPress={onNext}
        />
      </View>
    </SafeAreaView>
  );
}

function MealPreview({
  still,
  diet,
  ingredientIds,
  onBack,
  onDone,
}: {
  still: OnboardingStillId;
  diet: Diet;
  ingredientIds: string[];
  onBack: () => void;
  onDone: () => void;
}) {
  const pantry = useMemo(() => itemsFromIds(ingredientIds, 'manual'), [ingredientIds]);
  const [ideas, setIdeas] = useState<ScoredRecipe[]>(() => suggestDinners(pantry, diet, 3));

  useEffect(() => {
    setIdeas(suggestDinners(pantry, diet, 3));
    if (pantry.length === 0) return;
    let cancelled = false;
    void loadDinnerIdeas(pantry, diet, 3).then((rows) => {
      if (!cancelled && rows.length) setIdeas(rows);
    });
    return () => {
      cancelled = true;
    };
  }, [diet, pantry]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.form} showsVerticalScrollIndicator={false}>
        <Pressable onPress={onBack}>
          <Text style={styles.back}>← Pantry</Text>
        </Pressable>
        <FoodStill id={still} height={132} style={styles.heroStill} />
        <Display>Tonight, from your fridge.</Display>
        <Text style={styles.lede}>
          {ideas.length
            ? 'These dinners use what you just logged. The one that expires first is on top.'
            : 'Add a few more things and Tonight will have something to say. You can photograph the fridge anytime.'}
        </Text>
        {ideas.length > 0 ? (
          <View style={styles.meals}>
            <RecipeCard featured scored={ideas[0]} />
            {ideas.slice(1).map((row) => (
              <RecipeCard key={row.recipe.id} scored={row} />
            ))}
          </View>
        ) : null}
      </ScrollView>
      <Button label="Open the kitchen" onPress={onDone} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.paper,
    paddingHorizontal: 22,
    paddingBottom: 20,
    justifyContent: 'space-between',
  },
  hero: { flex: 1, justifyContent: 'center' },
  heroStill: { marginBottom: 22 },
  kicker: {
    fontFamily: fonts.sansSemi,
    color: colors.terracotta,
    letterSpacing: 0.4,
    marginBottom: 10,
  },
  wordmark: { fontSize: 64, lineHeight: 68, marginBottom: 16 },
  lede: {
    fontFamily: fonts.sans,
    fontSize: 18,
    lineHeight: 26,
    color: colors.inkSoft,
    marginTop: 12,
  },
  points: { gap: 12, marginVertical: 28 },
  point: {
    fontFamily: fonts.sansSemi,
    fontSize: 17,
    color: colors.ink,
  },
  form: { paddingTop: 12, paddingBottom: 24, gap: 8 },
  label: {
    fontFamily: fonts.display,
    fontSize: 22,
    color: colors.ink,
    marginTop: 16,
  },
  hint: {
    fontFamily: fonts.sans,
    color: colors.inkSoft,
    marginTop: 8,
  },
  pantryScroll: { paddingTop: 8, paddingBottom: 24, gap: 8 },
  pantryTitle: { fontSize: 34, lineHeight: 38, marginTop: 8 },
  photoActions: { gap: 8, marginTop: 16 },
  photo: { height: 140, borderRadius: radius.md, marginTop: 8 },
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
    marginTop: 8,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
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
  cellName: { fontFamily: fonts.sansSemi, fontSize: 12, color: colors.ink, textAlign: 'center' },
  spotted: { fontFamily: fonts.sans, fontSize: 10, color: colors.terracotta },
  footer: {
    borderTopWidth: 1,
    borderTopColor: colors.line,
    marginHorizontal: -22,
    paddingHorizontal: 22,
    paddingTop: 12,
    gap: 8,
    backgroundColor: colors.cream,
  },
  count: { fontFamily: fonts.sansSemi, color: colors.inkSoft },
  meals: { gap: 12, marginTop: 16 },
  back: { fontFamily: fonts.sansSemi, color: colors.terracotta, marginBottom: 8 },
});
