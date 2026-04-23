import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { CourseProvider } from '../context/CourseContext';
import { OnboardingProvider } from '../context/OnboardingContext';
import { PlannerProvider } from '../context/PlannerContext';

export default function RootLayout() {
  useEffect(() => {
    AsyncStorage.removeItem('onboarding_complete').then(() => {
      router.replace('/onboarding' as never);
    });
  }, []);

  return (
    <SafeAreaProvider>
      <OnboardingProvider>
      <PlannerProvider>
      <CourseProvider>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false, animation: 'fade' }} />
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
      </OnboardingProvider>
    </SafeAreaProvider>
  );
}
