import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { InMemoryEmployeeRepository } from '../src/infrastructure/persistence/InMemoryEmployeeRepository.js';
import { RegisterEmployee } from '../src/application/use-cases/RegisterEmployee.js';
import { ListEmployees } from '../src/application/use-cases/ListEmployees.js';
import { FindEmployeeByIdentification } from '../src/application/use-cases/FindEmployeeByIdentification.js';
import { UpdateEmployee } from '../src/application/use-cases/UpdateEmployee.js';
import { DeleteEmployee } from '../src/application/use-cases/DeleteEmployee.js';
import {
    ValidationError,
    DuplicateEmployeeError,
    EmployeeNotFoundError
} from '../src/domain/errors/DomainErrors.js';

describe('Gestión de Empleados ACME (RF-01 a RF-05 y RN-01 a RN-05)', () => {
    let repository;
    let registerEmployee;
    let listEmployees;
    let findEmployee;
    let updateEmployee;
    let deleteEmployee;

    const validEmployeeData = {
        identificacion: '1020304050',
        nombres: 'Ana María',
        apellidos: 'López Gómez',
        genero: 'F',
        email: 'ana.lopez@acme.com',
        telefono: '55512345',
        direccion: 'Zona 10, Edificio Empresarial',
        ciudadResidencia: 'Ciudad de Guatemala',
        profesion: 'Ingeniera de Sistemas',
        cargo: 'Desarrolladora Senior',
        salario: 15000
    };

    beforeEach(() => {
        repository = new InMemoryEmployeeRepository();
        registerEmployee = new RegisterEmployee(repository);
        listEmployees = new ListEmployees(repository);
        findEmployee = new FindEmployeeByIdentification(repository);
        updateEmployee = new UpdateEmployee(repository);
        deleteEmployee = new DeleteEmployee(repository);
    });

    it('RF-01 & RF-02: registra un empleado asignando UUID único y lo lista', () => {
        const created = registerEmployee.execute(validEmployeeData);

        assert.ok(created.id);
        assert.equal(created.identificacion, '1020304050');
        assert.equal(created.salario, 15000);

        const list = listEmployees.execute();
        assert.equal(list.length, 1);
        assert.equal(list[0].id, created.id);
    });

    it('RF-03: busca un empleado por su identificación', () => {
        const created = registerEmployee.execute(validEmployeeData);
        const found = findEmployee.execute('1020304050');

        assert.equal(found.id, created.id);
        assert.equal(found.nombres, 'Ana María');
    });

    it('RF-04: actualiza los datos de un empleado conservando su ID único', () => {
        const created = registerEmployee.execute(validEmployeeData);
        const updated = updateEmployee.execute(created.id, {
            cargo: 'Arquitecta de Software',
            salario: 20000
        });

        assert.equal(updated.id, created.id);
        assert.equal(updated.cargo, 'Arquitecta de Software');
        assert.equal(updated.salario, 20000);
        assert.equal(updated.nombres, 'Ana María');
    });

    it('RF-05: elimina un empleado por su ID único', () => {
        const created = registerEmployee.execute(validEmployeeData);
        const result = deleteEmployee.execute(created.id);

        assert.equal(result, true);
        assert.equal(listEmployees.execute().length, 0);
    });

    it('RN-01 a RN-05: rechaza datos inválidos lanzando ValidationError', () => {
        assert.throws(
            () => registerEmployee.execute({ ...validEmployeeData, nombres: '   ' }),
            ValidationError
        );
        assert.throws(
            () => registerEmployee.execute({ ...validEmployeeData, genero: 'X' }),
            ValidationError
        );
        assert.throws(
            () => registerEmployee.execute({ ...validEmployeeData, telefono: '' }),
            ValidationError
        );
        assert.throws(
            () => registerEmployee.execute({ ...validEmployeeData, cargo: '' }),
            ValidationError
        );
        assert.throws(
            () => registerEmployee.execute({ ...validEmployeeData, salario: 0 }),
            ValidationError
        );
    });

    it('Control de errores de negocio: impide identificaciones duplicadas y IDs inexistentes', () => {
        registerEmployee.execute(validEmployeeData);

        assert.throws(
            () => registerEmployee.execute(validEmployeeData),
            DuplicateEmployeeError
        );
        assert.throws(
            () => findEmployee.execute('99999999'),
            EmployeeNotFoundError
        );
    });
});