import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  FlatList,
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radius } from '../constants/theme';
import { LESSONS, COOKING_COURSES } from '../constants/data';
import {
  useOnboarding,
  getWasteStat,
  getFamilyLabel,
  getSkillLabel,
  getLessonPath,
  SkillLevel,
  FamilySize,
  CookingFrequency,
} from '../context/OnboardingContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const TOTAL_SCREENS = 17;

// ─── Shared components ───────────────────────────────────────────────────────

function ProgressBar({ step }: { step: number }) {
  return (
    <View style={s.progressRow}>
      {Array.from({ length: TOTAL_SCREENS }).map((_, i) => (
        <View
          key={i}
          style={[s.progressSegment, i < step && s.progressSegmentActive]}
        />
      ))}
    </View>
  );
}

function NextBtn({ onPress, label = 'Continue', disabled = false }: { onPress: () => void; label?: string; disabled?: boolean }) {
  return (
    <Pressable
      style={({ pressed }) => [s.nextBtn, disabled && s.nextBtnDisabled, pressed && !disabled && { opacity: 0.85 }]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={s.nextBtnText}>{label}</Text>
      <Ionicons name="arrow-forward" size={18} color="#fff" />
    </Pressable>
  );
}

function OptionBtn({ label, emoji, selected, onPress }: { label: string; emoji?: string; selected: boolean; onPress: () => void }) {
  return (
    <Pressable style={[s.optionBtn, selected && s.optionBtnActive]} onPress={onPress}>
      {emoji && <Text style={s.optionEmoji}>{emoji}</Text>}
      <Text style={[s.optionLabel, selected && s.optionLabelActive]}>{label}</Text>
      {selected && <Ionicons name="checkmark-circle" size={20} color={colors.primary} style={{ marginLeft: 'auto' }} />}
    </Pressable>
  );
}

// ─── Individual screens ───────────────────────────────────────────────────────

function Screen1Hook({ onNext }: { onNext: () => void }) {
  const insets = useSafeAreaInsets();
  return (
    <ImageBackground
      source={require('../assets/mealPlannerProFridge.jpeg')}
      style={{ flex: 1 }}
    >
      <LinearGradient
        colors={['rgba(0,0,0,0.15)', 'rgba(0,0,0,0.72)']}
        style={[s.hookHero, { paddingTop: insets.top + 32, paddingBottom: insets.bottom + 32 }]}
      >
        {/* Quote bubble */}
        <View style={s.hookBubble}>
          <Text style={s.hookQuote}>"You open the fridge. Nothing looks right. You order takeout again."</Text>
        </View>

        {/* Bottom CTA */}
        <View style={s.hookBottom}>
          <Text style={s.hookHeadline}>Sound familiar?</Text>
          <Text style={s.hookSub}>You're not alone — and it's not your fault. Most people were never taught how to make cooking effortless.</Text>
          <Pressable style={s.hookBtn} onPress={onNext}>
            <Text style={s.hookBtnText}>Yes, that's me  →</Text>
          </Pressable>
        </View>
      </LinearGradient>
    </ImageBackground>
  );
}

function Screen2Cost({ onNext }: { onNext: () => void }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[s.screen, { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24 }]}>
      <View style={s.centeredContent}>
        <View style={s.statCard}>
          <Text style={s.statNumber}>$1,500</Text>
          <Text style={s.statLabel}>wasted per household{'\n'}every single year</Text>
        </View>
        <Text style={s.costHeadline}>The average family wastes $1,500/year on unused groceries — and most people never learned why.</Text>
        <Text style={s.costSub}>Uneaten food. Forgotten ingredients. Last-minute takeout. It adds up faster than you think.</Text>
      </View>
      <NextBtn onPress={onNext} />
    </View>
  );
}

function Screen3Solution({ onNext }: { onNext: () => void }) {
  const insets = useSafeAreaInsets();
  const features = [
    { icon: 'flash-outline', label: 'Smart Recipe Swapper', desc: 'Turn any ingredients into a meal instantly' },
    { icon: 'calendar-outline', label: 'Meal Planner', desc: 'Plan your week, track your nutrition' },
    { icon: 'school-outline', label: 'Cooking School', desc: '30 lessons from beginner to advanced chef' },
  ];
  return (
    <View style={[s.screen, { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24 }]}>
      <Text style={s.screenTitle}>Introducing{'\n'}MealPlannerPro</Text>
      <Text style={s.screenSub}>The recipes AND the skills to actually use them.</Text>
      <View style={s.featureList}>
        {features.map((f) => (
          <View key={f.label} style={s.featureRow}>
            <View style={s.featureIcon}>
              <Ionicons name={f.icon as any} size={22} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.featureLabel}>{f.label}</Text>
              <Text style={s.featureDesc}>{f.desc}</Text>
            </View>
          </View>
        ))}
      </View>
      <NextBtn onPress={onNext} label="Let's get started" />
    </View>
  );
}

function Screen4Skill({ onNext }: { onNext: () => void }) {
  const { answers, setAnswer } = useOnboarding();
  const insets = useSafeAreaInsets();
  const options: { label: string; emoji: string; value: SkillLevel }[] = [
    { label: 'I burn everything', emoji: '🔥', value: 'beginner' },
    { label: 'I can follow a recipe', emoji: '📖', value: 'novice' },
    { label: "I'm pretty comfortable", emoji: '🙌', value: 'comfortable' },
    { label: 'I could open a restaurant', emoji: '👨‍🍳', value: 'advanced' },
  ];
  return (
    <View style={[s.screen, { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24 }]}>
      <Text style={s.screenTitle}>How confident are you in the kitchen?</Text>
      <Text style={s.screenSub}>Be honest — this helps us build your personal learning path.</Text>
      <View style={s.optionList}>
        {options.map((o) => (
          <OptionBtn
            key={o.value}
            label={o.label}
            emoji={o.emoji}
            selected={answers.skillLevel === o.value}
            onPress={() => setAnswer('skillLevel', o.value)}
          />
        ))}
      </View>
      <NextBtn onPress={onNext} disabled={!answers.skillLevel} />
    </View>
  );
}

