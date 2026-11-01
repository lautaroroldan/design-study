import type { Question, SessionConfig, SessionQuestion } from '../types';
import { availableLangs } from './code';
import { shuffle, type Rng } from './random';

/**
 * Filtra el banco de preguntas según la configuración de sesión.
 *
 * - `topics` vacío no devuelve nada (la UI no permite empezar sin tema).
 * - El filtro de lenguaje se aplica solo a preguntas con código: una pregunta
 *   conceptual no está atada a Java ni a React.
 */
export function filterQuestions(
  questions: readonly Question[],
  config: Pick<
    SessionConfig,
    'topics' | 'tags' | 'questionIds' | 'type' | 'lang' | 'difficulty'
  >,
): Question[] {
  if (config.topics.length === 0) return [];

  const tags = config.tags ?? [];
  const ids = config.questionIds;

  return questions.filter((question) => {
    if (!config.topics.includes(question.topic)) return false;
    if (tags.length > 0 && !tags.includes(question.tag)) return false;
    if (ids && !ids.includes(question.id)) return false;
    if (config.type !== 'all' && question.type !== config.type) return false;

    if (config.difficulty !== 'all' && question.difficulty !== config.difficulty) {
      return false;
    }

    if (config.lang !== 'both') {
      const langs = availableLangs(question);
      // Las preguntas conceptuales no están atadas a un lenguaje.
      if (langs.length > 0 && !langs.includes(config.lang)) return false;
    }

    return true;
  });
}

/**
 * Arma la sesión: filtra, ordena, recorta y mezcla las opciones de cada pregunta.
 *
 * El `rng` es inyectable para que los tests sean determinísticos.
 */
export function buildSession(
  questions: readonly Question[],
  config: SessionConfig,
  rng: Rng = Math.random,
): SessionQuestion[] {
  const pool = filterQuestions(questions, config);
  const ordered = config.order === 'random' ? shuffle(pool, rng) : [...pool];
  const limited = config.count === 'all' ? ordered : ordered.slice(0, config.count);

  return limited.map((question) => ({
    question,
    options: shuffle(question.options, rng),
  }));
}

/** Cuántas preguntas hay disponibles con esta configuración (sin recortar). */
export function countAvailable(
  questions: readonly Question[],
  config: Pick<SessionConfig, 'topics' | 'tags' | 'type' | 'lang' | 'difficulty'>,
): number {
  return filterQuestions(questions, config).length;
}
