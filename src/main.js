/* 
 * Conecta Dominio (EmployeeValidator), Infraestructura, Aplicación y
 * Presentación mediante ES Modules con extensiones explícitas (.js).
 */
import process from 'node:process';
import { EmployeeValidator } from './domain/validators/EmployeeValidator.js';
import { InMemoryEmployeeRepository } from './infrastructure/persistence/InMemoryEmployeeRepository.js';
import { RegisterEmployee } from './application/use-cases/RegisterEmployee.js';
import { ListEmployees } from './application/use-cases/ListEmployees.js';
import { FindEmployeeByIdentification } from './application/use-cases/FindEmployeeByIdentification.js';
import { UpdateEmployee } from './application/use-cases/UpdateEmployee.js';
import { DeleteEmployee } from './application/use-cases/DeleteEmployee.js';
import { ConsoleUI } from './presentation/ConsoleUI.js';
import { EmployeeMenuController } from './presentation/EmployeeMenuController.js';

/* 
 * Actúa como Composition Root (principio DIP): instancia el validador de
 * reglas de negocio y el repositorio en memoria, inyectándolos en los casos
 * de uso correspondientes.
 */
export class AcmeApplication {
    #ui;
    #menuController;

    constructor() {
        const validator = new EmployeeValidator();
        const repository = new InMemoryEmployeeRepository();

        const useCases = {
            registerEmployee: new RegisterEmployee(repository, validator),
            listEmployees: new ListEmployees(repository),
            findEmployee: new FindEmployeeByIdentification(repository),
            updateEmployee: new UpdateEmployee(repository, validator),
            deleteEmployee: new DeleteEmployee(repository)
        };

        this.#ui = new ConsoleUI();
        this.#menuController = new EmployeeMenuController(this.#ui, useCases);
        this.#registerShutdownHooks();
    }

    /*
     * Captura Ctrl+C para cerrar readline ordenadamente sin cierres abruptos.
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