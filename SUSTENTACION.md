# Guion de sustentación técnica — ACME HR CLI

> Duración sugerida: 15–20 min de exposición y 10 min de preguntas.
> Ten abiertos: el editor con `src/`, una terminal con `node src/main.js` y otra con los tests.
> Las líneas en cursiva son lo que dices; lo demás son tus notas.

---

## 0. Apertura (1 min)

*"Buenos días. Les presento ACME HR CLI, una aplicación de consola en Node.js para que Talento Humano gestione empleados: registrar, listar, buscar, actualizar y eliminar. Tenía tres restricciones: cero dependencias externas, persistencia solo en memoria y validación estricta de cinco reglas de negocio (RN-01 a RN-05) sobre cinco requerimientos funcionales (RF-01 a RF-05)."*

*"Más que el CRUD, quiero mostrarles cómo lo organicé para que el negocio no dependa de la consola ni del almacenamiento, porque eso es lo que permite que mañana sea una API con PostgreSQL sin tocar las reglas."*

Datos rápidos para tener a mano:
- Node 20+, ES Modules (`"type": "module"`), campos privados `#`, `async/await`.
- Solo módulos nativos: `node:readline/promises`, `node:crypto` (`randomUUID`), `node:process`, `node:test`.
- 4 suites, 12 pruebas, todas pasan (`npm test`).
- Flujo de Git: una rama por funcionalidad (`feature/*`, `test/*`, `fix/*`) → `dev` → `main` con pull requests, y una publicación `v1.0.0`.

---

## Guía de navegación: qué archivo mostrar en cada momento

> Usa esta sección como "chuleta" mientras hablas. Cada fila dice **qué estás explicando → qué archivo abrir → qué línea señalar**.
> En VS Code: `Cmd + P` y escribes el nombre del archivo; luego `Ctrl + G` y escribes el número de línea para saltar directo.

### Mapa del proyecto (muéstralo al iniciar la sección 1)

Abre el explorador de archivos de VS Code y despliega `src/` completo. Señala las carpetas en este orden:

```text
acme-hr-cli/
├── package.json                 ← scripts npm start / npm test, "type": "module"
├── src/
│   ├── main.js                  ← ⑤ ARRANQUE: aquí se conecta todo
│   ├── domain/                  ← ① NÚCLEO (no depende de nadie)
│   │   ├── entities/Employee.js         ← entidad + randomUUID
│   │   ├── validators/EmployeeValidator.js  ← reglas RN-01..05
│   │   ├── errors/DomainErrors.js       ← AppError y subclases
│   │   └── repositories/employeeRepository.js  ← contrato (puerto)
│   ├── application/use-cases/   ← ② CASOS DE USO (RF-01..05)
│   ├── infrastructure/persistence/  ← ③ ARREGLO EN MEMORIA (adaptador)
│   └── presentation/            ← ④ CONSOLA Y MENÚ
└── tests/                       ← ⑥ PRUEBAS node:test
```

*"Lo leo de adentro hacia afuera: primero el dominio, luego quién lo usa."*

### Paso a paso, en el orden del guion

#### Sección 0 — Apertura
| Qué dices | Archivo a mostrar | Qué señalar |
|---|---|---|
| "Cero dependencias, ES Modules" | `package.json` | `"type": "module"`, que no hay bloque `dependencies`, y los scripts `start` / `test` (líneas 15–17) |

#### Sección 1 — Arquitectura
| Qué dices | Archivo a mostrar | Qué señalar |
|---|---|---|
| "Cuatro capas" | Explorador de VS Code, carpeta `src/` | Las 4 carpetas `domain`, `application`, `infrastructure`, `presentation` |
| "El dominio no importa nada externo" | `src/domain/entities/Employee.js` | Líneas 7–8: solo importa `node:crypto` y su propio validador |
| "La infraestructura depende del dominio (DIP)" | `src/infrastructure/persistence/InMemoryEmployeeRepository.js` | Línea 6 (`import` desde `domain`) y línea 13 (`extends EmployeeRepository`) |
| "Composition Root" | `src/main.js` | Líneas 25–39: se crean validador, repositorio, casos de uso, UI y controlador |
| "Inyección por constructor" | `src/application/use-cases/RegisterEmployee.js` | Líneas 15–17: el repositorio llega por constructor, no se crea adentro |

