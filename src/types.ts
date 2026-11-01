export type Topic = 'gof' | 'solid' | 'grasp';

export type QuestionType = 'concept' | 'identify-pattern' | 'find-violation' | 'choose-fix';

export type Lang = 'java' | 'tsx';

export type Difficulty = 1 | 2 | 3;

export interface CodeSnippet {
  language: Lang;
  source: string;
  /** Líneas (1-based) que se resaltan recién después de responder. */
  highlightLines?: number[];
}

export interface QuestionOption {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  topic: Topic;
  tag: string;
  type: QuestionType;
  difficulty: Difficulty;
  prompt: string;
  code?: CodeSnippet;
  /**
   * Variantes adicionales del snippet, una por lenguaje. `code` es la primaria.
   * Sirve para la misma pregunta en Java y en React: la UI muestra un selector.
   */
  codeVariants?: Partial<Record<Lang, CodeSnippet>>;
  /** Exactamente 4 opciones. */
  options: QuestionOption[];
  correctOptionId: string;
  explanation: string;
  optionExplanations?: Record<string, string>;
  /** Pista opcional que se muestra con la tecla H. */
  hint?: string;
}

/* ------------------------------- Sesión -------------------------------- */

export type QuestionCount = 5 | 10 | 20 | 'all';

export type DifficultyFilter = 'all' | Difficulty;

export type SessionOrder = 'random' | 'fixed';

export interface SessionConfig {
  topics: Topic[];
  /** Filtro opcional por etiqueta (una o varias). */
  tags?: string[];
  /** Filtro opcional por ids, para "repetir los errores". */
  questionIds?: string[];
  count: QuestionCount;
  type: QuestionType | 'all';
  lang: Lang | 'both';
  difficulty: DifficultyFilter;
  order: SessionOrder;
}

/** Una pregunta ya "armada" para la sesión, con las opciones mezcladas. */
export interface SessionQuestion {
  question: Question;
  options: QuestionOption[];
}

export interface AnswerRecord {
  questionId: string;
  selectedOptionId: string;
  correct: boolean;
}

export interface Mistake {
  question: Question;
  selectedOptionId: string;
}

export interface Breakdown {
  key: string;
  label: string;
  total: number;
  correct: number;
  accuracy: number;
}

export interface SessionSummary {
  total: number;
  correct: number;
  wrong: number;
  /** 0..1 */
  accuracy: number;
  byTopic: Breakdown[];
  byTag: Breakdown[];
  mistakes: Mistake[];
}
