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
    codeVariants: {
      tsx: {
        language: 'tsx',
        source: `export function PanelPedidos() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);

  useEffect(() => {
    fetch('/api/pedidos')
      .then((res) => res.json())
      .then((data) => setPedidos(normalizar(data)));
  }, []);

  const total = pedidos.reduce((suma, p) => suma + p.precio, 0);

  return <Tabla pedidos={pedidos} total={total} />;
}`,
        highlightLines: [4, 7, 10, 12],
      },
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
    codeVariants: {
      tsx: {
        language: 'tsx',
        source: `import { usuariosApi } from '../api/usuarios';

export function BotonRegistrar({ usuario }: { usuario: Usuario }) {
  const registrar = () => usuariosApi.insertar(usuario);

  return <button onClick={registrar}>Registrar</button>;
}`,
        highlightLines: [1, 4],
      },
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
  {
    id: 'solid-srp-003',
    topic: 'solid',
    tag: 'SRP',
    type: 'choose-fix',
    difficulty: 2,
    prompt:
      'El método registrar() guarda, manda email, genera un PDF y escribe logs. ¿Cuál refactorización respeta mejor SRP?',
    code: {
      language: 'java',
      source: `class UsuarioService {
    void registrar(Usuario usuario) {
        repositorio.insertar(usuario);
        smtp.enviar(usuario.email(), "Bienvenido");
        pdf.generar(usuario);
        log.info("usuario registrado");
    }
}`,
      highlightLines: [2, 3, 4, 5, 6],
    },
    options: [
      {
        id: 'a',
        text: 'Separar en UsuarioRepository, EmailBienvenida, ReporteUsuario y Auditoria, y que un caso de uso los coordine.',
      },
      {
        id: 'b',
        text: 'Hacer privados repositorio, smtp, pdf y log para encapsular los detalles.',
      },
      {
        id: 'c',
        text: 'Extraer los cuatro pasos a un método privado registrarTodo().',
      },
      {
        id: 'd',
        text: 'Heredar de BaseService, que ya tiene repositorio y logger.',
      },
    ],
    correctOptionId: 'a',
    explanation:
      'SRP pide una sola razón para cambiar por módulo. Persistencia, notificación, reporte y auditoría cambian por motivos distintos, así que cada una va a su clase y el caso de uso solo las orquesta.',
    optionExplanations: {
      b: 'La encapsulación no separa responsabilidades: la clase sigue cambiando por cuatro motivos.',
      c: 'Mover las cuatro responsabilidades a un método privado no las separa, solo las agrupa con otro nombre.',
      d: 'La herencia no divide responsabilidades y además acopla la clase a una base concreta.',
    },
    hint: 'Una razón para cambiar por cada módulo.',
  },
  {
    id: 'solid-ocp-003',
    topic: 'solid',
    tag: 'OCP',
    type: 'choose-fix',
    difficulty: 3,
    prompt:
      'Agregar un formato de exportación obliga a editar el if/else. ¿Cuál refactorización cumple mejor Open/Closed?',
    code: {
      language: 'java',
      source: `class Exportador {
    String exportar(List<Venta> ventas, String formato) {
        if (formato.equals("csv")) {
            return aCsv(ventas);
        } else if (formato.equals("json")) {
            return aJson(ventas);
        }
        throw new IllegalArgumentException("formato desconocido");
    }
}`,
      highlightLines: [2, 3, 5, 8],
    },
    options: [
      {
        id: 'a',
        text: 'Reemplazar los if por un enum Formato y un switch más corto.',
      },
      {
        id: 'b',
        text: 'Definir una interfaz Exportador con un método exportar(List<Venta>) y una implementación por formato, elegida por un registro.',
      },
      {
        id: 'c',
        text: 'Recibir el formato por constructor y guardarlo en un campo de la clase.',
      },
      {
        id: 'd',
        text: 'Mover el if/else a una clase ExportadorHelper.',
      },
    ],
    correctOptionId: 'b',
    explanation:
      'Con una interfaz, sumar un formato es sumar una implementación: el código existente no se toca. El registro o la inyección solo eligen cuál usar.',
    optionExplanations: {
      a: 'Un enum con switch sigue obligando a editar el switch con cada formato nuevo.',
      c: 'El formato cambia de lugar, pero la decisión por formato sigue dentro de la clase.',
      d: 'Mover el condicional a otra clase no elimina la modificación: solo cambia el archivo que hay que editar.',
    },
    hint: 'Agregar funcionalidad sin abrir el archivo que ya funciona.',
  },
  {
    id: 'solid-dip-003',
    topic: 'solid',
    tag: 'DIP',
    type: 'choose-fix',
    difficulty: 2,
    prompt:
      'El componente importa el cliente HTTP concreto, así que no se puede testear sin red. ¿Cuál refactorización respeta mejor Dependency Inversion?',
    code: {
      language: 'tsx',
      source: `import { api } from '../api';

export function ListaUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);

  useEffect(() => {
    api.get('/usuarios').then((res) => setUsuarios(res.data));
  }, []);

  return (
    <ul>
      {usuarios.map((usuario) => (
        <li key={usuario.id}>{usuario.nombre}</li>
      ))}
    </ul>
  );
}`,
      highlightLines: [1, 7],
    },
    options: [
      {
        id: 'a',
        text: 'Recibir por props o Context una interfaz UsuariosApi y usar esa en el componente.',
      },
      {
        id: 'b',
        text: 'Mover el fetch a una función async dentro del mismo archivo.',
      },
      {
        id: 'c',
        text: 'Cambiar fetch por axios y centralizar la URL en una constante.',
      },
      {
        id: 'd',
        text: 'Envolver el componente en React.memo para evitar renders.',
      },
    ],
    correctOptionId: 'a',
    explanation:
      'El componente de alto nivel debe depender de una abstracción, no del cliente concreto. Con UsuariosApi inyectada, producción usa la API real y los tests usan un doble sin red.',
    optionExplanations: {
      b: 'La función sigue importando el cliente concreto: cambia el lugar, no la dependencia.',
      c: 'Cambiar de librería no invierte nada: el componente sigue acoplado a un detalle.',
      d: 'React.memo optimiza renders; no tiene relación con la dirección de las dependencias.',
    },
    hint: '¿Quién debería decidir qué implementación se usa?',
  },
  {
    id: 'solid-isp-003',
    topic: 'solid',
    tag: 'ISP',
    type: 'choose-fix',
    difficulty: 2,
    prompt:
      'El componente usa usuario y tema, pero su contrato exige cinco props. ¿Cuál refactorización aplica Interface Segregation?',
    code: {
      language: 'tsx',
      source: `type Props = {
  usuario: Usuario;
  permisos: Permiso[];
  preferencias: Preferencias;
  notificaciones: Notificacion[];
  tema: Tema;
};

function Encabezado({ usuario, tema }: Props) {
  return <header className={tema}>{usuario.nombre}</header>;
}`,
      highlightLines: [1, 2, 3, 4, 5, 9],
    },
    options: [
      {
        id: 'a',
        text: 'Reducir el contrato a Props = { usuario, tema } y que quien lo use pase solo eso.',
      },
      {
        id: 'b',
        text: 'Pasar todas las props con spread al header para no romper la firma.',
      },
      {
        id: 'c',
        text: 'Mover todas las props a un contexto global.',
      },
      {
        id: 'd',
        text: 'Marcar como opcionales las props que el componente no usa.',
      },
    ],
    correctOptionId: 'a',
    explanation:
      'ISP pide que el consumidor no dependa de nada que no use. Si el encabezado solo necesita usuario y tema, ese es todo su contrato.',
    optionExplanations: {
      b: 'El spread propaga el contrato gigante y sigue acoplando el componente a datos que no usa.',
      c: 'Un contexto global empeora el acoplamiento: cualquier cambio en el contexto afecta a todos.',
      d: 'Opcionales siguen siendo parte del contrato y obligan a quien llama a conocerlos.',
    },
    hint: 'El contrato debería ser exactamente lo que el componente necesita.',
  },
] satisfies Question[];
