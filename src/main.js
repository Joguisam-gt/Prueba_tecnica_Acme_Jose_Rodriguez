/*
 * Conecta Infraestructura, Aplicación y Presentación usando ES Modules.
 */
import process from 'node:process';
import { InMemoryEmployeeRepository } from './infrastructure/persistence/InMemoryEmployeeRepository.js';
import { RegisterEmployee } from './application/use-cases/RegisterEmployee.js';
import { ListEmployees } from './application/use-cases/ListEmployees.js';
import { FindEmployeeByIdentification } from './application/use-cases/FindEmployeeByIdentification.js';
import { UpdateEmployee } from './application/use-cases/UpdateEmployee.js';
import { DeleteEmployee } from './application/use-cases/DeleteEmployee.js';
import { ConsoleUI } from './presentation/ConsoleUI.js';
import { EmployeeMenuController } from './presentation/EmployeeMenuController.js';

/*
 * Ensambla todas las dependencias siguiendo el principio DIP: si mañana ACME
 * cambia el arreglo en memoria por una base de datos, solo se modifica la
 * instancia de 'repository' en este constructor.
 */
export class AcmeApplication {
    #ui;
    #menuController;

    constructor() {
        const repository = new InMemoryEmployeeRepository();

        const useCases = {
            registerEmployee: new RegisterEmployee(repository),
            listEmployees: new ListEmployees(repository),
            findEmployee: new FindEmployeeByIdentification(repository),
            updateEmployee: new UpdateEmployee(repository),
            deleteEmployee: new DeleteEmployee(repository)
        };

        this.#ui = new ConsoleUI();
        this.#menuController = new EmployeeMenuController(this.#ui, useCases);
        this.#registerShutdownHooks();
    }

    /*
     * Captura la combinación Ctrl+C para cerrar readline ordenadamente sin
     * dejar procesos colgados ni volcados de pila abruptos.
     */
    #registerShutdownHooks() {
        process.on('SIGINT', () => {
            this.#ui.printInfo('Interrupción detectada (Ctrl+C). Cerrando aplicación de forma segura...');
            this.#ui.close();
            process.exit(0);
        });
    }

    /* 
     * Inicia el bucle interactivo del menú principal.
     */
    async run() {
        await this.#menuController.start();
    }
}

/*
 * Arranca la aplicación y captura cualquier fallo crítico de inicialización.
 */
const app = new AcmeApplication();
app.run().catch((error) => {
    console.error('\n[FATAL] Error crítico al ejecutar la aplicación:', error.message);
    process.exit(1);
});