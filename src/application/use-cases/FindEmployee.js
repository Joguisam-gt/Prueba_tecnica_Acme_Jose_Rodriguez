/* 
 * Importa ValidationError (si el término de búsqueda está vacío) y
 * EmployeeNotFoundError (si ningún empleado coincide con el nombre).
 */
import { EmployeeNotFoundError, ValidationError } from '../../domain/errors/DomainErrors.js';

/*
 * Aplica SRP e Inversión de Dependencias (DIP): recibe el repositorio por
 * constructor y consulta los empleados registrados sin acoplarse a la consola.
 */
export class FindEmployee {
    #employeeRepository;

    constructor(employeeRepository) {
        this.#employeeRepository = employeeRepository;
    }

    /*
     * 1. Valida que el nombre recibido no sea una cadena vacía.
     * 2. Normaliza el texto a minúsculas y filtra los empleados cuyo nombre,
     *    apellido o nombre completo contenga el término buscado.
     * 3. Si no hay coincidencias lanza EmployeeNotFoundError; si las hay,
     *    devuelve el arreglo de objetos planos (DTO) listos para console.table().
     */
    execute(nameQuery) {
        if (typeof nameQuery !== 'string' || nameQuery.trim().length === 0) {
            throw new ValidationError('Debe ingresar un nombre para realizar la búsqueda.');
        }

        const normalizedQuery = nameQuery.trim().toLowerCase();

        const matches = this.#employeeRepository
            .findAll()
            .filter((employee) => {
                const fullName = `${employee.nombres} ${employee.apellidos}`.toLowerCase();
                return fullName.includes(normalizedQuery);
            })
            .map((employee) => employee.toPrimitives());

        if (matches.length === 0) {
            throw new EmployeeNotFoundError(`nombre "${nameQuery.trim()}"`);
        }

        return matches;
    }
}