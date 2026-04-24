import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radius } from '../../constants/theme';
import { WallpaperBackground } from '../../components/WallpaperBackground';
import { RECIPES } from '../../constants/data';
import { usePlannerContext, MealSlot, WeekPlans, EMPTY_SLOT } from '../../context/PlannerContext';

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];


function getMondayOf(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function getWeekDays(monday: Date): Date[] {
  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(d.getDate() + i);
    return d;
  });
}

function formatWeekLabel(monday: Date): string {
  const sunday = new Date(monday);
  sunday.setDate(sunday.getDate() + 6);
  const startMonth = MONTH_NAMES[monday.getMonth()];
  const endMonth = MONTH_NAMES[sunday.getMonth()];
  if (startMonth === endMonth) {
    return `${startMonth} ${monday.getDate()} — ${sunday.getDate()}`;
  }
  return `${startMonth} ${monday.getDate()} — ${endMonth} ${sunday.getDate()}`;
}

function dateKey(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
}

export default function PlannerScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const today = new Date();
  const [weekStart, setWeekStart] = useState(() => getMondayOf(today));
  const [selectedDay, setSelectedDay] = useState(() => {
    const days = getWeekDays(getMondayOf(today));
    const idx = days.findIndex((d) => isSameDay(d, today));
    return idx >= 0 ? idx : 0;
  });
  const [pendingSlot, setPendingSlot] = useState<keyof MealSlot | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [trackerMode, setTrackerMode] = useState<'daily' | 'weekly' | null>(null);
  const [calorieGoal, setCalorieGoal] = useState(2000);
  const [editingGoal, setEditingGoal] = useState(false);
  const [goalInput, setGoalInput] = useState('2000');

  const { weekPlans, pendingRecipe, setPendingRecipe, addToSlot, removeFromSlot } = usePlannerContext();

  const weekDays = getWeekDays(weekStart);
  const weekLabel = formatWeekLabel(weekStart);

  const goToPrevWeek = () => {
    setWeekStart((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() - 7);
      return d;
    });
    setSelectedDay(0);
  };

  const goToNextWeek = () => {
    setWeekStart((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() + 7);
      return d;
    });
    setSelectedDay(0);
  };

  const currentKey = dateKey(weekDays[selectedDay]);
  const currentPlan: MealSlot = weekPlans[currentKey] ?? EMPTY_SLOT;

  const totalCals =
    (currentPlan.breakfast?.calories ?? 0) +
    (currentPlan.lunch?.calories ?? 0) +
    (currentPlan.dinner?.calories ?? 0);
  const totalProtein =
    (currentPlan.breakfast?.protein ?? 0) +
    (currentPlan.lunch?.protein ?? 0) +
    (currentPlan.dinner?.protein ?? 0);
  const totalCarbs =
    (currentPlan.breakfast?.carbs ?? 0) +
    (currentPlan.lunch?.carbs ?? 0) +
    (currentPlan.dinner?.carbs ?? 0);

  const weeklyData = weekDays.map((date) => {
    const plan = weekPlans[dateKey(date)] ?? EMPTY_SLOT;
    return {
      label: DAY_LABELS[date.getDay()],
      cals: (plan.breakfast?.calories ?? 0) + (plan.lunch?.calories ?? 0) + (plan.dinner?.calories ?? 0),
      isToday: isSameDay(date, today),
    };
  });
  const weeklyTotal = weeklyData.reduce((s, d) => s + d.cals, 0);
  const weeklyGoal = calorieGoal * 7;

  const handleRemoveFromSlot = (slot: keyof MealSlot) => removeFromSlot(currentKey, slot);

  const handleAddToSlot = (slot: keyof MealSlot, recipe: typeof RECIPES[0]) => {
    addToSlot(currentKey, slot, recipe);
    setPendingSlot(null);
  };

  const handleAssignPendingToSlot = (slot: keyof MealSlot) => {
    if (!pendingRecipe) return;
    addToSlot(currentKey, slot, pendingRecipe);
    setPendingRecipe(null);
  };

  const MealCard = ({
    meal,
    onRemove,
    onAdd,
  }: {
    meal: typeof RECIPES[0] | null;
    onRemove: () => void;
    onAdd: () => void;
  }) => {
    if (!meal) {
      return (
        <Pressable style={styles.emptySlot} onPress={onAdd}>
          <Ionicons name="clipboard-outline" size={30} color={colors.mutedForeground} style={{ opacity: 0.5 }} />
          <Text style={styles.emptySlotText}>Add a recipe</Text>
        </Pressable>
      );
    }

    return (
      <Pressable
        style={styles.mealCard}
        onPress={() => router.push(`/recipe/${meal.id}`)}
      >
        <View style={styles.mealThumb}>
          <Image source={{ uri: meal.image }} style={styles.mealImage} />
        </View>
        <View style={styles.mealInfo}>
          <Text style={styles.mealTitle} numberOfLines={1}>{meal.title}</Text>
          <View style={styles.mealMeta}>
            <Text style={styles.mealMetaText}>{meal.calories} kcal</Text>
            <Text style={styles.mealMetaText}>{meal.protein}g Protein</Text>
          </View>
        </View>
        <Pressable onPress={onRemove} hitSlop={8} style={styles.removeBtn}>
          <Ionicons name="close" size={16} color={colors.mutedForeground} />
        </Pressable>
      </Pressable>
    );
  };

  return (
    <WallpaperBackground>
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Meal Planner</Text>
          <Pressable style={styles.menuBtn} onPress={() => setShowMenu(true)}>
            <Ionicons name="ellipsis-horizontal" size={20} color={colors.foreground} />
          </Pressable>
        </View>

        {/* Dropdown menu */}
        {showMenu && (
          <Pressable style={styles.menuOverlay} onPress={() => setShowMenu(false)}>
            <View style={styles.menuDropdown}>
              <Pressable style={styles.menuItem} onPress={() => { setShowMenu(false); setTrackerMode('daily'); }}>
                <Ionicons name="today-outline" size={18} color={colors.foreground} />
                <Text style={styles.menuItemText}>Daily Calorie Tracker</Text>
              </Pressable>
              <View style={styles.menuDivider} />
              <Pressable style={styles.menuItem} onPress={() => { setShowMenu(false); setTrackerMode('weekly'); }}>
                <Ionicons name="bar-chart-outline" size={18} color={colors.foreground} />
                <Text style={styles.menuItemText}>Weekly Calorie Tracker</Text>
              </Pressable>
              <View style={styles.menuDivider} />
              <Pressable style={styles.menuItem} onPress={() => { setShowMenu(false); setEditingGoal(true); setGoalInput(String(calorieGoal)); }}>
                <Ionicons name="flag-outline" size={18} color={colors.foreground} />
                <Text style={styles.menuItemText}>Set Calorie Goal</Text>
              </Pressable>
            </View>
          </Pressable>
        )}

        {/* Week Nav */}
        <View style={styles.weekNav}>
          <Pressable style={styles.weekNavBtn} onPress={goToPrevWeek}>
            <Ionicons name="chevron-back" size={20} color={colors.foreground} />
          </Pressable>
          <View style={styles.weekLabel}>
            <Text style={styles.weekLabelTop}>
              {isSameDay(weekStart, getMondayOf(today)) ? 'This Week' : weekLabel}
            </Text>
            <Text style={styles.weekLabelDate}>{weekLabel}</Text>
          </View>
          <Pressable style={styles.weekNavBtn} onPress={goToNextWeek}>
            <Ionicons name="chevron-forward" size={20} color={colors.foreground} />
          </Pressable>
        </View>

        {/* Day Picker */}
        <View style={styles.dayPicker}>
          {weekDays.map((date, i) => {
            const isToday = isSameDay(date, today);
            const isSelected = selectedDay === i;
            return (
              <Pressable
                key={i}
                style={styles.dayCol}
                onPress={() => setSelectedDay(i)}
              >
                <Text style={[styles.dayLabel, isToday && styles.dayLabelToday]}>
                  {DAY_LABELS[date.getDay()]}
                </Text>
                <View style={[styles.dayNum, isSelected && styles.dayNumActive]}>
                  <Text style={[styles.dayNumText, isSelected && styles.dayNumTextActive]}>
                    {date.getDate()}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>

        {/* Daily Summary */}
        <View style={styles.summary}>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryLabel, { color: colors.secondary }]}>Cals</Text>
            <Text style={styles.summaryValue}>
              {totalCals > 0 ? totalCals.toLocaleString() : '—'}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryLabel, { color: colors.chart1 }]}>Protein</Text>
            <Text style={styles.summaryValue}>{totalProtein > 0 ? `${totalProtein}g` : '—'}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryLabel, { color: colors.chart2 }]}>Carbs</Text>
            <Text style={styles.summaryValue}>{totalCarbs > 0 ? `${totalCarbs}g` : '—'}</Text>
          </View>
        </View>

        {/* Meals */}
        <View style={styles.meals}>
          {(['breakfast', 'lunch', 'dinner'] as const).map((slot) => (
            <View key={slot} style={styles.mealSection}>
              <View style={styles.mealSectionHeader}>
                <Text style={styles.mealSectionLabel}>
                  {slot.charAt(0).toUpperCase() + slot.slice(1)}
                </Text>
                <Pressable onPress={() => setPendingSlot(slot)}>
                  <Ionicons name="add" size={20} color={colors.mutedForeground} />
                </Pressable>
              </View>
              <MealCard
                meal={currentPlan[slot]}
                onRemove={() => handleRemoveFromSlot(slot)}
                onAdd={() => setPendingSlot(slot)}
              />
            </View>
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Calorie Tracker Modal */}
      <Modal visible={trackerMode !== null} animationType="slide" transparent onRequestClose={() => setTrackerMode(null)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setTrackerMode(null)} />
        <View style={[styles.modalSheet, { paddingBottom: insets.bottom + 24, maxHeight: '88%' }]}>
          <View style={styles.modalHandle} />

          {/* Header */}
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalTitle}>
                {trackerMode === 'daily' ? 'Daily Tracker' : 'Weekly Tracker'}
              </Text>
              <Text style={styles.modalSub}>Goal: {calorieGoal.toLocaleString()} kcal/day</Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <Pressable
                style={[styles.trackerTabBtn, trackerMode === 'daily' && styles.trackerTabActive]}
                onPress={() => setTrackerMode('daily')}
              >
                <Text style={[styles.trackerTabText, trackerMode === 'daily' && styles.trackerTabTextActive]}>Daily</Text>
              </Pressable>
              <Pressable
                style={[styles.trackerTabBtn, trackerMode === 'weekly' && styles.trackerTabActive]}
                onPress={() => setTrackerMode('weekly')}
              >
                <Text style={[styles.trackerTabText, trackerMode === 'weekly' && styles.trackerTabTextActive]}>Weekly</Text>
              </Pressable>
            </View>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {trackerMode === 'daily' ? (
              <View style={styles.trackerContent}>
                {/* Big calorie ring summary */}
                <View style={styles.trackerRingCard}>
                  <View style={styles.trackerRingRow}>
                    <View style={styles.trackerRingWrap}>
                      <View style={[styles.trackerRingOuter, { borderColor: totalCals >= calorieGoal ? colors.chart3 : colors.primary }]}>
                        <Text style={styles.trackerRingNum}>{totalCals.toLocaleString()}</Text>
                        <Text style={styles.trackerRingLabel}>consumed</Text>
                      </View>
                    </View>
                    <View style={styles.trackerRingSide}>
                      <View style={styles.trackerStat}>
                        <Text style={styles.trackerStatVal}>{calorieGoal.toLocaleString()}</Text>
                        <Text style={styles.trackerStatLabel}>Goal</Text>
                      </View>
                      <View style={styles.trackerStat}>
                        <Text style={[styles.trackerStatVal, { color: Math.max(0, calorieGoal - totalCals) === 0 ? colors.chart3 : colors.primary }]}>
                          {Math.max(0, calorieGoal - totalCals).toLocaleString()}
                        </Text>
                        <Text style={styles.trackerStatLabel}>Remaining</Text>
                      </View>
                    </View>
                  </View>
                  {/* Progress bar */}
                  <View style={styles.trackerBarWrap}>
                    <View style={styles.trackerBarBg}>
                      <View style={[styles.trackerBarFill, {
                        width: `${Math.min(100, (totalCals / calorieGoal) * 100)}%` as any,
                        backgroundColor: totalCals > calorieGoal ? colors.destructive : colors.primary,
                      }]} />
                    </View>
                    <Text style={styles.trackerBarPct}>
                      {calorieGoal > 0 ? Math.round((totalCals / calorieGoal) * 100) : 0}%
                    </Text>
                  </View>
                </View>

                {/* Meal breakdown */}
                <Text style={styles.trackerSectionLabel}>Meal Breakdown</Text>
                {(['breakfast', 'lunch', 'dinner'] as const).map((slot) => {
                  const meal = currentPlan[slot];
                  const cals = meal?.calories ?? 0;
                  const pct = calorieGoal > 0 ? Math.min(100, (cals / calorieGoal) * 100) : 0;
                  return (
                    <View key={slot} style={styles.mealBreakdownRow}>
                      <Text style={styles.mealBreakdownEmoji}>
                        {slot === 'breakfast' ? '🌅' : slot === 'lunch' ? '☀️' : '🌙'}
                      </Text>
                      <View style={{ flex: 1 }}>
                        <View style={styles.mealBreakdownTop}>
                          <Text style={styles.mealBreakdownName}>
                            {slot.charAt(0).toUpperCase() + slot.slice(1)}
                          </Text>
                          <Text style={styles.mealBreakdownCals}>{cals > 0 ? `${cals} kcal` : '—'}</Text>
                        </View>
                        <View style={styles.trackerBarBg}>
                          <View style={[styles.trackerBarFill, { width: `${pct}%` as any, backgroundColor: colors.chart1 + 'CC' }]} />
                        </View>
                        {meal && <Text style={styles.mealBreakdownTitle} numberOfLines={1}>{meal.title}</Text>}
                      </View>
                    </View>
                  );
                })}

                {/* Macros */}
                <Text style={styles.trackerSectionLabel}>Macros Today</Text>
                <View style={styles.macroRow3}>
                  {[
                    { label: 'Protein', val: totalProtein, unit: 'g', color: colors.chart1 },
                    { label: 'Carbs', val: totalCarbs, unit: 'g', color: colors.chart2 },
                    { label: 'Fats', val: (currentPlan.breakfast?.fats ?? 0) + (currentPlan.lunch?.fats ?? 0) + (currentPlan.dinner?.fats ?? 0), unit: 'g', color: colors.chart4 },
                  ].map((m) => (
                    <View key={m.label} style={styles.macroBox}>
                      <View style={[styles.macroDot, { backgroundColor: m.color }]} />
                      <Text style={styles.macroBoxVal}>{m.val}{m.unit}</Text>
                      <Text style={styles.macroBoxLabel}>{m.label}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ) : (
              <View style={styles.trackerContent}>
                {/* Weekly summary */}
                <View style={styles.trackerRingCard}>
                  <View style={styles.weeklyTotalRow}>
                    <View>
                      <Text style={styles.weeklyTotalNum}>{weeklyTotal.toLocaleString()}</Text>
                      <Text style={styles.trackerStatLabel}>kcal this week</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={styles.weeklyTotalNum}>{weeklyGoal.toLocaleString()}</Text>
                      <Text style={styles.trackerStatLabel}>weekly goal</Text>
                    </View>
                  </View>
                  <View style={styles.trackerBarWrap}>
                    <View style={styles.trackerBarBg}>
                      <View style={[styles.trackerBarFill, {
                        width: `${Math.min(100, weeklyGoal > 0 ? (weeklyTotal / weeklyGoal) * 100 : 0)}%` as any,
                        backgroundColor: weeklyTotal > weeklyGoal ? colors.destructive : colors.primary,
                      }]} />
                    </View>
                    <Text style={styles.trackerBarPct}>
                      {weeklyGoal > 0 ? Math.round((weeklyTotal / weeklyGoal) * 100) : 0}%
                    </Text>
                  </View>
                </View>

                {/* Bar chart per day */}
                <Text style={styles.trackerSectionLabel}>Daily Breakdown</Text>
                <View style={styles.weekBars}>
                  {weeklyData.map((day) => {
                    const pct = calorieGoal > 0 ? Math.min(100, (day.cals / calorieGoal) * 100) : 0;
                    const overGoal = day.cals > calorieGoal;
                    return (
                      <View key={day.label} style={styles.weekBarCol}>
                        <Text style={styles.weekBarCals}>{day.cals > 0 ? day.cals : ''}</Text>
                        <View style={styles.weekBarTrack}>
                          <View style={[styles.weekBarFill, {
                            height: `${Math.max(4, pct)}%` as any,
                            backgroundColor: overGoal ? colors.destructive : day.isToday ? colors.primary : colors.secondary + 'AA',
                          }]} />
                        </View>
                        <Text style={[styles.weekBarLabel, day.isToday && { color: colors.primary, fontWeight: '700' }]}>
                          {day.label}
                        </Text>
                      </View>
                    );
                  })}
                </View>

                <Pressable style={styles.setGoalInline} onPress={() => { setTrackerMode(null); setEditingGoal(true); setGoalInput(String(calorieGoal)); }}>
                  <Ionicons name="flag-outline" size={16} color={colors.secondary} />
                  <Text style={styles.setGoalInlineText}>Change daily goal ({calorieGoal.toLocaleString()} kcal)</Text>
                  <Ionicons name="chevron-forward" size={14} color={colors.mutedForeground} />
                </Pressable>
              </View>
            )}
          </ScrollView>
        </View>
      </Modal>

      {/* Set Goal Modal */}
      <Modal visible={editingGoal} animationType="fade" transparent onRequestClose={() => setEditingGoal(false)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setEditingGoal(false)} />
        <View style={styles.goalModal}>
          <Text style={styles.goalModalTitle}>Set Daily Calorie Goal</Text>
          <Text style={styles.goalModalSub}>Enter your target calories per day</Text>
          <TextInput
            style={styles.goalInput}
            value={goalInput}
            onChangeText={setGoalInput}
            keyboardType="numeric"
            placeholder="e.g. 2000"
            placeholderTextColor={colors.mutedForeground}
            autoFocus
          />
          <View style={styles.goalBtnRow}>
            <Pressable style={styles.goalCancelBtn} onPress={() => setEditingGoal(false)}>
              <Text style={styles.goalCancelText}>Cancel</Text>
            </Pressable>
            <Pressable
              style={styles.goalSaveBtn}
              onPress={() => {
                const val = parseInt(goalInput, 10);
                if (!isNaN(val) && val > 0) setCalorieGoal(val);
                setEditingGoal(false);
              }}
            >
              <Text style={styles.goalSaveText}>Save</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Slot Picker Modal — opened when coming from "Add to Planner" on recipe detail */}
      <Modal
        visible={pendingRecipe !== null}
        animationType="slide"
        transparent
        onRequestClose={() => setPendingRecipe(null)}
      >
        <Pressable style={styles.modalBackdrop} onPress={() => setPendingRecipe(null)} />
        <View style={[styles.modalSheet, { paddingBottom: insets.bottom + 16 }]}>
          <View style={styles.modalHandle} />
          <View style={styles.modalHeader}>
            <View style={{ flex: 1, marginRight: 12 }}>
              <Text style={styles.modalTitle}>Add to Planner</Text>
              <Text style={styles.modalSub} numberOfLines={1}>{pendingRecipe?.title}</Text>
            </View>
            <Pressable onPress={() => setPendingRecipe(null)} style={styles.modalClose}>
              <Ionicons name="close" size={20} color={colors.foreground} />
            </Pressable>
          </View>
          <Text style={[styles.modalSub, { marginBottom: 16 }]}>Choose a meal slot for today</Text>
          {(['breakfast', 'lunch', 'dinner'] as const).map((slot) => (
            <Pressable
              key={slot}
              style={({ pressed }) => [styles.slotPickerBtn, pressed && { opacity: 0.75 }]}
              onPress={() => handleAssignPendingToSlot(slot)}
            >
              <Text style={styles.slotPickerEmoji}>
                {slot === 'breakfast' ? '🌅' : slot === 'lunch' ? '☀️' : '🌙'}
              </Text>
              <Text style={styles.slotPickerLabel}>
                {slot.charAt(0).toUpperCase() + slot.slice(1)}
              </Text>
              {currentPlan[slot] && (
                <Text style={styles.slotPickerOccupied} numberOfLines={1}>
                  Replaces: {currentPlan[slot]!.title}
                </Text>
              )}
              <Ionicons name="chevron-forward" size={18} color={colors.mutedForeground} style={{ marginLeft: 'auto' }} />
            </Pressable>
          ))}
        </View>
      </Modal>

      {/* Recipe Picker Modal */}
      <Modal
        visible={pendingSlot !== null}
        animationType="slide"
        transparent
        onRequestClose={() => setPendingSlot(null)}
      >
        <Pressable style={styles.modalBackdrop} onPress={() => setPendingSlot(null)} />
        <View style={[styles.modalSheet, { paddingBottom: insets.bottom + 16 }]}>
          <View style={styles.modalHandle} />
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalTitle}>Add to {pendingSlot ? pendingSlot.charAt(0).toUpperCase() + pendingSlot.slice(1) : ''}</Text>
              <Text style={styles.modalSub}>Choose a recipe</Text>
            </View>
            <Pressable onPress={() => setPendingSlot(null)} style={styles.modalClose}>
              <Ionicons name="close" size={20} color={colors.foreground} />
            </Pressable>
          </View>
          <ScrollView showsVerticalScrollIndicator={false} style={styles.modalScroll}>
            {RECIPES.map((recipe) => (
              <Pressable
                key={recipe.id}
                style={({ pressed }) => [styles.pickerCard, pressed && { opacity: 0.8 }]}
                onPress={() => pendingSlot && handleAddToSlot(pendingSlot, recipe)}
              >
                <Image source={{ uri: recipe.image }} style={styles.pickerImage} />
                <View style={styles.pickerInfo}>
                  <Text style={styles.pickerTitle} numberOfLines={1}>{recipe.title}</Text>
                  <View style={styles.pickerMeta}>
                    <Ionicons name="time-outline" size={11} color={colors.mutedForeground} />
                    <Text style={styles.pickerMetaText}>{recipe.time}</Text>
                    <Text style={styles.pickerDot}>·</Text>
                    <Text style={styles.pickerMetaText}>{recipe.calories} kcal</Text>
                    <Text style={styles.pickerDot}>·</Text>
                    <Text style={styles.pickerMetaText}>{recipe.protein}g protein</Text>
                  </View>
                </View>
                <Ionicons name="add-circle" size={28} color={colors.primary} />
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </Modal>
    </SafeAreaView>
    </WallpaperBackground>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  container: { flex: 1 },
  content: {
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.foreground,
  },
  menuBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.88)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border + '66',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  weekNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.88)',
    borderRadius: 999,
    padding: 8,
    borderWidth: 1,
    borderColor: colors.border + '66',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
    marginBottom: 24,
  },
  weekNavBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  weekLabel: {
    alignItems: 'center',
  },
  weekLabelTop: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.secondary,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 2,
  },
  weekLabelDate: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.foreground,
  },
  dayPicker: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  dayCol: {
    alignItems: 'center',
    gap: 8,
  },
  dayLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.mutedForeground,
    textTransform: 'uppercase',
  },
  dayLabelToday: {
    color: colors.primary,
  },
  dayNum: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.88)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border + '66',
  },
  dayNumActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  dayNumText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.foreground,
  },
  dayNumTextActive: {
    color: '#fff',
  },
  summary: {
    backgroundColor: 'rgba(255,255,255,0.88)',
    borderRadius: radius.lg,
    padding: 24,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border + '66',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
    marginBottom: 32,
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.foreground,
  },
  divider: {
    width: 1,
    height: 32,
    backgroundColor: colors.border + '80',
  },
  meals: {
    gap: 24,
  },
  mealSection: {},
  mealSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  mealSectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.secondary,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  mealCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border + '4D',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  mealThumb: {
    width: 64,
    height: 64,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: colors.muted,
    flexShrink: 0,
  },
  mealImage: {
    width: '100%',
    height: '100%',
  },
  mealInfo: {
    flex: 1,
  },
  mealTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.foreground,
    marginBottom: 6,
  },
  mealMeta: {
    flexDirection: 'row',
    gap: 12,
  },
  mealMetaText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.mutedForeground,
    textTransform: 'uppercase',
  },
  emptySlot: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.border + '66',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  emptySlotText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.mutedForeground,
    letterSpacing: 0.5,
  },
  removeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.muted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  modalSheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 12,
    maxHeight: '75%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 16,
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    alignSelf: 'center',
    marginBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.foreground,
  },
  modalSub: {
    fontSize: 12,
    color: colors.mutedForeground,
    marginTop: 2,
  },
  modalClose: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.muted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalScroll: {
    flexGrow: 0,
  },
  pickerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: 'rgba(255,255,255,0.88)',
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border + '4D',
  },
  pickerImage: {
    width: 56,
    height: 56,
    borderRadius: 10,
    backgroundColor: colors.muted,
    flexShrink: 0,
  },
  pickerInfo: {
    flex: 1,
  },
  pickerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.foreground,
    marginBottom: 5,
  },
  pickerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  pickerMetaText: {
    fontSize: 11,
    color: colors.mutedForeground,
  },
  pickerDot: {
    fontSize: 11,
    color: colors.mutedForeground,
  },
  menuOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    zIndex: 100,
  },
  menuDropdown: {
    position: 'absolute',
    top: 68,
    right: 24,
    backgroundColor: 'rgba(255,255,255,0.88)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border + '66',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
    minWidth: 220,
    zIndex: 101,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  menuItemText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.foreground,
  },
  menuDivider: {
    height: 1,
    backgroundColor: colors.border + '66',
    marginHorizontal: 16,
  },
  trackerTabBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: colors.muted,
  },
  trackerTabActive: {
    backgroundColor: colors.primary,
  },
  trackerTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.mutedForeground,
  },
  trackerTabTextActive: {
    color: '#fff',
  },
  trackerContent: {
    paddingBottom: 24,
    gap: 16,
  },
  trackerRingCard: {
    backgroundColor: colors.muted,
    borderRadius: radius.lg,
    padding: 20,
    gap: 16,
  },
  trackerRingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
  },
  trackerRingWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  trackerRingOuter: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trackerRingNum: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.foreground,
  },
  trackerRingLabel: {
    fontSize: 9,
    fontWeight: '600',
    color: colors.mutedForeground,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  trackerRingSide: {
    flex: 1,
    gap: 16,
  },
  trackerStat: {
    gap: 2,
  },
  trackerStatVal: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.foreground,
  },
  trackerStatLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.mutedForeground,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  trackerBarWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  trackerBarBg: {
    flex: 1,
    height: 8,
    backgroundColor: colors.border + '80',
    borderRadius: 4,
    overflow: 'hidden',
  },
  trackerBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  trackerBarPct: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.mutedForeground,
    width: 34,
    textAlign: 'right',
  },
  trackerSectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.secondary,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginTop: 8,
  },
  mealBreakdownRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: 'rgba(255,255,255,0.88)',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border + '4D',
  },
  mealBreakdownEmoji: {
    fontSize: 22,
    marginTop: 2,
  },
  mealBreakdownTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  mealBreakdownName: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.foreground,
  },
  mealBreakdownCals: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
  mealBreakdownTitle: {
    fontSize: 11,
    color: colors.mutedForeground,
    marginTop: 4,
  },
  macroRow3: {
    flexDirection: 'row',
    gap: 10,
  },
  macroBox: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.88)',
    borderRadius: 14,
    paddingVertical: 18,
    paddingHorizontal: 8,
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: colors.border + '4D',
  },
  macroDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  macroBoxVal: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.foreground,
  },
  macroBoxLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.mutedForeground,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  weeklyTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  weeklyTotalNum: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.foreground,
  },
  weekBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 6,
    height: 160,
    backgroundColor: 'rgba(255,255,255,0.88)',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border + '4D',
  },
  weekBarCol: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
    gap: 4,
  },
  weekBarCals: {
    fontSize: 8,
    fontWeight: '600',
    color: colors.mutedForeground,
    height: 12,
  },
  weekBarTrack: {
    flex: 1,
    width: '100%',
    backgroundColor: colors.muted,
    borderRadius: 6,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  weekBarFill: {
    width: '100%',
    borderRadius: 6,
  },
  weekBarLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.mutedForeground,
  },
  setGoalInline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.secondary + '10',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.secondary + '30',
  },
  setGoalInlineText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: colors.secondary,
  },
  goalModal: {
    position: 'absolute',
    top: '30%',
    left: 32,
    right: 32,
    backgroundColor: 'rgba(255,255,255,0.88)',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 12,
  },
  goalModalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.foreground,
    marginBottom: 4,
  },
  goalModalSub: {
    fontSize: 13,
    color: colors.mutedForeground,
    marginBottom: 20,
  },
  goalInput: {
    backgroundColor: colors.muted,
    borderRadius: 12,
    padding: 14,
    fontSize: 20,
    fontWeight: '700',
    color: colors.foreground,
    textAlign: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border + '80',
  },
  goalBtnRow: {
    flexDirection: 'row',
    gap: 12,
  },
  goalCancelBtn: {
    flex: 1,
    height: 48,
    borderRadius: 999,
    backgroundColor: colors.muted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goalCancelText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.mutedForeground,
  },
  goalSaveBtn: {
    flex: 1,
    height: 48,
    borderRadius: 999,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goalSaveText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
  slotPickerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: 'rgba(255,255,255,0.88)',
    borderRadius: 16,
    padding: 18,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border + '4D',
  },
  slotPickerEmoji: {
    fontSize: 22,
  },
  slotPickerLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.foreground,
  },
  slotPickerOccupied: {
    fontSize: 11,
    color: colors.mutedForeground,
    flex: 1,
  },
});
