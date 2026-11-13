# ACME - Sistema de Gestión de Empleados (CLI)

Aplicación de consola interactiva desarrollada en **Node.js** para automatizar y centralizar la gestión del personal del área de Talento Humano de la empresa **ACME**. Permite registrar, listar, buscar, actualizar y eliminar empleados en memoria aplicando **Programación Orientada a Objetos (POO)**, principios **SOLID** y validación estricta de reglas de negocio sin dependencias externas.

![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)
![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)

---

## Tecnologías utilizadas

Este proyecto fue desarrollado utilizando las siguientes tecnologías:

* **Lenguaje principal:** JavaScript moderno (ECMAScript Modules, campos privados `#`, clases y `async/await`)
* **Entorno de ejecución:** Node.js (v20+ con módulos nativos `node:readline/promises`, `node:crypto`, `node:process` y `node:test`)
* **Persistencia:** Estructuras de datos en memoria RAM (arreglos encapsulados, sin motor de base de datos externo)
* **Arquitectura y diseño:** Arquitectura Limpia en Capas, Programación Orientada a Objetos (POO) y principios SOLID
* **Control de versiones:** Git y GitHub
* **Otras herramientas:** Visual Studio Code y runner nativo de pruebas `node:test`

---

# Cómo montar el proyecto

## Requisitos previos

Antes de instalar y ejecutar el proyecto, asegúrate de tener instaladas las siguientes herramientas:

