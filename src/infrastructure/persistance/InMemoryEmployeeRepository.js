/* 
 * Importa la clase base EmployeeRepository desde la capa de dominio. Esto
 * garantiza la Inversión de Dependencias (DIP): la infraestructura depende
 * de las reglas del negocio, nunca al revés.
 */
import { EmployeeRepository } from '../../domain/repositories/EmployeeRepository.js';

/* 
 * Extiende EmployeeRepository cumpliendo exactamente cada método esperado por
 * el contrato. Almacenar los datos en un arreglo privado (#employees) cumple
 * con la restricción de ACME de no utilizar bases de datos externas.
 */
export class InMemoryEmployeeRepository extends EmployeeRepository {
    // Arreglo privado encapsulado donde viven las instancias de Employee en RAM
    #employees = [];

    /* 
     * BLOQUE 3: Guardar Empleado (save)
     * Inserta una instancia válida de Employee dentro del arreglo interno y la
     * retorna para confirmar su almacenamiento.
     */
    save(employee) {
        this.#employees.push(employee);
        return employee;
    }

    /* 
     * BLOQUE 4: Listar Todos los Empleados (findAll)
     * Devuelve una copia superficial ([...this.#employees]) del arreglo. De esta
     * forma, si una capa externa hace .push() o .pop() sobre el resultado, el
     * almacenamiento original permanece protegido contra mutaciones accidentales.
     */
    findAll() {
        return [...this.#employees];
    }

    /* 
     * Localiza un empleado mediante su UUID generado por el sistema. Se utiliza
     * principalmente en las operaciones de actualización (RF-04) y borrado (RF-05).
     */
    findById(id) {
        if (typeof id !== 'string') return null;
        return this.#employees.find((emp) => emp.id === id.trim()) ?? null;
    }

    /*
     * Busca coincidencias exactas por el número de identificación civil (RF-03)
     * y también sirve para prevenir registros duplicados antes de guardar.
     */
    findByIdentificacion(identificacion) {
        if (typeof identificacion !== 'string') return null;
        const normalized = identificacion.trim();
        return this.#employees.find((emp) => emp.identificacion === normalized) ?? null;
    }

    /* --------------------------------------------------------------------------
     * BLOQUE 7: Actualizar Registro Existente (update)
     * Busca la posición del empleado por su UUID; si existe, reemplaza la
     * instancia anterior por la nueva versión validada y la retorna.
     * -------------------------------------------------------------------------- */
    update(updatedEmployee) {
        const index = this.#employees.findIndex((emp) => emp.id === updatedEmployee.id);
        if (index === -1) return null;

        this.#employees[index] = updatedEmployee;
        return updatedEmployee;
    }

    /* 
     * Localiza el índice del empleado por su UUID y lo extrae definitivamente
     * del arreglo mediante splice(), devolviendo true si la operación tuvo éxito.
     */
    delete(id) {
        if (typeof id !== 'string') return false;
        const index = this.#employees.findIndex((emp) => emp.id === id.trim());
        if (index === -1) return false;

        this.#employees.splice(index, 1);
        return true;
    }
}