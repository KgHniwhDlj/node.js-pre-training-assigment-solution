import { Todo, NewTodo, TodoStatus } from './types';

let nextId = 1;

export function createTodo(input: NewTodo): Todo {

  const newTodo: Todo = {
    id: nextId++,  // assigns an ID and increments the counter 
    title: input.title,
    description: input.description,
    createdAt: new Date(),
    status: input.status || TodoStatus.PENDING, // sets the status to input or PENDING if not assigned
  };
  return newTodo;
  //throw new Error('createTodo: not implemented');
}
