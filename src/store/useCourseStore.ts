import { create } from 'zustand';

interface CourseState {
  currentLessonId: string | null;
  currentStepIndex: number;
  completedLessons: string[]; // IDs of completed lessons

  // Actions
  startLesson: (lessonId: string) => void;
  nextStep: () => void;
  prevStep: () => void;
  completeLesson: () => void;
  resetProgress: () => void;
}

export const useCourseStore = create<CourseState>((set) => ({
  currentLessonId: null,
  currentStepIndex: 0,
  completedLessons: [],

  startLesson: (lessonId) => set({
    currentLessonId: lessonId,
    currentStepIndex: 0
  }),

  nextStep: () => set((state) => ({
    currentStepIndex: state.currentStepIndex + 1
  })),

  prevStep: () => set((state) => ({
    currentStepIndex: Math.max(0, state.currentStepIndex - 1)
  })),

  completeLesson: () => set((state) => {
    if (state.currentLessonId && !state.completedLessons.includes(state.currentLessonId)) {
      return {
        completedLessons: [...state.completedLessons, state.currentLessonId],
        currentLessonId: null,
        currentStepIndex: 0
      };
    }
    return {
        currentLessonId: null,
        currentStepIndex: 0
    };
  }),

  resetProgress: () => set({ completedLessons: [], currentLessonId: null, currentStepIndex: 0 }),
}));
