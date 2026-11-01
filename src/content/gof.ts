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
  {
    id: 'gof-adapter-002',
    topic: 'gof',
    tag: 'Adapter',
    type: 'identify-pattern',
    difficulty: 2,
    prompt: '¿Qué patrón GoF implementa este código?',
    code: {
      language: 'java',
      source: `class PagoStripeAdapter implements PagoService {
    private final StripeSdk sdk;

    PagoStripeAdapter(StripeSdk sdk) {
        this.sdk = sdk;
    }

    @Override
    public void cobrar(double monto) {
        sdk.charge((int) Math.round(monto * 100), "ARS");
    }
}`,
      highlightLines: [1, 2, 9, 10],
    },
    codeVariants: {
      tsx: {
        language: 'tsx',
        source: `type ProductoApi = { id: number; title: string; price_cents: number };
type Producto = { id: string; nombre: string; precio: number };

export function adaptarProducto(api: ProductoApi): Producto {
  return {
    id: String(api.id),
    nombre: api.title,
    precio: api.price_cents / 100,
  };
}`,
        highlightLines: [1, 2, 4, 8],
      },
    },
    options: [
      { id: 'a', text: 'Adapter' },
      { id: 'b', text: 'Facade' },
      { id: 'c', text: 'Decorator' },
      { id: 'd', text: 'Proxy' },
    ],
    correctOptionId: 'a',
    explanation:
      'Traduce la interfaz del SDK externo (charge, centavos) a la que espera el cliente (cobrar, pesos) sin modificar ninguna de las dos. En React, la función de mapeo hace lo mismo con la forma de la respuesta de la API.',
    optionExplanations: {
      b: 'Facade simplifica el acceso a un conjunto de APIs, pero no convierte una interfaz en otra.',
      c: 'Decorator implementa la misma interfaz que el objeto envuelto y le agrega comportamiento; acá las interfaces son distintas.',
      d: 'Proxy también comparte la interfaz del objeto real, pero su objetivo es controlar el acceso, no traducir tipos.',
    },
    hint: 'El nombre del patrón aparece en la forma en que se conectan dos contratos incompatibles.',
  },
  {
    id: 'gof-decorator-002',
    topic: 'gof',
    tag: 'Decorator',
    type: 'identify-pattern',
    difficulty: 2,
    prompt: '¿Qué patrón GoF aplica este código?',
    code: {
      language: 'tsx',
      source: `function withLogging<P extends object>(Componente: React.ComponentType<P>) {
  return (props: P) => {
    console.log('render', props);
    return <Componente {...props} />;
  };
}

const ListaConLog = withLogging(Lista);`,
      highlightLines: [1, 2, 4, 8],
    },
    codeVariants: {
      java: {
        language: 'java',
        source: `class CafeConLeche implements Bebida {
    private final Bebida base;

    CafeConLeche(Bebida base) {
        this.base = base;
    }

    public double precio() {
        return base.precio() + 120;
    }
}`,
        highlightLines: [1, 2, 8, 9],
      },
    },
    options: [
      { id: 'a', text: 'Observer' },
      { id: 'b', text: 'Decorator' },
      { id: 'c', text: 'Singleton' },
      { id: 'd', text: 'Facade' },
    ],
    correctOptionId: 'b',
    explanation:
      'Envuelve un objeto del mismo tipo y le agrega comportamiento (logging en el HOC, precio en el café) sin modificarlo, y se pueden apilar varios. El HOC y el envoltorio Java son la misma idea.',
    optionExplanations: {
      a: 'Observer notifica cambios de estado a una lista de suscriptores; acá no hay notificación.',
      c: 'Singleton garantiza una única instancia; acá se crea un envoltorio por uso.',
      d: 'Facade simplifica un subsistema, pero no implementa el mismo contrato que el objeto envuelto.',
    },
    hint: 'Envolver algo que ya cumple la interfaz y sumarle algo encima.',
  },
  {
    id: 'gof-observer-002',
    topic: 'gof',
    tag: 'Observer',
    type: 'identify-pattern',
    difficulty: 3,
    prompt: '¿Qué patrón GoF implementa este código?',
    code: {
      language: 'java',
      source: `interface ObservadorPrecio {
    void actualizar(BigDecimal precio);
}

class Accion {
    private final List<ObservadorPrecio> observadores = new ArrayList<>();

    void suscribir(ObservadorPrecio observador) {
        observadores.add(observador);
    }

    void actualizarPrecio(BigDecimal precio) {
        observadores.forEach(o -> o.actualizar(precio));
    }
}`,
      highlightLines: [1, 6, 8, 13],
    },
    codeVariants: {
      tsx: {
        language: 'tsx',
        source: `const listeners = new Set<() => void>();
let precioActual = 0;

export function suscribir(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function usePrecio() {
  return useSyncExternalStore(suscribir, () => precioActual);
}`,
        highlightLines: [1, 4, 5, 12],
      },
    },
    options: [
      { id: 'a', text: 'Mediator' },
      { id: 'b', text: 'Observer' },
      { id: 'c', text: 'Strategy' },
      { id: 'd', text: 'Command' },
    ],
    correctOptionId: 'b',
    explanation:
      'Un sujeto mantiene una lista de interesados y les avisa cuando cambia el estado. En React, suscribir más useSyncExternalStore expresa la misma relación entre la fuente de datos y los componentes.',
    optionExplanations: {
      a: 'Mediator centraliza la comunicación entre objetos que se conocen entre sí; acá el sujeto solo notifica hacia afuera.',
      c: 'Strategy intercambia algoritmos, no notifica cambios de estado.',
      d: 'Command encapsula una acción como objeto; no hay lista de interesados.',
    },
    hint: 'Suscribir, guardar interesados y avisarles a todos.',
  },
  {
    id: 'gof-facade-002',
    topic: 'gof',
    tag: 'Facade',
    type: 'identify-pattern',
    difficulty: 2,
    prompt: '¿Qué patrón GoF aplica este código?',
    code: {
      language: 'tsx',
      source: `export function useCheckout(carrito: Carrito) {
  const { reservar } = useStock();
  const { cobrar } = usePagos();
  const { programar } = useEnvios();

  return async () => {
    await reservar(carrito);
    await cobrar(carrito.total);
    await programar(carrito);
  };
}`,
      highlightLines: [1, 2, 3, 4, 6],
    },
    codeVariants: {
      java: {
        language: 'java',
        source: `class CheckoutFacade {
    private final Stock stock;
    private final Pagos pagos;
    private final Envios envios;

    void comprar(Carrito carrito) {
        stock.reservar(carrito);
        pagos.cobrar(carrito.total());
        envios.programar(carrito);
    }
}`,
        highlightLines: [1, 6, 7, 8, 9],
      },
    },
    options: [
      { id: 'a', text: 'Facade' },
      { id: 'b', text: 'Adapter' },
      { id: 'c', text: 'Proxy' },
      { id: 'd', text: 'Mediator' },
    ],
    correctOptionId: 'a',
    explanation:
      'Un solo punto de entrada (useCheckout o CheckoutFacade) esconde la coordinación de tres subsistemas. El cliente no necesita conocer stock, pagos ni envíos.',
    optionExplanations: {
      b: 'Adapter traduce una interfaz incompatible; acá no hay dos contratos que conectar, hay un conjunto de pasos que simplificar.',
      c: 'Proxy controla el acceso a un objeto que ya existe; acá se orquesta a varios.',
      d: 'Mediator coordina objetos que se comunican en ambas direcciones; este flujo es de una sola dirección y busca simplificar la API.',
    },
    hint: 'Un único punto de entrada que coordina varios subsistemas.',
  },
  {
    id: 'gof-composite-002',
    topic: 'gof',
    tag: 'Composite',
    type: 'identify-pattern',
    difficulty: 2,
    prompt: '¿Qué patrón GoF aplica este código?',
    code: {
      language: 'tsx',
      source: `type Nodo = { nombre: string; hijos?: Nodo[] };

function Arbol({ nodo, nivel = 0 }: { nodo: Nodo; nivel?: number }) {
  return (
    <div style={{ marginLeft: nivel * 12 }}>
      {nodo.nombre}
      {nodo.hijos?.map((hijo) => (
        <Arbol key={hijo.nombre} nodo={hijo} nivel={nivel + 1} />
      ))}
    </div>
  );
}`,
      highlightLines: [1, 3, 7, 8],
    },
    options: [
      { id: 'a', text: 'Composite' },
      { id: 'b', text: 'Decorator' },
      { id: 'c', text: 'Iterator' },
      { id: 'd', text: 'Chain of Responsibility' },
    ],
    correctOptionId: 'a',
    explanation:
      'El mismo componente trata igual a una hoja (sin hijos) y a un nodo con hijos, y se llama a sí mismo para recorrer la estructura parte-todo. Es la versión React del Composite.',
    optionExplanations: {
      b: 'Decorator envuelve un objeto para sumarle comportamiento; acá se modela una jerarquía, no un envoltorio.',
      c: 'Iterator recorre una colección, pero no representa una estructura de árbol.',
      d: 'Chain of Responsibility pasa una solicitud entre eslabones; acá no hay decisión de quién maneja.',
    },
    hint: 'Hoja y contenedor comparten la misma interfaz.',
  },
  {
    id: 'gof-proxy-002',
    topic: 'gof',
    tag: 'Proxy',
    type: 'identify-pattern',
    difficulty: 3,
    prompt: '¿Qué patrón GoF aplica este código?',
    code: {
      language: 'tsx',
      source: `const DetalleProducto = lazy(() => import('./DetalleProducto'));

function FichaProducto({ id }: { id: string }) {
  return (
    <Suspense fallback={<p>Cargando...</p>}>
      <DetalleProducto id={id} />
    </Suspense>
  );
}`,
      highlightLines: [1, 5, 6],
    },
    codeVariants: {
      java: {
        language: 'java',
        source: `class ImagenProxy implements Imagen {
    private ImagenReal real;

    public void dibujar() {
        if (real == null) {
            real = new ImagenReal();
        }
        real.dibujar();
    }
}`,
        highlightLines: [1, 2, 5, 6, 8],
      },
    },
    options: [
      { id: 'a', text: 'Decorator' },
      { id: 'b', text: 'Proxy' },
      { id: 'c', text: 'Facade' },
      { id: 'd', text: 'Adapter' },
    ],
    correctOptionId: 'b',
    explanation:
      'Expone el mismo contrato que el objeto real, pero controla cuándo se crea o se carga: lazy más Suspense en React, creación diferida en Java. El cliente cree que habla con el objeto final.',
    optionExplanations: {
      a: 'Decorator también comparte la interfaz, pero agrega comportamiento y siempre delega en el envuelto; acá se decide si siquiera crearlo.',
      c: 'Facade no implementa el mismo contrato ni representa a un único objeto.',
      d: 'Adapter convierte una interfaz en otra; acá se conserva la misma.',
    },
    hint: 'Mismo contrato que el original, pero con carga diferida.',
  },
  {
    id: 'gof-command-002',
    topic: 'gof',
    tag: 'Command',
    type: 'identify-pattern',
    difficulty: 2,
    prompt: '¿Qué patrón GoF aplica este código?',
    code: {
      language: 'tsx',
      source: `type Accion =
  | { type: 'agregar'; item: Item }
  | { type: 'quitar'; id: string };

function carrito(state: Item[], accion: Accion): Item[] {
  switch (accion.type) {
    case 'agregar':
      return [...state, accion.item];
    case 'quitar':
      return state.filter((item) => item.id !== accion.id);
  }
}

const [items, dispatch] = useReducer(carrito, []);
dispatch({ type: 'agregar', item });`,
      highlightLines: [1, 5, 6, 7, 14],
    },
    codeVariants: {
      java: {
        language: 'java',
        source: `interface Comando {
    void ejecutar();
}

class AgregarItem implements Comando {
    private final Carrito carrito;
    private final Item item;

    public void ejecutar() {
        carrito.agregar(item);
    }
}`,
        highlightLines: [1, 5, 9, 10],
      },
    },
    options: [
      { id: 'a', text: 'Strategy' },
      { id: 'b', text: 'Command' },
      { id: 'c', text: 'Observer' },
      { id: 'd', text: 'State' },
    ],
    correctOptionId: 'b',
    explanation:
      'Cada acción se representa como un dato u objeto con su tipo y parámetros, y se entrega a un ejecutor (dispatch en React, un invoker en Java). El receptor no conoce los detalles de la operación.',
    optionExplanations: {
      a: 'Strategy elige un algoritmo entre varios; acá se encapsula una acción con sus parámetros para ejecutarla después.',
      c: 'Observer notifica cambios a suscriptores, no ejecuta acciones.',
      d: 'State cambia el comportamiento según un estado interno, no representa operaciones.',
    },
    hint: 'La acción es un objeto o un dato que después se ejecuta.',
  },
  {
    id: 'gof-chain-002',
    topic: 'gof',
    tag: 'Chain of Responsibility',
    type: 'identify-pattern',
    difficulty: 3,
    prompt: '¿Qué patrón GoF aplica este código?',
    code: {
      language: 'tsx',
      source: `type Middleware = (pedido: Pedido, next: () => void) => void;

function ejecutar(cadena: Middleware[], pedido: Pedido) {
  const paso = (indice: number): void => {
    const actual = cadena[indice];
    if (!actual) return;
    actual(pedido, () => paso(indice + 1));
  };

  paso(0);
}`,
      highlightLines: [1, 4, 6, 7, 10],
    },
    codeVariants: {
      java: {
        language: 'java',
        source: `abstract class Manejador {
    private Manejador siguiente;

    Manejador setSiguiente(Manejador siguiente) {
        this.siguiente = siguiente;
        return siguiente;
    }

    void manejar(Solicitud solicitud) {
        if (puedeResolver(solicitud)) {
            resolver(solicitud);
        } else if (siguiente != null) {
            siguiente.manejar(solicitud);
        }
    }

    abstract boolean puedeResolver(Solicitud solicitud);
    abstract void resolver(Solicitud solicitud);
}`,
        highlightLines: [1, 9, 10, 13],
      },
    },
    options: [
      { id: 'a', text: 'Chain of Responsibility' },
      { id: 'b', text: 'Decorator' },
      { id: 'c', text: 'Command' },
      { id: 'd', text: 'Observer' },
    ],
    correctOptionId: 'a',
    explanation:
      'Cada eslabón decide si maneja la solicitud o la pasa al siguiente, y el emisor no sabe cuál la resuelve. Los middlewares de React o Express son la versión encadenada de esta idea.',
    optionExplanations: {
      b: 'Decorator envuelve para agregar comportamiento y siempre ejecuta al envuelto; acá se decide quién maneja y el resto no se ejecuta.',
      c: 'Command encapsula una acción; no hay cadena de responsables.',
      d: 'Observer notifica a todos los interesados; acá la solicitud se atiende una sola vez.',
    },
    hint: 'Si este no puede, que lo intente el siguiente.',
  },
  {
    id: 'gof-factory-002',
    topic: 'gof',
    tag: 'Factory Method',
    type: 'choose-fix',
    difficulty: 3,
    prompt:
      'Cada formato nuevo obliga a editar crear(). ¿Cuál refactorización aplica mejor Factory Method?',
    code: {
      language: 'java',
      source: `class ReporteService {
    Documento crear(String formato) {
        if (formato.equals("pdf")) {
            return new ReportePdf();
        } else if (formato.equals("csv")) {
            return new ReporteCsv();
        }
        throw new IllegalArgumentException("formato desconocido");
    }
}`,
      highlightLines: [2, 3, 5, 8],
    },
    options: [
      {
        id: 'a',
        text: 'Mover el if/else a una clase ReporteFactory estática y llamar ReporteFactory.crear(formato).',
      },
      {
        id: 'b',
        text: 'Convertir ReporteService en una clase base con el flujo común y un método abstracto crearDocumento(); una subclase por formato.',
      },
      {
        id: 'c',
        text: 'Recibir un Documento ya construido por constructor y eliminar crear().',
      },
      {
        id: 'd',
        text: 'Reemplazar los if por un enum Formato con un switch dentro del constructor de Documento.',
      },
    ],
    correctOptionId: 'b',
    explanation:
      'Factory Method deja el algoritmo en la clase base y delega la creación en la subclase: agregar un formato es agregar una subclase, no volver a editar la clase existente.',
    optionExplanations: {
      a: 'Mover el switch a otra clase lo esconde, pero cada formato nuevo sigue obligando a modificarlo.',
      c: 'Eso traslada la creación al llamador: el servicio deja de decidir y el acoplamiento aumenta.',
      d: 'El switch sigue existiendo y ahora vive dentro de Documento, que es peor: mezcla el producto con la creación.',
    },
    hint: 'La creación es el punto que varía por subclase.',
  },
] satisfies Question[];
