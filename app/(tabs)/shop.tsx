import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Alert,
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
import { SHOPPING_CATEGORIES, ShoppingItem } from '../../constants/data';

type Category = typeof SHOPPING_CATEGORIES[0] & { items: ShoppingItem[] };

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  produce: [
    'apple', 'banana', 'tomato', 'onion', 'garlic', 'lemon', 'lime', 'orange', 'avocado',
    'spinach', 'lettuce', 'kale', 'broccoli', 'carrot', 'potato', 'pepper', 'cucumber',
    'zucchini', 'mushroom', 'celery', 'ginger', 'cilantro', 'parsley', 'basil', 'mint',
    'herb', 'berry', 'strawberry', 'blueberry', 'raspberry', 'grape', 'mango', 'pineapple',
    'watermelon', 'melon', 'peach', 'pear', 'plum', 'cherry', 'corn', 'asparagus',
    'eggplant', 'squash', 'pumpkin', 'cabbage', 'cauliflower', 'beet', 'radish', 'leek',
    'shallot', 'scallion', 'arugula', 'fennel', 'chard', 'chive', 'dill', 'thyme',
    'rosemary', 'sage', 'oregano', 'chilli', 'chili', 'jalapeño', 'jalapeno', 'sweet potato',
    'butternut', 'courgette', 'aubergine', 'spring onion', 'bok choy',
  ],
  dairy: [
    'milk', 'cream', 'butter', 'cheese', 'yogurt', 'yoghurt', 'egg', 'eggs',
    'mozzarella', 'cheddar', 'parmesan', 'brie', 'feta', 'ricotta', 'cottage',
    'sour cream', 'half and half', 'whipping', 'ghee', 'kefir', 'custard',
  ],
  meat: [
    'chicken', 'beef', 'pork', 'lamb', 'turkey', 'salmon', 'shrimp', 'prawn',
    'fish', 'cod', 'tilapia', 'bass', 'steak', 'mince', 'ground beef', 'ground turkey',
    'bacon', 'ham', 'sausage', 'duck', 'veal', 'venison', 'bison', 'crab', 'lobster',
    'scallop', 'anchovy', 'sardine', 'halibut', 'trout', 'snapper', 'tuna steak',
    'pork chop', 'pork loin', 'rib', 'brisket', 'sirloin', 'fillet', 'meatball',
  ],
};

function inferCategory(name: string): string {
  const lower = name.toLowerCase();
  for (const [categoryId, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some((kw) => lower.includes(kw))) return categoryId;
  }
  return 'pantry';
}

const QUICK_ADD_SECTIONS = [
  {
    label: 'Produce',
    categoryId: 'produce',
    emoji: '🥦',
    items: ['Bananas', 'Apples', 'Tomatoes', 'Onions', 'Garlic', 'Lemons', 'Avocado', 'Broccoli', 'Carrots', 'Baby Spinach', 'Bell Peppers', 'Potatoes'],
  },
  {
    label: 'Pantry',
    categoryId: 'pantry',
    emoji: '🫙',
    items: ['Olive Oil', 'Salt', 'Black Pepper', 'Flour', 'Sugar', 'Rice', 'Pasta', 'Canned Tomatoes', 'Tuna (canned)', 'Chicken Stock', 'Bread', 'Oats', 'Honey'],
  },
  {
    label: 'Dairy & Eggs',
    categoryId: 'dairy',
    emoji: '🥛',
    items: ['Eggs', 'Milk', 'Butter', 'Cheddar Cheese', 'Greek Yogurt', 'Heavy Cream', 'Sour Cream'],
  },
  {
    label: 'Meat & Fish',
    categoryId: 'meat',
    emoji: '🥩',
    items: ['Chicken Breast', 'Ground Beef', 'Salmon', 'Bacon', 'Shrimp', 'Pork Chops', 'Lamb Mince', 'Cod Fillet'],
  },
];