#### Sección 2.1 — Entidad `Employee`
Archivo: **`src/domain/entities/Employee.js`**

| Qué dices | Línea |
|---|---|
| "Uso `randomUUID` nativo de Node" | **7** — `import { randomUUID } from 'node:crypto';` |
| "Atributos privados con `#`" | 16–27 |
| "Valida antes de asignar" | 36 — `EmployeeValidator.validate(props);` |
| "Genera el UUID o conserva el existente" | **38** — `this.#id = props.id ?? randomUUID();` |
| "Normaliza: `trim`, mayúsculas, minúsculas" | 39–49 (género 42, email 43, salario 49) |
| "Solo getters, sin setters" | 57–68 |
| "Actualización sin modificar el original" | 75–81 — `withUpdates` |
| "Objeto plano para cruzar capas" | 88–103 — `toPrimitives` |

#### Sección 2.2 — Reglas de negocio
Archivo: **`src/domain/validators/EmployeeValidator.js`**

| Regla | Línea |
|---|---|
| `Set` de géneros permitidos | 13 |
| Punto de entrada `static validate` (orden de las reglas) | 27–38 |
| RN-01 nombres y apellidos | 44 |
| RN-02 género | 53 |
| RN-03 contacto + expresión regular del email | 64 (regex en 66) |
| RN-04 profesión y cargo | 78 |
| RN-05 salario > 0 | 87 |
| Ayudante reutilizable (DRY) | 97 |

#### Sección 2.3 — Errores
Archivo: **`src/domain/errors/DomainErrors.js`**

| Qué dices | Línea |
|---|---|
| "Clase base con `code`" | 6–12 — `AppError` |
| `ValidationError` | 18 |
| `DuplicateEmployeeError` | 28 |
| `EmployeeNotFoundError` | 41 |
| "Y aquí se usa la jerarquía" → cambia a `src/presentation/EmployeeMenuController.js` | 63–69 — `catch` con `instanceof AppError` |

#### Sección 2.4 — Contrato del repositorio
Archivo: **`src/domain/repositories/employeeRepository.js`**
- Líneas 7–30: los 6 métodos que lanzan "no implementado".

#### Sección 2.5 — Repositorio en memoria
Archivo: **`src/infrastructure/persistence/InMemoryEmployeeRepository.js`**

| Qué dices | Línea |
|---|---|
| "Arreglo privado en RAM" | 15 — `#employees = [];` |
| `save` | 22 |
| "Devuelvo una copia para proteger el estado" | 33–35 — `findAll` |
| Búsquedas por UUID / identificación | 41 / 50 |
| `update` con `findIndex` | 61 |
| `delete` con `splice` | 73 |

#### Sección 2.6 — Casos de uso
Carpeta: **`src/application/use-cases/`**

| Caso de uso | Archivo | Líneas clave |
|---|---|---|
| RF-01 Registrar | `RegisterEmployee.js` | 29 (control de duplicado), 33 (`new Employee` → valida y crea UUID), 34 (`save`) |
| RF-02 Listar | `ListEmployees.js` | 13–15 |
| RF-03 Buscar por identificación | `FindEmployeeByIdentification.js` | 23–36 |
| RF-04 Actualizar | `UpdateEmployee.js` | 33 (busca por UUID), 38–43 (duplicado si cambia la identificación), 45 (`withUpdates`), 46 (`update`) |
| RF-05 Eliminar | `DeleteEmployee.js` | 17–28 |
| Extra: buscar por nombre | `FindEmployee.js` | 25–45 |

> ⚠️ No te detengas en `UpdateEmployee.js` línea 47 (línea sobrante, ver 3.1). Si lo hacen notar, ya tienes la respuesta.

#### Sección 2.7 — Consola
Archivo: **`src/presentation/ConsoleUI.js`**

| Qué dices | Línea |
|---|---|
| "`readline/promises` nativo" | 5 y 16 |
| "`ask` asíncrono" | 22 |
| `[OK]` / `[ERROR]` / `[INFO]` | 33–43 |
| `console.table` | 49 |