* [Git](https://git-scm.com/)
* [Node.js](https://nodejs.org/) versión `20.0.0` o superior
* [Visual Studio Code](https://code.visualstudio.com/) (recomendado)

Puedes comprobar las versiones instaladas con los siguientes comandos:

```bash
git --version
node --version
npm --version
```

## 1. Clonar el repositorio

```bash
git clone [https://github.com/joguisam-gt/prueba_tecnica_acme_jose_rodriguez.git](https://github.com/joguisam-gt/prueba_tecnica_acme_jose_rodriguez.git)
```

## 2. Entrar a la carpeta del proyecto

```bash
cd prueba_tecnica_acme_jose_rodriguez
```

## 3. Instalar las dependencias

```bash
npm install
```

> **Nota:** Este proyecto cumple con la restricción de **cero librerías o frameworks de terceros** (`"dependencies": {}`), por lo que no descarga paquetes externos.

## 4. Configurar las variables de entorno

Este proyecto **no requiere un archivo `.env`**, ya que se ejecuta localmente en consola y gestiona los registros directamente en memoria RAM sin credenciales externas ni puertos de red.

## 5. Configurar la base de datos

Por requerimiento técnico de **ACME**, la aplicación **no utiliza bases de datos externas ni archivos locales**. Toda la información se administra en memoria durante la sesión mediante la clase `InMemoryEmployeeRepository` respaldada por un arreglo privado (`#employees = []`).

## 6. Ejecutar el proyecto

Para iniciar la aplicación interactiva en consola:

```bash
npm start
```

O ejecutando directamente el punto de entrada con Node.js:

```bash
node src/main.js
```

La interfaz interactiva se desplegará directamente en la terminal:

```text
============================================================
  ACME - SISTEMA DE GESTIÓN DE EMPLEADOS
============================================================
1. Registrar empleado (RF-01)
2. Listar empleados registrados (RF-02)
3. Buscar empleado por identificación (RF-03)
4. Actualizar empleado por ID único (RF-04)
5. Eliminar empleado por ID único (RF-05)
6. Buscar empleado por nombre
0. Salir del sistema
```

---

# Estructura del proyecto

```text
acme-hr-cli/
├── src/
│   ├── domain/
│   │   ├── entities/
│   │   │   └── Employee.js                    # Entidad de dominio con campos privados (#) y UUID
│   │   ├── errors/
│   │   │   └── DomainErrors.js                # Jerarquía de errores controlados (AppError)
│   │   ├── repositories/
│   │   │   └── EmployeeRepository.js          # Contrato abstracto de persistencia (DIP)
│   │   └── validators/
│   │       └── EmployeeValidator.js           # Motor de validación de reglas RN-01 a RN-05
│   ├── application/
│   │   └── use-cases/
│   │       ├── RegisterEmployee.js            # Caso de uso RF-01
│   │       ├── ListEmployees.js               # Caso de uso RF-02
│   │       ├── FindEmployeeByIdentification.js# Caso de uso RF-03
│   │       ├── FindEmployee.js                # Búsqueda por nombre o apellido
│   │       ├── UpdateEmployee.js              # Caso de uso RF-04
│   │       └── DeleteEmployee.js              # Caso de uso RF-05
│   ├── infrastructure/
│   │   └── persistence/
│   │       └── InMemoryEmployeeRepository.js  # Implementación en arreglo en memoria RAM
│   ├── presentation/
│   │   ├── ConsoleUI.js                       # Abstracción de entrada/salida en terminal
│   │   └── EmployeeMenuController.js          # Controlador del menú interactivo y manejo de errores
│   └── main.js                                # Punto de entrada e inyección de dependencias
├── tests/
│   ├── domain.test.js                         # Pruebas unitarias de entidad y reglas RN-01..05
│   ├── employee.test.js                       # Pruebas de comportamiento de Employee
│   ├── inMemoryEmployeeRepository.test.js     # Pruebas unitarias del repositorio en memoria
│   └── use-cases.test.js                      # Pruebas de integración de casos de uso RF-01..05
├── .gitignore                                 # Archivos y carpetas ignorados por Git
├── package.json                               # Configuración ESM ("type": "module") y scripts
└── README.md                                  # Documentación principal del proyecto
```

## Descripción de carpetas importantes

| Carpeta | Descripción |
|---|---|
| `src/domain/` | Núcleo del negocio: contiene la entidad `Employee`, validadores (`RN-01` a `RN-05`), errores semánticos y el contrato del repositorio. |
| `src/application/` | Orquesta los requerimientos funcionales (`RF-01` a `RF-05`) mediante casos de uso desacoplados. |
| `src/infrastructure/` | Implementa la persistencia en memoria (`InMemoryEmployeeRepository`) cumpliendo el contrato del dominio. |
| `src/presentation/` | Gestiona la interacción por consola (`readline/promises`), formateo tabular y captura segura de errores. |
| `tests/` | Contiene la suite de pruebas automatizadas ejecutadas con el runner nativo `node:test`. |

---

# Documentación del proyecto

## Descripción general

Esta aplicación de consola permite al departamento de Talento Humano de **ACME** administrar el ciclo de vida completo de los registros de empleados durante una sesión de trabajo. Garantiza la integridad de los datos mediante validaciones estrictas antes de almacenar o actualizar cualquier registro y evita cierres inesperados ante entradas inválidas del usuario.

## Objetivo general

Desarrollar una aplicación de consola modular, mantenible y robusta en **Node.js** para la gestión integral de empleados de **ACME**, aplicando Programación Orientada a Objetos, principios SOLID y estándares modernos de ECMAScript sin dependencias externas.

## Objetivos específicos

* Implementar las operaciones CRUD y búsquedas requeridas (`RF-01` a `RF-05`) con generación automática de identificadores únicos (`UUID v4`).
* Garantizar el cumplimiento estricto de las reglas de negocio (`RN-01` a `RN-05`) mediante validación centralizada en la capa de dominio.
* Desacoplar la lógica de negocio de la persistencia y de la interfaz de consola aplicando Inversión e Inyección de Dependencias.
* Blindar la ejecución del menú interactivo con manejo controlado de excepciones y pruebas automatizadas nativas.

## Funcionalidades

El sistema permite realizar las siguientes acciones:

* **Registrar empleado (`RF-01`):** Captura los 11 datos obligatorios, valida reglas de negocio, evita identificaciones duplicadas y asigna un `UUID` único automático.
* **Listar empleados (`RF-02`):** Despliega todos los empleados almacenados en memoria en formato tabular limpio (`console.table`).
* **Buscar empleado por identificación (`RF-03`):** Localiza y muestra el detalle de un empleado mediante su número de documento de identificación.
* **Actualizar empleado por ID único (`RF-04`):** Modifica selectivamente los campos deseados usando su `UUID` interno, conservando su identificador original y revalidando todas las reglas.
* **Eliminar empleado por ID único (`RF-05`):** Remueve definitivamente el registro del arreglo en memoria a partir de su `UUID`.
* **Buscar empleado por nombre:** Filtra empleados de forma insensible a mayúsculas y minúsculas por coincidencia parcial en nombres o apellidos.

## Usuarios del sistema

| Tipo de usuario | Permisos |
|---|---|
| Analista de Talento Humano (ACME) | Acceso completo al menú interactivo de consola para registrar, consultar, listar, actualizar y eliminar empleados en la sesión activa. |

## Flujo principal

1. El usuario inicia la aplicación en terminal mediante `npm start` o `node src/main.js`.
2. El sistema despliega el menú interactivo principal con las opciones disponibles (`1` a `6` y `0`).
3. El usuario selecciona una operación e ingresa los datos solicitados por consola.
4. El controlador delega la solicitud al caso de uso correspondiente, el cual valida las reglas de negocio (`RN-01` a `RN-05`) y opera sobre el repositorio en memoria.
5. El sistema muestra la confirmación (`[OK]`), la tabla de resultados o una alerta controlada (`[ERROR]`) sin interrumpir la ejecución.
6. El usuario selecciona la opción `0` (o presiona `Ctrl + C`) para cerrar los flujos de lectura y salir de forma segura.

## Arquitectura

El proyecto implementa una **Arquitectura Limpia en 4 Capas** guiada por los **5 principios SOLID**:

* **Capa de Presentación (`presentation`):** `ConsoleUI` y `EmployeeMenuController` gestionan exclusivamente la lectura/escritura en terminal y la captura de errores (`SRP`).
* **Capa de Aplicación (`application`):** Cada requerimiento funcional está encapsulado en su propia clase de caso de uso (`RegisterEmployee`, `ListEmployees`, `UpdateEmployee`, etc.) recibiendo sus dependencias por constructor (`DIP`).
* **Capa de Dominio (`domain`):** Contiene la entidad `Employee` con atributos privados (`#`), el validador `EmployeeValidator` (`OCP`) y la clase abstracta `EmployeeRepository`.
* **Capa de Infraestructura (`infrastructure`):** `InMemoryEmployeeRepository` extiende `EmployeeRepository` (`LSP`) y encapsula el arreglo en memoria.

## Modelo de datos

### Entidad: `Employee` (Almacenada en memoria RAM)

| Campo | Tipo | Regla / Descripción |
|---|---|---|
| `id` | `string` (UUID v4) | Generado automáticamente mediante `crypto.randomUUID()`. Inmutable al actualizar. |
| `identificacion` | `string` | Obligatorio y único dentro del sistema. |
| `nombres` | `string` | **RN-01:** Obligatorio, no permite cadenas vacías. |
| `apellidos` | `string` | **RN-01:** Obligatorio, no permite cadenas vacías. |
| `genero` | `string` | **RN-02:** Restringido estrictamente a `"M"`, `"F"` u `"O"`. |
| `email` | `string` | **RN-03:** Obligatorio y con formato de correo electrónico válido. |
| `telefono` | `string` | **RN-03:** Obligatorio. |
| `direccion` | `string` | **RN-03:** Obligatorio. |
| `ciudadResidencia` | `string` | **RN-03:** Obligatorio. |
| `profesion` | `string` | **RN-04:** Obligatorio. |
| `cargo` | `string` | **RN-04:** Obligatorio. |
| `salario` | `number` | **RN-05:** Valor numérico finito estrictamente superior a `0`. |

## Documentación de Casos de Uso (Contratos Internos)

Al tratarse de una aplicación de consola sin servidor HTTP, los puntos de entrada de la lógica de negocio son los métodos `.execute()` de cada caso de uso:

### Registrar empleado (`RF-01`)

```javascript
registerEmployee.execute({
  identificacion: '10203040',
  nombres: 'Ana',
  apellidos: 'Martínez',
  genero: 'F',
  email: 'ana.martinez@acme.com',
  telefono: '55512345',
  direccion: 'Zona 10, Edificio Corporativo',
  ciudadResidencia: 'Guatemala',
  profesion: 'Ingeniera en Sistemas',
  cargo: 'Desarrolladora Backend',
  salario: 15000
});
```

### Listar empleados (`RF-02`)

```javascript
listEmployees.execute(); // Retorna EmployeeDTO[]
```

### Buscar empleado por identificación (`RF-03`)

```javascript
findEmployee.execute('10203040'); // Retorna EmployeeDTO o lanza EmployeeNotFoundError
```

### Actualizar empleado por ID único (`RF-04`)

```javascript
updateEmployee.execute('uuid-generado', { cargo: 'Arquitecta de Software', salario: 20000 });
```

### Eliminar empleado por ID único (`RF-05`)

```javascript
deleteEmployee.execute('uuid-generado'); // Retorna true o lanza EmployeeNotFoundError
```

## Comandos disponibles

| Comando | Descripción |
|---|---|
| `npm start` | Inicia la aplicación interactiva de consola (`node src/main.js`). |
| `npm test` | Ejecuta todas las pruebas automatizadas con el runner nativo `node:test`. |
| `node --test --test-reporter=spec` | Ejecuta la suite de pruebas mostrando el detalle individual de cada caso. |
| `node --test --experimental-test-coverage` | Ejecuta las pruebas generando un reporte nativo de cobertura de código. |

## Pruebas

Para ejecutar las pruebas automatizadas:

```bash
npm test
```

Para ejecutar un archivo de pruebas específico:

```bash
node --test tests/domain.test.js
node --test tests/inMemoryEmployeeRepository.test.js
node --test tests/use-cases.test.js
```

Las pruebas verifican:

* La creación válida de entidades `Employee` y generación de `UUID v4`.
* El rechazo controlado ante incumplimientos de `RN-01` a `RN-05`.
* El aislamiento e inmutabilidad superficial del arreglo en `InMemoryEmployeeRepository`.
* El ciclo completo `RF-01` a `RF-05` y manejo de registros duplicados o inexistentes.

## Convenciones de código

Para mantener el proyecto limpio y legible:

* Uso exclusivo de **ES Modules** (`import` / `export` con extensiones `.js` explícitas).
* Nombres de variables, parámetros y métodos en `camelCase`.
* Nombres de clases y archivos de clase en `PascalCase`.
* Encapsulamiento estricto del estado interno mediante campos privados (`#`).
* Separación clara de responsabilidades por capa y comentarios descriptivos por bloque lógico.

## Convención de commits

Se sigue el estándar **Conventional Commits**:

```text
feat(domain): implementar entidad Employee y validador de reglas RN-01 a RN-05
feat(infrastructure): implementar InMemoryEmployeeRepository
feat(application): agregar casos de uso RF-01 a RF-05
feat(presentation): implementar menu interactivo CLI y control de errores
fix(application): asegurar persistencia al actualizar empleado por UUID
test: agregar pruebas unitarias y de integracion con node:test
docs: actualizar documentacion en README.md
```

## Capturas de pantalla

### Menú principal y listado tabular en consola (`RF-02`)

```text
============================================================
  ACME - SISTEMA DE GESTIÓN DE EMPLEADOS
============================================================
1. Registrar empleado (RF-01)
2. Listar empleados registrados (RF-02)
3. Buscar empleado por identificación (RF-03)
4. Actualizar empleado por ID único (RF-04)
5. Eliminar empleado por ID único (RF-05)
6. Buscar empleado por nombre
0. Salir del sistema

Seleccione una opción: 1
[OK] Empleado Ana Martínez registrado con ID único: 9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d
```

## Despliegue

El código fuente del proyecto se encuentra publicado en GitHub:

* **Repositorio:** https://github.com/joguisam-gt/prueba_tecnica_acme_jose_rodriguez

## Problemas conocidos

* **Volatilidad de datos entre ejecuciones:** Al cumplir con la restricción de no utilizar bases de datos ni persistencia en disco, los registros almacenados en memoria RAM se reinician al cerrar la aplicación.
* **Sensibilidad de mayúsculas en sistemas Linux:** En sistemas operativos sensibles a mayúsculas/minúsculas, los nombres de archivos importados deben coincidir exactamente con su declaración (`EmployeeRepository.js`).

## Mejoras futuras

* Incorporar un adaptador opcional de persistencia en archivo JSON (`FileEmployeeRepository`) aprovechando el principio **OCP** y el contrato `EmployeeRepository`.
* Agregar exportación de reportes de nómina y listado de empleados en formato CSV desde la capa de presentación.
* Implementar confirmación interactiva (`S/N`) antes de ejecutar la eliminación definitiva (`RF-05`).

## Cómo contribuir

1. Crea un fork del repositorio.
2. Crea una nueva rama a partir de `dev`:

```bash
git checkout -b feat/nueva-funcionalidad
```

3. Realiza tus cambios siguiendo las convenciones de código y añade pruebas en `tests/`.
4. Verifica que toda la suite pase en verde:

```bash
npm test
```

5. Guarda y sube tus cambios:

```bash
git add .
git commit -m "feat: describir nueva funcionalidad"
git push origin feat/nueva-funcionalidad
```

6. Abre un Pull Request hacia la rama `dev`.

## Autor

* **Nombre:** José Guillermo Rodríguez Samcam
* **Proyecto:** Prueba Técnica — Sistema de Gestión de Empleados ACME
* **GitHub:** [https://github.com/joguisam-gt](https://github.com/joguisam-gt)

## Licencia

Este proyecto fue desarrollado bajo la licencia **MIT** con fines de evaluación técnica y educativos.

---

## Lista de verificación antes de entregar

* [x] El nombre y la descripción del proyecto están completos.
* [x] Las tecnologías utilizadas están actualizadas.
* [x] Las instrucciones de instalación y ejecución funcionan.
* [x] La configuración de entorno y almacenamiento en memoria está documentada.
* [x] La estructura corresponde al proyecto real.
* [x] Las funcionalidades (`RF-01` a `RF-05`) y reglas de negocio (`RN-01` a `RN-05`) están descritas.
* [x] El modelo de datos y los contratos de casos de uso están documentados.
* [x] Las pruebas se pueden ejecutar con `npm test`.
* [x] Los enlaces funcionan.
* [x] No se incluyeron contraseñas, tokens ni datos privados.
* [x] Los datos del autor están completos.