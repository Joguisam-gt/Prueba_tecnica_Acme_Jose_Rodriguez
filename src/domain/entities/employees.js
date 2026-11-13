/* 
 * Importa ValidationError usando sintaxis ESM con extensión explícita (.js)
 * para reportar cualquier incumplimiento de las reglas de negocio.
 */
import { ValidationError } from '../errors/DomainErrors.js';

/* 
 * Centraliza todas las validaciones fuera de la entidad Employee. Al estar
 * dividida en métodos privados especializados, permite agregar nuevas reglas
 * en el futuro sin modificar la estructura interna del empleado.
 */
export class EmployeeValidator {
    // Conjunto privado en memoria con los únicos valores válidos para género (RN-02)
    static #ALLOWED_GENDERS = new Set(['M', 'F', 'O']);

    /* 
     * Punto de entrada único que recibe el objeto con los datos crudos y ejecuta
     * secuencialmente todas las verificaciones antes de instanciar un Employee.
     */
    static validate(data) {
        if (!data || typeof data !== 'object') {
            throw new ValidationError('Los datos del empleado son obligatorios.');
        }

        this.#validateRequiredString(data.identificacion, 'La identificación es obligatoria.');
        this.#validateFullName(data.nombres, data.apellidos);
        this.#validateGender(data.genero);
        this.#validateContactInfo(data);
        this.#validateJobInfo(data.profesion, data.cargo);
        this.#validateSalary(data.salario);
    }

    /* 
     * Garantiza que tanto nombres como apellidos contengan texto real y no sean
     * cadenas vacías o compuestas únicamente por espacios en blanco.
    */
    static #validateFullName(nombres, apellidos) {
        this.#validateRequiredString(nombres, 'RN-01: Los nombres no pueden estar vacíos.');
        this.#validateRequiredString(apellidos, 'RN-01: Los apellidos no pueden estar vacíos.');
    }

    /* 
     * Normaliza la entrada a mayúsculas para aceptar "m", "f" u "o" sin fricción
     * y comprueba su existencia dentro del Set #ALLOWED_GENDERS.
    */
    static #validateGender(genero) {
        const normalized = typeof genero === 'string' ? genero.trim().toUpperCase() : '';
        if (!this.#ALLOWED_GENDERS.has(normalized)) {
            throw new ValidationError('RN-02: El género debe ser "M", "F" u "O".');
        }
    }

    /*
     * Exige que email, teléfono, dirección y ciudad estén diligenciados, y aplica
     * una expresión regular básica para asegurar una estructura válida de correo.
    */
    static #validateContactInfo({ email, telefono, direccion, ciudadResidencia }) {
        this.#validateRequiredString(email, 'RN-03: El email es obligatorio.');
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
            throw new ValidationError('RN-03: El formato del email no es válido.');
        }
        this.#validateRequiredString(telefono, 'RN-03: El teléfono es obligatorio.');
        this.#validateRequiredString(direccion, 'RN-03: La dirección es obligatoria.');
        this.#validateRequiredString(ciudadResidencia, 'RN-03: La ciudad de residencia es obligatoria.');
    }

    /* --------------------------------------------------------------------------
     * BLOQUE 7: Validación de Perfil Profesional (RN-04)
     * Comprueba que la profesión y el cargo dentro de ACME no queden vacíos.
     * -------------------------------------------------------------------------- */
    static #validateJobInfo(profesion, cargo) {
        this.#validateRequiredString(profesion, 'RN-04: La profesión es obligatoria.');
        this.#validateRequiredString(cargo, 'RN-04: El cargo es obligatorio.');
    }

    /* 
     * Convierte el dato recibido a tipo numérico, descarta valores NaN o
     * infinitos (Number.isFinite) y exige que sea estrictamente mayor a 0.
    */
    static #validateSalary(salario) {
        const numericSalary = Number(salario);
        if (!Number.isFinite(numericSalary) || numericSalary <= 0) {
            throw new ValidationError('RN-05: El salario debe ser un número superior a 0.');
        }
    }

    /* 
     * Evita repetir la misma lógica de verificación de tipo string y .trim() en
     * cada campo de texto del formulario.
    */
    static #validateRequiredString(value, message) {
        if (typeof value !== 'string' || value.trim().length === 0) {
            throw new ValidationError(message);
        }
    }
}