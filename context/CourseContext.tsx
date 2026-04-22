import React, { createContext, useContext, useState } from 'react';
import { COOKING_COURSES } from '../constants/data';

type CourseState = { progress: number; locked: boolean };
type CourseContextType = {
  courseStates: Record<string, CourseState>;
  completeCourse: (courseId: string) => void;
};

const COURSE_SEQUENCE = [
  'b1','b2','b3','b4','b5','b6','b7','b8','b9','b10',
  'i1','i2','i3','i4','i5','i6','i7','i8','i9','i10',
  'a1','a2','a3','a4','a5','a6','a7','a8','a9','a10',
];

const initialState: Record<string, CourseState> = {};
COOKING_COURSES.forEach((c) => {
  initialState[c.id] = { progress: c.progress, locked: c.locked ?? false };
});

const CourseContext = createContext<CourseContextType>({
  courseStates: initialState,
  completeCourse: () => {},
});

export function CourseProvider({ children }: { children: React.ReactNode }) {
  const [courseStates, setCourseStates] = useState<Record<string, CourseState>>(initialState);

  const completeCourse = (courseId: string) => {
    setCourseStates((prev) => {
      const next = { ...prev };
      next[courseId] = { ...next[courseId], progress: 1, locked: false };
      const idx = COURSE_SEQUENCE.indexOf(courseId);
      if (idx >= 0 && idx < COURSE_SEQUENCE.length - 1) {
        const nextId = COURSE_SEQUENCE[idx + 1];
        if (next[nextId]) next[nextId] = { ...next[nextId], locked: false };
      }
      return next;
    });
  };

  return (
    <CourseContext.Provider value={{ courseStates, completeCourse }}>
      {children}
    </CourseContext.Provider>
  );
}

export function useCourseContext() {
  return useContext(CourseContext);
}
