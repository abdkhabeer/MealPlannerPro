import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useCourseContext } from '../../context/CourseContext';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radius } from '../../constants/theme';
import { COOKING_COURSES } from '../../constants/data';

type Course = typeof COOKING_COURSES[0] & { level: number };

const XP_PER_LESSON = 10;
const XP_PER_LEVEL = 30; // 3 lessons per level, 10 levels total

const LEVEL_META = [
  { title: 'Kitchen Newcomer',   emoji: '🥚' },
  { title: 'Home Cook',          emoji: '🍳' },
  { title: 'Flavour Seeker',     emoji: '🌿' },
  { title: 'Confident Cook',     emoji: '🔪' },
  { title: 'Kitchen Adventurer', emoji: '🗺️' },
  { title: 'Skilled Chef',       emoji: '👨‍🍳' },
  { title: 'Culinary Artist',    emoji: '🎨' },
  { title: 'Master Cook',        emoji: '🏅' },
  { title: 'Expert Chef',        emoji: '⭐' },
  { title: 'Culinary Master',    emoji: '👑' },
];

function CourseCard({ course, progress, locked }: { course: Course; progress: number; locked: boolean }) {
  const router = useRouter();
  const [pressed, setPressed] = useState(false);
  const isLocked = locked;
  const completed = progress >= 1;

  return (
    <Pressable
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      onPress={() => !isLocked && router.push(`/lesson/${course.id}`)}
      style={[
        styles.courseCard,
        pressed && !isLocked && { transform: [{ scale: 0.97 }] },
        isLocked && styles.courseCardLocked,
      ]}
      disabled={isLocked}
    >
      {/* Level badge */}
      <View style={[styles.levelBadgeSmall, completed && styles.levelBadgeSmallDone]}>
        {completed
          ? <Ionicons name="checkmark" size={10} color="#fff" />
          : <Text style={styles.levelBadgeSmallText}>{course.level}</Text>
        }
      </View>

      {course.image ? (
        <View style={styles.courseImageContainer}>
          <Image source={{ uri: course.image }} style={styles.courseImage} resizeMode="contain" />
        </View>
      ) : (
        <View style={[styles.courseImageContainer, styles.courseImageFallback]}>
          {isLocked
            ? <Ionicons name="lock-closed" size={22} color={colors.mutedForeground} />
            : <Ionicons name="flame" size={28} color={colors.primary} />
          }
        </View>
      )}
      <Text style={styles.courseTitle} numberOfLines={2}>
        {course.title}
      </Text>
      <Text style={styles.courseDesc} numberOfLines={2}>
        {course.description}
      </Text>
      {isLocked && (
        <Text style={styles.lockedLabel}>LOCKED</Text>
      )}
    </Pressable>
  );
}

function CourseCardWide({ course, progress, locked }: { course: Course; progress: number; locked: boolean }) {
  const router = useRouter();
  const isLocked = locked;

  return (
    <Pressable
      onPress={() => !isLocked && router.push(`/lesson/${course.id}`)}
      style={[styles.courseCardWide, isLocked && styles.courseCardLocked]}
      disabled={isLocked}
    >
      <View style={[styles.courseIconWide, { backgroundColor: colors.accent + '4D' }]}>
        <Ionicons name="flame" size={32} color={colors.primary} />
      </View>
      <View style={styles.courseWideContent}>
        <Text style={styles.courseTitle}>{course.title}</Text>
        <Text style={styles.courseDesc}>{course.description}</Text>
        {isLocked && <Text style={styles.lockedLabel}>LOCKED</Text>}
      </View>
    </Pressable>
  );
}

