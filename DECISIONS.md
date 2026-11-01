# Decisiones

Donde la spec no definía algo, se eligió la opción más simple. Al final está lo
que sigue pendiente, separado por fase.

## Estado

- **Fase 1** implementada: home, tres secciones, sesión completa, 30 preguntas
  (10 por tema), tipos `concept` y `find-violation`, código Java.
- **Fase 2** implementada: modo mixto con filtros, tipos `identify-pattern` y
  `choose-fix`, código en React y selector de lenguaje por pregunta. Total: 47
  preguntas (19 GoF, 14 SOLID, 14 GRASP).
- **Fase 3** implementada: progreso persistido en `localStorage`, página
  `/progreso`, «solo las que fallé», atajos de teclado, pistas y tema
  claro/oscuro con preferencia guardada.

## Corrección de la Fase 1

- **La etiqueta (`tag`) se muestra recién después de responder.** En la versión
  anterior el encabezado de la ficha decía, por ejemplo, `SOLID · ISP · Encontrar
  la violación` mientras la pregunta era "¿Qué principio SOLID se viola?": **la
  etiqueta era la respuesta**. Ahora antes de responder se ve tema + tipo de
  ejercicio, y la etiqueta aparece con el feedback. Hay un test que lo cubre.

## Stack

| Decisión | Por qué |
| --- | --- |
| Vite 6 + React 18 + TS, Tailwind **v4** | La spec pedía React 18; Tailwind v4 se integra por plugin de Vite (sin `tailwind.config.js`: los tokens viven en `src/index.css`). |
| **Zustand** para la sesión en curso | Menos ceremonia que Context + `useReducer`; la lógica de armado y puntaje queda en funciones puras. |
| **`react-syntax-highlighter` (PrismLight)** | Síncrono, sin WASM; se registran solo `java` y `tsx`. |
| **React Router 6 con `createBrowserRouter`** | `ScrollRestoration` y rutas anidadas bajo `Layout` sin código extra. |
| **Zod 3** | Validación en runtime con mensajes por campo; los tipos se declaran aparte en `src/types.ts`. |
| **Vitest 3 + Testing Library** | Mismo pipeline de Vite; `jsdom` para los tests de componente. |

## Contenido

- **Archivos `.ts` en vez de `.json`.** La spec permitía JSON o TS. Con TS los
  snippets se escriben con template literals sin escapar `\n`, y
  `satisfies Question[]` da chequeo de tipos en el editor además de Zod en
  runtime.
- **47 preguntas, no la tabla completa de la sección 9.** La tabla pide 2 por
  etiqueta GoF y 4 por principio SOLID; la sección 12 pide 10 por tema en Fase 1
  y no fija volumen para la Fase 2. Se amplió a 19 / 14 / 14 cubriendo los tipos
  nuevos y ambos lenguajes; la cobertura completa por etiqueta es Fase 4.
- **`find-violation` en GoF** se interpretó como *"qué patrón, mal aplicado, causa
  el defecto"* (por ejemplo un Singleton con estado mutable global), porque la
  spec describe el tipo para SOLID/GRASP.
- **Todas las preguntas explican cada distractor.** Hay un test que lo verifica.
- **Criterio de dificultad:** 1 = reconocer el concepto; 2 = leer un snippet
  corto; 3 = snippet con matices o distractores muy cercanos (Proxy vs Decorator,
  Mediator vs Facade, Protected Variations vs Polymorphism).

## Variantes Java / React

- **`code` sigue siendo el snippet primario del modelo del README y
  `codeVariants` guarda las variantes por lenguaje.** Así no se duplican
  preguntas ni se rompe el modelo documentado. Se valida que la clave coincida
  con `snippet.language`, que no repita el lenguaje de `code` y que
  `highlightLines` exista en cada variante.
- **No todas las preguntas tienen las dos variantes.** La spec lo permite: si un
  patrón no tiene una expresión natural en React, la pregunta queda en Java.
  Hoy hay 14 preguntas con las dos variantes.
