import { Todo } from './types';
import { mapArray } from './array-helpers';
import { filterArray } from './array-helpers';

export function addTodo(state: Todo[], todo: Todo): Todo[] {
  //throw new Error('addTodo: not implemented');
  if (!state || !todo) {    // checks if state or todo isn't provided
    throw new TypeError('State and todo must be provided');
  }
  return [...state, todo]; // creates an array copying old todos and adding a new one at the end
}

export function updateTodo(state: Todo[], id: number, update: Partial<Omit<Todo, 'id' | 'createdAt'>>): Todo[] {
  
  const exists = state.some(t => t.id === id); // checks if a todo with such ID exists
  
  if (!exists) {
    throw new TypeError(`Todo with id ${id} not found`);
  }

  return mapArray(state, (todo) => 
    // if IDs match, creates a new object that combines properties of the todo and its updates
    todo.id === id ? {...todo, ...update} : todo  
   );
  //throw new Error('updateTodo: not implemented');
}

export function removeTodo(state: Todo[], id: number): Todo[] {
  
  const exists = state.some(t => t.id === id);

  if (!exists) {
    throw new TypeError(`Todo with id ${id} not found`);
  }

  return filterArray(state, (todo) => todo.id !== id); // filters the array, keeping only those items which IDs don't match the provided one
  //throw new Error('removeTodo: not implemented');
}

export function getTodo(state: Todo[], id: number): Todo | undefined {
  
  return state.find(todo => todo.id === id);  // looks for an item which ID matches the provided one
  //throw new Error('getTodo: not implemented');
}
