/*
 * Conecta los 5 casos de uso con InMemoryEmployeeRepository para validar
 * los requerimientos funcionales RF-01 a RF-05 de extremo a extremo.
 */
import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { InMemoryEmployeeRepository } from '../src/infrastructure/persistence/InMemoryEmployeeRepository.js';
import { RegisterEmployee } from '../src/application/use-cases/RegisterEmployee.js';
import { ListEmployees } from '../src/application/use-cases/ListEmployees.js';
import { FindEmployeeByIdentification } from '../src/application/use-cases/FindEmployeeByIdentification.js';
import { UpdateEmployee } from '../src/application/use-cases/UpdateEmployee.js';
import { DeleteEmployee } from '../src/application/use-cases/DeleteEmployee.js';
import {
    DuplicateEmployeeError,
    EmployeeNotFoundError,
    ValidationError
} from '../src/domain/errors/DomainErrors.js';

/* 
 * Evalúa el ciclo completo de gestión de empleados en Talento Humano ACME.
 */
describe('Fase 4 - Casos de Uso de Empleados (RF-01 a RF-05)', () => {
    let repository;
    let registerEmployee;
    let listEmployees;
    let findEmployee;
    let updateEmployee;
    let deleteEmployee;

    const sampleInput = {
        identificacion: '30405060',
        nombres: 'Sofía',
        apellidos: 'Ramírez',
        genero: 'F',
        email: 'sofia.ramirez@acme.com',
        telefono: '55543210',
        direccion: 'Zona 15, Vista Hermosa',
        ciudadResidencia: 'Guatemala',
        profesion: 'Contadora Pública',
        cargo: 'Auditora Interna',
        salario: 14000
    };

    /*
     * Instancia un repositorio nuevo e inyecta la misma referencia en los 5
     * casos de uso antes de ejecutar cada prueba individual.
     */
    beforeEach(() => {
        repository = new InMemoryEmployeeRepository();
        registerEmployee = new RegisterEmployee(repository);
        listEmployees = new ListEmployees(repository);
        findEmployee = new FindEmployeeByIdentification(repository);
        updateEmployee = new UpdateEmployee(repository);
        deleteEmployee = new DeleteEmployee(repository);
    });

    /*
     * Comprueba que registrar, listar, buscar, actualizar y eliminar funcionen
     * coordinadamente conservando el UUID único en las actualizaciones.
     */
    it('ejecuta el ciclo CRUD completo cumpliendo RF-01 a RF-05', () => {
        // RF-01: Registrar
        const created = registerEmployee.execute(sampleInput);
        assert.ok(created.id);

        // RF-02: Listar
        assert.equal(listEmployees.execute().length, 1);

        // RF-03: Buscar por identificación
        const found = findEmployee.execute('30405060');
        assert.equal(found.id, created.id);

        // RF-04: Actualizar por ID único conservando el UUID
        const updated = updateEmployee.execute(created.id, {
            cargo: 'Directora Financiera',
            salario: 22000
        });
        assert.equal(updated.id, created.id);
        assert.equal(updated.cargo, 'Directora Financiera');
        assert.equal(updated.salario, 22000);

        // RF-05: Eliminar por ID único
        assert.equal(deleteEmployee.execute(created.id), true);
        assert.equal(listEmployees.execute().length, 0);
    });

    /*
     * Verifica que duplicados, búsquedas sin resultados o actualizaciones con
     * reglas inválidas disparen las excepciones de dominio correspondientes.
     */
    it('controla duplicados, registros inexistentes y reglas de negocio al actualizar', () => {
        const created = registerEmployee.execute(sampleInput);

        assert.throws(() => registerEmployee.execute(sampleInput), DuplicateEmployeeError);
        assert.throws(() => findEmployee.execute('00000000'), EmployeeNotFoundError);
        assert.throws(() => updateEmployee.execute('uuid-falso', { salario: 15000 }), EmployeeNotFoundError);
        assert.throws(() => updateEmployee.execute(created.id, { salario: 0 }), ValidationError);
        assert.throws(() => deleteEmployee.execute('uuid-falso'), EmployeeNotFoundError);
    });
});