export default function ShopScreen() {
  const insets = useSafeAreaInsets();
  const [categories, setCategories] = useState<Category[]>(
    SHOPPING_CATEGORIES.map((c) => ({ ...c, items: c.items.map((i) => ({ ...i })) }))
  );
  const [newItem, setNewItem] = useState('');
  const [quickAddVisible, setQuickAddVisible] = useState(false);
  const [selectedQuickItems, setSelectedQuickItems] = useState<Set<string>>(new Set());

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
    const categoryId = inferCategory(newItem.trim());
    const item: ShoppingItem = {
      id: Date.now().toString(),
      name: newItem.trim(),
      source: 'Custom',
      checked: false,
      category: categoryId,
    };
    setCategories((prev) =>
      prev.map((cat) => {
        if (cat.id !== categoryId) return cat;
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

  const toggleQuickItem = (name: string) => {
    setSelectedQuickItems((prev) => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });
  };

  const confirmQuickAdd = () => {
    if (selectedQuickItems.size === 0) return;
    setCategories((prev) => {
      let next = prev.map((cat) => ({ ...cat, items: [...cat.items] }));
      QUICK_ADD_SECTIONS.forEach((section) => {
        section.items.forEach((name) => {
          if (!selectedQuickItems.has(name)) return;
          const targetCat = next.find((c) => c.id === section.categoryId) ?? next[1];
          const alreadyExists = targetCat.items.some(
            (i) => i.name.toLowerCase() === name.toLowerCase()
          );
          if (!alreadyExists) {
            targetCat.items.push({
              id: `qa-${Date.now()}-${name}`,
              name,
              source: 'Quick Add',
              checked: false,
              category: targetCat.id,
            });
          }
        });
      });
      return next;
    });
    setSelectedQuickItems(new Set());
    setQuickAddVisible(false);
  };

  const totalItems = categories.reduce((sum, c) => sum + c.items.length, 0);
  const checkedCount = categories.reduce(
    (sum, c) => sum + c.items.filter((i) => i.checked).length,
    0
  );

  return (
    <WallpaperBackground>
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Sticky Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Shopping List</Text>
        <View style={styles.headerActions}>
          <Pressable style={styles.iconBtn} onPress={() => { setSelectedQuickItems(new Set()); setQuickAddVisible(true); }}>
            <Ionicons name="flash-outline" size={20} color={colors.foreground} />
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

    {/* Quick Add Modal */}
    <Modal visible={quickAddVisible} animationType="slide" transparent onRequestClose={() => setQuickAddVisible(false)}>
      <Pressable style={styles.modalBackdrop} onPress={() => setQuickAddVisible(false)} />
      <View style={[styles.modalSheet, { paddingBottom: insets.bottom + 24 }]}>
        <View style={styles.modalHandle} />
        <View style={styles.modalHeader}>
          <View>
            <Text style={styles.modalTitle}>Quick Add</Text>
            <Text style={styles.modalSub}>Tap items to add to your list</Text>
          </View>
          <Pressable onPress={() => setQuickAddVisible(false)} style={styles.modalClose}>
            <Ionicons name="close" size={20} color={colors.foreground} />
          </Pressable>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} style={styles.modalScroll}>
          {QUICK_ADD_SECTIONS.map((section) => (
            <View key={section.label} style={styles.quickSection}>
              <Text style={styles.quickSectionLabel}>{section.emoji}  {section.label}</Text>
              <View style={styles.quickChips}>
                {section.items.map((name) => {
                  const selected = selectedQuickItems.has(name);
                  return (
                    <Pressable
                      key={name}
                      onPress={() => toggleQuickItem(name)}
                      style={[styles.chip, selected && styles.chipSelected]}
                    >
                      {selected && <Ionicons name="checkmark" size={12} color="#fff" style={{ marginRight: 4 }} />}
                      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{name}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          ))}
          <View style={{ height: 16 }} />
        </ScrollView>

        <Pressable
          style={[styles.addBtn, selectedQuickItems.size === 0 && styles.addBtnDisabled]}
          onPress={confirmQuickAdd}
          disabled={selectedQuickItems.size === 0}
        >
          <Text style={styles.addBtnText}>
            {selectedQuickItems.size === 0 ? 'Select items to add' : `Add ${selectedQuickItems.size} item${selectedQuickItems.size !== 1 ? 's' : ''} to list`}
          </Text>
        </Pressable>
      </View>
    </Modal>

    </WallpaperBackground>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 16,
    backgroundColor: 'rgba(245,239,228,0.55)',
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
    backgroundColor: 'rgba(255,255,255,0.88)',
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
    backgroundColor: 'rgba(255,255,255,0.88)',
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
  // Modal
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  modalSheet: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 12,
    maxHeight: '80%',
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
    fontSize: 18,
    fontWeight: '700',
    color: colors.foreground,
    marginBottom: 2,
  },
  modalSub: {
    fontSize: 13,
    color: colors.mutedForeground,
  },
  modalClose: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.muted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalScroll: {
    flexGrow: 0,
  },
  quickSection: {
    marginBottom: 20,
  },
  quickSectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.secondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 10,
  },
  quickChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: colors.muted,
    borderWidth: 1,
    borderColor: colors.border + '66',
  },
  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.foreground,
  },
  chipTextSelected: {
    color: '#ffffff',
    fontWeight: '600',
  },
  addBtn: {
    marginTop: 16,
    height: 52,
    borderRadius: 999,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnDisabled: {
    opacity: 0.4,
  },
  addBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
  },
});
