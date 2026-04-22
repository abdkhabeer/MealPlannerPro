import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { CourseProvider } from '../context/CourseContext';
import { PlannerProvider } from '../context/PlannerContext';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <PlannerProvider>
      <CourseProvider>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="recipe/[id]"
          options={{ headerShown: false, animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="smart-sub"
          options={{ headerShown: false, animation: 'slide_from_bottom' }}
        />
        <Stack.Screen
          name="lesson/[id]"
          options={{ headerShown: false, animation: 'slide_from_right' }}
        />
      </Stack>
      </CourseProvider>
      </PlannerProvider>
    </SafeAreaProvider>
  );
}
