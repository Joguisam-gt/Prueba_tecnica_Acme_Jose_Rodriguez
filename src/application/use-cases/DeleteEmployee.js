/*
 * Importa ValidationError y EmployeeNotFoundError para informar claramente
 * cuando el ID único enviado está vacío o no corresponde a ningún registro.
 */
import { EmployeeNotFoundError, ValidationError } from '../../domain/errors/DomainErrors.js';

/*
 * Ejecuta el borrado definitivo de un empleado usando su UUID interno.
 */
export class DeleteEmployee {
    #employeeRepository;

    constructor(employeeRepository) {
        this.#employeeRepository = employeeRepository;
    }

    execute(id) {
        if (typeof id !== 'string' || id.trim().length === 0) {
            throw new ValidationError('Debe proporcionar el ID único (UUID) del empleado a eliminar.');
        }

        const deleted = this.#employeeRepository.delete(id.trim());
        if (!deleted) {
            throw new EmployeeNotFoundError(`ID único "${id.trim()}"`);
        }

        return true;
    }
}