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

type SnippetIssueContext = z.RefinementCtx;
type SnippetPath = (string | number)[];

/** Valida cantidades y rangos de un snippet; se usa para `code` y sus variantes. */
function checkSnippet(
  snippet: { source: string; highlightLines?: number[] },
  path: SnippetPath,
  ctx: SnippetIssueContext,
) {
  if (!snippet.highlightLines) return;

  const lineCount = snippet.source.split('\n').length;
  const outOfRange = snippet.highlightLines.filter((line) => line > lineCount);

  if (outOfRange.length > 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: [...path, 'highlightLines'],
      message: `hay líneas resaltadas fuera del snippet (${lineCount} líneas): ${outOfRange.join(', ')}`,
    });
  }
}

export const questionSchema = z
  .object({
    id: z.string().min(1),
    topic: topicSchema,
    tag: z.string().min(1),
    type: questionTypeSchema,
    difficulty: z.union([z.literal(1), z.literal(2), z.literal(3)]),
    prompt: z.string().min(1),
    code: codeSchema.optional(),
    codeVariants: z.record(langSchema, codeSchema).optional(),
    options: z.array(optionSchema).length(4, 'debe tener exactamente 4 opciones'),
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

    if (question.code) {
      checkSnippet(question.code, ['code'], ctx);
    }

    if (question.codeVariants) {
      const variantLangs = Object.keys(question.codeVariants);

      if (variantLangs.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['codeVariants'],
          message: 'si existe codeVariants, debe tener al menos una variante',
        });
      }

      for (const [lang, snippet] of Object.entries(question.codeVariants)) {
        if (!snippet) continue;

        if (snippet.language !== lang) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['codeVariants', lang, 'language'],
            message: `el lenguaje del snippet debe coincidir con la clave "${lang}"`,
          });
        }

        checkSnippet(snippet, ['codeVariants', lang], ctx);
      }

      if (question.code && question.codeVariants[question.code.language]) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['codeVariants', question.code.language],
          message: `repite el lenguaje de "code" (${question.code.language}); usá una clave distinta`,
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
