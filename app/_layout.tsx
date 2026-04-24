import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { ImageBackground, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { CourseProvider } from '../context/CourseContext';
import { OnboardingProvider } from '../context/OnboardingContext';
import { PlannerProvider } from '../context/PlannerContext';

const WALLPAPER = 'https://images.unsplash.com/photo-1543353071-873f17a7a088?w=1200&q=80';

export default function RootLayout() {
  useEffect(() => {
    AsyncStorage.removeItem('onboarding_complete').then(() => {
      router.replace('/onboarding' as never);
    });
  }, []);

  return (
    <ImageBackground source={{ uri: WALLPAPER }} style={styles.root} imageStyle={styles.wallpaper}>
      <SafeAreaProvider style={styles.transparent}>
        <OnboardingProvider>
        <PlannerProvider>
        <CourseProvider>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: 'transparent' },
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="onboarding" options={{ headerShown: false, animation: 'fade' }} />
          <Stack.Screen name="recipe/[id]" options={{ headerShown: false, animation: 'slide_from_right' }} />
          <Stack.Screen name="smart-sub" options={{ headerShown: false, animation: 'slide_from_bottom' }} />
          <Stack.Screen name="lesson/[id]" options={{ headerShown: false, animation: 'slide_from_right' }} />
        </Stack>
        </CourseProvider>
        </PlannerProvider>
        </OnboardingProvider>
      </SafeAreaProvider>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  transparent: { flex: 1, backgroundColor: 'transparent' },
  wallpaper: {
    opacity: 0.25,
    resizeMode: 'cover',
  },
});
