import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radius } from '../../constants/theme';
import { COOKING_COURSES, LESSONS } from '../../constants/data';
import { useCourseContext } from '../../context/CourseContext';

const SECTION_COLORS: Record<string, { bg: string; accent: string; label: string }> = {
  beginner:     { bg: '#E8F5E9', accent: colors.chart3,  label: 'Complete Beginner' },
  intermediate: { bg: '#EEF2FF', accent: colors.secondary, label: 'Intermediate' },
  advanced:     { bg: '#FFF3E0', accent: '#E8891A',        label: 'Advanced' },
};

export default function LessonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const course = COOKING_COURSES.find((c) => c.id === id);
  const lesson = LESSONS.find((l) => l.id === id);
  const theme = SECTION_COLORS[course?.section ?? 'beginner'];

  const { courseStates, completeCourse } = useCourseContext();
  const isCompleted = (courseStates[id ?? '']?.progress ?? 0) >= 1;

  const handleMarkComplete = () => {
    if (!id || isCompleted) return;
    completeCourse(id);
    router.back();
  };

  if (!course || !lesson) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color={colors.foreground} />
        </Pressable>
        <Text style={styles.errorText}>Lesson not found.</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero */}
        <View style={[styles.hero, { backgroundColor: theme.bg, paddingTop: insets.top + 12 }]}>
          <Pressable style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={20} color={colors.foreground} />
          </Pressable>
          <View style={[styles.levelPill, { backgroundColor: theme.accent + '20', borderColor: theme.accent + '40' }]}>
            <Text style={[styles.levelPillText, { color: theme.accent }]}>
              {theme.label} · Level {course.level}
            </Text>
          </View>
          <Text style={styles.heroTitle}>{course.title}</Text>
          <View style={styles.heroMeta}>
            <Ionicons name="book-outline" size={14} color={colors.mutedForeground} />
            <Text style={styles.heroMetaText}>{lesson.readTime}</Text>
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {lesson.sections.map((section, i) => {
            if (section.type === 'intro') {
              return (
                <Text key={i} style={styles.intro}>{section.body}</Text>
              );
            }

            if (section.type === 'text') {
              return (
                <View key={i} style={styles.textBlock}>
                  {section.title && (
                    <Text style={[styles.sectionHeading, { color: theme.accent }]}>{section.title}</Text>
                  )}
                  <Text style={styles.bodyText}>{section.body}</Text>
                </View>
              );
            }

            if (section.type === 'steps') {
              return (
                <View key={i} style={styles.textBlock}>
                  {section.title && (
                    <Text style={[styles.sectionHeading, { color: theme.accent }]}>{section.title}</Text>
                  )}
                  {section.items?.map((item, j) => (
                    <View key={j} style={styles.stepRow}>
                      <View style={[styles.stepNumber, { backgroundColor: theme.accent }]}>
                        <Text style={styles.stepNumberText}>{j + 1}</Text>
                      </View>
                      <Text style={styles.stepText}>{item}</Text>
                    </View>
                  ))}
                </View>
              );
            }

            if (section.type === 'tips') {
              return (
                <View key={i} style={[styles.tipsCard, { borderColor: theme.accent + '30', backgroundColor: theme.bg }]}>
                  {section.title && (
                    <View style={styles.tipsHeader}>
                      <Ionicons name="bulb-outline" size={16} color={theme.accent} />
                      <Text style={[styles.tipsTitle, { color: theme.accent }]}>{section.title}</Text>
                    </View>
                  )}
                  {section.items?.map((tip, j) => (
                    <View key={j} style={styles.tipRow}>
                      <View style={[styles.tipDot, { backgroundColor: theme.accent }]} />
                      <Text style={styles.tipText}>{tip}</Text>
                    </View>
                  ))}
                </View>
              );
            }

            if (section.type === 'callout') {
              return (
                <View key={i} style={[styles.callout, { borderLeftColor: theme.accent, backgroundColor: theme.bg }]}>
                  {section.title && (
                    <Text style={[styles.calloutTitle, { color: theme.accent }]}>{section.title}</Text>
                  )}
                  <Text style={styles.calloutBody}>{section.body}</Text>
                </View>
              );
            }

            return null;
          })}

          {/* Mark Complete */}
          <Pressable
            style={({ pressed }) => [
              styles.completeBtn,
              { backgroundColor: isCompleted ? colors.chart3 : theme.accent },
              pressed && !isCompleted && { transform: [{ scale: 0.97 }] },
              isCompleted && { opacity: 0.85 },
            ]}
            onPress={handleMarkComplete}
            disabled={isCompleted}
          >
            <Ionicons name={isCompleted ? 'checkmark-circle' : 'checkmark-circle-outline'} size={22} color="#fff" />
            <Text style={styles.completeBtnText}>
              {isCompleted ? 'Lesson Completed' : 'Mark as Complete'}
            </Text>
          </Pressable>

          <View style={{ height: insets.bottom + 32 }} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {},
  hero: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border + '40',
  },
  levelPill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
    marginBottom: 12,
  },
  levelPillText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.foreground,
    lineHeight: 34,
    marginBottom: 12,
  },
  heroMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  heroMetaText: {
    fontSize: 12,
    color: colors.mutedForeground,
    fontWeight: '500',
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 28,
  },
  intro: {
    fontSize: 16,
    lineHeight: 26,
    color: colors.foreground,
    fontWeight: '400',
    marginBottom: 28,
  },
  textBlock: {
    marginBottom: 28,
  },
  sectionHeading: {
    fontSize: 13,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  bodyText: {
    fontSize: 15,
    lineHeight: 25,
    color: colors.foreground,
  },
  stepRow: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 14,
    alignItems: 'flex-start',
  },
  stepNumber: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 1,
  },
  stepNumberText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#fff',
  },
  stepText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 24,
    color: colors.foreground,
  },
  tipsCard: {
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: 20,
    marginBottom: 28,
    gap: 10,
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  tipsTitle: {
    fontSize: 13,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  tipRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  tipDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 9,
    flexShrink: 0,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 22,
    color: colors.foreground,
  },
  callout: {
    borderLeftWidth: 4,
    borderRadius: 4,
    padding: 18,
    marginBottom: 28,
  },
  calloutTitle: {
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  calloutBody: {
    fontSize: 14,
    lineHeight: 22,
    color: colors.foreground,
  },
  completeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    height: 56,
    borderRadius: 999,
    marginTop: 8,
    marginBottom: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 5,
  },
  completeBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  errorText: {
    fontSize: 16,
    color: colors.mutedForeground,
    padding: 24,
  },
});
