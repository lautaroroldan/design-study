import type { Question } from '../types';

export const graspQuestions = [
  {
    id: 'grasp-information-expert-001',
    topic: 'grasp',
    tag: 'Information Expert',
    type: 'concept',
    difficulty: 1,
    prompt:
      '¿A qué clase le corresponde calcular el total de un Pedido: Pedido, CalculadoraTotales, CarritoController o BaseDeDatos?',
    options: [
      { id: 'a', text: 'BaseDeDatos' },
      { id: 'b', text: 'Pedido' },
      { id: 'c', text: 'CarritoController' },
      { id: 'd', text: 'CalculadoraTotales' },
    ],
    correctOptionId: 'b',
    explanation:
      'Information Expert: el total se calcula con los ítems y precios que Pedido ya conoce. Asignar la responsabilidad a quien tiene la información evita exponer los datos y duplicar la regla.',
    optionExplanations: {
      a: 'La base de datos persiste objetos; no debe conocer reglas de negocio.',
      c: 'El controller coordina la entrada del sistema, no debería saber precios ni totales.',
      d: 'Una calculadora externa obliga a exponer las líneas del pedido: acoplamiento innecesario.',
    },
    hint: '¿Quién ya tiene los datos necesarios para hacer el cálculo?',
  },
  {
    id: 'grasp-information-expert-002',
    topic: 'grasp',
    tag: 'Information Expert',
    type: 'find-violation',
    difficulty: 2,
    prompt:
      '¿Qué patrón GRASP se viola al poner el cálculo del total en ReporteTotales en vez de en Pedido?',
    code: {
      language: 'java',
      source: `class Pedido {
    private final List<LineaPedido> lineas;
    List<LineaPedido> getLineas() { return lineas; }
}

class ReporteTotales {
    BigDecimal total(Pedido pedido) {
        BigDecimal total = BigDecimal.ZERO;
        for (LineaPedido linea : pedido.getLineas()) {
            total = total.add(linea.precioUnitario().multiply(BigDecimal.valueOf(linea.cantidad())));
        }
        return total;
    }
}`,
      highlightLines: [3, 6, 9, 10],
    },
    options: [
      { id: 'a', text: 'Creator' },
      { id: 'b', text: 'Information Expert' },
      { id: 'c', text: 'Controller' },
      { id: 'd', text: 'Pure Fabrication' },
    ],
    correctOptionId: 'b',
    explanation:
      'Pedido ya tiene las líneas: la fórmula del total le corresponde a él. Ponerla afuera obliga a exponer getLineas() y a repetir la regla en cada cliente que necesite el total.',
    optionExplanations: {
      a: 'Creator trata de quién crea objetos, no de quién calcula.',
      c: 'Controller coordina los eventos del sistema, no calcula totales de dominio.',
      d: 'Pure Fabrication justifica inventar clases para bajar acoplamiento; acá se creó una clase que duplica información que la entidad ya tenía.',
    },
    hint: 'El getter existe solo porque el cálculo se fue a otra clase.',
  },
  {
    id: 'grasp-creator-001',
    topic: 'grasp',
    tag: 'Creator',
    type: 'concept',
    difficulty: 1,
    prompt: '¿Quién debería crear las LineaPedido de una compra?',
    options: [
      { id: 'a', text: 'Pedido' },
      { id: 'b', text: 'ImpresoraFactura' },
      { id: 'c', text: 'ServicioDeEmail' },
      { id: 'd', text: 'Logger' },
    ],
    correctOptionId: 'a',
    explanation:
      'Creator: Pedido contiene y agrega LineaPedido, tiene los datos para construirlas y controla su ciclo de vida. Es el candidato natural para crearlas.',
    optionExplanations: {
      b: 'La impresora solo consume el pedido para mostrarlo.',
      c: 'El servicio de email notifica; no participa de la composición del pedido.',
      d: 'El logger no tiene relación con la estructura del dominio.',
    },
  },
  {
    id: 'grasp-controller-001',
    topic: 'grasp',
    tag: 'Controller',
    type: 'concept',
    difficulty: 1,
    prompt:
      'La interfaz de una tienda debe atender los eventos "agregar al carrito" y "confirmar compra". ¿Qué patrón GRASP sugiere un objeto que reciba esos eventos del sistema y coordine los casos de uso?',
    options: [
      { id: 'a', text: 'Controller' },
      { id: 'b', text: 'Information Expert' },
      { id: 'c', text: 'Indirection' },
      { id: 'd', text: 'Polymorphism' },
    ],
    correctOptionId: 'a',
    explanation:
      'Controller: un objeto de la capa de aplicación (por ejemplo VentasController) recibe los eventos de la UI y delega en el dominio, sin mezclar presentación con reglas de negocio.',
    optionExplanations: {
      b: 'Information Expert decide quién tiene los datos, no quién recibe eventos del sistema.',
      c: 'Indirection interpone un intermediario para desacoplar; no describe el punto de entrada de la UI.',
      d: 'Polymorphism reemplaza condicionales por tipos, no organiza la entrada del sistema.',
    },
  },
  {
    id: 'grasp-low-coupling-001',
    topic: 'grasp',
    tag: 'Low Coupling',
    type: 'find-violation',
    difficulty: 2,
    prompt:
      'La clase hace una sola cosa, pero cambiarla obliga a tocar tres proveedores distintos. ¿Qué patrón GRASP se viola con más claridad?',
    code: {
      language: 'java',
      source: `class NotificadorPedido {
    private final SmtpClient smtp = new SmtpClient("smtp.mail.com");
    private final TwilioClient sms = new TwilioClient("token");
    private final PushGateway push = new PushGateway();

    void notificar(Pedido pedido) {
        smtp.enviar(pedido.cliente().email(), "ok");
        sms.enviar(pedido.cliente().telefono(), "ok");
        push.enviar(pedido.cliente().deviceId(), "ok");
    }
}`,
      highlightLines: [2, 3, 4],
    },
    options: [
      { id: 'a', text: 'High Cohesion' },
      { id: 'b', text: 'Low Coupling' },
      { id: 'c', text: 'Creator' },
      { id: 'd', text: 'Protected Variations' },
    ],
    correctOptionId: 'b',
    explanation:
      'Acoplamiento alto: NotificadorPedido conoce y crea tres clientes concretos, y usa sus APIs directamente. Inyectarlos detrás de una interfaz CanaldeNotificacion permite cambiar cualquier proveedor sin tocarla.',
    optionExplanations: {
      a: 'La clase está enfocada en una sola tarea (notificar), así que su cohesión es alta.',
      c: 'Creator decide quién crea objetos; acá el problema es a quién conoce la clase.',
      d: 'Protected Variations es la estrategia de diseño que resolvería el problema, pero el patrón violado es Low Coupling.',
    },
    hint: 'Contá de cuántas clases concretas depende y cuántas instancia.',
  },
  {
    id: 'grasp-high-cohesion-001',
    topic: 'grasp',
    tag: 'High Cohesion',
    type: 'find-violation',
    difficulty: 2,
    prompt:
      '¿Qué patrón GRASP se viola en una clase que reúne tareas sin relación entre sí?',
    code: {
      language: 'java',
      source: `class UtilidadesSistema {
    String formatearFecha(LocalDate fecha) { /* ... */ }
    BigDecimal calcularIva(BigDecimal monto) { /* ... */ }
    void enviarEmail(String destino) { /* ... */ }
    byte[] comprimirZip(byte[] datos) { /* ... */ }
    String generarPassword() { /* ... */ }
}`,
      highlightLines: [1, 2, 3, 4, 5, 6],
    },
    options: [
      { id: 'a', text: 'High Cohesion' },
      { id: 'b', text: 'Low Coupling' },
      { id: 'c', text: 'Polymorphism' },
      { id: 'd', text: 'Information Expert' },
    ],
    correctOptionId: 'a',
    explanation:
      'Alta cohesión significa responsabilidades relacionadas y enfocadas. Acá conviven formato de fechas, impuestos, mensajería, compresión y seguridad: cinco motivos distintos para cambiar. Conviene separarlas en clases específicas.',
    optionExplanations: {
      b: 'El acoplamiento no es el problema principal: no se ve una red de dependencias concretas.',
      c: 'No hay condicionales por tipo que reemplazar por polimorfismo.',
      d: 'Information Expert asignaría responsabilidades según los datos; acá el problema es que no comparten tema.',
    },
  },
  {
    id: 'grasp-polymorphism-001',
    topic: 'grasp',
    tag: 'Polymorphism',
    type: 'concept',
    difficulty: 2,
    prompt:
      'El checkout tiene un switch por tipo de pago (tarjeta, transferencia, cripto) y cada rama calcula comisiones distintas. ¿Qué patrón GRASP reemplaza el switch por comportamiento polimórfico?',
    options: [
      { id: 'a', text: 'Polymorphism' },
      { id: 'b', text: 'Pure Fabrication' },
      { id: 'c', text: 'Indirection' },
      { id: 'd', text: 'Controller' },
    ],
    correctOptionId: 'a',
    explanation:
      'Polymorphism: una interfaz MetodoPago con una implementación por tipo; el cliente envía el mismo mensaje y cada clase resuelve su comisión. En términos GoF, esto se materializa como Strategy.',
    optionExplanations: {
      b: 'Pure Fabrication inventa clases para bajar acoplamiento; acá el objetivo es distribuir comportamiento por tipo.',
      c: 'Indirection interpone un intermediario, no reemplaza condicionales.',
      d: 'Controller coordina casos de uso, no elimina switches de dominio.',
    },
  },
  {
    id: 'grasp-pure-fabrication-001',
    topic: 'grasp',
    tag: 'Pure Fabrication',
    type: 'concept',
    difficulty: 3,
    prompt:
      'Ninguna clase del dominio (Pedido, Cliente, Producto) debería saber de SQL. Se decide crear RepositorioPedidos, una clase que no representa ningún concepto del negocio. ¿Qué patrón GRASP justifica esa decisión?',
    options: [
      { id: 'a', text: 'Information Expert' },
      { id: 'b', text: 'Creator' },
      { id: 'c', text: 'Pure Fabrication' },
      { id: 'd', text: 'Protected Variations' },
    ],
    correctOptionId: 'c',
    explanation:
      'Pure Fabrication: se inventa una clase cohesiva y sin equivalente en el dominio para no ensuciar las entidades y reducir el acoplamiento con la persistencia.',
    optionExplanations: {
      a: 'Information Expert asignaría el cálculo a quien tiene los datos, justo lo que se quiere evitar acá.',
      b: 'Creator asignaría la creación a quien contiene o usa los objetos.',
      d: 'Protected Variations protege ante una variación futura, pero el criterio de diseño acá es la clase inventada.',
    },
  },
  {
    id: 'grasp-indirection-001',
    topic: 'grasp',
    tag: 'Indirection',
    type: 'concept',
    difficulty: 2,
    prompt:
      'Dos módulos se comunican directo y cada cambio en uno rompe al otro. Se interpone un servicio que recibe el mensaje y lo reenvía, sin lógica de negocio propia. ¿Qué patrón GRASP aplica?',
    options: [
      { id: 'a', text: 'Indirection' },
      { id: 'b', text: 'Low Coupling' },
      { id: 'c', text: 'Controller' },
      { id: 'd', text: 'Information Expert' },
    ],
    correctOptionId: 'a',
    explanation:
      'Indirection: un intermediario con responsabilidad acotada desacopla emisor y receptor. El objetivo es bajo acoplamiento, pero el patrón que describe al intermediario es Indirection.',
    optionExplanations: {
      b: 'Low Coupling es el objetivo que se busca; la pregunta apunta al mecanismo que lo logra.',
      c: 'Controller recibe eventos del sistema, no reenvía mensajes entre módulos internos.',
      d: 'Information Expert reparte responsabilidades según los datos, no interpone intermediarios.',
    },
    hint: 'Intermediario sin lógica propia: eso es el patrón.',
  },
  {
    id: 'grasp-protected-variations-001',
    topic: 'grasp',
    tag: 'Protected Variations',
    type: 'concept',
    difficulty: 3,
    prompt:
      'La app usa hoy una pasarela de pago, pero el equipo sabe que va a cambiar de proveedor cada año. Se define una interfaz PagoGateway y los casos de uso dependen solo de ella. ¿Qué patrón GRASP describe esta protección frente a la variación?',
    options: [
      { id: 'a', text: 'Protected Variations' },
      { id: 'b', text: 'Creator' },
      { id: 'c', text: 'Pure Fabrication' },
      { id: 'd', text: 'Polymorphism' },
    ],
    correctOptionId: 'a',
    explanation:
      'Protected Variations: identificar los puntos de variación probable y aislarlos detrás de una interfaz estable. Los casos de uso no se enteran de qué proveedor hay detrás.',
    optionExplanations: {
      b: 'Creator trata de quién crea objetos, no de aislar cambios.',
      c: 'Pure Fabrication justifica inventar una clase; acá el criterio es proteger un punto de variación.',
      d: 'Polymorphism es el mecanismo que se usa para lograrlo, pero el patrón que nombra el criterio de diseño es Protected Variations.',
    },
  },
  {
    id: 'grasp-controller-002',
    topic: 'grasp',
    tag: 'Controller',
    type: 'identify-pattern',
    difficulty: 2,
    prompt: '¿Qué patrón GRASP aplica este código?',
    code: {
      language: 'java',
      source: `class VentasController {
    private final CarritoService carrito;
    private final PagoService pagos;

    void agregarAlCarrito(String productoId, int cantidad) {
        carrito.agregar(productoId, cantidad);
    }

    Recibo confirmarCompra(String carritoId) {
        return pagos.cobrar(carrito.confirmar(carritoId));
    }
}`,
      highlightLines: [1, 5, 9],
    },
    options: [
      { id: 'a', text: 'Controller' },
      { id: 'b', text: 'Information Expert' },
      { id: 'c', text: 'Creator' },
      { id: 'd', text: 'Pure Fabrication' },
    ],
    correctOptionId: 'a',
    explanation:
      'Controller: un objeto de la capa de aplicación recibe los eventos del sistema (las acciones de la UI) y delega en los servicios de dominio, sin quedarse con la lógica de negocio.',
    optionExplanations: {
      b: 'Information Expert asigna responsabilidades a quien tiene los datos; el controller no calcula nada, solo recibe y delega.',
      c: 'Creator decide quién crea objetos; acá no se crea nada.',
      d: 'Pure Fabrication justifica una clase inventada para bajar acoplamiento, pero no describe el punto de entrada de los eventos.',
    },
    hint: 'Punto de entrada de los eventos de la interfaz.',
  },
  {
    id: 'grasp-polymorphism-002',
    topic: 'grasp',
    tag: 'Polymorphism',
    type: 'identify-pattern',
    difficulty: 2,
    prompt: '¿Qué patrón GRASP aplica este código?',
    code: {
      language: 'java',
      source: `interface MetodoPago {
    BigDecimal comision(BigDecimal monto);
}

class Tarjeta implements MetodoPago {
    public BigDecimal comision(BigDecimal monto) {
        return monto.multiply(new BigDecimal("0.03"));
    }
}

BigDecimal total(List<MetodoPago> pagos, BigDecimal monto) {
    BigDecimal total = monto;
    for (MetodoPago pago : pagos) {
        total = total.add(pago.comision(monto));
    }
    return total;
}`,
      highlightLines: [1, 12, 15],
    },
    codeVariants: {
      tsx: {
        language: 'tsx',
        source: `type MetodoPago = { comision: (monto: number) => number };

const tarjeta: MetodoPago = { comision: (monto) => monto * 0.03 };
const cripto: MetodoPago = { comision: (monto) => monto * 0.01 };

function total(pagos: MetodoPago[], monto: number) {
  return pagos.reduce((suma, pago) => suma + pago.comision(monto), monto);
}`,
        highlightLines: [1, 3, 6, 7],
      },
    },
    options: [
      { id: 'a', text: 'Polymorphism' },
      { id: 'b', text: 'Low Coupling' },
      { id: 'c', text: 'Indirection' },
      { id: 'd', text: 'Protected Variations' },
    ],
    correctOptionId: 'a',
    explanation:
      'Cada implementación resuelve su comisión detrás de la misma interfaz y el cliente repite el mismo mensaje sin preguntar el tipo. Así se evita el switch por tipo de pago.',
    optionExplanations: {
      b: 'Low Coupling es un efecto secundario deseable, pero el patrón que describe el reparto de comportamiento por tipo es Polymorphism.',
      c: 'Indirection interpone un intermediario; acá no hay intermediario, hay varias implementaciones.',
      d: 'Protected Variations protege ante cambios futuros; el mecanismo concreto que se ve es el polimorfismo.',
    },
    hint: 'El mismo mensaje, distintas implementaciones.',
  },
  {
    id: 'grasp-information-expert-003',
    topic: 'grasp',
    tag: 'Information Expert',
    type: 'identify-pattern',
    difficulty: 1,
    prompt: '¿Qué patrón GRASP aplica este código?',
    code: {
      language: 'java',
      source: `class Pedido {
    private final List<LineaPedido> lineas;

    BigDecimal total() {
        return lineas.stream()
            .map(LineaPedido::subtotal)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}`,
      highlightLines: [4, 5, 6],
    },
    options: [
      { id: 'a', text: 'Information Expert' },
      { id: 'b', text: 'Creator' },
      { id: 'c', text: 'Controller' },
      { id: 'd', text: 'Low Coupling' },
    ],
    correctOptionId: 'a',
    explanation:
      'La responsabilidad de calcular el total está en quien tiene los datos (las líneas del pedido). Nadie más necesita conocer la estructura interna para sumar.',
    optionExplanations: {
      b: 'Creator trata de quién crea objetos; total() no crea nada.',
      c: 'Controller recibe eventos del sistema, no calcula totales del dominio.',
      d: 'Low Coupling es una consecuencia de asignar bien la responsabilidad, no el patrón que la describe.',
    },
    hint: 'Quien tiene los datos, hace el cálculo.',
  },
  {
    id: 'grasp-low-coupling-002',
    topic: 'grasp',
    tag: 'Low Coupling',
    type: 'identify-pattern',
    difficulty: 2,
    prompt: '¿Qué patrón GRASP guía este diseño?',
    code: {
      language: 'tsx',
      source: `type Props = { notificador: Notificador };

export function BotonPagar({ notificador }: Props) {
  const pagar = async () => {
    const recibo = await cobrar();
    notificador.enviar(recibo.cliente, recibo);
  };

  return <button onClick={pagar}>Pagar</button>;
}`,
      highlightLines: [1, 3, 6],
    },
    options: [
      { id: 'a', text: 'Low Coupling' },
      { id: 'b', text: 'High Cohesion' },
      { id: 'c', text: 'Creator' },
      { id: 'd', text: 'Controller' },
    ],
    correctOptionId: 'a',
    explanation:
      'El componente depende de una abstracción que recibe de afuera (Notificador) en lugar de importar un cliente concreto de email. Menos dependencias fijas: se puede cambiar el canal o usar un doble en tests sin tocar el componente.',
    optionExplanations: {
      b: 'High Cohesion habla de responsabilidades relacionadas dentro de una clase; acá el foco está en las dependencias externas.',
      c: 'Creator decide quién crea objetos, no cómo se inyectan dependencias.',
      d: 'Controller es el punto de entrada de los eventos del sistema, no el criterio de acoplamiento.',
    },
    hint: 'Depender de lo mínimo y de abstracciones.',
  },
] satisfies Question[];
