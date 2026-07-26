#!/usr/bin/env ts-node
// CLI entry for Task 10 – placeholder only
//console.log('CLI not implemented yet');
import {ToDoManager} from "./todo-manager";

async function main() {
    try {
        const manager = new ToDoManager();

        await manager.init();

        const command = process.argv[0];
        const arg1 = process.argv[1];
        const arg2 = process.argv[2];

        switch (command) {
            case 'add':
                if (!arg1) {
                    console.error('Please, enter title');
                    break;
                }
                await manager.add(arg1, arg2);
                console.log(`Todo "${arg1}" has been added!`);
                break;

            case 'complete':
                if (!arg1) {
                    console.error('Please, enter ID');
                    break;
                }
                await manager.complete(Number(arg1));
                console.log(`The status of the todo ${arg1} has been changed to COMPLETE!`);
                break;

            case 'list':
            default:
                const todos = await manager.list();
                console.log('All Todos:');
                console.log(todos);
                break;
        }
    } catch (error) {
        console.error(error);
    }
}