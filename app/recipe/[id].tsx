import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radius } from '../../constants/theme';
import { RECIPES } from '../../constants/data';
import { usePlannerContext } from '../../context/PlannerContext';

const GRADES = ['A', 'B', 'C', 'D', 'E'];

const UNICODE_FRACS: [string, string][] = [
  ['½','1/2'],['⅓','1/3'],['⅔','2/3'],['¼','1/4'],['¾','3/4'],['⅛','1/8'],['⅜','3/8'],['⅝','5/8'],['⅞','7/8'],
];

function parseFraction(s: string): number | null {
  let str = s.trim();
  for (const [u, r] of UNICODE_FRACS) str = str.replace(u, r);
  const mixed = str.match(/^(\d+)\s+(\d+)\/(\d+)$/);
  if (mixed) return +mixed[1] + +mixed[2] / +mixed[3];
  const frac = str.match(/^(\d+)\/(\d+)$/);
  if (frac) return +frac[1] / +frac[2];
  const n = parseFloat(str);
  return isNaN(n) ? null : n;
}

function formatNum(n: number): string {
  if (Number.isInteger(n)) return String(n);
  const whole = Math.floor(n);
  const frac = n - whole;
  const fracs: [number, string][] = [[0.125,'⅛'],[0.25,'¼'],[0.33,'⅓'],[0.5,'½'],[0.67,'⅔'],[0.75,'¾'],[0.875,'⅞']];
  for (const [v, sym] of fracs) {
    if (Math.abs(frac - v) < 0.04) return whole > 0 ? `${whole}${sym}` : sym;
  }
  return parseFloat(n.toFixed(1)).toString();
}

const SKIP_WORDS = ['taste','handful','bunch','small','medium','large','ripe','slice','scoop','pinch','piece','whole','sprig'];

function scaleAmount(amount: string, servings: number): string {
  if (servings === 1) return amount;
  let norm = amount;
  for (const [u, r] of UNICODE_FRACS) norm = norm.replace(u, r);
  // Capture leading numeric portion (handles "1/2", "1 1/2", "3"), then the rest (unit + text)
  const match = norm.match(/^([\d\/]+(?:\s+[\d\/]+)?)\s*(.*)/);
  if (!match) return amount;
  const num = parseFraction(match[1].trim());
  if (num === null) return amount;
  const rest = match[2].trim();
  return rest ? `${formatNum(num * servings)} ${rest}` : formatNum(num * servings);
}

