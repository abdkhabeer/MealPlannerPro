import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../constants/theme';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

type TabIcon = {
  active: React.ComponentProps<typeof Ionicons>['name'] | string;
  inactive: React.ComponentProps<typeof Ionicons>['name'] | string;
  label: string;
  library?: 'Ionicons' | 'MaterialIcons';
};

const TAB_CONFIG: Record<string, TabIcon> = {
  index: {
    active: 'compass',
    inactive: 'compass-outline',
    label: 'Discover',
  },
  planner: {
    active: 'calendar',
    inactive: 'calendar-outline',
    label: 'Planner',
  },
  school: {
    active: 'restaurant',
    inactive: 'restaurant-outline',
    label: 'School',
  },
  shop: {
    active: 'cart',
    inactive: 'cart-outline',
    label: 'Shop',
  },
  library: {
    active: 'book',
    inactive: 'book-outline',
    label: 'Library',
  },
};

function TabIcon({ name, size, color, library = 'Ionicons' }: {
  name: string;
  size: number;
  color: string;
  library?: 'Ionicons' | 'MaterialIcons';
}) {
  if (library === 'MaterialIcons') {
    return <MaterialIcons name={name as any} size={size} color={color} />;
  }
  return <Ionicons name={name as any} size={size} color={color} />;
}

export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrapper, { paddingBottom: insets.bottom }]}>
      <View style={styles.container}>
        {state.routes.map((route, index) => {
          const config = TAB_CONFIG[route.name] ?? {
            active: 'ellipse',
            inactive: 'ellipse-outline',
            label: route.name,
          };
          const isFocused = state.index === index;
          const { options } = descriptors[route.key];

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              style={styles.tab}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
            >
              <TabIcon
                name={isFocused ? config.active : config.inactive}
                size={24}
                color={isFocused ? colors.primary : colors.mutedForeground}
              />
              <Text style={[styles.label, { color: isFocused ? colors.primary : colors.mutedForeground }]}>
                {config.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 8,
  },
  container: {
    flexDirection: 'row',
    height: 64,
    paddingHorizontal: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  label: {
    fontSize: 10,
    fontWeight: '500',
  },
});
