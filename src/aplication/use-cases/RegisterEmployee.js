/*
 * Importa la entidad Employee (que ejecuta RN-01 a RN-05 al instanciarse)
 * y el error DuplicateEmployeeError para impedir identificaciones repetidas.
 */
import { Employee } from '../../domain/entities/Employee.js';
import { DuplicateEmployeeError } from '../../domain/errors/DomainErrors.js';

/* 
 * Aplica Responsabilidad Única (SRP) e Inversión de Dependencias (DIP):
 * recibe cualquier repositorio que cumpla el contrato EmployeeRepository.
 */
export class RegisterEmployee {
    #employeeRepository;

    constructor(employeeRepository) {
        this.#employeeRepository = employeeRepository;
    }

    /*
     * 1. Verifica que no exista otro empleado con la misma identificación.
     * 2. Instancia Employee (valida RN-01..05 y genera su UUID único).
     * 3. Guarda en el repositorio y retorna los datos planos (DTO).
     */
    execute(employeeData) {
        const rawId = typeof employeeData?.identificacion === 'string'
            ? employeeData.identificacion.trim()
            : '';

        if (rawId && this.#employeeRepository.findByIdentificacion(rawId)) {
            throw new DuplicateEmployeeError(rawId);
        }

        const employee = new Employee(employeeData);
        this.#employeeRepository.save(employee);
        return employee.toPrimitives();
    }
}