import React, { createContext, useContext, useState } from 'react';
import { RECIPES } from '../constants/data';

type Recipe = typeof RECIPES[0];

export type MealSlot = {
  breakfast: Recipe | null;
  lunch: Recipe | null;
  dinner: Recipe | null;
};

export type WeekPlans = Record<string, MealSlot>;

export const EMPTY_SLOT: MealSlot = { breakfast: null, lunch: null, dinner: null };

type PlannerContextType = {
  weekPlans: WeekPlans;
  pendingRecipe: Recipe | null;
  setPendingRecipe: (recipe: Recipe | null) => void;
  addToSlot: (dateKey: string, slot: keyof MealSlot, recipe: Recipe) => void;
  removeFromSlot: (dateKey: string, slot: keyof MealSlot) => void;
};

const PlannerContext = createContext<PlannerContextType>({
  weekPlans: {},
  pendingRecipe: null,
  setPendingRecipe: () => {},
  addToSlot: () => {},
  removeFromSlot: () => {},
});

export function PlannerProvider({ children }: { children: React.ReactNode }) {
  const [weekPlans, setWeekPlans] = useState<WeekPlans>({});
  const [pendingRecipe, setPendingRecipe] = useState<Recipe | null>(null);

  const addToSlot = (dateKey: string, slot: keyof MealSlot, recipe: Recipe) => {
    setWeekPlans((prev) => ({
      ...prev,
      [dateKey]: { ...(prev[dateKey] ?? EMPTY_SLOT), [slot]: recipe },
    }));
  };

  const removeFromSlot = (dateKey: string, slot: keyof MealSlot) => {
    setWeekPlans((prev) => ({
      ...prev,
      [dateKey]: { ...(prev[dateKey] ?? EMPTY_SLOT), [slot]: null },
    }));
  };

  return (
    <PlannerContext.Provider value={{ weekPlans, pendingRecipe, setPendingRecipe, addToSlot, removeFromSlot }}>
      {children}
    </PlannerContext.Provider>
  );
}

export function usePlannerContext() {
  return useContext(PlannerContext);
}
