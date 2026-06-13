import { TodoApi } from './todo-api';
import { Todo, TodoStatus } from './types';

export class TodoService {
  constructor(private readonly api: TodoApi) { }

  async create(title: string, description = ''): Promise<Todo> {

      if (title.trim() === '') {
        throw new Error(`Title cannot be empty`);
      }
      let createdTodo = await this.api.add({
        title: title, 
        description: description, 
        status: TodoStatus.PENDING
      });
      return createdTodo;

  }

  async toggleStatus(id: number): Promise<Todo> {

    const allTodos = await this.api.getAll();
    const todo = allTodos.find(item => item.id === id);

    if (!todo) {
      throw new Error(`Todo with ${id} id was not found`);
    }

    let newStatus: TodoStatus;

    switch (todo.status) {
      case TodoStatus.PENDING:
        newStatus = TodoStatus.IN_PROGRESS;
        break;
      case TodoStatus.IN_PROGRESS:
        newStatus = TodoStatus.COMPLETED;
        break;
      case TodoStatus.COMPLETED:
        newStatus = TodoStatus.PENDING;
        break;
}


    let result = await this.api.update(id, { status: newStatus });
    return result;
  }

  async search(keyword: string): Promise<Todo[]> {

    let loweredKeyword = keyword.toLowerCase();
    const allTodos = await this.api.getAll();

    const filteredArray = allTodos.filter(todo => {
      const matchedTitles = todo.title.toLowerCase().includes(loweredKeyword);
      const matchedDescriptions = (todo.description?.toLowerCase() ?? '').includes(loweredKeyword);

      return matchedTitles || matchedDescriptions;
    });
    return filteredArray;
  }
}