#### Sección 2.8 — Controlador del menú
Archivo: **`src/presentation/EmployeeMenuController.js`**

| Qué dices | Línea |
|---|---|
| "Bucle del menú" | 28 — `while (isRunning)` |
| "`switch` por opción" | 40–62 |
| "El `try/catch` dentro del bucle: nunca se cae" | 63–69 |
| Registrar (pide los 11 campos) | 79 |
| Actualización parcial (solo campos escritos) | 143–145 — `Object.fromEntries(...filter...)` |

#### Sección 2.9 — Arranque
Archivo: **`src/main.js`**

| Qué dices | Línea |
|---|---|
| Composition Root | 21–40 |
| Ctrl+C ordenado | 46 — `process.on('SIGINT', ...)` |
| Red de seguridad final `[FATAL]` | 65 — `app.run().catch(...)` |

#### Sección 2.10 — Pruebas
Carpeta: **`tests/`**

| Qué dices | Archivo | Línea |
|---|---|---|
| "Crea UUID y normaliza" | `domain.test.js` | 34 |
| "Rechaza RN-01..05" | `domain.test.js` | 45 |
| "Protege el arreglo contra modificaciones externas" | `inMemoryEmployeeRepository.test.js` | 42 |
| "CRUD completo" | `use-cases.test.js` | 61 |
| "Duplicados e inexistentes" | `employee.test.js` | 110 |

Luego cambia a la **terminal** y ejecuta `npm test` (deben salir 12 aprobadas) y después `npm start` para la demo.

#### Sección 3 — Mejoras (si piden ver los problemas)
| Problema | Dónde mostrarlo |
|---|---|
| Mayúsculas en la importación | Explorador: `src/domain/repositories/employeeRepository.js` (con minúscula) vs. `InMemoryEmployeeRepository.js` línea 6 (`EmployeeRepository.js` con mayúscula) |
| Línea sobrante | `src/application/use-cases/UpdateEmployee.js` línea 47 |
| Búsqueda por nombre sin conectar | `src/main.js` líneas 29–35 (no aparece `FindEmployee`) y `EmployeeMenuController.js` líneas 30–35 (menú solo hasta 5) |
| Validador inyectado sin uso | `src/main.js` línea 30 vs. `RegisterEmployee.js` línea 15 (el constructor solo recibe el repositorio) |

### Recorrido "en vivo" de un registro (si te piden seguir el flujo en el código)

Abre los archivos en este orden, saltando con `Cmd + clic` sobre cada llamada:

1. `src/presentation/EmployeeMenuController.js:79` → `#handleRegister` pide los datos.
2. Misma clase, línea 95 → `registerEmployee.execute(data)`.
3. `src/application/use-cases/RegisterEmployee.js:29` → control de duplicado.
4. `RegisterEmployee.js:33` → `new Employee(employeeData)`.
5. `src/domain/entities/Employee.js:36` → `EmployeeValidator.validate(props)`.
6. `src/domain/validators/EmployeeValidator.js:27` → se ejecutan RN-01..05.
7. `Employee.js:38` → **`randomUUID()` genera el ID**.
8. `RegisterEmployee.js:34` → `save(employee)`.
9. `src/infrastructure/persistence/InMemoryEmployeeRepository.js:22` → `push` al arreglo.
10. Vuelve a `EmployeeMenuController.js:96` → imprime `[OK]` con el UUID.

---

## 1. Arquitectura (4 min)

*"Usé una arquitectura limpia en cuatro capas. La regla principal es la regla de dependencias: las flechas apuntan siempre hacia el dominio. El dominio no importa nada de las otras capas."*

```
presentation  ──►  application  ──►  domain  ◄──  infrastructure
(ConsoleUI,        (casos de uso)    (Employee,     (InMemoryEmployee
 MenuController)                      Validator,     Repository)
                                      Errors,
                                      contrato Repository)
                         ▲
                     main.js  (Composition Root: crea e inyecta todo)
```

