/*
 * Consulta todos los empleados almacenados en el repositorio y los transforma
 * a objetos planos (toPrimitives) para que la capa de presentación pueda
 * desplegarlos sin acceder a campos privados (#) de la entidad.
 */
export class ListEmployees {
    #employeeRepository;

    constructor(employeeRepository) {
        this.#employeeRepository = employeeRepository;
    }

    execute() {
        return this.#employeeRepository.findAll().map((employee) => employee.toPrimitives());
    }
}