import process from 'node:process';
import { InMemoryEmployeeRepository } from './infrastructure/persistence/InMemoryEmployeeRepository.js';
import { RegisterEmployee } from './application/use-cases/RegisterEmployee.js';
import { ListEmployees } from './application/use-cases/ListEmployees.js';
import { FindEmployeeByIdentification } from './application/use-cases/FindEmployeeByIdentification.js';
import { UpdateEmployee } from './application/use-cases/UpdateEmployee.js';
import { DeleteEmployee } from './application/use-cases/DeleteEmployee.js';
import { ConsoleUI } from './presentation/ConsoleUI.js';
import { EmployeeMenuController } from './presentation/EmployeeMenuController.js';

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

    #registerShutdownHooks() {
        process.on('SIGINT', () => {
            this.#ui.printInfo('Interrupción detectada (Ctrl+C). Cerrando de forma segura...');
            this.#ui.close();
            process.exit(0);
        });
    }

    async run() {
        await this.#menuController.start();
    }
}

const app = new AcmeApplication();
app.run().catch((error) => {
    console.error('\n[FATAL] Error crítico en la aplicación:', error.message);
    process.exit(1);
});