function convertAmount(amount: string, toMetric: boolean): string {
  const lower = amount.toLowerCase();
  if (SKIP_WORDS.some((w) => lower.includes(w))) return amount;

  let norm = amount;
  for (const [u, r] of UNICODE_FRACS) norm = norm.replace(u, r);

  const match = norm.match(/^([\d\s/]+)\s*([a-zA-Z]+\.?)([\s,].*)?$/);
  if (!match) return amount;

  const num = parseFraction(match[1].trim());
  if (num === null) return amount;
  const unit = match[2].toLowerCase();
  const tail = match[3] ?? '';

  if (toMetric) {
    const conversions: Record<string, [number, string]> = {
      cup: [240, 'ml'], cups: [240, 'ml'],
      tbsp: [15, 'ml'], tablespoon: [15, 'ml'], tablespoons: [15, 'ml'],
      tsp: [5, 'ml'], teaspoon: [5, 'ml'], teaspoons: [5, 'ml'],
      oz: [28.35, 'g'], ounce: [28.35, 'g'], ounces: [28.35, 'g'],
      lb: [453.6, 'g'], lbs: [453.6, 'g'], pound: [453.6, 'g'], pounds: [453.6, 'g'],
    };
    const c = conversions[unit];
    if (!c) return amount;
    return `${Math.round(num * c[0])} ${c[1]}${tail}`;
  } else {
    if (unit === 'ml') {
      if (num < 15) return `${formatNum(num / 5)} tsp${tail}`;
      if (num < 60) return `${formatNum(num / 15)} tbsp${tail}`;
      return `${formatNum(num / 240)} cups${tail}`;
    }
    if (unit === 'g') return `${formatNum(num / 28.35)} oz${tail}`;
    if (unit === 'kg') return `${formatNum(num * 2.205)} lbs${tail}`;
    return amount;
  }
}

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const recipe = RECIPES.find((r) => r.id === id) ?? RECIPES[0];
  const [servings, setServings] = useState(1);
  const [saved, setSaved] = useState(false);
  const [checkedIngredients, setCheckedIngredients] = useState<Set<string>>(new Set());
  const [unitSystem, setUnitSystem] = useState<'imperial' | 'metric'>('imperial');
  const { setPendingRecipe } = usePlannerContext();

  const toggleIngredient = (ingId: string) => {
    setCheckedIngredients((prev) => {
      const next = new Set(prev);
      if (next.has(ingId)) next.delete(ingId);
      else next.add(ingId);
      return next;
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Image */}
        <View style={styles.hero}>
          <Image source={{ uri: recipe.image }} style={styles.heroImage} />
          <Pressable
            style={[styles.fabBtn, { position: 'absolute', top: insets.top + 12, left: 24 }]}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={22} color={colors.foreground} />
          </Pressable>
          <View style={[styles.fabGroup, { top: insets.top + 12, right: 24 }]}>
            <Pressable style={styles.fabBtn}>
              <Ionicons name="share-outline" size={22} color={colors.foreground} />
            </Pressable>
            <Pressable style={styles.fabBtn} onPress={() => setSaved(!saved)}>
              <Ionicons
                name={saved ? 'bookmark' : 'bookmark-outline'}
                size={22}
                color={saved ? colors.primary : colors.foreground}
              />
            </Pressable>
          </View>

          {/* Nutrition card overlapping hero */}
          <View style={styles.nutritionCard}>
            <View style={styles.calRingContainer}>
              <View style={styles.calRingCenter}>
                <Text style={styles.calNumber}>{Math.round(recipe.calories * servings)}</Text>
                <Text style={styles.calLabel}>Calories</Text>
              </View>
            </View>
            <View style={styles.macroList}>
              <View style={styles.macroRow}>
                <View style={styles.macroLeft}>
                  <Text style={styles.macroEmoji}>🍗</Text>
                  <Text style={styles.macroName}>Protein</Text>
                </View>
                <Text style={styles.macroValue}>{Math.round(recipe.protein * servings)}g</Text>
              </View>
              <View style={styles.macroRow}>
                <View style={styles.macroLeft}>
                  <Text style={styles.macroEmoji}>🌾</Text>
                  <Text style={styles.macroName}>Carbs</Text>
                </View>
                <Text style={styles.macroValue}>{Math.round(recipe.carbs * servings)}g</Text>
              </View>
              <View style={styles.macroRow}>
                <View style={styles.macroLeft}>
                  <Text style={styles.macroEmoji}>🥑</Text>
                  <Text style={styles.macroName}>Fats</Text>
                </View>
                <Text style={styles.macroValue}>{Math.round(recipe.fats * servings)}g</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Main Content */}
        <View style={styles.main}>
          {/* Title & Description */}
          <View style={styles.titleSection}>
            <Text style={styles.title}>{recipe.title}</Text>
            <Text style={styles.description}>{recipe.description}</Text>
          </View>

          {/* Servings & Unit */}
          <View style={styles.controls}>
            <View style={styles.servingsControl}>
              <Pressable
                style={styles.servingBtn}
                onPress={() => setServings(Math.max(1, servings - 1))}
              >
                <Ionicons name="remove" size={18} color={colors.primaryForeground} />
              </Pressable>
              <Text style={styles.servingsNum}>{servings}</Text>
              <Pressable
                style={styles.servingBtn}
                onPress={() => setServings(servings + 1)}
              >
                <Ionicons name="add" size={18} color={colors.primaryForeground} />
              </Pressable>
            </View>
            <Pressable style={styles.unitBtn} onPress={() => setUnitSystem(u => u === 'imperial' ? 'metric' : 'imperial')}>
              <Ionicons name="refresh-outline" size={18} color={colors.primary} />
              <Text style={styles.unitBtnText}>{unitSystem === 'imperial' ? 'Imperial' : 'Metric'}</Text>
            </Pressable>
          </View>

          {/* Nutritional Grade */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Nutritional Grade</Text>
            <View style={styles.gradeRow}>
              {GRADES.map((g) => {
                const isActive = g === recipe.grade;
                return (
                  <View
                    key={g}
                    style={[
                      styles.gradeBox,
                      isActive
                        ? styles.gradeBoxActive
                        : styles.gradeBoxInactive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.gradeText,
                        isActive
                          ? styles.gradeTextActive
                          : styles.gradeTextInactive,
                      ]}
                    >
                      {g}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Ingredients */}
          <View style={styles.section}>
            <View style={styles.sectionRow}>
              <Text style={styles.sectionLabel}>Ingredients</Text>
              <Text style={styles.sectionCount}>{recipe.ingredients.length} items</Text>
            </View>
            <View style={styles.ingredientList}>
              {recipe.ingredients.map((ing) => {
                const checked = checkedIngredients.has(ing.id);
                return (
                  <Pressable
                    key={ing.id}
                    style={styles.ingredientRow}
                    onPress={() => toggleIngredient(ing.id)}
                  >
                    <View style={styles.ingredientEmoji}>
                      <Text style={styles.ingredientEmojiText}>{ing.emoji}</Text>
                    </View>
                    <View style={styles.ingredientInfo}>
                      <Text style={styles.ingredientAmount}>{convertAmount(scaleAmount(ing.amount, servings), unitSystem === 'metric')} </Text>
                      <Text style={styles.ingredientName}>{ing.name}</Text>
                    </View>
                    <Ionicons
                      name={checked ? 'checkmark-circle' : 'checkmark-circle-outline'}
                      size={22}
                      color={checked ? colors.primary : colors.muted}
                    />
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Preparation */}
          <View style={[styles.section, { marginBottom: 120 }]}>
            <Text style={styles.sectionLabel}>Preparation</Text>
            <View style={styles.stepList}>
              {recipe.steps.map((step, index) => (
                <View key={step.id} style={styles.step}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>{index + 1}</Text>
                  </View>
                  <View style={styles.stepContent}>
                    <Text style={styles.stepText}>{step.description}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* CTA Bar */}
      <View style={[styles.ctaBar, { paddingBottom: insets.bottom + 16 }]}>
        <View style={styles.ctaRow}>
          <Pressable
            style={({ pressed }) => [styles.ctaBtnSecondary, pressed && { transform: [{ scale: 0.97 }] }]}
            onPress={() => router.push(`/smart-sub?recipeId=${recipe.id}`)}
          >
            <Ionicons name="flash-outline" size={20} color={colors.primary} />
            <Text style={styles.ctaBtnSecondaryText}>Smart Sub</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.ctaBtn, pressed && { transform: [{ scale: 0.97 }] }]}
            onPress={() => {
              setPendingRecipe(recipe);
              router.push('/(tabs)/planner');
            }}
          >
            <Ionicons name="calendar-outline" size={20} color="#fff" />
            <Text style={styles.ctaBtnText}>Add to Planner</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: { flex: 1 },
  content: {},
  hero: {
    height: 450,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  fabBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  fabGroup: {
    position: 'absolute',
    flexDirection: 'row',
    gap: 12,
  },
  nutritionCard: {
    position: 'absolute',
    bottom: -40,
    left: 24,
    right: 24,
    backgroundColor: '#fff',
    borderRadius: 32,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
  },
  calRingContainer: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 8,
    borderColor: colors.chart1 + '50',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  calRingCenter: {
    alignItems: 'center',
  },
  calNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.foreground,
  },
  calLabel: {
    fontSize: 8,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: colors.mutedForeground,
  },
  macroList: {
    flex: 1,
    gap: 10,
  },
  macroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  macroLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  macroEmoji: { fontSize: 16 },
  macroName: { fontSize: 12, fontWeight: '500', color: colors.foreground },
  macroValue: { fontSize: 12, fontWeight: '700', color: colors.foreground },
  main: {
    marginTop: 56,
    paddingHorizontal: 24,
  },
  titleSection: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.foreground,
    lineHeight: 36,
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: colors.mutedForeground,
    lineHeight: 22,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  servingsControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 999,
    padding: 4,
    gap: 8,
    borderWidth: 1,
    borderColor: colors.border + '66',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  servingBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  servingsNum: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.foreground,
    paddingHorizontal: 16,
  },
  unitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#fff',
    borderRadius: 999,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.border + '66',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  unitBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.foreground,
  },
  section: {
    marginBottom: 32,
  },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.secondary,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 16,
  },
  sectionCount: {
    fontSize: 11,
    color: colors.mutedForeground,
  },
  gradeRow: {
    flexDirection: 'row',
    gap: 12,
  },
  gradeBox: {
    width: 64,
    height: 64,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradeBoxActive: {
    backgroundColor: colors.chart3,
    shadowColor: colors.chart3,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },
  gradeBoxInactive: {
    backgroundColor: colors.muted + '66',
  },
  gradeText: {
    fontSize: 28,
    fontWeight: '700',
  },
  gradeTextActive: { color: '#fff' },
  gradeTextInactive: { color: colors.mutedForeground },
  ingredientList: {
    gap: 4,
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 8,
  },
  ingredientEmoji: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },
  ingredientEmojiText: { fontSize: 18 },
  ingredientInfo: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  ingredientAmount: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.foreground,
  },
  ingredientName: {
    fontSize: 14,
    color: colors.mutedForeground,
  },
  stepList: {
    gap: 32,
  },
  step: {
    flexDirection: 'row',
    gap: 16,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  stepNumberText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.foreground,
  },
  stepContent: {
    flex: 1,
    gap: 10,
  },
  stepText: {
    fontSize: 14,
    color: colors.foreground,
    lineHeight: 22,
  },
  ctaBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border + '80',
  },
  ctaRow: {
    flexDirection: 'row',
    gap: 12,
  },
  ctaBtnSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 56,
    paddingHorizontal: 20,
    backgroundColor: colors.accent,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: colors.primary + '40',
  },
  ctaBtnSecondaryText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
  ctaBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    height: 56,
    backgroundColor: colors.primary,
    borderRadius: 999,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  ctaBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
  },
});
