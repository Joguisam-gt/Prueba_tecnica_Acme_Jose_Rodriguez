/* 
 * Define los métodos que cualquier mecanismo de almacenamiento debe ofrecer
 * a la capa de aplicación. Hoy se implementará con un arreglo en memoria
 * (InMemoryEmployeeRepository), pero mañana podría conectarse a una base de
 * datos sin alterar ni una línea de los casos de uso.
 */
export class EmployeeRepository {
    save(_employee) {
        throw new Error('Método save() no implementado.');
    }

    findAll() {
        throw new Error('Método findAll() no implementado.');
    }

    findById(_id) {
        throw new Error('Método findById() no implementado.');
    }

    findByIdentificacion(_identificacion) {
        throw new Error('Método findByIdentificacion() no implementado.');
    }

    update(_employee) {
        throw new Error('Método update() no implementado.');
    }

    delete(_id) {
        throw new Error('Método delete() no implementado.');
    }
}