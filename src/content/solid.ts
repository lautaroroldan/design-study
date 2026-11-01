import type { Question } from '../types';

export const solidQuestions = [
  {
    id: 'solid-srp-001',
    topic: 'solid',
    tag: 'SRP',
    type: 'find-violation',
    difficulty: 1,
    prompt: '¿Qué principio SOLID se viola en este código?',
    code: {
      language: 'java',
      source: `class FacturaService {
    void generar(Factura f) { /* arma el PDF */ }
    void enviarPorEmail(Factura f, String destino) { /* SMTP */ }
    void guardarEnBase(Factura f) { /* SQL */ }
    BigDecimal calcularImpuestos(Factura f) { /* ... */ }
}`,
      highlightLines: [1, 2, 3, 4, 5],
    },
    options: [
      { id: 'a', text: 'Open/Closed' },
      { id: 'b', text: 'Single Responsibility' },
      { id: 'c', text: 'Liskov Substitution' },
      { id: 'd', text: 'Dependency Inversion' },
    ],
    correctOptionId: 'b',
    explanation:
      'La clase tiene cuatro razones distintas para cambiar: el formato del PDF, el envío, la persistencia y las reglas impositivas. SRP pide que cada módulo tenga una sola razón para cambiar.',
    optionExplanations: {
      a: 'OCP se refiere a extender sin modificar; acá el problema es la mezcla de responsabilidades.',
      c: 'LSP aplica a jerarquías de herencia, y en este snippet no hay ninguna.',
      d: 'DIP habla de depender de abstracciones; acá no se ve ese problema, aunque también podría mejorarse.',
    },
    hint: 'Contá cuántos motivos distintos harían cambiar esta clase.',
  },
  {
    id: 'solid-srp-002',
    topic: 'solid',
    tag: 'SRP',
    type: 'concept',
    difficulty: 1,
    prompt:
      'Un componente React hace fetch a la API, normaliza los datos, calcula totales y renderiza la tabla con estilos. ¿Qué principio SOLID se está violando con más claridad?',
    options: [
      { id: 'a', text: 'Single Responsibility' },
      { id: 'b', text: 'Open/Closed' },
      { id: 'c', text: 'Interface Segregation' },
      { id: 'd', text: 'Dependency Inversion' },
    ],
    correctOptionId: 'a',
    explanation:
      'Hay cuatro responsabilidades en una sola unidad: obtener datos, transformarlos, aplicar lógica de negocio y presentarlos. Cada una cambia por motivos distintos y debería vivir en su propio módulo o hook.',
    optionExplanations: {
      b: 'OCP se refiere a extender sin modificar; no es el problema central acá.',
      c: 'ISP habla de interfaces o props que el consumidor no usa.',
      d: 'DIP sería el problema si el componente importara el cliente HTTP concreto en vez de recibirlo por props o Context.',
    },
  },
  {
    id: 'solid-ocp-001',
    topic: 'solid',
    tag: 'OCP',
    type: 'find-violation',
    difficulty: 2,
    prompt:
      'Cada tipo de cliente nuevo obliga a editar esta clase y a recompilarla. ¿Qué principio SOLID se viola?',
    code: {
      language: 'java',
      source: `class CalculadoraDescuento {
    BigDecimal calcular(Cliente cliente, BigDecimal total) {
        switch (cliente.tipo()) {
            case VIP: return total.multiply(new BigDecimal("0.80"));
            case MAYORISTA: return total.multiply(new BigDecimal("0.70"));
            case NUEVO: return total.multiply(new BigDecimal("0.95"));
            default: return total;
        }
    }
}`,
      highlightLines: [3, 4, 5, 6, 7],
    },
    options: [
      { id: 'a', text: 'Interface Segregation' },
      { id: 'b', text: 'Open/Closed' },
      { id: 'c', text: 'Liskov Substitution' },
      { id: 'd', text: 'Single Responsibility' },
    ],
    correctOptionId: 'b',
    explanation:
      'La clase no está cerrada a modificación: agregar un tipo de cliente exige cambiar el switch. La corrección es una abstracción Descuento con una implementación por tipo, para extender sin tocar lo que ya funciona.',
    optionExplanations: {
      a: 'No hay interfaces gordas ni implementadores forzados a métodos que no usan.',
      c: 'No hay jerarquía ni contrato de sustitución roto.',
      d: 'La clase tiene una sola responsabilidad (calcular descuentos); el problema es la extensibilidad, no la mezcla de tareas.',
    },
    hint: 'Pensá qué pasa cada vez que aparece un tipo de cliente nuevo.',
  },
  {
    id: 'solid-ocp-002',
    topic: 'solid',
    tag: 'OCP',
    type: 'concept',
    difficulty: 2,
    prompt:
      'El exportador de reportes solo produce CSV. Mañana harán falta JSON y XML. Se busca agregar formatos nuevos sin editar el código que ya funciona ni tocar sus tests. ¿Qué principio guía el diseño?',
    options: [
      { id: 'a', text: 'Single Responsibility' },
      { id: 'b', text: 'Open/Closed' },
      { id: 'c', text: 'Dependency Inversion' },
      { id: 'd', text: 'Liskov Substitution' },
    ],
    correctOptionId: 'b',
    explanation:
      'Open/Closed: definir una abstracción Exportador y agregar implementaciones nuevas sin modificar las existentes.',
    optionExplanations: {
      a: 'SRP ayuda a separar responsabilidades, pero no garantiza que agregar un formato no toque el exportador.',
      c: 'DIP ayuda a depender de abstracciones, pero el criterio pedido es explícitamente "extender sin modificar".',
      d: 'LSP aplica a jerarquías existentes, no a la extensión de funcionalidad.',
    },
  },
  {
    id: 'solid-lsp-001',
    topic: 'solid',
    tag: 'LSP',
    type: 'find-violation',
    difficulty: 2,
    prompt: 'migrar() rompe cuando recibe un Pinguino. ¿Qué principio SOLID se viola?',
    code: {
      language: 'java',
      source: `class Ave {
    void volar() { /* ... */ }
}

class Pinguino extends Ave {
    @Override
    void volar() {
        throw new UnsupportedOperationException("no vuela");
    }
}

void migrar(List<Ave> aves) {
    for (Ave ave : aves) ave.volar();
}`,
      highlightLines: [5, 6, 7, 8, 13],
    },
    options: [
      { id: 'a', text: 'Interface Segregation' },
      { id: 'b', text: 'Liskov Substitution' },
      { id: 'c', text: 'Dependency Inversion' },
      { id: 'd', text: 'Open/Closed' },
    ],
    correctOptionId: 'b',
    explanation:
      'Pinguino no puede sustituir a Ave sin romper el contrato: el cliente espera que volar() funcione. La jerarquía debe modelar lo que realmente comparten (por ejemplo, un Ave base y una interfaz Volador aparte).',
    optionExplanations: {
      a: 'ISP se acerca al síntoma, pero la violación concreta es de sustitución dentro de la jerarquía.',
      c: 'No hay dependencias invertidas de por medio en este snippet.',
      d: 'No se está impidiendo extender: se está rompiendo un contrato existente.',
    },
    hint: '¿Pinguino puede reemplazar a Ave en cualquier lugar donde se use Ave?',
  },
  {
    id: 'solid-lsp-002',
    topic: 'solid',
    tag: 'LSP',
    type: 'concept',
    difficulty: 2,
    prompt:
      'Una subclase CuentaAhorro sobreescribe retirar() y lanza una excepción si el saldo queda bajo un mínimo, algo que la clase base Cuenta nunca prohíbe. El código cliente que trabaja con Cuenta se rompe. ¿Qué principio se viola?',
    options: [
      { id: 'a', text: 'Single Responsibility' },
      { id: 'b', text: 'Open/Closed' },
      { id: 'c', text: 'Liskov Substitution' },
      { id: 'd', text: 'Interface Segregation' },
    ],
    correctOptionId: 'c',
    explanation:
      'La subclase endurece una precondición del contrato: ya no es sustituible por la base. Si el mínimo es una regla propia de ese producto, debe modelarse con otra abstracción o validarse fuera del contrato de Cuenta.',
    optionExplanations: {
      a: 'No hay mezcla de responsabilidades: hay un contrato roto.',
      b: 'OCP no aplica: el problema no es agregar funcionalidad, sino respetar lo que la base promete.',
      d: 'No hay interfaces gordas ni consumidores obligados a métodos que no usan.',
    },
  },
  {
    id: 'solid-isp-001',
    topic: 'solid',
    tag: 'ISP',
    type: 'find-violation',
    difficulty: 1,
    prompt: '¿Qué principio SOLID se viola en este código?',
    code: {
      language: 'java',
      source: `interface Trabajador {
    void trabajar();
    void comer();
}

class Robot implements Trabajador {
    public void trabajar() { /* ensambla piezas */ }
    public void comer() {
        throw new UnsupportedOperationException();
    }
}`,
      highlightLines: [1, 2, 3, 6, 8, 9],
    },
    options: [
      { id: 'a', text: 'Dependency Inversion' },
      { id: 'b', text: 'Interface Segregation' },
      { id: 'c', text: 'Open/Closed' },
      { id: 'd', text: 'Single Responsibility' },
    ],
    correctOptionId: 'b',
    explanation:
      'Robot está obligado a implementar comer(), un método que no usa. Conviene separar la interfaz en otras más chicas, por ejemplo Trabajable y Alimentable, y que cada clase implemente solo lo que necesita.',
    optionExplanations: {
      a: 'No hay dependencia de un detalle concreto en el snippet.',
      c: 'OCP no aplica: el problema es la interfaz, no la extensión.',
      d: 'SRP habla de responsabilidades de la clase, no del tamaño del contrato que implementa.',
    },
    hint: 'Un método implementado con UnsupportedOperationException suele ser una pista.',
  },
  {
    id: 'solid-isp-002',
    topic: 'solid',
    tag: 'ISP',
    type: 'concept',
    difficulty: 1,
    prompt:
      'Un componente React recibe props con { usuario, permisos, preferencias, notificaciones, tema }, pero solo usa usuario y tema. Cada cambio en el resto obliga a revisar sus tests y provoca renders innecesarios. ¿Qué principio se viola?',
    options: [
      { id: 'a', text: 'Interface Segregation' },
      { id: 'b', text: 'Open/Closed' },
      { id: 'c', text: 'Liskov Substitution' },
      { id: 'd', text: 'Single Responsibility' },
    ],
    correctOptionId: 'a',
    explanation:
      'El componente depende de una interfaz (sus props) más grande de lo que necesita: Interface Segregation. Lo correcto es recibir solo lo que usa, o dividir el componente.',
    optionExplanations: {
      b: 'No hay problema de extensión: hay un contrato demasiado ancho.',
      c: 'No hay herencia ni sustitución involucrada.',
      d: 'El componente puede tener una sola responsabilidad y aun así recibir props de más.',
    },
  },
  {
    id: 'solid-dip-001',
    topic: 'solid',
    tag: 'DIP',
    type: 'find-violation',
    difficulty: 2,
    prompt: 'Los tests no pueden correr sin una base MySQL real. ¿Qué principio SOLID se viola?',
    code: {
      language: 'java',
      source: `class ServicioUsuarios {
    private final RepositorioMySQL repositorio = new RepositorioMySQL();

    void registrar(Usuario usuario) {
        repositorio.insertar(usuario);
    }
}`,
      highlightLines: [2],
    },
    options: [
      { id: 'a', text: 'Single Responsibility' },
      { id: 'b', text: 'Open/Closed' },
      { id: 'c', text: 'Dependency Inversion' },
      { id: 'd', text: 'Liskov Substitution' },
    ],
    correctOptionId: 'c',
    explanation:
      'El módulo de alto nivel crea y depende de una implementación concreta. Debería depender de una abstracción (RepositorioUsuarios) que se inyecta: MySQL en producción y un doble en tests.',
    optionExplanations: {
      a: 'La clase tiene una sola responsabilidad; el problema es de qué depende.',
      b: 'No se está impidiendo la extensión: se está fijando la implementación.',
      d: 'No hay herencia ni contrato de sustitución en juego.',
    },
    hint: 'Mirá el new dentro del campo y preguntate cómo lo reemplazarías en un test.',
  },
  {
    id: 'solid-dip-002',
    topic: 'solid',
    tag: 'DIP',
    type: 'concept',
    difficulty: 2,
    prompt:
      'La capa de dominio instancia dentro del caso de uso un cliente concreto del proveedor de email (new EnvioEmailSMTP()) y llama a sus métodos. Cambiar de proveedor obliga a tocar el dominio. ¿Qué principio SOLID se viola?',
    options: [
      { id: 'a', text: 'Dependency Inversion' },
      { id: 'b', text: 'Interface Segregation' },
      { id: 'c', text: 'Single Responsibility' },
      { id: 'd', text: 'Open/Closed' },
    ],
    correctOptionId: 'a',
    explanation:
      'El dominio (alto nivel) depende de un detalle (el cliente concreto). Corresponde definir una interfaz NotificadorEmail en el dominio e inyectar la implementación desde afuera.',
    optionExplanations: {
      b: 'No hay interfaces gordas ni métodos forzados en este problema.',
      c: 'La responsabilidad del caso de uso puede estar bien delimitada; lo que está mal es la dirección de la dependencia.',
      d: 'OCP también se resiente, pero el criterio que describe el problema es depender de una abstracción y no de un detalle.',
    },
  },
] satisfies Question[];
