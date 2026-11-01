import type {
  AnswerRecord,
  Breakdown,
  Question,
  SessionQuestion,
  SessionSummary,
} from '../types';
import { TOPIC_LABELS } from './labels';

function ratio(correct: number, total: number): number {
  return total === 0 ? 0 : correct / total;
}

function breakdown(
  answers: readonly AnswerRecord[],
  questionsById: Map<string, Question>,
  keyOf: (question: Question) => string,
  labelOf: (key: string) => string,
): Breakdown[] {
  const buckets = new Map<string, { total: number; correct: number }>();

  for (const answer of answers) {
    const question = questionsById.get(answer.questionId);
    if (!question) continue;

    const key = keyOf(question);
    const bucket = buckets.get(key) ?? { total: 0, correct: 0 };
    bucket.total += 1;
    bucket.correct += answer.correct ? 1 : 0;
    buckets.set(key, bucket);
  }

  return [...buckets.entries()]
    .map(([key, { total, correct }]) => ({
      key,
      label: labelOf(key),
      total,
      correct,
      accuracy: ratio(correct, total),
    }))
    .sort((a, b) => a.accuracy - b.accuracy || b.total - a.total);
}

/**
 * Resumen de una sesión: puntaje global, desglose por tema y por etiqueta,
 * y la lista de errores con la opción elegida.
 */
export function summarize(
  answers: readonly AnswerRecord[],
  sessionQuestions: readonly SessionQuestion[],
): SessionSummary {
  const questionsById = new Map(
    sessionQuestions.map(({ question }) => [question.id, question] as const),
  );

  const correct = answers.filter((answer) => answer.correct).length;
  const total = answers.length;

  const mistakes = answers
    .filter((answer) => !answer.correct)
    .map((answer) => {
      const question = questionsById.get(answer.questionId);
      return question ? { question, selectedOptionId: answer.selectedOptionId } : null;
    })
    .filter((mistake): mistake is NonNullable<typeof mistake> => mistake !== null);

  return {
    total,
    correct,
    wrong: total - correct,
    accuracy: ratio(correct, total),
    byTopic: breakdown(
      answers,
      questionsById,
      (question) => question.topic,
      (key) => TOPIC_LABELS[key as keyof typeof TOPIC_LABELS] ?? key,
    ),
    byTag: breakdown(
      answers,
      questionsById,
      (question) => question.tag,
      (key) => key,
    ),
    mistakes,
  };
}

/** Mensaje corto según el puntaje. */
export function scoreMessage(accuracy: number, total: number): string {
  if (total === 0) return 'No hay respuestas para puntuar.';
  if (accuracy === 1) return 'Perfecto. Todo correcto.';
  if (accuracy >= 0.8) return 'Muy bien: tenés el tema claro.';
  if (accuracy >= 0.6) return 'Vas bien, pero hay un par de huecos.';
  if (accuracy >= 0.4) return 'A medio camino: conviene repasar los errores.';
  return 'Toca repasar: empezá por las preguntas falladas.';
}
