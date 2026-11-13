/*
- Permite reportar si el UUID proporcionado no existe o si el cambio de
- identificación entra en conflicto con otro empleado ya registrado.
 */
import {
    DuplicateEmployeeError,
    EmployeeNotFoundError,
    ValidationError
} from '../../domain/errors/DomainErrors.js';

/*
- Localiza al empleado mediante su UUID interno, aplica los cambios solicitados
- revalidando todas las reglas de negocio (RN-01 a RN-05) y persiste el cambio.
 */
export class UpdateEmployee {
    #employeeRepository;

    constructor(employeeRepository) {
        this.#employeeRepository = employeeRepository;
    }

    /* 
- Valida que se envíe un UUID y que exista en el repositorio.
- 2. Si se intenta cambiar la identificación, comprueba que no esté en uso.
- 3. Usa employee.withUpdates(newData) para revalidar RN-01..05 y conservar
-    el mismo UUID original antes de guardar en el repositorio.
     */
    execute(id, newData) {
        if (typeof id !== 'string' || id.trim().length === 0) {
            throw new ValidationError('Debe proporcionar el ID único (UUID) del empleado.');
        }

        const currentEmployee = this.#employeeRepository.findById(id.trim());
        if (!currentEmployee) {
            throw new EmployeeNotFoundError(`ID único "${id.trim()}"`);
        }

        if (newData?.identificacion && newData.identificacion.trim() !== currentEmployee.identificacion) {
            const duplicated = this.#employeeRepository.findByIdentificacion(newData.identificacion.trim());
            if (duplicated) {
                throw new DuplicateEmployeeError(newData.identificacion.trim());
            }
        }

        const updatedEmployee = currentEmployee.withUpdates(newData);
        this.#employeeRepository.update(updatedEmployee);
        this.#employeeRepository.update(currentEmployee.id, updatedEmployee); // <-- AGREGAR ESTA LÍNEA
        return updatedEmployee.toPrimitives();
    }
}