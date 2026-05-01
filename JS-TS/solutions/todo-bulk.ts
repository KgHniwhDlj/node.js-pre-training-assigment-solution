import { Todo, TodoStatus } from './types';
import { mapArray } from './array-helpers';
import { filterArray } from './array-helpers';

export function toggleAll(state: Todo[], completed: boolean): Todo[] {
  
  const targetStatus = completed ? TodoStatus.COMPLETED : TodoStatus.PENDING ; // if completed is true assigns COMPLETED, if false PENDING

  return mapArray(state, (todo) => {  
    if (todo.status === targetStatus) { // if todo status matches with targetStatus nothing changes
    return todo; 
    }
    return { // returns a new todo object with status changed to targetStatus
      ...todo, 
      status: targetStatus
    };
});
  
}

export function clearCompleted(state: Todo[]): Todo[] {
  
  // filters the array, keeping only those todos that are not COMPLETED
  return filterArray(state, (todo) => todo.status !== TodoStatus.COMPLETED); 
  
}

export function countByStatus(state: Todo[], status: TodoStatus): number {

  // filters the array, keeping only todos with provided status 
  const filtered = filterArray(state, (todo) => todo.status === status);
  return filtered.length; // returns the number of todos with provided status
  
}
