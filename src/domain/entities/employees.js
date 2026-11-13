import { randomUUID } from 'node:crypto';
import { EmployeeValidator } from '../validators/EmployeeValidator.js';

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

    withUpdates(partialData) {
        return new Employee({
            ...this.toPrimitives(),
            ...partialData,
            id: this.#id
        });
    }

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