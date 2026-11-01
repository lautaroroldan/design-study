# Decisiones — Fase 1

Donde la spec no definía algo, se eligió la opción más simple. Todo lo que quedó
afuera está al final, separado por fase.

## Alcance

- **Solo Fase 1.** Home, tres secciones separadas (`/gof`, `/solid`, `/grasp`),
  sesión completa (pregunta → feedback → resultados) y 30 preguntas.
- `/mixto` y `/progreso` existen como **pantallas marcador de posición** con el
  detalle de qué va a vivir ahí. No tienen lógica ni datos falsos.
- No se avanzó nada de Fase 2 ni Fase 3 (ver "Pendiente").

## Stack

| Decisión | Por qué |
| --- | --- |
| Vite 6 + React 18 + TS, Tailwind **v4** | La spec pedía React 18; Tailwind v4 se integra por plugin de Vite (sin `tailwind.config.js`: los tokens viven en `src/index.css`). |
| **Zustand** para la sesión en curso | Menos ceremonia que Context + `useReducer` y los tests de lógica pura no dependen del store. |
| **`react-syntax-highlighter` (PrismLight)** en vez de Shiki | La spec permitía cualquiera. PrismLight es síncrono: no obliga a cargar un WASM ni a manejar promesas en cada render de código. Se registran solo `java` y `tsx`. |
| **React Router 6 con `createBrowserRouter`** | `ScrollRestoration` y rutas anidadas bajo `Layout` sin código extra. |
| **Zod 3** | Validación en runtime con mensajes por campo; los tipos se declaran aparte en `src/types.ts`. |
| **Vitest 3 + Testing Library** | Mismo pipeline de Vite; `jsdom` para los tests de componente. |

## Contenido

- **Archivos `.ts` en vez de `.json`.** La spec permitía JSON o TS. Con TS los
  snippets Java se escriben con template literals sin escapar `\n`, y
  `satisfies Question[]` da chequeo de tipos en el editor además de la validación
  con Zod en runtime.
