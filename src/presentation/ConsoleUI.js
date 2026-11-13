/* 
 * Utiliza 'node:readline/promises' y 'node:process' integrados en Node.js
 * para leer entradas del usuario de forma asíncrona sin librerías externas.
 */
import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

/*
 * Encapsula la instancia privada de readline (#rl) y estandariza cómo se
 * imprimen encabezados, tablas, alertas de error y mensajes de éxito.
 */
export class ConsoleUI {
    #rl;

    constructor() {
        this.#rl = createInterface({ input, output });
    }

    /* 
     * Muestra una pregunta en pantalla y espera a que el usuario presione ENTER.
     */
    async ask(question) {
        return this.#rl.question(question);
    }

    /*
     * Separan la presentación visual de la lógica del controlador del menú.
     */
    printHeader(title) {
        console.log(`  ${title}`);
    }

    printSuccess(message) {
        console.log(`\n[OK] ${message}`);
    }

    printError(message) {
        console.error(`\n[ERROR] ${message}`);
    }

    printInfo(message) {
        console.log(`\n[INFO] ${message}`);
    }

    /*
     * Muestra los registros en formato de tabla nativa usando console.table()
     * o informa amablemente si la lista aún está vacía.
     */
    printTable(items) {
        if (!Array.isArray(items) || items.length === 0) {
            this.printInfo('No hay empleados registrados en el sistema.');
            return;
        }
        console.log('');
        console.table(items);
    }

    /*
     * Libera los recursos de stdin/stdout para que Node.js finalice limpiamente.
     */
    close() {
        this.#rl.close();
    }
}