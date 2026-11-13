export class AppError extends Error {
    constructor(message, code = 'APP_ERROR') {
        super(message);
        this.name = this.constructor.name;
        this.code = code;
    }
}

export class ValidationError extends AppError {
    constructor(message) {
        super(message, 'VALIDATION_ERROR');
    }
}

export class DuplicateEmployeeError extends AppError {
    constructor(identificacion) {
        super(
            `Ya existe un empleado registrado con la identificación "${identificacion}".`,
            'DUPLICATE_EMPLOYEE'
        );
    }
}

export class EmployeeNotFoundError extends AppError {
    constructor(criteria) {
        super(`No se encontró ningún empleado con el criterio: ${criteria}.`, 'EMPLOYEE_NOT_FOUND');
    }
}