| Capa | Carpeta | Responsabilidad |
|---|---|---|
| Dominio | `src/domain/` | Entidad `Employee`, reglas RN-01..05, errores del negocio y el **contrato** del repositorio. No sabe que existe una consola ni un arreglo. |
| Aplicación | `src/application/use-cases/` | Un caso de uso por requerimiento. Orquesta: valida la entrada, consulta el repositorio, aplica reglas como "no duplicar identificación". |
| Infraestructura | `src/infrastructure/persistence/` | Implementación concreta del contrato: un arreglo privado en RAM. |
| Presentación | `src/presentation/` | Entrada/salida de terminal y menú. Traduce errores a mensajes legibles. |

*"La infraestructura depende del dominio y no al revés: `InMemoryEmployeeRepository` **extiende** `EmployeeRepository`, que vive en el dominio. Eso es inversión de dependencias (DIP)."*

*"`main.js` es el Composition Root: el único lugar donde se hace `new` de las piezas concretas y se inyectan por constructor. Si mañana cambio el repositorio en memoria por uno de PostgreSQL, cambio una línea ahí."*

Cómo se aplica SOLID (dilo con ejemplos, no como lista de memoria):
- **S — Responsabilidad única:** `ConsoleUI` solo imprime y lee; `EmployeeMenuController` solo enruta opciones; cada caso de uso hace una sola cosa; `EmployeeValidator` solo valida.
- **O — Abierto/cerrado:** agregar una nueva forma de persistencia es crear una clase nueva que cumpla el contrato, sin modificar casos de uso.
- **L — Sustitución de Liskov:** cualquier subclase de `EmployeeRepository` puede reemplazar a la de memoria; los tests usan la misma interfaz.
- **I — Segregación de interfaces:** cada caso de uso recibe solo lo que usa (por ejemplo `ListEmployees` solo recibe el repositorio).
- **D — Inversión de dependencias:** los casos de uso reciben el repositorio por constructor; no lo crean.

Flujo de una petición (ejemplo: registrar):
1. `EmployeeMenuController.#handleRegister` pide los 11 campos con `ConsoleUI.ask`.
2. Llama `registerEmployee.execute(data)`.
3. El caso de uso comprueba duplicado con `findByIdentificacion`.
4. `new Employee(data)` valida RN-01..05, normaliza y genera el UUID.
5. `repository.save(employee)` y se devuelve `toPrimitives()` (un objeto plano).
6. Si algo falla se lanza un `AppError`; el controlador lo captura, muestra `[ERROR]` y vuelve al menú sin perder datos.

---

## 2. Módulos uno por uno (8 min)

### 2.1 `domain/entities/Employee.js` — la entidad

*"Es el corazón. Tiene 12 atributos privados con `#`, así que nadie fuera de la clase puede modificarlos y saltarse las reglas."*

- **Constructor:** primero llama `EmployeeValidator.validate(props)`; solo si pasa, asigna. Así **es imposible que exista un `Employee` inválido** en memoria.
- **UUID:** `props.id ?? randomUUID()` — genera uno nuevo al crear y conserva el existente al actualizar.
- **Normalización:** `trim()` en todo, género en mayúsculas, email en minúsculas, salario a `Number`.
- **Getters** de solo lectura.
- **`withUpdates(partial)`:** no muta; crea una **nueva instancia** mezclando los datos actuales con los cambios y forzando el mismo `id`. Como pasa otra vez por el constructor, la actualización se revalida completa. Es inmutabilidad aplicada.
- **`toPrimitives()`:** convierte la entidad a un objeto plano (DTO) para cruzar capas; la presentación nunca toca la entidad real.

### 2.2 `domain/validators/EmployeeValidator.js` — reglas de negocio

*"Centraliza las cinco reglas en un solo lugar, cada una en un método privado estático."*

| Regla | Qué valida | Método |
|---|---|---|
| (base) | El objeto existe y la identificación no está vacía | `validate` |
| RN-01 | Nombres y apellidos no vacíos | `#validateFullName` |
| RN-02 | Género ∈ {M, F, O} (usa un `Set`, búsqueda O(1)) | `#validateGender` |
| RN-03 | Email obligatorio y con formato; teléfono, dirección y ciudad obligatorios | `#validateContactInfo` |
| RN-04 | Profesión y cargo obligatorios | `#validateJobInfo` |
| RN-05 | Salario numérico, finito y > 0 | `#validateSalary` |