function Screen5Family({ onNext }: { onNext: () => void }) {
  const { answers, setAnswer } = useOnboarding();
  const insets = useSafeAreaInsets();
  const options: { label: string; emoji: string; value: FamilySize }[] = [
    { label: 'Just me', emoji: '🧑', value: 'solo' },
    { label: 'Me and my partner', emoji: '👫', value: 'partner' },
    { label: 'Family of 3–4', emoji: '👨‍👩‍👧', value: 'small' },
    { label: 'Family of 5+', emoji: '👨‍👩‍👧‍👦', value: 'large' },
  ];
  return (
    <View style={[s.screen, { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24 }]}>
      <Text style={s.screenTitle}>Who are you cooking for?</Text>
      <Text style={s.screenSub}>We'll personalise your meal plans and portion sizes.</Text>
      <View style={s.optionList}>
        {options.map((o) => (
          <OptionBtn
            key={o.value}
            label={o.label}
            emoji={o.emoji}
            selected={answers.familySize === o.value}
            onPress={() => setAnswer('familySize', o.value)}
          />
        ))}
      </View>
      <NextBtn onPress={onNext} disabled={!answers.familySize} />
    </View>
  );
}

function Screen6Frequency({ onNext }: { onNext: () => void }) {
  const { answers, setAnswer } = useOnboarding();
  const insets = useSafeAreaInsets();
  const options: { label: string; emoji: string; value: CookingFrequency }[] = [
    { label: 'Rarely — mostly takeout', emoji: '🥡', value: 'rarely' },
    { label: 'A few times a week', emoji: '🥘', value: 'sometimes' },
    { label: 'Almost every day', emoji: '🔪', value: 'often' },
  ];
  return (
    <View style={[s.screen, { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24 }]}>
      <Text style={s.screenTitle}>How often do you cook at home?</Text>
      <Text style={s.screenSub}>No judgment — we just want to know where you're starting from.</Text>
      <View style={s.optionList}>
        {options.map((o) => (
          <OptionBtn
            key={o.value}
            label={o.label}
            emoji={o.emoji}
            selected={answers.cookingFrequency === o.value}
            onPress={() => setAnswer('cookingFrequency', o.value)}
          />
        ))}
      </View>
      <NextBtn onPress={onNext} disabled={!answers.cookingFrequency} />
    </View>
  );
}

function Screen7Struggles({ onNext }: { onNext: () => void }) {
  const { answers, setAnswer } = useOnboarding();
  const insets = useSafeAreaInsets();
  const options = [
    { label: "I don't know what to make", emoji: '🤷' },
    { label: 'I waste too much food', emoji: '🗑️' },
    { label: 'I eat out too much', emoji: '🍔' },
    { label: "I'm too busy to cook", emoji: '⏰' },
    { label: 'I want to eat healthier', emoji: '🥗' },
    { label: "I can't cook well", emoji: '😅' },
  ];
  const toggle = (label: string) => {
    const current = answers.struggles;
    const next = current.includes(label) ? current.filter((s) => s !== label) : [...current, label];
    setAnswer('struggles', next);
  };
  return (
    <View style={[s.screen, { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24 }]}>
      <Text style={s.screenTitle}>What's your biggest cooking challenge?</Text>
      <Text style={s.screenSub}>Pick all that apply.</Text>
      <View style={s.optionList}>
        {options.map((o) => (
          <OptionBtn
            key={o.label}
            label={o.label}
            emoji={o.emoji}
            selected={answers.struggles.includes(o.label)}
            onPress={() => toggle(o.label)}
          />
        ))}
      </View>
      <NextBtn onPress={onNext} disabled={answers.struggles.length === 0} />
    </View>
  );
}

function Screen8Aha({ onNext }: { onNext: () => void }) {
  const { answers } = useOnboarding();
  const insets = useSafeAreaInsets();
  const waste = getWasteStat(answers.familySize, answers.cookingFrequency);
  const familyLabel = getFamilyLabel(answers.familySize);
  return (
    <View style={[s.screen, { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24 }]}>
      <View style={s.ahaCard}>
        <Text style={s.ahaEyebrow}>Based on your profile</Text>
        <Text style={s.ahaAmount}>{waste}</Text>
        <Text style={s.ahaAmountLabel}>per month in wasted food</Text>
      </View>
      <Text style={s.ahaHeadline}>
        As {familyLabel}, you're likely wasting {waste}/month — and 80% of people say it's because they don't know how to improvise with what's already in the fridge.
      </Text>
      <Text style={s.ahaSub}>That's a skill. And it's completely learnable.</Text>
      <NextBtn onPress={onNext} label="Show me how" />
    </View>
  );
}

