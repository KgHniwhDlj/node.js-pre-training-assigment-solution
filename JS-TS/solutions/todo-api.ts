import { InMemoryRepository } from './repository';
import { Todo, NewTodo } from './types';

export class TodoApi {
  private repo = new InMemoryRepository<Todo>();
  private nextId = 1;

  async getAll(): Promise<Todo[]> {

    const mathMs = Math.floor(Math.random() * (600 - 300 + 1)) + 300;

    return new Promise ((resolve) => 
    setTimeout(() => {
      let data = this.repo.findAll();
      resolve([...data])
    }, mathMs)
    )
  }

  async add(newTodo: NewTodo): Promise<Todo> {

    const mathMs = Math.floor(Math.random() * (600 - 300 + 1)) + 300;

    return new Promise ((resolve) =>
      setTimeout(() => {
        let addTodo: Todo = {
          ...newTodo,
          id: this.nextId++,
          createdAt: new Date(),
        }

        this.repo.add(addTodo);

        resolve(addTodo);
    }, mathMs))

  }

  async update(id: number, update: Partial<Omit<Todo, 'id' | 'createdAt'>>): Promise<Todo> {

    const mathMs = Math.floor(Math.random() * (600 - 300 + 1)) + 300;

    return new Promise ((resolve, reject) => {
      setTimeout(() => {

        let todo = this.repo.findById(id);

        if (!todo) {
          return reject(new TodoNotFoundError(`Todo with ${id} id was not found`));
        } 
        
        let updateTodo: Todo = {
          ...todo,
          ...update,
        }

        this.repo.update(id, updateTodo);
        resolve(updateTodo);
      }, mathMs)
    })
  }

  async remove(id: number): Promise<void> {

    const mathMs = Math.floor(Math.random() * (600 - 300 + 1)) + 300;

    return new Promise((resolve, reject) =>
    setTimeout(() => {
      let todo = this.repo.findById(id);

      if (!todo) {
        return reject(new TodoNotFoundError(`Todo with ${id} id was not found`));
      }

      this.repo.remove(id);
      resolve();
    }, mathMs));
  }
}

export class TodoNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TodoNotFoundError'; 
    
    Object.setPrototypeOf(this, TodoNotFoundError.prototype);
      }
}