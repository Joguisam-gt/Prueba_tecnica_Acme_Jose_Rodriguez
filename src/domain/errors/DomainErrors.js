/*
 * Extiende de la clase nativa Error de JavaScript para crear una jerarquía
 * controlada. Permite que la interfaz de consola distinga entre un error
 * esperado del negocio (ej. salario inválido) y un fallo técnico del sistema.
 */
export class AppError extends Error {
    constructor(message, code = 'APP_ERROR') {
        super(message);
        this.name = this.constructor.name; // Asigna automáticamente el nombre de la subclase
        this.code = code;                  // Código interno para identificar el tipo de fallo
    }
}

/*
 * Se lanza cada vez que un dato ingresado incumple cualquiera de las reglas
 * RN-01 a RN-05 (campos vacíos, género no permitido, salario <= 0, etc.).
 */
export class ValidationError extends AppError {
    constructor(message) {
        super(message, 'VALIDATION_ERROR');
    }
}

/* 
 * Evita que se registren dos empleados con el mismo número de identificación
 * civil, manteniendo la integridad de la colección en memoria.
 */
export class DuplicateEmployeeError extends AppError {
    constructor(identificacion) {
        super(
            `Ya existe un empleado registrado con la identificación "${identificacion}".`,
            'DUPLICATE_EMPLOYEE'
        );
    }
}

/*
 * Se dispara en búsquedas (RF-03), actualizaciones (RF-04) o eliminaciones
 * (RF-05) cuando la identificación o el UUID solicitado no existe.
*/
export class EmployeeNotFoundError extends AppError {
    constructor(criteria) {
        super(`No se encontró ningún empleado con el criterio: ${criteria}.`, 'EMPLOYEE_NOT_FOUND');
    }
}