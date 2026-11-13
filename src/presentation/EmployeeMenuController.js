/*
 * Permite identificar si una excepción lanzada durante la ejecución proviene
 * de una regla de negocio o validación controlada (AppError).
 */
import { AppError } from '../domain/errors/DomainErrors.js';

/*
 * Orquesta la interacción con el usuario de Talento Humano ACME. Recibe la
 * interfaz (ui) y los 5 casos de uso (useCases) inyectados en su constructor.
 */
export class EmployeeMenuController {
    #ui;
    #useCases;

    constructor(ui, useCases) {
        this.#ui = ui;
        this.#useCases = useCases;
    }

    /*
     * Mantiene el menú activo hasta que el usuario elija la opción "0".
     * El bloque try / catch interno captura cualquier error operacional y
     * devuelve al usuario al menú principal sin perder los datos en memoria.
     */
    async start() {
        let isRunning = true;

        while (isRunning) {
            this.#ui.printHeader('ACME - SISTEMA DE GESTIÓN DE EMPLEADOS');
            console.log('1. Registrar empleado (RF-01)');
            console.log('2. Listar empleados registrados (RF-02)');
            console.log('3. Buscar empleado por identificación (RF-03)');
            console.log('4. Actualizar empleado por ID único (RF-04)');
            console.log('5. Eliminar empleado por ID único (RF-05)');
            console.log('0. Salir del sistema');

            const option = (await this.#ui.ask('\nSeleccione una opción: ')).trim();

            try {
                switch (option) {
                    case '1':
                        await this.#handleRegister();
                        break;
                    case '2':
                        this.#handleList();
                        break;
                    case '3':
                        await this.#handleFindByIdentificacion();
                        break;
                    case '4':
                        await this.#handleUpdate();
                        break;
                    case '5':
                        await this.#handleDelete();
                        break;
                    case '0':
                        isRunning = false;
                        this.#ui.printInfo('Cerrando aplicación de Talento Humano ACME. ¡Hasta pronto!');
                        break;
                    default:
                        this.#ui.printError('Opción no válida. Por favor seleccione un número del 0 al 5.');
                }
            } catch (error) {
                if (error instanceof AppError) {
                    this.#ui.printError(error.message);
                } else {
                    this.#ui.printError(`Error inesperado controlado: ${error.message}`);
                }
            }
        }

        this.#ui.close();
    }

    /*
     * Solicita los 11 campos requeridos por consola y delega la validación y
     * generación del UUID único al caso de uso registerEmployee.
     */
    async #handleRegister() {
        this.#ui.printHeader('REGISTRAR NUEVO EMPLEADO (RF-01)');
        const data = {
            identificacion: await this.#ui.ask('Identificación: '),
            nombres: await this.#ui.ask('Nombres: '),
            apellidos: await this.#ui.ask('Apellidos: '),
            genero: await this.#ui.ask('Género (M / F / O): '),
            email: await this.#ui.ask('Email: '),
            telefono: await this.#ui.ask('Teléfono: '),
            direccion: await this.#ui.ask('Dirección: '),
            ciudadResidencia: await this.#ui.ask('Ciudad de residencia: '),
            profesion: await this.#ui.ask('Profesión: '),
            cargo: await this.#ui.ask('Cargo: '),
            salario: await this.#ui.ask('Salario: ')
        };

        const created = this.#useCases.registerEmployee.execute(data);
        this.#ui.printSuccess(
            `Empleado ${created.nombres} ${created.apellidos} registrado con ID único: ${created.id}`
        );
    }

    /*
     * Obtiene todos los empleados almacenados en memoria y los imprime en tabla.
     */
    #handleList() {
        this.#ui.printHeader('LISTADO DE EMPLEADOS REGISTRADOS (RF-02)');
        const employees = this.#useCases.listEmployees.execute();
        this.#ui.printTable(employees);
    }

    /*
     * Captura el número de identificación civil y despliega el empleado hallado.
     */
    async #handleFindByIdentificacion() {
        this.#ui.printHeader('BUSCAR EMPLEADO POR IDENTIFICACIÓN (RF-03)');
        const identificacion = await this.#ui.ask('Ingrese el número de identificación: ');
        const employee = this.#useCases.findEmployee.execute(identificacion);
        this.#ui.printTable([employee]);
    }

    /*
     * Solicita el UUID del empleado y permite modificar solo los campos que el
     * usuario escriba, conservando intactos aquellos donde presione ENTER vacío.
     */
    async #handleUpdate() {
        this.#ui.printHeader('ACTUALIZAR EMPLEADO POR ID ÚNICO (RF-04)');
        const id = await this.#ui.ask('Ingrese el ID único (UUID) del empleado: ');
        this.#ui.printInfo('Presione ENTER sin escribir nada en los campos que no desea modificar.');

        const rawInputs = {
            identificacion: await this.#ui.ask('Nueva identificación: '),
            nombres: await this.#ui.ask('Nuevos nombres: '),
            apellidos: await this.#ui.ask('Nuevos apellidos: '),
            genero: await this.#ui.ask('Nuevo género (M / F / O): '),
            email: await this.#ui.ask('Nuevo email: '),
            telefono: await this.#ui.ask('Nuevo teléfono: '),
            direccion: await this.#ui.ask('Nueva dirección: '),
            ciudadResidencia: await this.#ui.ask('Nueva ciudad de residencia: '),
            profesion: await this.#ui.ask('Nueva profesión: '),
            cargo: await this.#ui.ask('Nuevo cargo: '),
            salario: await this.#ui.ask('Nuevo salario: ')
        };

        const updates = Object.fromEntries(
            Object.entries(rawInputs).filter(([, value]) => value.trim() !== '')
        );

        const updated = this.#useCases.updateEmployee.execute(id, updates);
        this.#ui.printSuccess(
            `Empleado ${updated.nombres} ${updated.apellidos} (ID: ${updated.id}) actualizado correctamente.`
        );
    }

    /*
     * Solicita el UUID del empleado y ejecuta su eliminación definitiva.
     */
    async #handleDelete() {
        this.#ui.printHeader('ELIMINAR EMPLEADO POR ID ÚNICO (RF-05)');
        const id = await this.#ui.ask('Ingrese el ID único (UUID) del empleado a eliminar: ');
        this.#useCases.deleteEmployee.execute(id);
        this.#ui.printSuccess('Empleado eliminado del sistema correctamente.');
    }
}