- **El selector vive en el encabezado del bloque de código** y muestra solo los
  lenguajes que la pregunta tiene. El lenguaje inicial es el filtro de la sesión
  (si elegiste React, abre en React) y después la primaria.
- **El filtro de lenguaje de la sesión mira todas las variantes**, no solo
  `code`. Las preguntas conceptuales pasan siempre: no dependen del lenguaje.

## Modo mixto

- **Temas con checkboxes y etiquetas multi-select agrupadas por tema.** Al sacar
  un tema se podan sus etiquetas para no dejar filtros imposibles.
- **Sin etiquetas elegidas entra todo** el contenido de los temas seleccionados;
  es el caso por defecto y el más simple.
- **«Solo las que fallé» queda para la Fase 3.** La sección 3.2 lo menciona, pero
  la sección 12 lo asigna explícitamente a la Fase 3 porque necesita el progreso
  persistido. En `/mixto` se muestra con esa aclaración, sin botón falso.
- **`Practicar otra sesión` en resultados vuelve a `/mixto`** cuando la sesión
  tuvo más de un tema.

## Modelo y lógica de sesión

- **`questionIds` en `SessionConfig`** para "Repetir los errores" sin duplicar el
  armado de sesiones.
- **Las opciones se mezclan al armar la sesión**, no en cada render: el orden es
  estable mientras respondés y testeable con un `rng` inyectable (mulberry32).
- **"Cantidad" recorta el pool ya ordenado**; si hay menos, se usa lo disponible y
  el panel lo dice antes de empezar.
- **La sesión vive en memoria.** Recargar en `/sesion` muestra un estado vacío
  explicando que se perdió. Persistirla no es parte de las Fases 1–2.
- **Tipos de ejercicio por sección:** el selector lista solo los tipos que existen
  en ese tema (más "Todos"). Evita combinaciones con 0 preguntas elegidas por el
  usuario.

## Interfaz

- **Modo claro/oscuro automático** con `prefers-color-scheme`. No hay toggle
  manual (Fase 3).
- **Tokens semánticos** (`canvas`, `surface`, `ink`, `rule`, `accent`, `good`,
  `bad`, `mustard`) como variables CSS expuestas a Tailwind con `@theme inline`.
  Ningún color hardcodeado en componentes.
- **Tipografía:** Newsreader (OFL) self-hosted en `public/fonts` para títulos;
  system-ui para UI; monoespaciada del sistema para código. Sin Google Fonts en
  runtime.
