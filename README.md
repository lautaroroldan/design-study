# Design Study

App de estudio para practicar **Patrones GoF**, **Principios SOLID** y **Patrones
GRASP** con preguntas de opción múltiple, snippets de código y explicación de cada
distractor.

La especificación completa vive en [`../README.md`](../README.md).
Las decisiones tomadas donde la spec no definía nada están en
[`DECISIONS.md`](./DECISIONS.md).

## Estado

**Fase 1 (MVP) implementada.** 30 preguntas (10 por tema), tipos `concept` y
`find-violation`, código Java, sesión completa con feedback, resaltado de líneas
y resultados.

Modo mixto (Fase 2) y progreso en `localStorage` (Fase 3) están como pantallas
marcador de posición, sin lógica.

## Correr el proyecto

```bash
npm install
npm run dev
```

| Script | Qué hace |
| --- | --- |
| `npm run dev` | Servidor de desarrollo en `http://localhost:5173` |
| `npm run build` | Typecheck + build de producción |
| `npm run preview` | Sirve el build |
| `npm test` | Vitest (una pasada) |
| `npm run test:watch` | Vitest en watch |
| `npm run typecheck` | Solo `tsc --noEmit` |

## Estructura

```
src/
├── content/        # gof.ts, solid.ts, grasp.ts + índice con validación y metadatos
├── components/     # QuestionCard, CodeBlock, OptionList, SessionConfigPanel, primitivos
├── pages/          # Home, Section, Session, Results, Mixed, Progress, NotFound
├── store/          # estado de la sesión en curso (Zustand)
├── lib/            # armado de sesiones, scoring, esquema Zod, azar, etiquetas
├── test/           # setup de Vitest
└── types.ts
```

## Cómo agregar preguntas

1. Editá `src/content/gof.ts`, `solid.ts` o `grasp.ts`.
2. Cada pregunta tiene exactamente 4 opciones y una `correctOptionId`.
3. Completá `optionExplanations` para cada distractor (es lo que se muestra al
   responder).
4. Si tiene `code`, `highlightLines` se valida contra la cantidad de líneas del
   snippet.
5. `npm test` corre la validación de contenido: si una pregunta está mal formada,
   el test y la app fallan con el detalle del campo.

## Stack

React 18 + Vite + TypeScript, Tailwind CSS v4, React Router 6, Zustand, Zod,
`react-syntax-highlighter` (PrismLight) con `java` y `tsx`, Vitest + Testing
Library.
