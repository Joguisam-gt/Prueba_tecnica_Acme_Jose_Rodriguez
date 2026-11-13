/*
 * Importa ValidationError (si el usuario envía un criterio vacío) y
 * EmployeeNotFoundError (si ningún empleado coincide con la búsqueda).
 */
import { EmployeeNotFoundError, ValidationError } from '../../domain/errors/DomainErrors.js';

/*
 * Orquesta la validación del parámetro de entrada y la consulta al repositorio
 * utilizando el número de identificación civil del empleado.
 */
export class FindEmployeeByIdentification {
  #employeeRepository;

  constructor(employeeRepository) {
    this.#employeeRepository = employeeRepository;
  }

  /*
   * BLOQUE 3: Ejecución de la Búsqueda (execute)
   * Verifica que la identificación no sea una cadena vacía, busca el registro
   * en el repositorio y devuelve sus datos planos o lanza EmployeeNotFoundError.
   */
  execute(identificacion) {
    if (typeof identificacion !== 'string' || identificacion.trim().length === 0) {
      throw new ValidationError('Debe ingresar un número de identificación para realizar la búsqueda.');
    }

    const normalized = identificacion.trim();
    const employee = this.#employeeRepository.findByIdentificacion(normalized);

    if (!employee) {
      throw new EmployeeNotFoundError(`identificación "${normalized}"`);
    }

    return employee.toPrimitives();
  }
}