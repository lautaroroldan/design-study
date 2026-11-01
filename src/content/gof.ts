import type { Question } from '../types';

export const gofQuestions = [
  {
    id: 'gof-singleton-001',
    topic: 'gof',
    tag: 'Singleton',
    type: 'concept',
    difficulty: 1,
    prompt:
      'Una aplicación necesita un único registro de configuración en memoria: todos los módulos leen los mismos valores y crear más de una instancia produciría datos inconsistentes. ¿Qué patrón GoF resuelve esto de forma directa?',
    options: [
      { id: 'a', text: 'Prototype' },
      { id: 'b', text: 'Singleton' },
      { id: 'c', text: 'Builder' },
      { id: 'd', text: 'Flyweight' },
    ],
    correctOptionId: 'b',
    explanation:
      'Singleton garantiza una única instancia y un punto de acceso global a ella (getInstance()). Eso es exactamente lo que pide el registro de configuración.',
    optionExplanations: {
      a: 'Prototype clona objetos existentes; no restringe cuántas instancias puede haber.',
      c: 'Builder arma un objeto complejo paso a paso; no impone unicidad.',
      d: 'Flyweight comparte estado intrínseco entre muchos objetos, pero no garantiza que exista una sola instancia del registro.',
    },
    hint: 'Buscá la idea de "una sola instancia y un acceso global".',
  },
  {
    id: 'gof-factory-method-001',
    topic: 'gof',
    tag: 'Factory Method',
    type: 'concept',
    difficulty: 2,
    prompt:
      'Un sistema de reportes genera PDF, CSV o XLSX. Cada subclase de ReporteGenerator sabe qué documento crear, mientras que el resto del flujo (obtener datos, formatear, guardar) es igual para todas. ¿Qué patrón GoF encaja mejor?',
    options: [
      { id: 'a', text: 'Abstract Factory' },
      { id: 'b', text: 'Factory Method' },
      { id: 'c', text: 'Builder' },
      { id: 'd', text: 'Prototype' },
    ],
    correctOptionId: 'b',
    explanation:
      'Factory Method deja el esqueleto del algoritmo en la clase base y delega en las subclases la creación de un único producto (crearDocumento()). La variación está en qué documento se crea.',
    optionExplanations: {
      a: 'Abstract Factory crea familias de productos relacionados; acá hay un solo producto por subclase.',
      c: 'Builder se ocupa de construir un objeto complejo paso a paso, no de elegir la clase del producto.',
      d: 'Prototype evita el new clonando instancias ya configuradas.',
    },
    hint: 'Clase base con el algoritmo + un método abstracto de creación.',
  },
  {
    id: 'gof-abstract-factory-001',
    topic: 'gof',
    tag: 'Abstract Factory',
    type: 'concept',
    difficulty: 3,
    prompt:
      'Una app de escritorio renderiza botones, checkboxes y ventanas. En Windows usa una familia de widgets nativos, en macOS otra, y las familias nunca se mezclan. ¿Qué patrón GoF modela esto?',
    options: [
      { id: 'a', text: 'Factory Method' },
      { id: 'b', text: 'Bridge' },
      { id: 'c', text: 'Abstract Factory' },
      { id: 'd', text: 'Builder' },
    ],
    correctOptionId: 'c',
    explanation:
      'Abstract Factory crea familias completas de objetos relacionados (botón + checkbox + ventana) sin que el cliente conozca las clases concretas ni pueda mezclar familias.',
    optionExplanations: {
      a: 'Factory Method crea un producto por subclase; acá son varios productos los que deben ser coherentes entre sí.',
      b: 'Bridge separa una abstracción de su implementación, pero no se ocupa de crear la familia de widgets.',
      d: 'Builder construye un objeto complejo paso a paso, no una familia de objetos relacionados.',
    },
    hint: 'La clave es "familia de productos que deben combinarse entre sí".',
  },
  {
    id: 'gof-builder-001',
    topic: 'gof',
    tag: 'Builder',
    type: 'concept',
    difficulty: 2,
    prompt:
      'Una clase Pedido tiene 12 campos, la mayoría opcionales, y el constructor de 12 parámetros ya es ilegible. Se quiere construir el objeto paso a paso, validando al final. ¿Qué patrón GoF aplica?',
    options: [
      { id: 'a', text: 'Builder' },
      { id: 'b', text: 'Prototype' },
      { id: 'c', text: 'Factory Method' },
      { id: 'd', text: 'Singleton' },
    ],
    correctOptionId: 'a',
    explanation:
      'Builder separa la construcción de la representación: métodos encadenables por campo y un build() que valida antes de entregar el objeto.',
    optionExplanations: {
      b: 'Prototype clona un objeto ya construido; no resuelve el constructor telescópico.',
      c: 'Factory Method elige la clase del producto, pero el problema acá es cómo armarlo.',
      d: 'Singleton no tiene relación con la construcción por pasos.',
    },
    hint: 'Pensá en algo como .conDescuento(...).conEnvio(...).build().',
  },
  {
    id: 'gof-prototype-001',
    topic: 'gof',
    tag: 'Prototype',
    type: 'concept',
    difficulty: 2,
    prompt:
      'Crear un DocumentoPlantilla requiere leer 40 archivos y aplicar estilos. El 90% de los documentos nuevos son copias de una plantilla existente con dos o tres cambios. ¿Qué patrón GoF evita repetir esa creación costosa?',
    options: [
      { id: 'a', text: 'Builder' },
      { id: 'b', text: 'Prototype' },
      { id: 'c', text: 'Abstract Factory' },
      { id: 'd', text: 'Flyweight' },
    ],
    correctOptionId: 'b',
    explanation:
      'Prototype clona una instancia ya configurada y después se ajusta la copia, sin volver a ejecutar la construcción cara.',
    optionExplanations: {
      a: 'Builder volvería a ejecutar toda la construcción desde cero.',
      c: 'Abstract Factory también crea desde cero; no aprovecha la instancia existente.',
      d: 'Flyweight comparte objetos inmutables; acá hacen falta copias independientes que se puedan modificar.',
    },
    hint: 'clone() sobre una instancia base ya configurada.',
  },
  {
    id: 'gof-singleton-002',
    topic: 'gof',
    tag: 'Singleton',
    type: 'find-violation',
    difficulty: 3,
    prompt:
      'Los tests de integración fallan de forma intermitente: un test ve el usuario y los permisos que dejó otro. ¿Qué patrón GoF, mal aplicado, es la causa del estado compartido?',
    code: {
      language: 'java',
      source: `public class SesionUsuario {
    private static SesionUsuario instancia;
    public String usuarioActual;
    public List<String> permisos = new ArrayList<>();

    private SesionUsuario() {}

    public static SesionUsuario getInstance() {
        if (instancia == null) {
            instancia = new SesionUsuario();
        }
        return instancia;
    }
}`,
      highlightLines: [2, 3, 4, 8, 12],
    },
    options: [
      { id: 'a', text: 'Flyweight' },
      { id: 'b', text: 'Singleton' },
      { id: 'c', text: 'Prototype' },
      { id: 'd', text: 'Proxy' },
    ],
    correctOptionId: 'b',
    explanation:
      'Es un Singleton con estado mutable: instancia estática, constructor privado y getInstance(). Todo el proceso comparte el mismo objeto, así que lo que deja un test se filtra al siguiente. El problema no es el patrón en sí, sino el estado global mutable: conviene pasar la sesión como dependencia o acotarla a cada request.',
    optionExplanations: {
      a: 'Flyweight también comparte estado, pero comparte objetos inmutables; acá el estado se muta.',
      c: 'Prototype clonaría el objeto, que es justo lo contrario a compartirlo.',
      d: 'Proxy agrega control de acceso, no unicidad global.',
    },
    hint: 'Fijate en el campo static y en los campos públicos mutables.',
  },
  {
    id: 'gof-adapter-001',
    topic: 'gof',
    tag: 'Adapter',
    type: 'concept',
    difficulty: 2,
    prompt:
      'El checkout usa una interfaz propia PagoService.cobrar(monto). La pasarela nueva solo ofrece un SDK con cobrarConTarjeta(cents, moneda) y tipos propios. No se puede modificar ni el SDK ni el checkout. ¿Qué patrón GoF corresponde?',
    options: [
      { id: 'a', text: 'Facade' },
      { id: 'b', text: 'Adapter' },
      { id: 'c', text: 'Proxy' },
      { id: 'd', text: 'Decorator' },
    ],
    correctOptionId: 'b',
    explanation:
      'Adapter traduce la interfaz del SDK a la que espera el cliente, sin tocar ninguno de los dos lados.',
    optionExplanations: {
      a: 'Facade simplifica un conjunto de APIs, pero no traduce una interfaz incompatible a otra que el cliente ya espera.',
      c: 'Proxy expone la misma interfaz que el objeto real y controla el acceso; acá las interfaces son distintas.',
      d: 'Decorator agrega comportamiento sobre la misma interfaz, no la convierte en otra.',
    },
    hint: 'La palabra clave del enunciado es "interfaces incompatibles".',
  },
  {
    id: 'gof-decorator-001',
    topic: 'gof',
    tag: 'Decorator',
    type: 'concept',
    difficulty: 2,
    prompt:
      'Un café se puede pedir con leche, crema y caramelo en cualquier combinación, y cada extra suma precio. Ya existen clases como CafeConLecheYCaramelo y la cantidad crece de forma combinatoria. ¿Qué patrón GoF evita esa explosión?',
    options: [
      { id: 'a', text: 'Composite' },
      { id: 'b', text: 'Builder' },
      { id: 'c', text: 'Decorator' },
      { id: 'd', text: 'Proxy' },
    ],
    correctOptionId: 'c',
    explanation:
      'Decorator envuelve el objeto base y agrega responsabilidades acumulables en runtime: una clase por extra en lugar de una por combinación.',
    optionExplanations: {
      a: 'Composite arma árboles parte-todo; no agrega costos acumulables a un mismo objeto.',
      b: 'Builder arma un objeto en un único flujo de construcción; no permite apilar comportamiento después.',
      d: 'Proxy controla el acceso, no suma funcionalidad arbitraria.',
    },
    hint: 'Un envoltorio que implementa la misma interfaz que el objeto que envuelve.',
  },
  {
    id: 'gof-observer-001',
    topic: 'gof',
    tag: 'Observer',
    type: 'concept',
    difficulty: 2,
    prompt:
      'Cuando cambia el precio de una acción, tres paneles (gráfico, lista y alerta) deben actualizarse, y mañana se sumarán más sin tocar el modelo de precios. ¿Qué patrón GoF desacopla al emisor de sus interesados?',
    options: [
      { id: 'a', text: 'Strategy' },
      { id: 'b', text: 'Observer' },
      { id: 'c', text: 'Mediator' },
      { id: 'd', text: 'Chain of Responsibility' },
    ],
    correctOptionId: 'b',
    explanation:
      'Observer: el sujeto mantiene una lista de observadores y les notifica cada cambio. Sumar un panel no modifica al sujeto.',
    optionExplanations: {
      a: 'Strategy elige un algoritmo entre varios; no hay notificación de cambios.',
      c: 'Mediator centraliza la comunicación entre pares; acá el problema es una notificación de uno a muchos.',
      d: 'Chain of Responsibility pasa una solicitud por una cadena hasta que alguien la maneja.',
    },
    hint: 'sujeto → lista de interesados → notificar()',
  },
  {
    id: 'gof-strategy-001',
    topic: 'gof',
    tag: 'Strategy',
    type: 'concept',
    difficulty: 1,
    prompt:
      'El cálculo de impuestos cambia según el país y debe poder elegirse en runtime desde la configuración. Hoy hay un if/else que crece con cada país. ¿Qué patrón GoF conviene?',
    options: [
      { id: 'a', text: 'State' },
      { id: 'b', text: 'Template Method' },
      { id: 'c', text: 'Strategy' },
      { id: 'd', text: 'Command' },
    ],
    correctOptionId: 'c',
    explanation:
      'Strategy encapsula cada cálculo detrás de una interfaz común y permite intercambiarlos en runtime según la configuración.',
    optionExplanations: {
      a: 'State también cambia comportamiento, pero la transición la decide el propio objeto según su estado interno, no la configuración.',
      b: 'Template Method fija el algoritmo en la clase base y varía pasos por herencia, no en runtime.',
      d: 'Command encapsula una acción como objeto, no una política de cálculo.',
    },
    hint: 'Una interfaz CalculadoraImpuesto con una implementación por país.',
  },
] satisfies Question[];
