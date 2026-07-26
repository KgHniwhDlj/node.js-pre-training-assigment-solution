import { TodoService } from './todo-service';
import { TodoApi } from './todo-api';
import { Todo } from './types';

export class ToDoManager {
  private service = new TodoService(new TodoApi());

  async init(): Promise<void> {
    await this.service.create('Title1', 'Description1');
    await this.service.create('Title2', 'Description2');
  }

  async add(title: string, description = ''): Promise<void> {
    await this.service.create(title, description);
  }

  async complete(id: number): Promise<void> {
    const todos = await this.service.search('');
    const todo = todos.find((t) => t.id === id);

    if (todo && todo.status !== 'COMPLETED') {
      await this.service.toggleStatus(id);

      if (todo.status === 'PENDING') {
        await this.service.toggleStatus(id);
      }
    }
  }

  async list(): Promise<Todo[]> {
    return await this.service.search('');
  }
}
