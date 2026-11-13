/*
 * Importa ValidationError mediante ES Modules para reportar de forma
 * controlada cualquier incumplimiento de las reglas de negocio RN-01 a RN-05.
 */
import { ValidationError } from '../errors/DomainErrors.js';

/*
 * Centraliza todas las validaciones de integridad del empleado. Soporta tanto
 * llamada estática como por instancia para facilitar su inyección desde main.js.
 */
export class EmployeeValidator {
    // Conjunto privado con los únicos valores permitidos para el género (RN-02)
    static #ALLOWED_GENDERS = new Set(['M', 'F', 'O']);

    /*
     * Permite que una instancia de EmployeeValidator inyectada desde main.js
     * ejecute la validación delegando al motor estático centralizado.
     */
    validate(data) {
        EmployeeValidator.validate(data);
    }

    /* 
     * Punto de entrada que verifica la estructura del objeto y ejecuta en orden
     * las reglas de negocio RN-01 a RN-05 antes de crear o actualizar un empleado.
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
     * Impide registrar o actualizar empleados con nombres o apellidos vacíos o
     * compuestos únicamente por espacios en blanco.
     */
    static #validateFullName(nombres, apellidos) {
        this.#validateRequiredString(nombres, 'RN-01: Los nombres no pueden estar vacíos.');
        this.#validateRequiredString(apellidos, 'RN-01: Los apellidos no pueden estar vacíos.');
    }

    /*
     * Normaliza la entrada a mayúsculas y comprueba que pertenezca al conjunto
     * autorizado por Talento Humano ACME.
     */
    static #validateGender(genero) {
        const normalized = typeof genero === 'string' ? genero.trim().toUpperCase() : '';
        if (!this.#ALLOWED_GENDERS.has(normalized)) {
            throw new ValidationError('RN-02: El género debe ser "M", "F" u "O".');
        }
    }

    /*
     * Verifica que email, teléfono, dirección y ciudad de residencia estén
     * presentes y que el correo electrónico tenga una estructura válida.
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

    /*
     * Asegura que todo empleado tenga definida su profesión y el cargo que
     * desempeñará dentro de la empresa.
     */
    static #validateJobInfo(profesion, cargo) {
        this.#validateRequiredString(profesion, 'RN-04: La profesión es obligatoria.');
        this.#validateRequiredString(cargo, 'RN-04: El cargo es obligatorio.');
    }

    /*
     * Convierte el valor a número, descarta valores NaN o infinitos y exige
     * que el salario sea estrictamente mayor a cero.
     */
    static #validateSalary(salario) {
        const numericSalary = Number(salario);
        if (!Number.isFinite(numericSalary) || numericSalary <= 0) {
            throw new ValidationError('RN-05: El salario debe ser un número superior a 0.');
        }
    }

    /*
     * Evita duplicar la validación de tipo string y .trim() en cada campo.
     */
    static #validateRequiredString(value, message) {
        if (typeof value !== 'string' || value.trim().length === 0) {
            throw new ValidationError(message);
        }
    }
}