import { TodoNotFoundError } from './todo-api'

export class InMemoryRepository<T extends { id: number }> {
  // private storage
  private items: T[] = [];

  add(entity: T): T {
    this.items.push(entity);
    return entity;
  }

  update(id: number, patch: Partial<T>): T {
    let index = this.items.findIndex(items => items.id === id)
    
    if (index === -1) {
      throw new TodoNotFoundError(`Todo with ${id} id was not found`)
    }
    const updatedItem: T = {
      ...this.items[index],
      ...patch,
      id: id,
    }
    this.items[index] = updatedItem;
    return updatedItem;
  }

  remove(id: number): void {
    this.items = this.items.filter(items => items.id !== id);
  }

  findById(id: number): T | undefined {
    let foundId = this.items.find(items => items.id === id)
    return foundId;
  }

  findAll(): T[] {
    return [...this.items];
  }
}