function Screen9Goals({ onNext }: { onNext: () => void }) {
  const { answers, setAnswer } = useOnboarding();
  const insets = useSafeAreaInsets();
  const options = [
    { label: 'Save money on groceries', emoji: '💰' },
    { label: 'Eat healthier', emoji: '🥦' },
    { label: 'Learn to cook properly', emoji: '📚' },
    { label: 'Reduce food waste', emoji: '♻️' },
    { label: 'Spend less time planning', emoji: '⚡' },
    { label: 'Build confidence in the kitchen', emoji: '💪' },
  ];
  const toggle = (label: string) => {
    const current = answers.goals;
    const next = current.includes(label) ? current.filter((g) => g !== label) : [...current, label];
    setAnswer('goals', next);
  };
  return (
    <View style={[s.screen, { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24 }]}>
      <Text style={s.screenTitle}>What do you want to achieve?</Text>
      <Text style={s.screenSub}>Pick everything that matters to you.</Text>
      <View style={s.optionList}>
        {options.map((o) => (
          <OptionBtn
            key={o.label}
            label={o.label}
            emoji={o.emoji}
            selected={answers.goals.includes(o.label)}
            onPress={() => toggle(o.label)}
          />
        ))}
      </View>
      <NextBtn onPress={onNext} disabled={answers.goals.length === 0} />
    </View>
  );
}

function Screen10Mirror({ onNext }: { onNext: () => void }) {
  const { answers } = useOnboarding();
  const insets = useSafeAreaInsets();
  const skillLabel = getSkillLabel(answers.skillLevel);
  const familyLabel = getFamilyLabel(answers.familySize);
  const goals = answers.goals.slice(0, 3).join(', ').toLowerCase();
  const struggle = answers.struggles[0]?.toLowerCase() ?? 'not knowing what to make';
  return (
    <View style={[s.screen, { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24 }]}>
      <Text style={s.screenTitle}>Here's what we heard.</Text>
      <View style={s.mirrorCard}>
        <View style={s.mirrorRow}>
          <Ionicons name="checkmark-circle" size={20} color={colors.chart3} />
          <Text style={s.mirrorText}>You're {familyLabel}, {skillLabel}.</Text>
        </View>
        <View style={s.mirrorRow}>
          <Ionicons name="checkmark-circle" size={20} color={colors.chart3} />
          <Text style={s.mirrorText}>Your biggest challenge: <Text style={s.mirrorHighlight}>{struggle}</Text>.</Text>
        </View>
        <View style={s.mirrorRow}>
          <Ionicons name="checkmark-circle" size={20} color={colors.chart3} />
          <Text style={s.mirrorText}>You want to: <Text style={s.mirrorHighlight}>{goals}</Text>.</Text>
        </View>
      </View>
      <Text style={s.mirrorClosing}>
        MealPlannerPro was built for exactly this. We know where to start.
      </Text>
      <NextBtn onPress={onNext} label="Build my plan" />
    </View>
  );
}

