# Design Study

App de estudio para practicar **Patrones GoF**, **Principios SOLID** y **Patrones
GRASP** con preguntas de opción múltiple, snippets de código Java y React, y
explicación de cada distractor.

La especificación completa vive en [`../README.md`](../README.md).
Las decisiones tomadas donde la spec no definía nada están en
[`DECISIONS.md`](./DECISIONS.md).

## Estado

**Fases 1, 2 y 3 implementadas.** 47 preguntas (19 GoF, 14 SOLID, 14 GRASP), los
cuatro tipos de ejercicio (`concept`, `identify-pattern`, `find-violation`,
`choose-fix`), código en Java y React con selector de lenguaje, modo mixto con
filtros por tema y etiqueta, progreso persistido en el navegador, página
`/progreso`, «solo las que fallé», atajos de teclado, pistas y tema claro/oscuro.

Queda la Fase 4 opcional: exportar/importar progreso, modo examen y más
contenido por etiqueta.

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
├── components/     # QuestionCard, CodeViewer, CodeBlock, OptionList, SessionConfigPanel...
├── pages/          # Home, Section, Mixed, Session, Results, Progress, NotFound
├── store/          # sesión en curso y progreso (Zustand + localStorage)
├── lib/            # sesiones, scoring, progreso, tema, atajos, esquema Zod, snippets, azar
├── test/           # setup de Vitest
└── types.ts
```

## Atajos de teclado (sesión)

| Tecla | Acción |
| --- | --- |
| `1`–`4` | Elegir opción |
| `Enter` | Pasar a la siguiente pregunta (después de responder) |
| `H` | Mostrar u ocultar la pista |

Se ignoran cuando el foco está en un control, para no romper `Enter` sobre un botón.

## Cómo agregar preguntas

1. Editá `src/content/gof.ts`, `solid.ts` o `grasp.ts`.
2. Cada pregunta tiene exactamente 4 opciones y una `correctOptionId`.
3. Completá `optionExplanations` para cada distractor (es lo que se muestra al
   responder).
4. Si tiene `code`, `highlightLines` se valida contra la cantidad de líneas del
   snippet.
5. Para la misma pregunta en los dos lenguajes, dejá `code` como snippet primario
   y agregá la otra variante en `codeVariants` (la clave debe coincidir con
   `language`):

```ts
code: { language: 'java', source: '...', highlightLines: [1] },
codeVariants: {
  tsx: { language: 'tsx', source: '...', highlightLines: [2, 3] },
},
```

6. `npm test` corre la validación de contenido: si una pregunta está mal formada,
   el test y la app fallan con el detalle del campo.

## Stack

React 18 + Vite + TypeScript, Tailwind CSS v4, React Router 6, Zustand, Zod,
`react-syntax-highlighter` (PrismLight) con `java` y `tsx`, Vitest + Testing
Library.
