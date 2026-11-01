import type { Difficulty, Lang, QuestionType, Topic } from '../types';

export const TOPIC_LABELS: Record<Topic, string> = {
  gof: 'Patrones GoF',
  solid: 'Principios SOLID',
  grasp: 'Patrones GRASP',
};

export const TOPIC_SHORT_LABELS: Record<Topic, string> = {
  gof: 'GoF',
  solid: 'SOLID',
  grasp: 'GRASP',
};

export const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
  concept: 'Concepto',
  'identify-pattern': 'Identificar patrón',
  'find-violation': 'Encontrar la violación',
  'choose-fix': 'Elegir la corrección',
};

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  1: 'Básica',
  2: 'Media',
  3: 'Difícil',
};

export const LANG_LABELS: Record<Lang, string> = {
  java: 'Java',
  tsx: 'React',
};
