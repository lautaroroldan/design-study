import { create } from 'zustand';
import type {
  AnswerRecord,
  Question,
  SessionConfig,
  SessionQuestion,
} from '../types';
import { buildSession } from '../lib/session';

type SessionStatus = 'idle' | 'active' | 'finished';

interface SessionState {
  config: SessionConfig | null;
  questions: SessionQuestion[];
  currentIndex: number;
  answers: AnswerRecord[];
  status: SessionStatus;
  start: (config: SessionConfig, bank: readonly Question[]) => number;
  answer: (optionId: string) => void;
  next: () => void;
  reset: () => void;
}

export const useSessionStore = create<SessionState>((set, get) => ({
  config: null,
  questions: [],
  currentIndex: 0,
  answers: [],
  status: 'idle',

  /** Arranca una sesión y devuelve cuántas preguntas se armaron. */
  start: (config, bank) => {
    const questions = buildSession(bank, config);

    set({
      config,
      questions,
      currentIndex: 0,
      answers: [],
      status: questions.length > 0 ? 'active' : 'idle',
    });

    return questions.length;
  },

  answer: (optionId) => {
    const { questions, currentIndex, answers, status } = get();
    const current = questions[currentIndex];

    if (status !== 'active' || !current) return;
    if (answers.length > currentIndex) return;

    set({
      answers: [
        ...answers,
        {
          questionId: current.question.id,
          selectedOptionId: optionId,
          correct: optionId === current.question.correctOptionId,
        },
      ],
    });
  },

  next: () => {
    const { questions, currentIndex, answers, status } = get();

    if (status !== 'active') return;
    // No se puede avanzar sin responder la pregunta actual.
    if (answers.length <= currentIndex) return;

    if (currentIndex + 1 >= questions.length) {
      set({ status: 'finished' });
      return;
    }

    set({ currentIndex: currentIndex + 1 });
  },

  reset: () =>
    set({
      config: null,
      questions: [],
      currentIndex: 0,
      answers: [],
      status: 'idle',
    }),
}));
