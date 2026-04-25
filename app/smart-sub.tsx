import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radius } from '../constants/theme';
import { RECIPES } from '../constants/data';

const DIETARY_OPTIONS = ['Vegan', 'Vegetarian', 'Gluten-Free', 'Dairy-Free', 'Keto', 'Halal', 'Low-Sodium'];
const ALLERGEN_OPTIONS = ['Tree Nuts', 'Peanuts', 'Shellfish', 'Eggs', 'Dairy', 'Soy', 'Wheat', 'Fish'];

type SubResult = {
  original: string;
  substitute: string;
  reason: string;
  ratio?: string;
  tip?: string;
};

export default function SmartSubScreen() {
  const { recipeId } = useLocalSearchParams<{ recipeId?: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const recipe = recipeId ? RECIPES.find((r) => r.id === recipeId) : null;

  const [customIngredients, setCustomIngredients] = useState('');
  const [selectedDietary, setSelectedDietary] = useState<Set<string>>(new Set());
  const [selectedAllergens, setSelectedAllergens] = useState<Set<string>>(new Set());
  const [fridgeMode, setFridgeMode] = useState(false);
  const [fridgeItems, setFridgeItems] = useState('');

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SubResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const toggleChip = (set: Set<string>, setFn: (fn: (prev: Set<string>) => Set<string>) => void, option: string) => {
    setFn((prev) => {
      const next = new Set(prev);
      if (next.has(option)) next.delete(option);
      else next.add(option);
      return next;
    });
  };

  const findSubstitutions = async () => {
    const apiKey = process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY;
    if (!apiKey) {
      setError('Add EXPO_PUBLIC_ANTHROPIC_API_KEY to your .env file to use this feature.');
      return;
    }

    const ingredientsText = recipe
      ? recipe.ingredients.map((ing) => `${ing.amount} ${ing.name}`).join('\n')
      : customIngredients.trim();

    if (!ingredientsText) {
      setError('Please enter at least one ingredient.');
      return;
    }

    const constraints: string[] = [];
    if (selectedDietary.size > 0) constraints.push(`Dietary restrictions: ${[...selectedDietary].join(', ')}`);
    if (selectedAllergens.size > 0) constraints.push(`Allergies to avoid: ${[...selectedAllergens].join(', ')}`);
    if (fridgeMode && fridgeItems.trim()) constraints.push(`Only substitute using these available items: ${fridgeItems.trim()}`);

    if (constraints.length === 0) {
      setError('Pick at least one dietary restriction, allergy, or enable Fridge Mode.');
      return;
    }

    setLoading(true);
    setError(null);
    setHasSearched(true);
    setResults([]);

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 1024,
          messages: [
            {
              role: 'user',
              content: `You are a culinary expert helping home cooks adapt recipes.

Ingredients:
${ingredientsText}

Constraints:
${constraints.join('\n')}

Return ONLY a valid JSON array of substitutions. Only include ingredients that conflict with the constraints or (in fridge mode) are unavailable. If everything is compatible, return [].

Schema:
[
  {
    "original": "ingredient name",
    "substitute": "best replacement",
    "reason": "one-sentence explanation",
    "ratio": "e.g. 1:1 or use 3/4 the amount",
    "tip": "optional short cooking adjustment"
  }
]

Respond with JSON only — no markdown fences, no explanation outside the array.`,
            },
          ],
        }),
      });
      const data = await response.json();
      let text = data.content?.[0]?.text?.trim() ?? '[]';
      text = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '').trim();
      setResults(JSON.parse(text));
    } catch (e: any) {
      setError(e.message ?? 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={22} color={colors.foreground} />
          </Pressable>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Smart Substitutions</Text>
            <Text style={styles.headerSub}>AI-powered ingredient swaps</Text>
          </View>
          <View style={{ width: 40 }} />
        </View>

        {/* Ingredients */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Ingredients</Text>
          {recipe ? (
            <>
              <View style={styles.recipeChip}>
                <Ionicons name="restaurant-outline" size={13} color={colors.primary} />
                <Text style={styles.recipeChipText}>{recipe.title}</Text>
              </View>
              <View style={styles.ingredientPreview}>
                {recipe.ingredients.map((ing) => (
                  <Text key={ing.id} style={styles.ingredientPreviewItem}>
                    · {ing.amount} {ing.name}
                  </Text>
                ))}
              </View>
            </>
          ) : (
            <TextInput
              style={styles.textArea}
              placeholder={'e.g.\n2 cups heavy cream\n3 eggs\n1/2 cup all-purpose flour'}
              placeholderTextColor={colors.mutedForeground}
              multiline
              value={customIngredients}
              onChangeText={setCustomIngredients}
              textAlignVertical="top"
            />
          )}
        </View>

        {/* Dietary */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Dietary Restrictions</Text>
          <View style={styles.chipRow}>
            {DIETARY_OPTIONS.map((opt) => {
              const active = selectedDietary.has(opt);
              return (
                <Pressable
                  key={opt}
                  style={[styles.chip, active && styles.chipActiveDietary]}
                  onPress={() => toggleChip(selectedDietary, setSelectedDietary, opt)}
                >
                  <Text style={[styles.chipText, active && styles.chipTextDietary]}>{opt}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Allergens */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Allergies</Text>
          <View style={styles.chipRow}>
            {ALLERGEN_OPTIONS.map((opt) => {
              const active = selectedAllergens.has(opt);
              return (
                <Pressable
                  key={opt}
                  style={[styles.chip, active && styles.chipActiveAllergen]}
                  onPress={() => toggleChip(selectedAllergens, setSelectedAllergens, opt)}
                >
                  <Text style={[styles.chipText, active && styles.chipTextAllergen]}>{opt}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Fridge Mode */}
        <View style={styles.card}>
          <View style={styles.fridgeRow}>
            <View style={styles.fridgeLeft}>
              <Text style={styles.cardLabel}>Fridge Mode</Text>
              <Text style={styles.fridgeDesc}>Swap with what you actually have</Text>
            </View>
            <Switch
              value={fridgeMode}
              onValueChange={setFridgeMode}
              trackColor={{ false: colors.muted, true: colors.primary + '66' }}
              thumbColor={fridgeMode ? colors.primary : '#fff'}
            />
          </View>
          {fridgeMode && (
            <TextInput
              style={[styles.textArea, { marginTop: 14, minHeight: 80 }]}
              placeholder={"What's in your fridge/pantry?\ne.g. almond milk, olive oil, oat flour, lemon"}
              placeholderTextColor={colors.mutedForeground}
              multiline
              value={fridgeItems}
              onChangeText={setFridgeItems}
              textAlignVertical="top"
            />
          )}
        </View>

        {/* Error */}
        {error && (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle-outline" size={16} color={colors.destructive} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* CTA */}
        <Pressable
          style={({ pressed }) => [
            styles.ctaBtn,
            pressed && { transform: [{ scale: 0.97 }] },
            loading && { opacity: 0.7 },
          ]}
          onPress={findSubstitutions}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="flash-outline" size={20} color="#fff" />
              <Text style={styles.ctaBtnText}>Find Substitutions</Text>
            </>
          )}
        </Pressable>

        {/* Results */}
        {hasSearched && !loading && (
          <View style={styles.resultsSection}>
            <Text style={styles.resultsSectionLabel}>
              {results.length > 0
                ? `${results.length} substitution${results.length !== 1 ? 's' : ''} found`
                : 'No substitutions needed'}
            </Text>

            {results.length === 0 && !error && (
              <View style={styles.emptyResults}>
                <Text style={styles.emptyResultsEmoji}>✅</Text>
                <Text style={styles.emptyResultsText}>
                  All ingredients are already compatible with your selected filters.
                </Text>
              </View>
            )}

            {results.map((item, i) => (
              <View key={i} style={styles.resultCard}>
                <View style={styles.resultTop}>
                  <View style={styles.resultOriginalCol}>
                    <Text style={styles.resultColLabel}>ORIGINAL</Text>
                    <Text style={styles.resultOriginalText}>{item.original}</Text>
                  </View>
                  <View style={styles.resultArrowCircle}>
                    <Ionicons name="arrow-forward" size={16} color={colors.primary} />
                  </View>
                  <View style={styles.resultSubCol}>
                    <Text style={[styles.resultColLabel, { color: colors.primary }]}>USE INSTEAD</Text>
                    <Text style={styles.resultSubText}>{item.substitute}</Text>
                  </View>
                </View>

                <Text style={styles.resultReason}>{item.reason}</Text>

                {(item.ratio || item.tip) && (
                  <View style={styles.resultMetas}>
                    {item.ratio && (
                      <View style={styles.resultMetaRow}>
                        <Ionicons name="swap-horizontal-outline" size={12} color={colors.mutedForeground} />
                        <Text style={styles.resultMetaText}>Ratio: {item.ratio}</Text>
                      </View>
                    )}
                    {item.tip && (
                      <View style={styles.resultMetaRow}>
                        <Ionicons name="bulb-outline" size={12} color={colors.chart4} />
                        <Text style={[styles.resultMetaText, { color: colors.chart4 }]}>{item.tip}</Text>
                      </View>
                    )}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        <View style={{ height: 48 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    paddingBottom: 20,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border + '66',
  },
  headerCenter: { alignItems: 'center' },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.foreground,
  },
  headerSub: {
    fontSize: 11,
    color: colors.mutedForeground,
    marginTop: 2,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: radius.lg,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border + '66',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  cardLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.secondary,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 12,
  },
  recipeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.accent,
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    marginBottom: 14,
  },
  recipeChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  ingredientPreview: { gap: 4 },
  ingredientPreviewItem: {
    fontSize: 13,
    color: colors.mutedForeground,
    lineHeight: 20,
  },
  textArea: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 14,
    fontSize: 14,
    color: colors.foreground,
    lineHeight: 22,
    minHeight: 120,
    borderWidth: 1,
    borderColor: colors.border + '80',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: colors.muted,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  chipActiveDietary: {
    backgroundColor: colors.secondary + '15',
    borderColor: colors.secondary,
  },
  chipActiveAllergen: {
    backgroundColor: colors.destructive + '12',
    borderColor: colors.destructive,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.mutedForeground,
  },
  chipTextDietary: {
    color: colors.secondary,
  },
  chipTextAllergen: {
    color: colors.destructive,
  },
  fridgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  fridgeLeft: { flex: 1, marginRight: 12 },
  fridgeDesc: {
    fontSize: 12,
    color: colors.mutedForeground,
    marginTop: 2,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: colors.destructive + '10',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.destructive + '30',
  },
  errorText: {
    flex: 1,
    fontSize: 13,
    color: colors.destructive,
    lineHeight: 18,
  },
  ctaBtn: {
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
    marginBottom: 32,
  },
  ctaBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  resultsSection: { gap: 12 },
  resultsSectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.secondary,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  emptyResults: {
    alignItems: 'center',
    paddingVertical: 32,
    gap: 12,
  },
  emptyResultsEmoji: { fontSize: 40 },
  emptyResultsText: {
    fontSize: 14,
    color: colors.mutedForeground,
    textAlign: 'center',
    lineHeight: 20,
  },
  resultCard: {
    backgroundColor: '#fff',
    borderRadius: radius.md,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border + '66',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  resultTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  resultOriginalCol: { flex: 1 },
  resultColLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.mutedForeground,
    letterSpacing: 1,
    marginBottom: 4,
  },
  resultOriginalText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.mutedForeground,
    textDecorationLine: 'line-through',
  },
  resultArrowCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  resultSubCol: { flex: 1 },
  resultSubText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.foreground,
  },
  resultReason: {
    fontSize: 12,
    color: colors.mutedForeground,
    lineHeight: 18,
    marginBottom: 8,
  },
  resultMetas: { gap: 6 },
  resultMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  resultMetaText: {
    fontSize: 11,
    color: colors.mutedForeground,
    fontStyle: 'italic',
  },
});
