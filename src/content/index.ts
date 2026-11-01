import type { Question, Topic } from '../types';
import { parseQuestionFile } from '../lib/schema';
import { gofQuestions } from './gof';
import { graspQuestions } from './grasp';
import { solidQuestions } from './solid';

export interface TopicMeta {
  slug: Topic;
  order: string;
  title: string;
  short: string;
  intro: string;
  /** Qué se practica en la sección, en una línea. */
  focus: string;
}

export const TOPIC_META: Record<Topic, TopicMeta> = {
  gof: {
    slug: 'gof',
    order: '01',
    title: 'Patrones GoF',
    short: 'GoF',
    intro:
      'Los patrones de diseño del libro de la Banda de los Cuatro: soluciones con nombre propio a problemas de creación, estructura y comportamiento entre objetos.',
    focus: 'Identificá qué patrón resuelve el problema y por qué los parecidos no aplican.',
  },
  solid: {
    slug: 'solid',
    order: '02',
    title: 'Principios SOLID',
    short: 'SOLID',
    intro:
      'Cinco principios para que el código sea fácil de cambiar: una responsabilidad por módulo, abierto a extensión, sustituible, con interfaces chicas y dependencias hacia abstracciones.',
    focus: 'Encontrá la violación en el snippet y elegí la corrección con mejor fundamento.',
  },
  grasp: {
    slug: 'grasp',
    order: '03',
    title: 'Patrones GRASP',
    short: 'GRASP',
    intro:
      'Nueve criterios para repartir responsabilidades entre objetos: quién sabe, quién crea, quién coordina y cómo mantener bajo el acoplamiento.',
    focus: 'Decidí a quién le corresponde cada responsabilidad y qué patrón lo justifica.',
  },
};

export const TOPICS: Topic[] = ['gof', 'solid', 'grasp'];

/** Orden canónico del README, para mostrar etiquetas siempre en el mismo orden. */
export const CANONICAL_TAGS: Record<Topic, string[]> = {
  gof: [
    'Singleton',
    'Factory Method',
    'Abstract Factory',
    'Builder',
    'Prototype',
    'Adapter',
    'Decorator',
    'Facade',
    'Composite',
    'Proxy',
    'Bridge',
    'Observer',
    'Strategy',
    'Command',
    'State',
    'Template Method',
    'Iterator',
    'Chain of Responsibility',
  ],
  solid: ['SRP', 'OCP', 'LSP', 'ISP', 'DIP'],
  grasp: [
    'Information Expert',
    'Creator',
    'Controller',
    'Low Coupling',
    'High Cohesion',
    'Polymorphism',
    'Pure Fabrication',
    'Indirection',
    'Protected Variations',
  ],
};

export type ContentLoadResult =
  | { ok: true; questions: Question[] }
  | { ok: false; error: string };

function loadContent(): ContentLoadResult {
  try {
    const questions = [
      ...parseQuestionFile(gofQuestions, 'gof.ts'),
      ...parseQuestionFile(solidQuestions, 'solid.ts'),
      ...parseQuestionFile(graspQuestions, 'grasp.ts'),
    ];

    const seen = new Map<string, string>();
    for (const question of questions) {
      const previous = seen.get(question.id);
      if (previous) {
        throw new Error(
          `Id duplicado: "${question.id}" aparece en ${previous} y en otra pregunta.`,
        );
      }
      seen.set(question.id, question.topic);
    }

    if (questions.length === 0) {
      throw new Error('No hay preguntas cargadas en src/content.');
    }

    return { ok: true, questions };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

const content = loadContent();

/** Error de validación del contenido, si lo hay. La app lo muestra en pantalla. */
export const contentError = content.ok ? null : content.error;

export const allQuestions: Question[] = content.ok ? content.questions : [];

export function questionsByTopic(topic: Topic): Question[] {
  return allQuestions.filter((question) => question.topic === topic);
}

export function tagsForTopic(topic: Topic): { tag: string; total: number }[] {
  const counts = new Map<string, number>();

  for (const question of questionsByTopic(topic)) {
    counts.set(question.tag, (counts.get(question.tag) ?? 0) + 1);
  }

  const canonical = CANONICAL_TAGS[topic];
  const ordered = [
    ...canonical.filter((tag) => counts.has(tag)),
    ...[...counts.keys()].filter((tag) => !canonical.includes(tag)),
  ];

  return ordered.map((tag) => ({ tag, total: counts.get(tag) ?? 0 }));
}