- `#validateRequiredString` evita repetir "es string y no está vacío tras `trim()`" (DRY).
- Falla rápido: lanza `ValidationError` en la primera regla que no se cumple.

### 2.3 `domain/errors/DomainErrors.js` — jerarquía de errores

*"Creé una jerarquía propia para distinguir un error esperado del negocio de un fallo técnico."*

- `AppError extends Error` → agrega `code` y pone `name` con el nombre de la subclase.
- `ValidationError` (`VALIDATION_ERROR`), `DuplicateEmployeeError` (`DUPLICATE_EMPLOYEE`), `EmployeeNotFoundError` (`EMPLOYEE_NOT_FOUND`).
- El controlador hace `error instanceof AppError`: si es del negocio muestra el mensaje tal cual; si no, lo marca como error inesperado. El programa nunca se cae por una entrada mala.

### 2.4 `domain/repositories/employeeRepository.js` — el contrato

*"JavaScript no tiene interfaces, así que lo modelé como una clase base cuyos métodos lanzan 'no implementado'. Define `save`, `findAll`, `findById`, `findByIdentificacion`, `update` y `delete`. Es el puerto; la infraestructura es el adaptador."*

### 2.5 `infrastructure/persistence/InMemoryEmployeeRepository.js`

- Arreglo privado `#employees = []`.
- `findAll()` devuelve una **copia** (`[...this.#employees]`): si alguien hace `push` sobre el resultado, el almacenamiento real no cambia (hay un test que lo comprueba).
- `findById` / `findByIdentificacion`: búsqueda con `find`, devuelven `null` si no hay coincidencia.
- `update`: localiza por UUID con `findIndex` y reemplaza la instancia.
- `delete`: `splice` y devuelve `true/false`; el caso de uso convierte el `false` en `EmployeeNotFoundError`.

*"Las búsquedas son O(n). Para el volumen de una sesión de consola es suficiente; en las mejoras explico cómo lo llevaría a O(1)."*

### 2.6 `application/use-cases/` — casos de uso

| Archivo | Requerimiento | Lógica clave |
|---|---|---|
| `RegisterEmployee` | RF-01 | Evita identificación duplicada → crea `Employee` (valida + UUID) → guarda → devuelve DTO. |
| `ListEmployees` | RF-02 | `findAll()` mapeado a `toPrimitives()`. |
| `FindEmployeeByIdentification` | RF-03 | Valida que el criterio no esté vacío; si no existe lanza `EmployeeNotFoundError`. |
| `UpdateEmployee` | RF-04 | Valida UUID → busca → si cambia la identificación comprueba que no la use otro → `withUpdates` (revalida todo) → `update`. |
| `DeleteEmployee` | RF-05 | Valida UUID → `delete` → error si no existía. |
| `FindEmployee` | Extra | Búsqueda parcial e insensible a mayúsculas sobre "nombres apellidos". |

*"Todos reciben el repositorio por constructor y lo guardan en un campo privado. Ninguno sabe que existe la consola: devuelven datos o lanzan errores. Por eso los pude probar sin simular el teclado."*

### 2.7 `presentation/ConsoleUI.js`

- Envuelve `readline/promises` en un campo privado `#rl`.
- `ask()` es `async`: el menú espera la respuesta con `await` sin bloquear el event loop.
- `printSuccess`, `printError`, `printInfo` estandarizan `[OK]`, `[ERROR]`, `[INFO]`; `printTable` usa `console.table`.
- `close()` libera stdin para que el proceso termine limpio.

*"Si quisiera cambiar a una interfaz web, solo reemplazo esta capa."*

### 2.8 `presentation/EmployeeMenuController.js`

- Bucle `while (isRunning)` con un `switch` por opción.
- **El `try/catch` está dentro del bucle**: cualquier error vuelve al menú y los datos en memoria se conservan.
- En actualizar, el usuario deja vacío (ENTER) lo que no quiere cambiar; con `Object.fromEntries(... filter(value.trim() !== ''))` se envían solo los campos modificados (actualización parcial).

### 2.9 `main.js` — arranque