function RecipeOptionCard({ text, index, selected, onSelect }: {
  text: string; index: number; selected: boolean; onSelect: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  return (
    <Pressable
      style={[s.demoRecipeCard, selected && s.demoRecipeCardSelected]}
      onPress={onSelect}
    >
      <View style={s.demoRecipeCardTop}>
        <Ionicons name="restaurant-outline" size={16} color={selected ? colors.primary : colors.chart3} />
        <Text style={s.demoRecipeNum}>Option {index + 1}</Text>
        {selected && <Ionicons name="checkmark-circle" size={18} color={colors.primary} style={{ marginLeft: 'auto' }} />}
      </View>
      <Text style={s.demoResultText} numberOfLines={expanded ? undefined : 2}>{text}</Text>
      <Pressable onPress={(e) => { e.stopPropagation?.(); setExpanded((v) => !v); }}>
        <Text style={s.demoExpandLink}>{expanded ? 'Show less' : 'Show more'}</Text>
      </Pressable>
    </Pressable>
  );
}

const LESSON_CATALOG = `b1:Setting Up Your Kitchen, b2:Building Blocks of Flavor, b3:Knife Skills 101, b4:Reading a Recipe, b5:Stovetop Fundamentals, b6:Cooking with Eggs, b7:Roasting Vegetables, b8:Rice Grains & Legumes, b9:Simple Sauces & Dressings, b10:Your First Complete Meal, i1:Stock & Broth Fundamentals, i2:Braising & Slow Cooking, i3:Stir-Fry Mastery, i4:Fresh Pasta from Scratch, i5:The Art of Seasoning, i6:Cooking Fish & Seafood, i7:Bread Baking Basics, i8:Emulsification, i9:Fermentation & Pickling, i10:Mise en Place & Menu Planning`;

function Screen11SwapperDemo({ onNext }: { onNext: () => void }) {
  const insets = useSafeAreaInsets();
  const { setAnswer } = useOnboarding();
  const [ingredients, setIngredients] = useState('');
  const [recipes, setRecipes] = useState<string[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const getSuggestions = async () => {
    Keyboard.dismiss();
    const apiKey = process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY;
    if (!apiKey || !ingredients.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 400,
          messages: [{
            role: 'user',
            content: `Given these fridge ingredients: ${ingredients}. Suggest TWO different simple meals. Format exactly as:
RECIPE1: **[Meal Name]** [2 sentence description]
RECIPE2: **[Meal Name]** [2 sentence description]
Make them distinct — different styles or ingredients emphasis. Be encouraging and practical.`,
          }],
        }),
      });
      const resData = await res.json();
      const raw = resData.content?.[0]?.text ?? '';
      // Try structured format first, fall back to splitting on blank line
      let r1 = raw.match(/RECIPE1:\s*([\s\S]+?)(?=RECIPE2:|$)/i)?.[1]?.trim() ?? '';
      let r2 = raw.match(/RECIPE2:\s*([\s\S]+)/i)?.[1]?.trim() ?? '';
      if (!r1 || !r2) {
        const parts = raw.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
        r1 = parts[0] ?? '';
        r2 = parts[1] ?? '';
      }
      setRecipes([r1, r2].filter(Boolean));
      setSelected(null);
    } catch {
      setRecipes([
        "**Veggie Stir-Fry** Toss everything in a hot pan with oil and soy sauce for a quick one-pan meal.",
        "**Scrambled Egg Bowl** Whisk your eggs with garlic and serve over whatever grains you have on hand.",
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = async (index: number) => {
    setSelected(index);
    const chosen = recipes[index];
    setAnswer('swapperResult', chosen);

    const apiKey = process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY;
    if (!apiKey) return;
    try {
      const matchRes = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 10,
          messages: [{
            role: 'user',
            content: `Recipe: "${chosen}". Lessons: ${LESSON_CATALOG}. Reply with ONLY the lesson ID (e.g. b5) most relevant to this recipe's cooking technique.`,
          }],
        }),
      });
      const matchData = await matchRes.json();
      const matchedId = matchData.content?.[0]?.text?.trim().toLowerCase().replace(/[^a-z0-9]/g, '') ?? '';
      if (matchedId) setAnswer('matchedLessonId', matchedId);
    } catch {}
  };

  const hasRecipes = recipes.length > 0;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={insets.top}
    >
      <ScrollView
        contentContainerStyle={[s.screen, { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 40 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={s.demoHeader}>
          <View style={s.demoIconWrap}>
            <Ionicons name="flash" size={24} color={colors.primary} />
          </View>
          <Text style={s.screenTitle}>Let's try it right now.</Text>
        </View>
        <Text style={s.screenSub}>Tell us what's in your fridge and we'll suggest two meals instantly.</Text>
        <TextInput
          style={s.demoInput}
          placeholder="e.g. eggs, spinach, garlic, leftover rice..."
          placeholderTextColor={colors.mutedForeground}
          value={ingredients}
          onChangeText={setIngredients}
          multiline
          returnKeyType="done"
          onSubmitEditing={Keyboard.dismiss}
          blurOnSubmit
          editable={!hasRecipes}
        />

        {!hasRecipes ? (
          <Pressable
            style={[s.demoBtn, (!ingredients.trim() || loading) && { opacity: 0.6 }]}
            onPress={getSuggestions}
            disabled={!ingredients.trim() || loading}
          >
            {loading ? <ActivityIndicator color="#fff" /> : (
              <>
                <Ionicons name="flash-outline" size={18} color="#fff" />
                <Text style={s.demoBtnText}>Find meals</Text>
              </>
            )}
          </Pressable>
        ) : (
          <>
            <Text style={s.demoPickLabel}>Pick the one that appeals to you:</Text>
            {recipes.map((r, i) => (
              <RecipeOptionCard
                key={i}
                text={r}
                index={i}
                selected={selected === i}
                onSelect={() => handleSelect(i)}
              />
            ))}
          </>
        )}

        {hasRecipes && (
          <NextBtn onPress={onNext} label="That's the one!" disabled={selected === null} />
        )}
        {!hasRecipes && <Pressable onPress={onNext} style={s.skipLink}><Text style={s.skipLinkText}>Skip for now</Text></Pressable>}
        {hasRecipes && <Pressable onPress={onNext} style={s.skipLink}><Text style={s.skipLinkText}>Neither, skip</Text></Pressable>}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Screen12LessonTaste({ onNext }: { onNext: () => void }) {
  const { answers } = useOnboarding();
  const insets = useSafeAreaInsets();

  // Auto-skip if user skipped the swapper demo
  useEffect(() => {
    if (!answers.swapperResult) onNext();
  }, []);

  const fallbackId = answers.skillLevel === 'advanced' ? 'a1'
    : answers.skillLevel === 'comfortable' ? 'i1'
    : 'b1';
  const lessonId = answers.matchedLessonId || fallbackId;

  const lesson = LESSONS.find((l) => l.id === lessonId);
  const course = COOKING_COURSES.find((c) => c.id === lessonId);
  const intro = lesson?.sections.find((s) => s.type === 'intro')?.body ?? '';
  const preview = intro.slice(0, 180);

  // Extract meal name from bold text e.g. **Turkey Fried Rice**
  const mealMatch = answers.swapperResult.match(/\*\*(.+?)\*\*/);
  const mealName = mealMatch ? mealMatch[1] : 'that meal';

  if (!answers.swapperResult) return null;

  return (
    <View style={[s.screen, { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24 }]}>
      <Text style={s.screenTitle}>Want to nail {mealName} every time?</Text>
      <Text style={s.screenSub}>Here's a taste of the skill behind it.</Text>
      <View style={s.lessonCard}>
        <View style={s.lessonCardHeader}>
          <Ionicons name="school-outline" size={16} color={colors.secondary} />
          <Text style={s.lessonCardTag}>{course?.title ?? 'Your first lesson'}</Text>
        </View>
        <Text style={s.lessonPreview}>{preview}…</Text>
        <View style={s.lessonBlur}>
          <View style={s.lessonLockBadge}>
            <Ionicons name="lock-closed" size={14} color="#fff" />
            <Text style={s.lessonLockText}>Unlock with free trial</Text>
          </View>
        </View>
      </View>
      <NextBtn onPress={onNext} label="I want this" />
    </View>
  );
}

const FEEDBACK_REASONS = [
  "It's missing features I need",
  "Feels complicated to use",
  "Not sure it'll help me",
  "Just getting started, too early to say",
];

function Screen13Review({ onNext }: { onNext: () => void }) {
  const insets = useSafeAreaInsets();
  const [rating, setRating] = useState(0);
  const [feedbackReason, setFeedbackReason] = useState('');

  const showFeedback = rating > 0 && rating < 4;
  const showThanks = rating >= 4;

  return (
    <View style={[s.screen, { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24 }]}>
      <Text style={s.screenTitle}>Loving this so far?</Text>
      <Text style={s.screenSub}>Your rating helps other home cooks find us — and takes 5 seconds.</Text>
      <View style={s.reviewStars}>
        {[1,2,3,4,5].map((i) => (
          <Pressable key={i} onPress={() => { setRating(i); setFeedbackReason(''); }}>
            <Ionicons
              name={i <= rating ? 'star' : 'star-outline'}
              size={48}
              color={i <= rating ? '#F5A623' : colors.mutedForeground}
            />
          </Pressable>
        ))}
      </View>

      {showThanks && (
        <Text style={s.reviewThanks}>Thank you! 🙏 It means a lot.</Text>
      )}

      {showFeedback && (
        <View style={s.feedbackBox}>
          <Text style={s.feedbackTitle}>What could be better?</Text>
          {FEEDBACK_REASONS.map((r) => (
            <Pressable
              key={r}
              style={[s.feedbackOption, feedbackReason === r && s.feedbackOptionActive]}
              onPress={() => setFeedbackReason(r)}
            >
              <Text style={[s.feedbackOptionText, feedbackReason === r && s.feedbackOptionTextActive]}>{r}</Text>
            </Pressable>
          ))}
        </View>
      )}

      <NextBtn
        onPress={onNext}
        label={rating === 0 ? 'Maybe later' : 'Continue'}
      />
    </View>
  );
}

function Screen14Commitment({ onNext }: { onNext: () => void }) {
  const { answers, setAnswer } = useOnboarding();
  const insets = useSafeAreaInsets();
  const options = [
    { label: 'All in — I need this to change', emoji: '🚀', value: 'allin' as const },
    { label: 'Pretty committed', emoji: '💪', value: 'committed' as const },
    { label: 'Somewhat interested', emoji: '🤔', value: 'somewhat' as const },
    { label: 'Just browsing for now', emoji: '👀', value: 'browsing' as const },
  ];
  return (
    <View style={[s.screen, { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24 }]}>
      <Text style={s.screenTitle}>How committed are you to leveling up in the kitchen?</Text>
      <Text style={s.screenSub}>Be honest — your plan adapts to where you are.</Text>
      <View style={s.optionList}>
        {options.map((o) => (
          <OptionBtn
            key={o.value}
            label={o.label}
            emoji={o.emoji}
            selected={answers.commitment === o.value}
            onPress={() => setAnswer('commitment', o.value)}
          />
        ))}
      </View>
      <NextBtn onPress={onNext} disabled={!answers.commitment} />
    </View>
  );
}

function Screen15Summary({ onNext }: { onNext: () => void }) {
  const { answers } = useOnboarding();
  const insets = useSafeAreaInsets();
  const lessonPath = getLessonPath(answers.skillLevel);

  // Build current week Sun–Sat, highlight today
  const today = new Date();
  const DAY_ABBR = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const sunday = new Date(today);
  sunday.setDate(today.getDate() - today.getDay());
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(sunday);
    d.setDate(sunday.getDate() + i);
    return { abbr: DAY_ABBR[i], num: d.getDate(), isToday: d.getDay() === today.getDay() };
  });

  return (
    <ScrollView
      contentContainerStyle={[s.screen, { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 40 }]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={s.screenTitle}>Your 7-day plan is ready.</Text>
      <Text style={s.screenSub}>Most users build a full cooking routine in just one week.</Text>

      <View style={s.summaryCard}>
        <View style={s.summaryTrackHeader}>
          <Text style={s.summaryTrackEmoji}>🍳</Text>
          <Text style={s.summaryTrackTitle}>Meal Track</Text>
        </View>
        <View style={s.summaryDayStrip}>
          {weekDays.map((d, i) => (
            <View key={i} style={[s.summaryDayPill, d.isToday && s.summaryDayPillActive]}>
              <Text style={[s.summaryDayPillAbbr, d.isToday && s.summaryDayPillTextActive]}>{d.abbr}</Text>
              <Text style={[s.summaryDayPillNum, d.isToday && s.summaryDayPillTextActive]}>{d.num}</Text>
            </View>
          ))}
        </View>
        <Text style={s.summaryTrackDesc}>7 personalised meals planned around your schedule</Text>
      </View>

      <View style={s.summaryCard}>
        <View style={s.summaryTrackHeader}>
          <Text style={s.summaryTrackEmoji}>📚</Text>
          <Text style={s.summaryTrackTitle}>Skill Track</Text>
        </View>
        <Text style={s.summaryLessonPath}>{lessonPath}</Text>
        <Text style={s.summaryTrackDesc}>7 lessons, one per day — from where you are to where you want to be</Text>
      </View>

      <NextBtn onPress={onNext} label="Let's do this" />
    </ScrollView>
  );
}

function Screen16SocialProof({ onNext }: { onNext: () => void }) {
  const insets = useSafeAreaInsets();
  const testimonials = [
    { name: 'Sarah M.', role: 'Mum of 3', quote: "I stopped ordering takeout. Saved $200 last month and my kids actually eat what I cook now.", stars: 5 },
    { name: 'James T.', role: 'College student', quote: "Went from burning pasta to cooking full dinners in 3 weeks. The lessons are genuinely good.", stars: 5 },
    { name: 'Priya K.', role: 'Working professional', quote: "The meal planner alone is worth it. I spend 10 minutes Sunday and the whole week is sorted.", stars: 5 },
  ];
  return (
    <View style={[s.screen, { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24 }]}>
      <View style={s.ratingRow}>
        {[1,2,3,4,5].map((i) => <Ionicons key={i} name="star" size={22} color="#F5A623" />)}
        <Text style={s.ratingText}>4.8 · 2,400+ ratings</Text>
      </View>
      <Text style={s.screenTitle}>People just like you are already winning.</Text>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {testimonials.map((t) => (
          <View key={t.name} style={s.testimonialCard}>
            <View style={s.testimonialStars}>
              {[1,2,3,4,5].map((i) => <Ionicons key={i} name="star" size={13} color="#F5A623" />)}
            </View>
            <Text style={s.testimonialQuote}>"{t.quote}"</Text>
            <Text style={s.testimonialName}>{t.name} · {t.role}</Text>
          </View>
        ))}
      </ScrollView>
      <NextBtn onPress={onNext} label="I'm ready" />
    </View>
  );
}

function Screen17Paywall({ onComplete }: { onComplete: () => void }) {
  const insets = useSafeAreaInsets();
  const [plan, setPlan] = useState<'monthly' | 'annual'>('monthly');
  return (
    <View style={[s.screen, { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24 }]}>
      <Text style={s.paywallTitle}>{plan === 'annual' ? 'Less than your morning coffee ☕' : 'Less than one takeout delivery fee'}</Text>
      <Text style={s.paywallSub}>And it actually teaches you something.</Text>

      <View style={s.planToggle}>
        <Pressable style={[s.planTab, plan === 'monthly' && s.planTabActive]} onPress={() => setPlan('monthly')}>
          <Text style={[s.planTabText, plan === 'monthly' && s.planTabTextActive]}>Monthly</Text>
        </Pressable>
        <Pressable style={[s.planTab, plan === 'annual' && s.planTabActive]} onPress={() => setPlan('annual')}>
          <Text style={[s.planTabText, plan === 'annual' && s.planTabTextActive]}>Annual</Text>
          <View style={s.saveBadge}><Text style={s.saveBadgeText}>SAVE 46%</Text></View>
        </Pressable>
      </View>

      <View style={s.priceCard}>
        <Text style={s.priceAmount}>{plan === 'monthly' ? '$6.99' : '$44.95'}</Text>
        <Text style={s.pricePer}>per {plan === 'monthly' ? 'month' : 'year'}</Text>
        <Text style={s.priceCompare}>
          {plan === 'monthly' ? 'Less than one takeout delivery fee' : 'Less than $4/month — cheaper than a latte'}
        </Text>
      </View>

      <View style={s.trialFeatures}>
        {[
          'Start your 7-day free trial today',
          'Full access to all features',
          'Cancel anytime before trial ends',
          "We'll remind you 1 day before you're charged",
        ].map((f) => (
          <View key={f} style={s.trialFeatureRow}>
            <Ionicons name="checkmark-circle" size={18} color={colors.chart3} />
            <Text style={s.trialFeatureText}>{f}</Text>
          </View>
        ))}
      </View>

      <Pressable style={s.trialBtn} onPress={onComplete}>
        <Text style={s.trialBtnText}>Start Free Trial</Text>
      </Pressable>
      <Text style={s.paywallLegal}>
        {plan === 'monthly' ? '$6.99/month' : '$44.95/year'} after trial · Cancel anytime · Billed via App Store
      </Text>
    </View>
  );
}

// ─── Main onboarding navigator ────────────────────────────────────────────────

export default function OnboardingScreen() {
  const [step, setStep] = useState(0);
  const { completeOnboarding } = useOnboarding();
  const router = useRouter();

  const next = () => setStep((s) => Math.min(s + 1, TOTAL_SCREENS - 1));

  const handleComplete = async () => {
    await completeOnboarding();
    router.replace('/(tabs)');
  };

  const screens = [
    <Screen1Hook onNext={next} />,
    <Screen2Cost onNext={next} />,
    <Screen3Solution onNext={next} />,
    <Screen4Skill onNext={next} />,
    <Screen5Family onNext={next} />,
    <Screen6Frequency onNext={next} />,
    <Screen7Struggles onNext={next} />,
    <Screen8Aha onNext={next} />,
    <Screen9Goals onNext={next} />,
    <Screen10Mirror onNext={next} />,
    <Screen11SwapperDemo onNext={next} />,
    <Screen12LessonTaste onNext={next} />,
    <Screen13Review onNext={next} />,
    <Screen14Commitment onNext={next} />,
    <Screen15Summary onNext={next} />,
    <Screen16SocialProof onNext={next} />,
    <Screen17Paywall onComplete={handleComplete} />,
  ];

  return (
    <View style={s.container}>
      <ProgressBar step={step + 1} />
      {step > 0 && (
        <Pressable style={s.backBtn} onPress={() => setStep((s) => Math.max(0, s - 1))}>
          <Ionicons name="chevron-back" size={20} color={colors.foreground} />
        </Pressable>
      )}
      {screens[step]}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' },
  progressRow: { flexDirection: 'row', gap: 3, paddingHorizontal: 24, paddingTop: 12 },
  progressSegment: { flex: 1, height: 3, borderRadius: 2, backgroundColor: colors.muted },
  progressSegmentActive: { backgroundColor: colors.primary },
  backBtn: {
    position: 'absolute', top: 32, left: 20, zIndex: 10,
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: colors.muted, alignItems: 'center', justifyContent: 'center',
  },
  screen: { flex: 1, paddingHorizontal: 24, gap: 20 },

  // Hook
  hookHero: {
    flex: 1, justifyContent: 'space-between',
    paddingHorizontal: 24,
  },
  hookBubble: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 20, padding: 24,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.25)',
    marginTop: 40,
  },
  hookQuote: { fontSize: 20, fontWeight: '600', color: '#fff', lineHeight: 30, fontStyle: 'italic' },
  hookBottom: { gap: 14 },
  hookHeadline: { fontSize: 32, fontWeight: '800', color: '#fff' },
  hookSub: { fontSize: 15, color: 'rgba(255,255,255,0.82)', lineHeight: 22 },
  hookBtn: {
    height: 56, backgroundColor: '#fff', borderRadius: 999,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2, shadowRadius: 12, elevation: 6,
  },
  hookBtnText: { fontSize: 16, fontWeight: '800', color: colors.primary },

  // Cost
  centeredContent: { flex: 1, justifyContent: 'center', gap: 24 },
  statCard: {
    backgroundColor: colors.primary, borderRadius: 24, padding: 32,
    alignItems: 'center', gap: 8,
  },
  statNumber: { fontSize: 56, fontWeight: '900', color: '#fff' },
  statLabel: { fontSize: 16, color: 'rgba(255,255,255,0.85)', textAlign: 'center', lineHeight: 24 },
  costHeadline: { fontSize: 20, fontWeight: '700', color: colors.foreground, lineHeight: 28 },
  costSub: { fontSize: 14, color: colors.mutedForeground, lineHeight: 22 },

  // Screen generic
  screenTitle: { fontSize: 26, fontWeight: '800', color: colors.foreground, lineHeight: 34 },
  screenSub: { fontSize: 15, color: '#4A4540', lineHeight: 22 },

  // Solution features
  featureList: { flex: 1, justifyContent: 'center', gap: 16 },
  featureRow: {
    flexDirection: 'row', alignItems: 'center', gap: 16,
    backgroundColor: colors.card, borderRadius: 16, padding: 18,
    borderWidth: 1, borderColor: colors.border + '4D',
  },
  featureIcon: {
    width: 44, height: 44, borderRadius: 14,
    backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center',
  },
  featureLabel: { fontSize: 15, fontWeight: '700', color: colors.foreground, marginBottom: 2 },
  featureDesc: { fontSize: 12, color: colors.mutedForeground },

  // Options
  optionList: { flex: 1, gap: 10 },
  optionBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: colors.card, borderRadius: 16, padding: 18,
    borderWidth: 1.5, borderColor: colors.border + '4D',
  },
  optionBtnActive: { borderColor: colors.primary, backgroundColor: colors.accent },
  optionEmoji: { fontSize: 22 },
  optionLabel: { fontSize: 15, fontWeight: '600', color: colors.foreground, flex: 1 },
  optionLabelActive: { color: colors.primary },

  // Aha
  ahaCard: {
    backgroundColor: colors.primary, borderRadius: 24, padding: 32,
    alignItems: 'center', gap: 8,
  },
  ahaEyebrow: { fontSize: 11, fontWeight: '700', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: 1.2 },
  ahaAmount: { fontSize: 52, fontWeight: '900', color: '#fff' },
  ahaAmountLabel: { fontSize: 14, color: 'rgba(255,255,255,0.85)' },
  ahaHeadline: { fontSize: 17, fontWeight: '600', color: colors.foreground, lineHeight: 26 },
  ahaSub: { fontSize: 14, color: colors.mutedForeground, fontStyle: 'italic' },

  // Mirror
  mirrorCard: {
    backgroundColor: colors.card, borderRadius: 20, padding: 24,
    gap: 16, borderWidth: 1, borderColor: colors.border + '4D',
  },
  mirrorRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  mirrorText: { fontSize: 15, color: colors.foreground, lineHeight: 22, flex: 1 },
  mirrorHighlight: { fontWeight: '700', color: colors.primary },
  mirrorClosing: { fontSize: 15, color: colors.mutedForeground, lineHeight: 22, fontStyle: 'italic' },

  // Demo
  demoHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  demoIconWrap: {
    width: 48, height: 48, borderRadius: 16,
    backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center',
  },
  demoInput: {
    backgroundColor: colors.card, borderRadius: 16, padding: 18,
    fontSize: 15, color: colors.foreground, lineHeight: 22, minHeight: 100,
    borderWidth: 1, borderColor: colors.border + '4D', textAlignVertical: 'top',
  },
  demoBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    height: 54, backgroundColor: colors.primary, borderRadius: 999,
    shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 10, elevation: 5,
  },
  demoBtnText: { fontSize: 16, fontWeight: '700', color: '#fff' },
  demoResult: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 12,
    backgroundColor: colors.chart3 + '15', borderRadius: 16, padding: 18,
    borderWidth: 1, borderColor: colors.chart3 + '40',
  },
  demoResultText: { fontSize: 15, color: colors.foreground, lineHeight: 23 },
  demoPickLabel: { fontSize: 13, fontWeight: '600', color: colors.mutedForeground, textTransform: 'uppercase', letterSpacing: 0.5 },
  demoRecipeCard: {
    backgroundColor: colors.card, borderRadius: 16, padding: 16,
    borderWidth: 1.5, borderColor: colors.border, gap: 8,
  },
  demoRecipeCardSelected: {
    borderColor: colors.primary, backgroundColor: colors.primary + '08',
  },
  demoRecipeCardTop: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  demoRecipeNum: { fontSize: 12, fontWeight: '700', color: colors.mutedForeground, textTransform: 'uppercase', letterSpacing: 0.5 },
  demoExpandLink: { fontSize: 12, fontWeight: '600', color: colors.primary, marginTop: 2 },
  skipLink: { alignItems: 'center', paddingVertical: 8 },
  skipLinkText: { fontSize: 13, color: colors.mutedForeground },

  // Lesson taste
  lessonCard: {
    backgroundColor: colors.card, borderRadius: 20, padding: 20,
    borderWidth: 1, borderColor: colors.border + '4D', overflow: 'hidden', flex: 1,
  },
  lessonCardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  lessonCardTag: { fontSize: 11, fontWeight: '700', color: colors.secondary, textTransform: 'uppercase', letterSpacing: 0.8 },
  lessonPreview: { fontSize: 15, color: colors.foreground, lineHeight: 24 },
  lessonBlur: {
    position: 'absolute', bottom: 0, left: 0, right: 0, height: 100,
    backgroundColor: 'rgba(255,255,255,0.92)', alignItems: 'center', justifyContent: 'flex-end', padding: 20,
  },
  lessonLockBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: colors.primary, borderRadius: 999, paddingHorizontal: 18, paddingVertical: 10,
  },
  lessonLockText: { fontSize: 13, fontWeight: '700', color: '#fff' },

  // Review
  reviewStars: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  reviewThanks: { fontSize: 16, fontWeight: '600', color: colors.chart3, textAlign: 'center' },
  feedbackBox: { gap: 10 },
  feedbackTitle: { fontSize: 14, fontWeight: '700', color: colors.foreground, marginBottom: 4 },
  feedbackOption: {
    borderWidth: 1, borderColor: colors.border, borderRadius: 12,
    paddingVertical: 12, paddingHorizontal: 16,
  },
  feedbackOptionActive: { borderColor: colors.primary, backgroundColor: colors.primary + '12' },
  feedbackOptionText: { fontSize: 14, color: colors.foreground },
  feedbackOptionTextActive: { color: colors.primary, fontWeight: '600' },

  // Summary
  summaryCard: {
    backgroundColor: colors.card, borderRadius: 20, padding: 20,
    borderWidth: 1, borderColor: colors.border + '4D', gap: 12,
  },
  summaryTrackHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  summaryTrackEmoji: { fontSize: 22 },
  summaryTrackTitle: { fontSize: 16, fontWeight: '700', color: colors.foreground },
  summaryDayStrip: { flexDirection: 'row', gap: 6 },
  summaryDayPill: {
    flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: 14,
    backgroundColor: colors.muted, gap: 4,
  },
  summaryDayPillActive: { backgroundColor: colors.primary },
  summaryDayPillAbbr: { fontSize: 10, fontWeight: '600', color: colors.mutedForeground },
  summaryDayPillNum: { fontSize: 15, fontWeight: '700', color: colors.foreground },
  summaryDayPillTextActive: { color: '#fff' },
  summaryLessonPath: { fontSize: 14, fontWeight: '700', color: colors.secondary },
  summaryTrackDesc: { fontSize: 12, color: colors.mutedForeground, lineHeight: 18 },

  // Social proof
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  ratingText: { fontSize: 13, fontWeight: '600', color: colors.mutedForeground },
  testimonialCard: {
    backgroundColor: colors.card, borderRadius: 16, padding: 18,
    borderWidth: 1, borderColor: colors.border + '4D', gap: 8, marginBottom: 12,
  },
  testimonialStars: { flexDirection: 'row', gap: 2 },
  testimonialQuote: { fontSize: 14, color: colors.foreground, lineHeight: 22, fontStyle: 'italic' },
  testimonialName: { fontSize: 12, fontWeight: '600', color: colors.mutedForeground },

  // Paywall
  paywallTitle: { fontSize: 26, fontWeight: '800', color: colors.foreground, lineHeight: 34 },
  paywallSub: { fontSize: 15, color: colors.mutedForeground },
  planToggle: {
    flexDirection: 'row', backgroundColor: colors.muted,
    borderRadius: 999, padding: 4,
  },
  planTab: { flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: 999, flexDirection: 'row', justifyContent: 'center', gap: 6 },
  planTabActive: { backgroundColor: '#fff', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 6, elevation: 2 },
  planTabText: { fontSize: 14, fontWeight: '600', color: colors.mutedForeground },
  planTabTextActive: { color: colors.foreground, fontWeight: '700' },
  saveBadge: { backgroundColor: colors.chart3, borderRadius: 999, paddingHorizontal: 7, paddingVertical: 2 },
  saveBadgeText: { fontSize: 9, fontWeight: '800', color: '#fff', letterSpacing: 0.5 },
  priceCard: {
    backgroundColor: colors.card, borderRadius: 20, padding: 24,
    alignItems: 'center', borderWidth: 1, borderColor: colors.border + '4D', gap: 4,
  },
  priceAmount: { fontSize: 44, fontWeight: '900', color: colors.foreground },
  pricePer: { fontSize: 14, color: colors.mutedForeground },
  priceCompare: { fontSize: 13, color: colors.secondary, fontWeight: '600', marginTop: 4 },
  trialFeatures: { gap: 10 },
  trialFeatureRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  trialFeatureText: { fontSize: 14, color: colors.foreground },
  trialBtn: {
    height: 56, backgroundColor: colors.primary, borderRadius: 999,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35, shadowRadius: 12, elevation: 6,
  },
  trialBtnText: { fontSize: 17, fontWeight: '800', color: '#fff' },
  paywallLegal: { fontSize: 11, color: colors.mutedForeground, textAlign: 'center', lineHeight: 16 },

  // Next button
  nextBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    height: 56, backgroundColor: colors.primary, borderRadius: 999,
    shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 12, elevation: 5,
  },
  nextBtnDisabled: { opacity: 0.4 },
  nextBtnText: { fontSize: 16, fontWeight: '700', color: '#fff' },
});
