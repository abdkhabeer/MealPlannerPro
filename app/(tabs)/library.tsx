import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radius } from '../../constants/theme';
import { RECIPES, Recipe } from '../../constants/data';

function LibraryCard({ recipe, onPress }: { recipe: Recipe; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && { transform: [{ scale: 0.98 }] }]}
    >
      <Image source={{ uri: recipe.image }} style={styles.cardImage} />
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle} numberOfLines={1}>{recipe.title}</Text>
        <View style={styles.cardMeta}>
          <Ionicons name="time-outline" size={12} color={colors.mutedForeground} />
          <Text style={styles.metaText}>{recipe.time}</Text>
          <View style={[styles.dot, { backgroundColor: colors.chart1 }]} />
          <Text style={styles.metaText}>{recipe.calories} kcal</Text>
        </View>
        <View style={styles.gradeBadge}>
          <Text style={styles.gradeText}>Grade {recipe.grade}</Text>
        </View>
      </View>
    </Pressable>
  );
}

export default function LibraryScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>My Library</Text>
        <Pressable style={styles.iconBtn}>
          <Ionicons name="search-outline" size={20} color={colors.foreground} />
        </Pressable>
      </View>

      <FlatList
        data={RECIPES}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <Text style={styles.sectionLabel}>Saved Recipes ({RECIPES.length})</Text>
        }
        ListFooterComponent={<View style={{ height: 100 }} />}
        renderItem={({ item }) => (
          <LibraryCard
            recipe={item}
            onPress={() => router.push(`/recipe/${item.id}`)}
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.foreground,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border + '66',
  },
  listContent: {
    paddingHorizontal: 24,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.secondary,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 16,
  },
  row: {
    gap: 16,
    marginBottom: 16,
  },
  card: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border + '4D',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  cardImage: {
    width: '100%',
    height: 120,
  },
  cardBody: {
    padding: 12,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.foreground,
    marginBottom: 6,
  },
  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  metaText: {
    fontSize: 11,
    color: colors.mutedForeground,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  gradeBadge: {
    backgroundColor: colors.chart3 + '20',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignSelf: 'flex-start',
  },
  gradeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.chart3,
  },
});