- Clase `AcmeApplication`: crea validador, repositorio, casos de uso, UI y controlador.
- Registra `SIGINT` (Ctrl+C) para cerrar `readline` de forma ordenada.
- `app.run().catch(...)`: red de seguridad final con mensaje `[FATAL]` y código de salida 1.

### 2.10 Pruebas (`tests/`)

*"Uso el runner nativo `node:test` con `assert`, sin Jest, para respetar la restricción de cero dependencias. Son 12 pruebas en 4 suites: entidad y reglas, repositorio (incluida la protección contra mutaciones), y casos de uso con el ciclo CRUD completo, duplicados y registros inexistentes."*

Demostración en vivo:
```bash
npm test
```
```bash
npm start
```
Guion de la demo (2 min): registrar un empleado válido → registrar uno con salario `0` (sale `RN-05`) → registrar otro con la misma identificación (sale duplicado) → listar → actualizar solo el cargo → eliminar con el UUID → salir con `0`.

---

## 3. Mejoras propuestas (4 min)

*"Les comparto también lo que yo mejoraría; algunas cosas las detecté preparando esta presentación."*

### 3.1 Correcciones inmediatas (lo que un revisor notaría primero)

1. **Scripts de `package.json` (ya corregido).** Antes `start` no existía y `test` era el placeholder de `npm init`. Ahora `npm start` ejecuta `node src/main.js`, `npm test` ejecuta `node --test tests/*.test.js`, `main` apunta a `src/main.js` y se declaró `"engines": { "node": ">=20" }`.
2. **Mayúsculas en una importación.** El archivo es `employeeRepository.js` pero se importa como `EmployeeRepository.js`. En macOS funciona porque el sistema de archivos ignora mayúsculas; **en Linux (CI, Docker, servidores) falla** con `ERR_MODULE_NOT_FOUND`. Solución: renombrar el archivo con `git mv`.
3. **Línea sobrante en `UpdateEmployee.js:47`.** Se llama `update(currentEmployee.id, updatedEmployee)`, pero `update` recibe un solo parámetro: con un string como argumento no encuentra nada y devuelve `null`. No rompe nada porque la línea anterior ya actualiza, pero es código muerto y se debe borrar.
4. **`FindEmployee` (búsqueda por nombre) no está conectado.** Existe y el README anuncia la opción 6, pero `main.js` no lo inyecta y el menú llega hasta la 5. Además, en `main.js` la clave `findEmployee` apunta a `FindEmployeeByIdentification`, lo que confunde: renombrar a `findByIdentification` y agregar `findByName`.
5. **El validador inyectado no se usa.** `main.js` pasa `validator` a `RegisterEmployee` y `UpdateEmployee`, pero sus constructores solo reciben el repositorio; la validación ocurre en el constructor de `Employee` llamando al método estático. Hay que elegir un criterio: o la entidad se autovalida (y se quita la inyección), o se inyecta de verdad. Yo dejaría que la entidad se valide sola, que es lo propio de DDD.
6. **Pruebas sin cubrir:** la presentación (controlador con una `ui` simulada), `FindEmployee` y casos borde como un email con mayúsculas y espacios o un salario `"1e3"`.

### 3.2 Diseño y dominio

- **Repositorio asíncrono:** hoy el contrato es síncrono. Una base de datos real es asíncrona, así que cambiar a PostgreSQL obligaría a modificar todos los casos de uso. Haría el contrato `async` desde ya, aunque la versión en memoria resuelva al instante.
- **Unicidad en el repositorio:** la comprobación de duplicados está en el caso de uso (consultar y luego guardar). En una base de datos concurrente eso es una condición de carrera; la garantía real debe ser un índice `UNIQUE` en la identificación.
- **Índices en memoria:** usar `Map` por `id` y por `identificacion` para pasar de O(n) a O(1).
- **Value Objects:** `Email`, `Salary`, `Gender` e `Identificacion` como objetos de valor con su propia validación, en lugar de strings sueltos.
- **Dinero:** el salario es `Number` (coma flotante). Para dinero se usan enteros en centavos o un decimal, más un tope razonable.
- **Validaciones más ricas:** formato de teléfono y de identificación, longitud máxima de campos, email único.
- **Validación que acumule errores:** devolver todos los errores juntos en vez de solo el primero, para que el usuario corrija todo de una vez.
- **Contrato abstracto real:** impedir `new EmployeeRepository()` con `if (new.target === EmployeeRepository) throw ...`, o pasar a TypeScript con `interface`.
- **Eliminación lógica:** en Recursos Humanos normalmente no se borra; se marca `activo: false` con fecha de retiro, por auditoría.

