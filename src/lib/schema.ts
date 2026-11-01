import { z } from 'zod';
import type { Question } from '../types';

export const topicSchema = z.enum(['gof', 'solid', 'grasp']);

export const questionTypeSchema = z.enum([
  'concept',
  'identify-pattern',
  'find-violation',
  'choose-fix',
]);

export const langSchema = z.enum(['java', 'tsx']);

const optionSchema = z.object({
  id: z.string().min(1),
  text: z.string().min(1),
});

const codeSchema = z.object({
  language: langSchema,
  source: z.string().min(1),
  highlightLines: z.array(z.number().int().positive()).min(1).optional(),
});

export const questionSchema = z
  .object({
    id: z.string().min(1),
    topic: topicSchema,
    tag: z.string().min(1),
    type: questionTypeSchema,
    difficulty: z.union([z.literal(1), z.literal(2), z.literal(3)]),
    prompt: z.string().min(1),
    code: codeSchema.optional(),
    options: z.array(optionSchema).length(4),
    correctOptionId: z.string().min(1),
    explanation: z.string().min(1),
    optionExplanations: z.record(z.string(), z.string()).optional(),
    hint: z.string().min(1).optional(),
  })
  .superRefine((question, ctx) => {
    const optionIds = question.options.map((option) => option.id);

    if (new Set(optionIds).size !== optionIds.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['options'],
        message: 'los ids de las opciones no se pueden repetir',
      });
    }

    if (!optionIds.includes(question.correctOptionId)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['correctOptionId'],
        message: `"${question.correctOptionId}" no es el id de ninguna opción`,
      });
    }

    if (question.optionExplanations) {
      const unknownIds = Object.keys(question.optionExplanations).filter(
        (id) => !optionIds.includes(id),
      );
      if (unknownIds.length > 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['optionExplanations'],
          message: `explica opciones que no existen: ${unknownIds.join(', ')}`,
        });
      }
    }

    if (question.type !== 'concept' && !question.code) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['code'],
        message: `el tipo "${question.type}" necesita un snippet de código`,
      });
    }

    if (question.code?.highlightLines) {
      const lineCount = question.code.source.split('\n').length;
      const outOfRange = question.code.highlightLines.filter(
        (line) => line > lineCount,
      );
      if (outOfRange.length > 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['code', 'highlightLines'],
          message: `hay líneas resaltadas fuera del snippet (${lineCount} líneas): ${outOfRange.join(', ')}`,
        });
      }
    }
  });

const fileSchema = z.array(questionSchema);

/**
 * Valida un archivo de contenido y devuelve las preguntas tipadas.
 * Si algo está mal, el error dice archivo, índice y qué campo corregir.
 */
export function parseQuestionFile(raw: unknown, fileName: string): Question[] {
  const result = fileSchema.safeParse(raw);

  if (!result.success) {
    const details = result.error.issues
      .map((issue) => {
        const [index, ...path] = issue.path;
        const location =
          typeof index === 'number'
            ? `pregunta #${index + 1}${path.length > 0 ? ` → ${path.join('.')}` : ''}`
            : 'archivo';
        return `  · ${location}: ${issue.message}`;
      })
      .join('\n');

    throw new Error(
      `Contenido inválido en "${fileName}":\n${details}\n\nRevisá src/content/${fileName} contra el modelo de datos del README.`,
    );
  }

  return result.data as Question[];
}
