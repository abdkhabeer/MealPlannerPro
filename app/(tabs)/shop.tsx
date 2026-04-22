import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radius } from '../../constants/theme';
import { SHOPPING_CATEGORIES, ShoppingItem } from '../../constants/data';

type Category = typeof SHOPPING_CATEGORIES[0] & { items: ShoppingItem[] };

export default function ShopScreen() {
  const [categories, setCategories] = useState<Category[]>(
    SHOPPING_CATEGORIES.map((c) => ({ ...c, items: c.items.map((i) => ({ ...i })) }))
  );
  const [newItem, setNewItem] = useState('');

  const toggleItem = (categoryId: string, itemId: string) => {
    setCategories((prev) =>
      prev.map((cat) => {
        if (cat.id !== categoryId) return cat;
        return {
          ...cat,
          items: cat.items.map((item) =>
            item.id === itemId ? { ...item, checked: !item.checked } : item
          ),
        };
      })
    );
  };

  const addCustomItem = () => {
    if (!newItem.trim()) return;
    const item: ShoppingItem = {
      id: Date.now().toString(),
      name: newItem.trim(),
      source: 'Custom',
      checked: false,
      category: 'pantry',
    };
    setCategories((prev) =>
      prev.map((cat) => {
        if (cat.id !== 'pantry') return cat;
        return { ...cat, items: [...cat.items, item] };
      })
    );
    setNewItem('');
  };

  const clearChecked = () => {
    Alert.alert('Clear Checked Items', 'Remove all checked items from the list?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear',
        style: 'destructive',
        onPress: () =>
          setCategories((prev) =>
            prev.map((cat) => ({ ...cat, items: cat.items.filter((i) => !i.checked) }))
          ),
      },
    ]);
  };

  const totalItems = categories.reduce((sum, c) => sum + c.items.length, 0);
  const checkedCount = categories.reduce(
    (sum, c) => sum + c.items.filter((i) => i.checked).length,
    0
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Sticky Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Shopping List</Text>
        <View style={styles.headerActions}>
          <Pressable style={styles.iconBtn}>
            <MaterialIcons name="sort" size={20} color={colors.foreground} />
          </Pressable>
          <Pressable style={styles.iconBtn} onPress={clearChecked}>
            <Ionicons name="trash-outline" size={20} color={colors.destructive} />
          </Pressable>
        </View>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Progress */}
        {totalItems > 0 && (
          <View style={styles.progressRow}>
            <View style={styles.progressBar}>
              <View
                style={[styles.progressFill, { width: `${(checkedCount / totalItems) * 100}%` }]}
              />
            </View>
            <Text style={styles.progressText}>
              {checkedCount}/{totalItems}
            </Text>
          </View>
        )}

        {/* Add Item */}
        <View style={styles.addBar}>
          <Ionicons name="add-circle" size={22} color={colors.primary} />
          <TextInput
            style={styles.addInput}
            placeholder="Add custom item..."
            placeholderTextColor={colors.mutedForeground}
            value={newItem}
            onChangeText={setNewItem}
            onSubmitEditing={addCustomItem}
            returnKeyType="done"
          />
        </View>

        {/* Categories */}
        {categories.map((category) => (
          <View key={category.id} style={styles.category}>
            <View style={styles.categoryHeader}>
              <View style={[styles.categoryIcon, { backgroundColor: category.bgColor }]}>
                <Text style={styles.categoryEmoji}>{category.emoji}</Text>
              </View>
              <Text style={styles.categoryLabel}>{category.label}</Text>
              <View style={styles.categoryDivider} />
              <Text style={styles.categoryCount}>{category.items.length} items</Text>
            </View>

            <View style={styles.itemsCard}>
              {category.items.map((item, index) => (
                <View key={item.id}>
                  <Pressable
                    style={[styles.itemRow, item.checked && styles.itemRowChecked]}
                    onPress={() => toggleItem(category.id, item.id)}
                  >
                    <View
                      style={[styles.checkbox, item.checked && styles.checkboxChecked]}
                    >
                      {item.checked && (
                        <Ionicons name="checkmark" size={14} color="#fff" />
                      )}
                    </View>
                    <View style={styles.itemInfo}>
                      <Text
                        style={[styles.itemName, item.checked && styles.itemNameChecked]}
                      >
                        {item.name}
                      </Text>
                      <Text style={styles.itemSource}>{item.source}</Text>
                    </View>
                  </Pressable>
                  {index < category.items.length - 1 && (
                    <View style={styles.itemDivider} />
                  )}
                </View>
              ))}
            </View>
          </View>
        ))}

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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 16,
    backgroundColor: 'rgba(245,239,228,0.8)',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border + '33',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.foreground,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  container: { flex: 1 },
  content: {
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: colors.muted,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.chart3,
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.mutedForeground,
    minWidth: 32,
    textAlign: 'right',
  },
  addBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 16,
    height: 56,
    borderWidth: 1,
    borderColor: colors.border + '66',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
    marginBottom: 32,
  },
  addInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: colors.foreground,
  },
  category: {
    marginBottom: 32,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  categoryIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryEmoji: {
    fontSize: 16,
  },
  categoryLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.secondary,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  categoryDivider: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border + '66',
  },
  categoryCount: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.mutedForeground,
  },
  itemsCard: {
    backgroundColor: '#fff',
    borderRadius: radius.lg,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  itemRowChecked: {
    opacity: 0.5,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.foreground,
    marginBottom: 2,
  },
  itemNameChecked: {
    textDecorationLine: 'line-through',
  },
  itemSource: {
    fontSize: 10,
    color: colors.mutedForeground,
  },
  itemDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border + '40',
    marginLeft: 56,
  },
});