- **Acierto/error no dependen solo del color:** ícono + texto ("Correcta", "Tu
  respuesta") y leyenda con cifras en resultados.
- **El resultado de la sesión se cuenta dos veces:** puntaje grande, `%`,
  mensaje, y una tira con un segmento por pregunta (verde/rojo) para ver el patrón
  de aciertos de un vistazo.
- **Etiquetas mostradas según el contenido**, no la lista completa del README:
  mostrar etiquetas con 0 preguntas habría sido ruido.

## Progreso (Fase 3)

- **Se guarda en `localStorage` con la clave `design-study:progress`**, vía
  `zustand/persist` con `version: 1`. No hay backend ni cuentas, como pide la
  spec.
- **El intento se registra al responder, no al armar la sesión**, y una sola vez
  por pregunta y sesión (el store ya bloquea re-responder). Reprobar una pregunta
  en otra sesión suma intento.
- **"Fallada" = el último intento fue incorrecto.** No es un historial de errores:
  si después la acertás, sale de la lista. Es lo que uno quiere repasar.
- **Las estadísticas son derivadas**, no se guardan duplicadas: se calculan
  cruzando el contenido con el mapa de intentos. Si mañana se agrega o se quita
  una pregunta, los totales no quedan desfasados.
- **Las etiquetas sin intentos no son "débiles"**, son desconocidas: no entran en
  el top 5 de `/progreso` hasta que las practiques.
- **Reiniciar pide confirmación en línea** (dos botones), no un `window.confirm`
  nativo: se estiliza, se navega con teclado y no bloquea el hilo.
- **El porcentaje por etiqueta en las secciones** reemplaza al conteo cuando hay
  intentos; el conteo vuelve a aparecer si todavía no practicaste nada.

## Atajos y pistas

- **`1`–`4` eligen opción, `Enter` avanza, `H` muestra/oculta la pista.** La
  lógica vive en `lib/shortcuts.ts` como función pura (`shortcutFor`) para poder
  testearla sin montar la página.
- **Los atajos se ignoran si el foco está en un control** (input, select, button,
  link, contenteditable): así `Enter` sigue activando el botón enfocado y no se
  disparan dos acciones.
- **Después de responder, el foco pasa al botón "Siguiente"** (autoFocus), así
  `Enter` funciona también de forma nativa.
- **Todas las preguntas tienen pista** (hay un test que lo exige). La pista no
  revela la respuesta: apunta a dónde mirar.
- **La pista se oculta al responder** y al cambiar de pregunta.

## Tema claro/oscuro

- **Tres estados: Auto, Claro y Oscuro**, persistidos en
  `design-study:theme`. El botón del encabezado los cicla.
- **El tema se aplica con la clase `.dark` en `<html>`**, y `index.html` incluye
  un script mínimo que la setea antes del primer paint: sin flash blanco al
  cargar en oscuro.
- **En "Auto" se sigue al sistema en vivo** (`matchMedia`), no solo al cargar.
- **Los tokens de color siguen siendo variables CSS**; no hay clases `dark:` en
  los componentes. Un solo lugar define ambos temas.

## Tests

103 tests con Vitest:

- `lib/session.test.ts`: filtros (tema, etiqueta, tipo, dificultad, ids,
  lenguaje con variantes), orden fijo/aleatorio determinístico, recorte, mezcla
  de opciones sin perder la correcta, no mutación.
- `lib/code.test.ts`: snippets por pregunta, deduplicación por lenguaje,
  preferencia de lenguaje.
- `lib/scoring.test.ts`: puntaje, accuracy, desglose por tema/etiqueta, orden de
  etiquetas de peor a mejor, errores, casos vacíos.
- `lib/progress.test.ts`: agregados por pregunta/tema/etiqueta, top de débiles,
  falladas por último intento, resumen global, casos vacíos.
- `lib/theme.test.ts`: resolución de Auto/Claro/Oscuro, persistencia, ciclo del
  botón y clase en el documento.
- `lib/shortcuts.test.ts`: teclas válidas, teclas ignoradas y foco en controles.
- `lib/schema.test.ts`: contenido inválido (opciones, correcta inexistente, ids
  repetidos, falta de código, highlights fuera de rango, variantes mal declaradas).
- `content/content.test.ts`: cobertura por tema, 4 opciones, explicación de cada
  distractor, pista en todas, snippets ≤ 25 líneas (variantes incluidas), los 4
  tipos existen, hay Java y React.
- `store/session.test.ts`: registro de intentos correctos/incorrectos, sin
  duplicados en la misma sesión, acumulación entre sesiones y avance.
- `components/QuestionCard.test.tsx`: opciones, feedback, etiqueta oculta hasta
  responder, pista, callbacks.

## Pendiente

### Fase 4 (opcional)
- Exportar e importar el progreso como JSON.
- Modo examen con temporizador.
- Más preguntas por etiqueta hasta cumplir la tabla completa de la sección 9.
- Ranking o cuentas: sigue fuera de alcance.

### Deuda técnica conocida
- La app no persiste la sesión en curso; recargar la pierde (el progreso sí queda).
- El bundle incluye Prism para `java` y `tsx` (~133 kB gzip total); si crece, se
  puede dividir por ruta.
- No hay tests end-to-end; los flujos se verificaron a mano en el navegador
  (desktop y 390 px, claro y oscuro).
- Las preguntas con dos variantes comparten un solo `prompt`: está redactado de
  forma neutral ("este código"). Si una variante necesitara otro enunciado, hay
  que duplicar la pregunta.
- El progreso no se sincroniza entre dispositivos (decisión de la spec: sin
  backend). Exportar/importar JSON es Fase 4.