### 3.3 Ingeniería y producción

- **TypeScript** (o al menos JSDoc + `checkJs`) para tipos en los contratos y DTOs.
- **ESLint + Prettier** y un hook de pre-commit.
- **CI con GitHub Actions** en Ubuntu ejecutando los tests: habría detectado el problema de mayúsculas del punto 3.1.2.
- **Cobertura** con `node --test --experimental-test-coverage`.
- **Persistencia real:** un `JsonFileEmployeeRepository` o `PostgresEmployeeRepository`; gracias a la arquitectura, solo cambia `main.js`.
- **Nueva entrega:** una API REST (Express/Fastify) reutilizando los mismos casos de uso; solo se agrega una capa de presentación HTTP.
- **Configuración** con variables de entorno, **logs** estructurados y **paginación** en el listado.
- **Seguridad** si pasa a multiusuario: autenticación, roles (consulta frente a administración), auditoría de cambios y protección de datos personales (habeas data).
- **Mensajes:** sacar los textos a un archivo de recursos (i18n) y usar los `code` de los errores en lugar de comparar textos.

---

## 4. Cierre (30 s)

*"En resumen: el dominio protege las reglas, los casos de uso orquestan, la infraestructura y la consola son piezas intercambiables, y todo está cubierto por pruebas nativas. Conozco sus límites y tengo identificado el camino para llevarlo a producción. Quedo atento a sus preguntas."*

---

## 5. Preguntas probables del ingeniero senior y cómo responder

**¿Por qué la validación está en la entidad y no en el caso de uso?**
Para que sea imposible tener un `Employee` inválido. Si se validara en el caso de uso, cualquier otro camino que cree la entidad podría saltársela. El caso de uso valida lo que necesita el repositorio (duplicados, existencia).

**¿Por qué `withUpdates` crea un objeto nuevo en vez de usar setters?**
Inmutabilidad: la entidad nunca queda a medio actualizar. Si la validación falla, el original queda intacto en el repositorio.

**¿Qué pasa si dos usuarios registran la misma identificación a la vez?**
En esta versión no puede pasar: es un solo proceso y el código es síncrono. Con una base de datos sí; se resuelve con un índice `UNIQUE` y traduciendo el error de la base de datos a `DuplicateEmployeeError`.

**¿Cuál es la complejidad de las búsquedas?**
O(n) con `find`. Con `Map` por `id` e `identificacion` sería O(1), a costa de mantener dos índices sincronizados.

**¿Por qué `findAll` devuelve una copia?**
Para proteger el estado interno. Ojo: es una copia superficial; las entidades no se pueden modificar porque sus campos son privados y solo tienen getters.

**¿Cómo cambiarías a PostgreSQL?**
Crearía `PostgresEmployeeRepository extends EmployeeRepository`, volvería `async` el contrato y los casos de uso (o lo haría desde ya) y cambiaría la instancia en `main.js`. El dominio no cambia.

**¿Por qué clases y no funciones?**
Era requisito de programación orientada a objetos y la encapsulación con `#` es nativa. Con funciones lo haría con *closures* y funciones fábrica; la arquitectura sería la misma.

**¿Por qué `node:test` y no Jest?**
Por la restricción de cero dependencias. Desde Node 20 es estable y tiene `describe`, `it`, `beforeEach` y cobertura.

**¿Qué es un Composition Root?**
El único punto donde se construye el árbol de objetos concretos. El resto del código depende de abstracciones y recibe sus dependencias.

**¿Cómo pruebas el controlador sin teclado?**
Inyectando una `ui` falsa cuyo `ask()` devuelve respuestas de una lista. Es una de las mejoras que propuse.

> Consejo: si te preguntan por algo de la sección 3.1, reconócelo de frente — *"sí, lo detecté y la corrección es esta"*. Un senior valora mucho más que conozcas los límites de tu código que un código perfecto.
