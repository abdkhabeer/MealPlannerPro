import Anthropic from '@anthropic-ai/sdk';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radius } from '../../constants/theme';
import { RECIPES, TRENDING_TAGS, Recipe } from '../../constants/data';

const DIETARY_OPTIONS = ['Vegan', 'Vegetarian', 'Gluten-Free', 'Dairy-Free', 'Nut-Free', 'Keto', 'Paleo', 'Low-FODMAP'];
const ALLERGEN_OPTIONS = ['Eggs', 'Milk', 'Peanuts', 'Tree Nuts', 'Soy', 'Wheat', 'Fish', 'Shellfish'];

type SubResult = {
  original: string;
  substitute: string;
  reason: string;
  ratio?: string;
  tip?: string;
};

function DropdownSelect({
  label,
  options,
  selected,
  onToggle,
  accentColor,
}: {
  label: string;
  options: string[];
  selected: Set<string>;
  onToggle: (opt: string) => void;
  accentColor: string;
}) {
  const [open, setOpen] = useState(false);
  const count = selected.size;

  return (
    <View style={ddStyles.wrapper}>
      <Pressable style={ddStyles.header} onPress={() => setOpen((v) => !v)}>
        <View style={{ flex: 1 }}>
          <Text style={ddStyles.label}>{label}</Text>
          {count > 0 && (
            <Text style={[ddStyles.countText, { color: accentColor }]}>
              {count} selected
            </Text>
          )}
        </View>
        <Ionicons
          name={open ? 'chevron-up' : 'chevron-down'}
          size={18}
          color={colors.mutedForeground}
        />
      </Pressable>

      {open && (
        <View style={ddStyles.chipArea}>
          {options.map((opt) => {
            const active = selected.has(opt);
            return (
              <Pressable
                key={opt}
                style={[
                  ddStyles.chip,
                  active && { backgroundColor: accentColor + '18', borderColor: accentColor },
                ]}
                onPress={() => onToggle(opt)}
              >
                {active && (
                  <Ionicons name="checkmark-circle" size={13} color={accentColor} />
                )}
                <Text style={[ddStyles.chipText, active && { color: accentColor, fontWeight: '700' }]}>
                  {opt}
                </Text>
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
}

function RecipeCard({ recipe, onPress }: { recipe: Recipe; onPress: () => void }) {
  const [saved, setSaved] = useState(false);
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.recipeCard, pressed && { transform: [{ scale: 0.98 }] }]}
    >
      <View style={styles.recipeImageContainer}>
        <Image source={{ uri: recipe.image }} style={styles.recipeImage} />
        <View style={styles.timeBadge}>
          <Ionicons name="time" size={14} color={colors.primary} />
          <Text style={styles.timeBadgeText}>{recipe.time}</Text>
        </View>
        <Pressable onPress={() => setSaved(!saved)} hitSlop={8} style={styles.bookmarkBtn}>
          <Ionicons
            name={saved ? 'bookmark' : 'bookmark-outline'}
            size={20}
            color={saved ? colors.primary : colors.foreground}
          />
        </Pressable>
      </View>
      <View style={styles.recipeBody}>
        <Text style={styles.recipeTitle} numberOfLines={2}>{recipe.title}</Text>
        <Text style={styles.recipeDescription} numberOfLines={2}>{recipe.description}</Text>
        <View style={styles.recipeMeta}>
          <View style={styles.metaItem}>
            <View style={[styles.dot, { backgroundColor: colors.chart1 }]} />
            <Text style={styles.metaText}>{recipe.calories} kcal</Text>
          </View>
          <View style={styles.metaItem}>
            <View style={[styles.dot, { backgroundColor: colors.chart3 }]} />
            <Text style={styles.metaText}>Grade {recipe.grade}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

export default function HomeScreen() {
  const router = useRouter();

  // Swapper state
  const [recipeText, setRecipeText] = useState('');
  const [selectedDietary, setSelectedDietary] = useState<Set<string>>(new Set());
  const [selectedAllergens, setSelectedAllergens] = useState<Set<string>>(new Set());
  const [havingIngredients, setHavingIngredients] = useState('');
  const [missingMode, setMissingMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [results, setResults] = useState<SubResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Browse state
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const toggleDietary = (opt: string) =>
    setSelectedDietary((prev) => { const n = new Set(prev); n.has(opt) ? n.delete(opt) : n.add(opt); return n; });

  const toggleAllergen = (opt: string) =>
    setSelectedAllergens((prev) => { const n = new Set(prev); n.has(opt) ? n.delete(opt) : n.add(opt); return n; });

  const extractRecipeFromImage = async (base64: string, mimeType: string) => {
    const apiKey = process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY;
    if (!apiKey) { setError('Missing API key.'); return; }
    setExtracting(true);
    setError(null);
    try {
      const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });
      const message = await client.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1500,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: { type: 'base64', media_type: mimeType as any, data: base64 },
              },
              {
                type: 'text',
                text: 'Extract the full recipe from this image — include the title, all ingredients with quantities, and all preparation steps. Format it cleanly as plain text. If this is not a recipe image, say so briefly.',
              },
            ],
          },
        ],
      });
      const extracted = message.content[0].type === 'text' ? message.content[0].text.trim() : '';
      setRecipeText(extracted);
    } catch (e: any) {
      setError(e.message ?? 'Failed to extract recipe from image.');
    } finally {
      setExtracting(false);
    }
  };

  const pickFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Allow access to your photo library to upload a recipe screenshot.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: true,
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0].base64) {
      setCapturedImage(result.assets[0].uri);
      setRecipeText('');
      await extractRecipeFromImage(result.assets[0].base64, 'image/jpeg');
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Allow camera access to photograph a recipe.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      base64: true,
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0].base64) {
      setCapturedImage(result.assets[0].uri);
      setRecipeText('');
      await extractRecipeFromImage(result.assets[0].base64, 'image/jpeg');
    }
  };

  const findSubstitutions = async () => {
    const apiKey = process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY;
    if (!apiKey) {
      setError('Missing API key — add EXPO_PUBLIC_ANTHROPIC_API_KEY to your .env file.');
      return;
    }
    if (!recipeText.trim()) {
      setError('Please paste a recipe above.');
      return;
    }
    const constraints: string[] = [];
    if (selectedDietary.size > 0) constraints.push(`Dietary restrictions: ${[...selectedDietary].join(', ')}`);
    if (selectedAllergens.size > 0) constraints.push(`Allergens to avoid: ${[...selectedAllergens].join(', ')}`);
    if (missingMode && havingIngredients.trim())
      constraints.push(`User only has these ingredients available: ${havingIngredients.trim()}. Suggest substitutes using only what's available.`);
    if (constraints.length === 0) {
      setError('Select at least one dietary restriction, allergy, or enable the missing-ingredients toggle.');
      return;
    }

    setLoading(true);
    setError(null);
    setHasSearched(true);
    setResults([]);

    try {
      const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });
      const message = await client.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1500,
        messages: [
          {
            role: 'user',
            content: `You are a culinary expert helping home cooks adapt recipes.

The user has pasted this recipe:
---
${recipeText.trim()}
---

Constraints:
${constraints.join('\n')}

Extract the ingredients from the recipe and return ONLY a valid JSON array of necessary substitutions. Only include ingredients that conflict with the constraints. If everything is compatible, return [].

Schema (no markdown, no fences — raw JSON only):
[
  {
    "original": "ingredient as written in the recipe",
    "substitute": "best replacement",
    "reason": "one-sentence explanation",
    "ratio": "e.g. 1:1 or use 3/4 the amount",
    "tip": "short cooking adjustment if needed"
  }
]`,
          },
        ],
      });

      let text = message.content[0].type === 'text' ? message.content[0].text.trim() : '[]';
      text = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '').trim();
      setResults(JSON.parse(text));
    } catch (e: any) {
      setError(e.message ?? 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredRecipes = RECIPES.filter((r) =>
    activeTag ? r.tags.includes(activeTag) : true
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good Morning</Text>
            <Text style={styles.userName}>Abdul Khabeer</Text>
          </View>
          <Image
            source={{ uri: 'https://lh3.googleusercontent.com/a/ACg8ocLOJCuU8EIzTdd1MdVqrhzzVV0lib2ayI-frj_BDAXbIVLfB2uc=s96-c' }}
            style={styles.avatar}
          />
        </View>

        {/* Smart Swapper Hero */}
        <View style={styles.heroCard}>
          <View style={styles.heroTop}>
            <View style={styles.heroIconWrap}>
              <Ionicons name="flash" size={22} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.heroTitle}>Smart Recipe Swapper</Text>
              <Text style={styles.heroSub}>AI-powered ingredient substitutions</Text>
            </View>
          </View>

          {/* Recipe paste area */}
          <View style={styles.fieldGroup}>
            <Text style={[styles.fieldLabel, { textAlign: 'center' }]}>Choose Photo / Upload Screenshot</Text>

            {/* Image capture buttons */}
            <View style={styles.imagePickerRow}>
              <Pressable
                style={({ pressed }) => [styles.imagePickerBtn, pressed && { opacity: 0.75 }]}
                onPress={takePhoto}
              >
                <Ionicons name="camera-outline" size={22} color={colors.secondary} />
                <Text style={styles.imagePickerBtnText}>Take Photo</Text>
              </Pressable>
              <Pressable
                style={({ pressed }) => [styles.imagePickerBtn, pressed && { opacity: 0.75 }]}
                onPress={pickFromGallery}
              >
                <Ionicons name="image-outline" size={22} color={colors.secondary} />
                <Text style={styles.imagePickerBtnText}>Upload Screenshot</Text>
              </Pressable>
            </View>

            {/* Captured image preview */}
            {capturedImage && (
              <View style={styles.imagePreviewWrap}>
                <Image source={{ uri: capturedImage }} style={styles.imagePreview} resizeMode="cover" />
                <Pressable
                  style={styles.imageRemoveBtn}
                  onPress={() => { setCapturedImage(null); setRecipeText(''); }}
                >
                  <Ionicons name="close-circle" size={22} color="#fff" />
                </Pressable>
                {extracting && (
                  <View style={styles.extractingOverlay}>
                    <ActivityIndicator color="#fff" size="small" />
                    <Text style={styles.extractingText}>Reading recipe…</Text>
                  </View>
                )}
              </View>
            )}

            <TextInput
              style={styles.recipeTextArea}
              placeholder={"Paste a full recipe — ingredients, quantities, steps...\n\ne.g.\n1 cup all-purpose flour\n2 large eggs\n1/2 cup whole milk\n..."}
              placeholderTextColor={colors.mutedForeground}
              multiline
              value={recipeText}
              onChangeText={setRecipeText}
              textAlignVertical="top"
            />
          </View>

          {/* Dietary Restrictions dropdown */}
          <View style={styles.fieldGroup}>
            <DropdownSelect
              label="Dietary Restrictions"
              options={DIETARY_OPTIONS}
              selected={selectedDietary}
              onToggle={toggleDietary}
              accentColor={colors.secondary}
            />
          </View>

          {/* Allergies dropdown */}
          <View style={styles.fieldGroup}>
            <DropdownSelect
              label="Allergies"
              options={ALLERGEN_OPTIONS}
              selected={selectedAllergens}
              onToggle={toggleAllergen}
              accentColor={colors.destructive}
            />
          </View>

          {/* Ingredients I Have */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Ingredients I Have</Text>
            <TextInput
              style={[styles.recipeTextArea, { minHeight: 90 }]}
              placeholder={"List what's in your fridge or pantry\ne.g. almond milk, olive oil, oat flour, lemon"}
              placeholderTextColor={colors.mutedForeground}
              multiline
              value={havingIngredients}
              onChangeText={setHavingIngredients}
              textAlignVertical="top"
            />
          </View>

          {/* Missing ingredients toggle */}
          <View style={styles.toggleRow}>
            <View style={{ flex: 1, marginRight: 12 }}>
              <Text style={styles.toggleLabel}>I'm missing some ingredients</Text>
              <Text style={styles.toggleSub}>Suggest alternatives using only what I have</Text>
            </View>
            <Switch
              value={missingMode}
              onValueChange={setMissingMode}
              trackColor={{ false: colors.muted, true: colors.primary + '66' }}
              thumbColor={missingMode ? colors.primary : '#fff'}
            />
          </View>

          {/* Error */}
          {error && (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle-outline" size={15} color={colors.destructive} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {/* CTA */}
          <Pressable
            style={({ pressed }) => [
              styles.ctaBtn,
              pressed && { transform: [{ scale: 0.97 }] },
              (loading || extracting) && { opacity: 0.7 },
            ]}
            onPress={findSubstitutions}
            disabled={loading || extracting}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Ionicons name="flash-outline" size={19} color="#fff" />
                <Text style={styles.ctaBtnText}>Find Substitutions</Text>
              </>
            )}
          </Pressable>
        </View>

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
                <Text style={styles.emptyEmoji}>✅</Text>
                <Text style={styles.emptyText}>
                  All ingredients are already compatible with your selected filters.
                </Text>
              </View>
            )}

            {results.map((item, i) => (
              <View key={i} style={styles.resultCard}>
                <View style={styles.resultTop}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.resultColLabel}>ORIGINAL</Text>
                    <Text style={styles.resultOriginalText}>{item.original}</Text>
                  </View>
                  <View style={styles.resultArrow}>
                    <Ionicons name="arrow-forward" size={15} color={colors.primary} />
                  </View>
                  <View style={{ flex: 1 }}>
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

        {/* Divider */}
        <View style={styles.divider} />

        {/* Trending Tags */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Trending Now</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.tagsScroll}
            contentContainerStyle={styles.tagsContent}
          >
            {TRENDING_TAGS.map((tag) => {
              const isActive = activeTag === tag.key;
              return (
                <Pressable
                  key={tag.id}
                  style={({ pressed }) => [
                    styles.tag,
                    isActive && styles.tagActive,
                    pressed && { transform: [{ scale: 0.95 }] },
                  ]}
                  onPress={() => setActiveTag(isActive ? null : tag.key)}
                >
                  <Text style={styles.tagEmoji}>{tag.emoji}</Text>
                  <Text style={[styles.tagLabel, isActive && styles.tagLabelActive]}>{tag.label}</Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* Recommended */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionLabel}>
              {activeTag
                ? TRENDING_TAGS.find((t) => t.key === activeTag)?.label
                : 'Recommended for you'}
            </Text>
            <Pressable>
              <Text style={styles.seeAll}>See all</Text>
            </Pressable>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.recipeScroll}
            contentContainerStyle={styles.recipeScrollContent}
          >
            {filteredRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onPress={() => router.push(`/recipe/${recipe.id}`)}
              />
            ))}
          </ScrollView>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

/* ─── Dropdown styles ─── */
const ddStyles = StyleSheet.create({
  wrapper: {
    borderWidth: 1,
    borderColor: colors.border + '80',
    borderRadius: radius.md,
    overflow: 'hidden',
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.foreground,
  },
  countText: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  chipArea: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: 14,
    paddingBottom: 14,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: colors.muted,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.mutedForeground,
  },
});

/* ─── Screen styles ─── */
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: { flex: 1 },
  content: { paddingHorizontal: 24 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    paddingBottom: 20,
  },
  greeting: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.mutedForeground,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  userName: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.foreground,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#fff',
  },

  heroCard: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border + '4D',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    gap: 16,
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  heroIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.foreground,
  },
  heroSub: {
    fontSize: 12,
    color: colors.mutedForeground,
    marginTop: 2,
  },

  fieldGroup: {
    gap: 8,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.secondary,
    textTransform: 'uppercase',
    letterSpacing: 1.1,
  },
  recipeTextArea: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 14,
    fontSize: 14,
    color: colors.foreground,
    lineHeight: 22,
    minHeight: 160,
    borderWidth: 1,
    borderColor: colors.border + '80',
  },

  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.muted,
    borderRadius: radius.md,
    padding: 14,
  },
  toggleLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.foreground,
  },
  toggleSub: {
    fontSize: 11,
    color: colors.mutedForeground,
    marginTop: 2,
  },

  errorBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: colors.destructive + '10',
    borderRadius: 10,
    padding: 12,
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
    height: 54,
    backgroundColor: colors.primary,
    borderRadius: 999,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  ctaBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },

  resultsSection: {
    gap: 12,
    marginBottom: 8,
  },
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
    paddingVertical: 24,
    gap: 10,
  },
  emptyEmoji: { fontSize: 36 },
  emptyText: {
    fontSize: 13,
    color: colors.mutedForeground,
    textAlign: 'center',
    lineHeight: 19,
  },
  resultCard: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: 18,
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
  resultColLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.mutedForeground,
    letterSpacing: 1,
    marginBottom: 3,
  },
  resultOriginalText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.mutedForeground,
    textDecorationLine: 'line-through',
  },
  resultArrow: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
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
  resultMetas: { gap: 5 },
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

  divider: {
    height: 1,
    backgroundColor: colors.border + '4D',
    marginBottom: 28,
  },

  section: { marginBottom: 32 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.secondary,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  seeAll: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.mutedForeground,
  },
  tagsScroll: {
    marginTop: 16,
    marginHorizontal: -24,
  },
  tagsContent: {
    paddingHorizontal: 24,
    gap: 10,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border + '80',
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  tagActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  tagEmoji: { fontSize: 15 },
  tagLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.foreground,
  },
  tagLabelActive: {
    color: '#fff',
    fontWeight: '700',
  },
  recipeScroll: {
    marginHorizontal: -24,
  },
  recipeScrollContent: {
    paddingHorizontal: 24,
    gap: 14,
  },
  recipeCard: {
    width: 240,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border + '4D',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  recipeImageContainer: {
    height: 140,
    position: 'relative',
  },
  recipeImage: { width: '100%', height: '100%' },
  timeBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  timeBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.foreground,
  },
  recipeBody: { padding: 14 },
  bookmarkBtn: {
    position: 'absolute',
    top: 10,
    left: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.88)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recipeTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.foreground,
    lineHeight: 20,
    marginBottom: 4,
  },
  recipeDescription: {
    fontSize: 11,
    color: colors.mutedForeground,
    lineHeight: 16,
    marginBottom: 10,
  },
  recipeMeta: {
    flexDirection: 'row',
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: { width: 8, height: 8, borderRadius: 4 },
  metaText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.mutedForeground,
  },

  imagePickerRow: {
    flexDirection: 'row',
    gap: 10,
  },
  imagePickerBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 14,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.secondary + '60',
    backgroundColor: colors.secondary + '08',
  },
  imagePickerBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.secondary,
    textAlign: 'center',
  },
  imagePreviewWrap: {
    borderRadius: 12,
    overflow: 'hidden',
    height: 180,
    position: 'relative',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
  },
  imageRemoveBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  extractingOverlay: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  extractingText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
});
