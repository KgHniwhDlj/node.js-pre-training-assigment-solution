import {TodoService} from "../JS-TS/solutions/todo-service";
import {TodoApi} from "../JS-TS/solutions/todo-api";
import {TodoStatus} from "../JS-TS/solutions/types";
import {InMemoryRepository} from "../JS-TS/solutions/repository";

describe('TodoService Unit Tests', () => {
    let service: TodoService;
    let api: TodoApi;

    beforeEach(() => {
        jest.useFakeTimers();

        api = new TodoApi();
        service = new TodoService(api);
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    async function timers() {
        await jest.runAllTimersAsync();
    }

    it('Should successfully create a todo', async () => {
        const createPromise = service.create('Buy milk', 'Need more milk');

        await timers();
        const result = await createPromise;

        expect(result).toBeDefined();
        expect(result.id).toBe(1);
        expect(result.title).toBe('Buy milk');
        expect(result.description).toBe('Need more milk');
        expect(result.status).toBe(TodoStatus.PENDING);
    });

    it('Should throw an error if title is empty', async () => {
        await expect(() => service.create(' ')).rejects.toThrow('Title cannot be empty');
    });

    it('Should toggle the status', async () => {
        const createPromise = service.create('Test');
        await timers();
        await createPromise;

        const toggle1 = service.toggleStatus(1);
        await timers();
        let updated = await toggle1;
        expect(updated.status).toBe(TodoStatus.IN_PROGRESS);

        const toggle2 = service.toggleStatus(1);
        await timers();
        updated = await toggle2;
        expect(updated.status).toBe(TodoStatus.COMPLETED);

        const toggle3 = service.toggleStatus(1);
        await timers();
        updated = await toggle3;
        expect(updated.status).toBe(TodoStatus.PENDING);
    });

    it('Should return matching items on search', async () => {

        const p1 = service.create('Apple pie', 'Delicious');
        await timers();
        await p1;
        const p2 = service.create('Banana shake', 'Fruit drink');
        await timers();
        await p2;

        const searchP1 = service.search('APPLE');
        await timers();
        const result1 = await searchP1;
        expect(result1.length).toBe(1);
        expect(result1[0].title).toBe('Apple pie');

        const searchP2 = service.search('drink');
        await timers();
        const result2 = await searchP2;
        expect(result2.length).toBe(1);
        expect(result2[0].title).toBe('Banana shake');
    });

    it('Should throw an error when toggling non-existing id', async () => {
        const assertion = expect(service.toggleStatus(13)).rejects.toThrow('Todo with 13 id was not found');
        await jest.advanceTimersByTimeAsync(600);
        await assertion;
    });

    it('Should throw an error when updating non-existing id', () => {
        const repo = new InMemoryRepository<{ id: number; title: string }>();
        expect(() => repo.update(999, { title: 'New' })).toThrow();
    });

})