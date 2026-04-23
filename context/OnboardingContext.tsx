import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useState } from 'react';

export type SkillLevel = 'beginner' | 'novice' | 'comfortable' | 'advanced';
export type CookingFrequency = 'rarely' | 'sometimes' | 'often';
export type FamilySize = 'solo' | 'partner' | 'small' | 'large';

export type OnboardingAnswers = {
  skillLevel: SkillLevel | null;
  familySize: FamilySize | null;
  cookingFrequency: CookingFrequency | null;
  struggles: string[];
  goals: string[];
  commitment: 'browsing' | 'somewhat' | 'committed' | 'allin' | null;
  name: string;
  swapperResult: string;
  matchedLessonId: string;
};

type OnboardingContextType = {
  answers: OnboardingAnswers;
  setAnswer: <K extends keyof OnboardingAnswers>(key: K, value: OnboardingAnswers[K]) => void;
  completeOnboarding: () => Promise<void>;
  isOnboardingComplete: boolean;
  setOnboardingComplete: (v: boolean) => void;
};

const defaultAnswers: OnboardingAnswers = {
  skillLevel: null,
  familySize: null,
  cookingFrequency: null,
  struggles: [],
  goals: [],
  commitment: null,
  name: '',
  swapperResult: '',
  matchedLessonId: '',
};

const OnboardingContext = createContext<OnboardingContextType>({
  answers: defaultAnswers,
  setAnswer: () => {},
  completeOnboarding: async () => {},
  isOnboardingComplete: false,
  setOnboardingComplete: () => {},
});

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [answers, setAnswers] = useState<OnboardingAnswers>(defaultAnswers);
  const [isOnboardingComplete, setOnboardingComplete] = useState(false);

  const setAnswer = <K extends keyof OnboardingAnswers>(key: K, value: OnboardingAnswers[K]) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const completeOnboarding = async () => {
    await AsyncStorage.setItem('onboarding_complete', 'true');
    setOnboardingComplete(true);
  };

  return (
    <OnboardingContext.Provider value={{ answers, setAnswer, completeOnboarding, isOnboardingComplete, setOnboardingComplete }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  return useContext(OnboardingContext);
}

// Helpers for personalized copy
export function getWasteStat(familySize: FamilySize | null, frequency: CookingFrequency | null): string {
  const waste: Record<FamilySize, Record<CookingFrequency, number>> = {
    solo:    { rarely: 48,  sometimes: 32,  often: 18 },
    partner: { rarely: 89,  sometimes: 61,  often: 34 },
    small:   { rarely: 127, sometimes: 88,  often: 51 },
    large:   { rarely: 174, sometimes: 121, often: 72 },
  };
  if (!familySize || !frequency) return '$100';
  return `$${waste[familySize][frequency]}`;
}

export function getFamilyLabel(familySize: FamilySize | null): string {
  switch (familySize) {
    case 'solo':    return 'living solo';
    case 'partner': return 'cooking for two';
    case 'small':   return 'a family of 3';
    case 'large':   return 'a family of 5+';
    default:        return 'your household';
  }
}

export function getSkillLabel(skill: SkillLevel | null): string {
  switch (skill) {
    case 'beginner':   return 'just starting out';
    case 'novice':     return 'able to follow a recipe';
    case 'comfortable': return 'pretty comfortable';
    case 'advanced':   return 'an experienced cook';
    default:           return 'a home cook';
  }
}

export function getLessonPath(skill: SkillLevel | null): string {
  switch (skill) {
    case 'beginner':    return 'Kitchen Newcomer → Home Cook';
    case 'novice':      return 'Home Cook → Confident Cook';
    case 'comfortable': return 'Confident Cook → Skilled Chef';
    case 'advanced':    return 'Skilled Chef → Culinary Master';
    default:            return 'Kitchen Newcomer → Home Cook';
  }
}