- **30 preguntas: 10 por tema.** La tabla de la sección 9 pide 2 por etiqueta GoF
  (36 en total) y 4 por principio SOLID (20), pero la Fase 1 de la sección 12 pide
  explícitamente "10 preguntas de ejemplo por tema". Se priorizó la Fase 1; la
  cobertura completa por etiqueta queda para la Fase 4 ("más preguntas por
  etiqueta").
- **`find-violation` en GoF** se interpretó como *"qué patrón, mal aplicado, causa
  el defecto"* (por ejemplo un Singleton con estado mutable global). La spec
  describe `find-violation` para SOLID/GRASP; para GoF no había una lectura
  natural, y esta permite ejercitar el tipo sin inventar un tipo nuevo.
- **Todas las preguntas tienen `optionExplanations`** para los tres distractores.
  Es un criterio de calidad de la sección 9 y un test lo verifica.
- **`hint` es opcional** y existe en el modelo (sección 7) aunque todavía no se
  muestra: es parte de la Fase 3.
- **Sin preguntas React.** Todo el código de la Fase 1 es Java; las preguntas
  conceptuales no dependen del lenguaje.

## Modelo y lógica de sesión

- **`questionIds` agregado a `SessionConfig`.** Es la forma más simple de
  implementar "Repetir los errores" de la pantalla de resultados (sección 7) sin
  duplicar el armado de sesiones.
- **El filtro de lenguaje solo aplica a preguntas con código.** Una pregunta
  conceptual no está atada a Java ni a React; si se filtra "Java", siguen
  apareciendo. Si se filtra "React" en Fase 1, quedan solo las conceptuales.
- **Las opciones se mezclan al armar la sesión**, no en cada render. Así el orden
  es estable mientras se responde y se puede testear con un `rng` inyectable
  (`mulberry32`), sin `Math.random` escondido en la lógica.
- **"Cantidad" recorta el pool ya ordenado.** Si hay menos preguntas que las
  pedidas, la sesión se arma con lo disponible y el panel lo muestra antes de
  empezar ("N preguntas en esta sesión").
- **Sin preguntas disponibles** el botón "Empezar" queda deshabilitado con el
  motivo, en vez de navegar a una sesión vacía.
- **La sesión vive en memoria.** Recargar en `/sesion` muestra un estado vacío
  explicando que la sesión se perdió. Persistirla no estaba en la Fase 1.
- **Tipos de ejercicio por sección:** el selector lista solo los tipos que existen
  en el contenido de ese tema (más "Todos"). Evita combinaciones que dan 0
  preguntas por elección del usuario.

## Interfaz

- **Modo claro/oscuro automático** con `prefers-color-scheme` desde ya: es gratis
  con Tailwind y evita rehacer los colores en la Fase 3. No hay toggle manual.
- **Paleta con tokens semánticos** (`canvas`, `surface`, `ink`, `rule`, `accent`,
  `good`, `bad`, `mustard`) definidos como variables CSS y expuestos a Tailwind
  con `@theme inline`. Ningún color hardcodeado en los componentes.
- **Tipografía:** Newsreader (variable, OFL) self-hosted en `public/fonts` para
  títulos y números; system-ui para UI; monoespaciada del sistema para código. Sin
  dependencia de Google Fonts en runtime.
- **Acierto/error no dependen solo del color:** cada opción lleva ícono y texto
  ("Correcta", "Tu respuesta"), y el resultado tiene leyenda + cifras.
- **Etiquetas mostradas según el contenido**, no la lista completa del README: en
  Fase 1 hay 9 etiquetas GoF, 5 SOLID y 9 GRASP. Mostrar 18 etiquetas con "0
  preguntas" habría sido ruido.
- **Atajos de teclado, pistas y porcentaje por etiqueta** en la sección quedaron
  pendientes: son Fase 3 explícitamente.

## Tests

45 tests con Vitest:

- `lib/session.test.ts`: filtros, orden fijo/aleatorio determinístico, recorte,
  mezcla de opciones sin perder la correcta, filtro por ids, no mutación.
- `lib/scoring.test.ts`: puntaje, accuracy, desglose por tema/etiqueta, orden de
  etiquetas de peor a mejor, errores, casos vacíos.
- `lib/schema.test.ts`: contenido inválido (menos de 4 opciones, correcta
  inexistente, ids repetidos, falta de código, `highlightLines` fuera de rango,
  explicaciones huérfanas).
- `content/content.test.ts`: 10 por tema, 4 opciones, explicación para cada
  distractor, snippets ≤ 25 líneas, ids únicos.
- `components/QuestionCard.test.tsx`: render de opciones, feedback correcto e
  incorrecto, callbacks.

## Pendiente

### Fase 2
- Modo mixto real: selección de temas, filtros por etiqueta, "solo las que fallé".
- Tipos `identify-pattern` y `choose-fix`.
- Preguntas y snippets en React (`tsx`), selector Java/React en la pregunta.
- Habilitar la opción "React" del filtro de lenguaje.

### Fase 3
- Persistencia de progreso en `localStorage` (por pregunta, etiqueta y tema).
- Página `/progreso` con las 5 etiquetas más débiles y reinicio con confirmación.
- "Solo las que fallé" en el modo mixto.
- Atajos `1`–`4`, `Enter` y `H` (pista).
- Toggle manual de tema claro/oscuro.

### Fase 4
- Exportar/importar progreso, modo examen con temporizador, más preguntas por
  etiqueta (hasta cumplir la tabla completa de la sección 9).

### Deuda técnica conocida
- La app no persiste la sesión en curso; recargar la pierde (decisión de Fase 1).
- El bundle incluye el highlighter completo de Prism para `java`/`tsx`
  (~124 kB gzip total); si crece, se puede dividir por ruta.
- No hay tests end-to-end; la verificación de flujo se hizo a mano en el navegador
  (desktop y 390 px).
