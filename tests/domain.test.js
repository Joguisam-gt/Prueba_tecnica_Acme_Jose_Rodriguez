/* 
 * Usa 'node:test' y 'node:assert/strict' integrados en Node.js para validar
 * el dominio sin instalar Jest, Mocha ni Vitest.
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { Employee } from '../src/domain/entities/Employee.js';
import { ValidationError } from '../src/domain/errors/DomainErrors.js';

/*
 * Agrupa los escenarios de verificación sobre la entidad Employee y sus
 * reglas de negocio (RN-01 a RN-05).
 */
describe('Fase 2 - Dominio Employee y Reglas de Negocio', () => {
    // Datos semilla válidos reutilizables para construir variaciones de prueba
    const baseData = {
        identificacion: '10101010',
        nombres: 'Carlos',
        apellidos: 'Mendoza',
        genero: 'm',
        email: 'CARLOS@ACME.COM',
        telefono: '55501928',
        direccion: 'Av. Reforma 12-01',
        ciudadResidencia: 'Guatemala',
        profesion: 'Ingeniero',
        cargo: 'Analista',
        salario: 12000
    };

    /*
     * Comprueba que al entregar datos correctos se genere automáticamente el
     * UUID único y se normalicen el género a mayúscula y el email a minúscula.
     */
    it('crea un empleado válido con UUID único y normaliza género y email', () => {
        const emp = new Employee(baseData);
        assert.ok(emp.id);
        assert.equal(emp.genero, 'M');
        assert.equal(emp.email, 'carlos@acme.com');
    });

    /*
     * Verifica mediante assert.throws que cada dato inválido dispare
     * exactamente un ValidationError controlado.
     */
    it('valida RN-01 a RN-05 lanzando ValidationError', () => {
        assert.throws(() => new Employee({ ...baseData, nombres: '' }), ValidationError);
        assert.throws(() => new Employee({ ...baseData, apellidos: '   ' }), ValidationError);
        assert.throws(() => new Employee({ ...baseData, genero: 'X' }), ValidationError);
        assert.throws(() => new Employee({ ...baseData, email: 'correo-invalido' }), ValidationError);
        assert.throws(() => new Employee({ ...baseData, profesion: '' }), ValidationError);
        assert.throws(() => new Employee({ ...baseData, salario: -50 }), ValidationError);
    });
});