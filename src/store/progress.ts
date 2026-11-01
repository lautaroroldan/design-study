import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ProgressMap, QuestionProgress } from '../lib/progress';

export const PROGRESS_STORAGE_KEY = 'design-study:progress';

interface ProgressState {
  questions: ProgressMap;
  /** Registra un intento. Se llama al responder, no al armar la sesión. */
  record: (questionId: string, correct: boolean, at?: Date) => void;
  reset: () => void;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set) => ({
      questions: {},

      record: (questionId, correct, at = new Date()) =>
        set((state) => {
          const previous = state.questions[questionId];

          const next: QuestionProgress = {
            attempts: (previous?.attempts ?? 0) + 1,
            correct: (previous?.correct ?? 0) + (correct ? 1 : 0),
            lastCorrect: correct,
            lastAttemptAt: at.toISOString(),
          };

          return { questions: { ...state.questions, [questionId]: next } };
        }),

      reset: () => set({ questions: {} }),
    }),
    {
      name: PROGRESS_STORAGE_KEY,
      version: 1,
    },
  ),
);
