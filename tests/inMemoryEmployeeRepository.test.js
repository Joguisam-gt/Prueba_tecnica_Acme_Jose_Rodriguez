/*
 * Carga el runner nativo de Node.js junto con la entidad Employee y el
 * repositorio en memoria recién implementado.
 */
import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { Employee } from '../src/domain/entities/Employee.js';
import { InMemoryEmployeeRepository } from '../src/infrastructure/persistence/InMemoryEmployeeRepository.js';

/*
 * Valida las operaciones CRUD aisladas sobre el arreglo interno #employees.
 */
describe('Fase 3 - InMemoryEmployeeRepository', () => {
    let repository;
    let sampleEmployee;

    /*
     * Antes de cada prueba crea un repositorio vacío y una instancia fresca de
     * Employee para evitar contaminación de estado entre pruebas.
     */
    beforeEach(() => {
        repository = new InMemoryEmployeeRepository();
        sampleEmployee = new Employee({
            identificacion: '20203030',
            nombres: 'Laura',
            apellidos: 'Castillo',
            genero: 'F',
            email: 'laura@acme.com',
            telefono: '55598765',
            direccion: 'Zona 14, Torre Empresarial',
            ciudadResidencia: 'Guatemala',
            profesion: 'Administradora',
            cargo: 'Analista de Talento Humano',
            salario: 11500
        });
    });

    /*
     * Comprueba save(), findAll(), findById(), findByIdentificacion() y que
     * alterar el arreglo retornado por findAll() no afecte al repositorio.
     */
    it('guarda, consulta y protege el arreglo interno contra mutaciones externas', () => {
        repository.save(sampleEmployee);

        const all = repository.findAll();
        assert.equal(all.length, 1);

        // Intento de mutación externa sobre el arreglo devuelto
        all.pop();
        assert.equal(repository.findAll().length, 1);

        assert.equal(repository.findById(sampleEmployee.id)?.nombres, 'Laura');
        assert.equal(repository.findByIdentificacion('20203030')?.id, sampleEmployee.id);
        assert.equal(repository.findById('uuid-inexistente'), null);
    });

    /*
     * Comprueba que update() sobrescriba el registro manteniendo el mismo UUID
     * y que delete() lo remueva definitivamente del arreglo.
     */
    it('actualiza y elimina un empleado existente por su UUID', () => {
        repository.save(sampleEmployee);

        const modified = sampleEmployee.withUpdates({ cargo: 'Jefa de RRHH', salario: 16000 });
        const updated = repository.update(modified);

        assert.equal(updated?.cargo, 'Jefa de RRHH');
        assert.equal(repository.findById(sampleEmployee.id)?.salario, 16000);

        const deleted = repository.delete(sampleEmployee.id);
        assert.equal(deleted, true);
        assert.equal(repository.findAll().length, 0);
        assert.equal(repository.delete(sampleEmployee.id), false);
    });
});