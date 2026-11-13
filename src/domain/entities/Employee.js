/* ============================================================================
 * BLOQUE 1: Importaciones Nativas y de Validación
 * Utiliza el módulo nativo 'node:crypto' (cero dependencias externas) para
 * generar identificadores únicos universales (UUID v4) conforme a RF-01, e
 * importa EmployeeValidator para garantizar las reglas RN-01 a RN-05.
 * ============================================================================ */
import { randomUUID } from 'node:crypto';
import { EmployeeValidator } from '../validators/EmployeeValidator.js';

/* ============================================================================
 * BLOQUE 2: Entidad Employee con Encapsulamiento Privado (ES2022 Private Fields #)
 * Protege todos los atributos del empleado para que ninguna capa externa
 * pueda modificarlos directamente saltándose las reglas de negocio.
 * ============================================================================ */
export class Employee {
    #id;
    #identificacion;
    #nombres;
    #apellidos;
    #genero;
    #email;
    #telefono;
    #direccion;
    #ciudadResidencia;
    #profesion;
    #cargo;
    #salario;

    /* --------------------------------------------------------------------------
     * BLOQUE 3: Constructor y Normalización de Estado
     * Valida los datos mediante EmployeeValidator.validate(props) antes de
     * asignar propiedades. Si todo es válido, genera un UUID automático (o
     * conserva el existente al actualizar) y limpia espacios innecesarios.
     * -------------------------------------------------------------------------- */
    constructor(props) {
        EmployeeValidator.validate(props);

        this.#id = props.id ?? randomUUID();
        this.#identificacion = props.identificacion.trim();
        this.#nombres = props.nombres.trim();
        this.#apellidos = props.apellidos.trim();
        this.#genero = props.genero.trim().toUpperCase();
        this.#email = props.email.trim().toLowerCase();
        this.#telefono = props.telefono.trim();
        this.#direccion = props.direccion.trim();
        this.#ciudadResidencia = props.ciudadResidencia.trim();
        this.#profesion = props.profesion.trim();
        this.#cargo = props.cargo.trim();
        this.#salario = Number(props.salario);
    }

    /* --------------------------------------------------------------------------
     * BLOQUE 4: Propiedades de Solo Lectura (Getters)
     * Exponen los valores encapsulados hacia las capas de aplicación y consola
     * sin permitir mutaciones directas desde el exterior.
     * -------------------------------------------------------------------------- */
    get id() { return this.#id; }
    get identificacion() { return this.#identificacion; }
    get nombres() { return this.#nombres; }
    get apellidos() { return this.#apellidos; }
    get genero() { return this.#genero; }
    get email() { return this.#email; }
    get telefono() { return this.#telefono; }
    get direccion() { return this.#direccion; }
    get ciudadResidencia() { return this.#ciudadResidencia; }
    get profesion() { return this.#profesion; }
    get cargo() { return this.#cargo; }
    get salario() { return this.#salario; }

    /* --------------------------------------------------------------------------
     * BLOQUE 5: Actualización Inmutable (RF-04)
     * Crea una nueva instancia de Employee combinando los valores actuales con
     * los campos modificados, revalidando RN-01..05 y conservando el mismo #id.
     * -------------------------------------------------------------------------- */
    withUpdates(partialData) {
        return new Employee({
            ...this.toPrimitives(),
            ...partialData,
            id: this.#id
        });
    }

    /* --------------------------------------------------------------------------
     * BLOQUE 6: Serialización a Objeto Plano (DTO)
     * Convierte los campos privados (#) en un objeto literal estándar de JS
     * para transportarlo entre capas o mostrarlo con console.table().
     * -------------------------------------------------------------------------- */
    toPrimitives() {
        return {
            id: this.#id,
            identificacion: this.#identificacion,
            nombres: this.#nombres,
            apellidos: this.#apellidos,
            genero: this.#genero,
            email: this.#email,
            telefono: this.#telefono,
            direccion: this.#direccion,
            ciudadResidencia: this.#ciudadResidencia,
            profesion: this.#profesion,
            cargo: this.#cargo,
            salario: this.#salario
        };
    }
}