export default function SchoolScreen() {
  const { courseStates } = useCourseContext();
  const beginnerCourses = COOKING_COURSES.filter((c) => c.section === 'beginner');
  const intermediateCourses = COOKING_COURSES.filter((c) => c.section === 'intermediate');
  const advancedCourses = COOKING_COURSES.filter((c) => c.section === 'advanced');

  const totalXP = COOKING_COURSES.reduce((sum, c) => {
    const p = courseStates[c.id]?.progress ?? c.progress;
    return sum + Math.floor(p * XP_PER_LESSON);
  }, 0);
  const completedCount = COOKING_COURSES.filter(
    (c) => (courseStates[c.id]?.progress ?? c.progress) >= 1
  ).length;
  const levelIndex = Math.min(Math.floor(totalXP / XP_PER_LEVEL), LEVEL_META.length - 1);
  const currentLevel = levelIndex + 1;
  const meta = LEVEL_META[levelIndex];
  const xpIntoLevel = totalXP % XP_PER_LEVEL;
  const isMaxLevel = levelIndex === LEVEL_META.length - 1;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with XP */}
        <View style={styles.header}>
          <View style={styles.levelBadge}>
            <Text style={styles.levelBadgeEmoji}>{meta.emoji}</Text>
          </View>
          <View style={styles.levelInfo}>
            <Text style={styles.levelText}>Level {currentLevel}</Text>
            <Text style={styles.levelTitle}>{meta.title}</Text>
          </View>
          <View style={styles.completedBadge}>
            <Text style={styles.completedBadgeText}>{completedCount}/30</Text>
            <Text style={styles.completedBadgeLabel}>lessons</Text>
          </View>
        </View>

        {/* XP Progress */}
        <View style={styles.xpSection}>
          <View style={styles.xpBar}>
            <View
              style={[
                styles.xpFill,
                { width: isMaxLevel ? '100%' : `${(xpIntoLevel / XP_PER_LEVEL) * 100}%` },
              ]}
            />
          </View>
          <View style={styles.xpLabels}>
            <Text style={styles.xpLabelLeft}>
              {isMaxLevel ? 'MAX LEVEL' : `Level ${currentLevel} → ${currentLevel + 1}`}
            </Text>
            <Text style={styles.xpLabelRight}>
              {isMaxLevel ? `${totalXP} XP` : `${xpIntoLevel} / ${XP_PER_LEVEL} XP`}
            </Text>
          </View>
        </View>

        {/* Beginner Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Complete Beginner</Text>
            <Text style={styles.sectionCount}>10 levels</Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.courseScroll}
            contentContainerStyle={styles.courseScrollContent}
          >
            {beginnerCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                progress={courseStates[course.id]?.progress ?? course.progress}
                locked={courseStates[course.id]?.locked ?? (course.locked ?? false)}
              />
            ))}
          </ScrollView>
        </View>

        {/* Intermediate Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Intermediate</Text>
            <Text style={styles.sectionCount}>10 levels</Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.courseScroll}
            contentContainerStyle={styles.courseScrollContent}
          >
            {intermediateCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                progress={courseStates[course.id]?.progress ?? course.progress}
                locked={courseStates[course.id]?.locked ?? (course.locked ?? false)}
              />
            ))}
          </ScrollView>
        </View>

        {/* Advanced Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Advanced</Text>
            <Text style={styles.sectionCount}>10 levels</Text>
          </View>
          {advancedCourses.map((course) => (
            <CourseCardWide
              key={course.id}
              course={course}
              progress={courseStates[course.id]?.progress ?? course.progress}
              locked={courseStates[course.id]?.locked ?? (course.locked ?? false)}
            />
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: { flex: 1 },
  content: {
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  levelBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E8B84B',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#E8B84B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },
  levelBadgeEmoji: {
    fontSize: 22,
  },
  levelInfo: {
    flex: 1,
  },
  completedBadge: {
    alignItems: 'center',
    backgroundColor: colors.muted,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  completedBadgeText: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.foreground,
  },
  completedBadgeLabel: {
    fontSize: 9,
    fontWeight: '600',
    color: colors.mutedForeground,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  levelText: {
    fontSize: 12,
    color: colors.mutedForeground,
    marginBottom: 2,
  },
  levelTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.foreground,
  },
  xpSection: {
    marginBottom: 32,
  },
  xpBar: {
    height: 8,
    backgroundColor: colors.muted,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  xpFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  xpLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  xpLabelLeft: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.secondary,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  xpLabelRight: {
    fontSize: 11,
    color: colors.mutedForeground,
    fontStyle: 'italic',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.foreground,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionCount: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.mutedForeground,
  },
  courseScroll: {
    marginHorizontal: -24,
  },
  courseScrollContent: {
    paddingHorizontal: 24,
    gap: 12,
  },
  levelBadgeSmall: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.muted,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  levelBadgeSmallDone: {
    backgroundColor: colors.chart3,
  },
  levelBadgeSmallText: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.mutedForeground,
  },
  courseCard: {
    width: 160,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border + '4D',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
    overflow: 'hidden',
    height: 180,
    position: 'relative',
  },
  courseCardLocked: {
    opacity: 0.7,
  },
  courseImageContainer: {
    width: 40,
    height: 40,
    marginBottom: 12,
    overflow: 'hidden',
  },
  courseImageFallback: {
    backgroundColor: colors.accent + '4D',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  courseImage: {
    width: '100%',
    height: '100%',
  },
  courseIconWide: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  courseTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.foreground,
    lineHeight: 18,
    marginBottom: 4,
  },
  courseDesc: {
    fontSize: 11,
    color: colors.mutedForeground,
    lineHeight: 16,
    flex: 1,
  },
  progressIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    height: 4,
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  courseCardWide: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: 20,
    flexDirection: 'row',
    gap: 20,
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: colors.border + '4D',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
    overflow: 'hidden',
  },
  courseWideContent: {
    flex: 1,
    gap: 10,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  progressBarSmall: {
    height: 6,
    backgroundColor: colors.muted,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFillSmall: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  lockedLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.mutedForeground,
    letterSpacing: 1,
  },
});
