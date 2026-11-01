import type { Question, Topic } from '../types';

export interface QuestionProgress {
  attempts: number;
  correct: number;
  lastCorrect: boolean;
  /** ISO 8601 */
  lastAttemptAt: string;
}

export type ProgressMap = Record<string, QuestionProgress>;

export interface Accuracy {
  attempts: number;
  correct: number;
  /** 0..1 */
  accuracy: number;
}

export interface GroupStat extends Accuracy {
  key: string;
  totalQuestions: number;
  practiced: number;
}

function ratio(correct: number, attempts: number): number {
  return attempts === 0 ? 0 : correct / attempts;
}

export function questionProgress(
  progress: ProgressMap,
  questionId: string,
): QuestionProgress | null {
  return progress[questionId] ?? null;
}

/** Suma intentos y aciertos de un conjunto de preguntas. */
export function accuracyOf(
  questions: readonly Question[],
  progress: ProgressMap,
): Accuracy {
  let attempts = 0;
  let correct = 0;

  for (const question of questions) {
    const entry = progress[question.id];
    if (!entry) continue;
    attempts += entry.attempts;
    correct += entry.correct;
  }

  return { attempts, correct, accuracy: ratio(correct, attempts) };
}

function groupBy(
  questions: readonly Question[],
  progress: ProgressMap,
  keyOf: (question: Question) => string,
): GroupStat[] {
  const buckets = new Map<
    string,
    { questions: number; practiced: number; attempts: number; correct: number }
  >();

  for (const question of questions) {
    const key = keyOf(question);
    const bucket = buckets.get(key) ?? {
      questions: 0,
      practiced: 0,
      attempts: 0,
      correct: 0,
    };

    bucket.questions += 1;

    const entry = progress[question.id];
    if (entry) {
      bucket.practiced += 1;
      bucket.attempts += entry.attempts;
      bucket.correct += entry.correct;
    }

    buckets.set(key, bucket);
  }

  return [...buckets.entries()].map(([key, bucket]) => ({
    key,
    totalQuestions: bucket.questions,
    practiced: bucket.practiced,
    attempts: bucket.attempts,
    correct: bucket.correct,
    accuracy: ratio(bucket.correct, bucket.attempts),
  }));
}

export function byTopic(
  questions: readonly Question[],
  progress: ProgressMap,
): GroupStat[] {
  return groupBy(questions, progress, (question) => question.topic);
}

export function byTag(
  questions: readonly Question[],
  progress: ProgressMap,
): GroupStat[] {
  return groupBy(questions, progress, (question) => question.tag);
}

/**
 * Etiquetas con intentos, de peor a mejor acierto.
 * Solo entran las que tienen al menos un intento: una etiqueta sin practicar
 * no es "débil", es desconocida.
 */
export function weakestTags(
  questions: readonly Question[],
  progress: ProgressMap,
  limit = 5,
): GroupStat[] {
  return byTag(questions, progress)
    .filter((stat) => stat.attempts > 0)
    .sort((a, b) => a.accuracy - b.accuracy || b.attempts - a.attempts)
    .slice(0, limit);
}

/** Resumen global de la app. */
export function overallStats(
  questions: readonly Question[],
  progress: ProgressMap,
): Accuracy & { totalQuestions: number; practiced: number } {
  const { attempts, correct, accuracy } = accuracyOf(questions, progress);

  return {
    totalQuestions: questions.length,
    practiced: questions.filter((question) => progress[question.id]).length,
    attempts,
    correct,
    accuracy,
  };
}

/**
 * Preguntas cuyo último intento fue incorrecto.
 * Si después la acertás, sale de la lista: "las que fallé" es lo que sigue
 * pendiente, no un historial de errores.
 */
export function failedQuestions(
  questions: readonly Question[],
  progress: ProgressMap,
): Question[] {
  return questions.filter((question) => progress[question.id]?.lastCorrect === false);
}

export function failedQuestionIds(progress: ProgressMap): string[] {
  return Object.entries(progress)
    .filter(([, entry]) => entry.lastCorrect === false)
    .map(([id]) => id);
}

/** Filtra las preguntas por tema, para "solo las que fallé" del modo mixto. */
export function filterQuestionsByTopics(
  questions: readonly Question[],
  topics: readonly Topic[],
): Question[] {
  return questions.filter((question) => topics.includes(question.topic));
}
