import React, { useState } from 'react';
import { Todo } from '../../types';

/**
 * Task 5: FilteredToDoList Component
 * 
 * Theory: Derived State and Computed Values
 * 
 * In React, you often need to compute values based on your state. These are called "derived state"
 * or "computed values" and should be calculated during render rather than stored in state.
 * 
 * Why Use Derived State:
 * 1. Avoids state synchronization issues
 * 2. Reduces complexity by having a single source of truth
 * 3. Automatically updates when source data changes
 * 4. Prevents stale state bugs
 * 
 * Common Derived State Patterns:
 * 
 * Filtering:
 * - const activeTodos = todos.filter(todo => !todo.completed)
 * - const completedTodos = todos.filter(todo => todo.completed)
 * 
 * Searching:
 * - const filteredTodos = todos.filter(todo => 
 *     todo.title.toLowerCase().includes(searchTerm.toLowerCase())
 *   )
 * 
 * Sorting:
 * - const sortedTodos = [...todos].sort((a, b) => a.title.localeCompare(b.title))
 * 
 * Aggregations:
 * - const completedCount = todos.filter(todo => todo.completed).length
 * - const totalCount = todos.length
 * 
 * Multiple Filters:
 * - Use multiple filter conditions or combine them
 * - Consider using useMemo for expensive computations
 * 
 * Key Concepts:
 * - Calculate derived values during render
 * - Don't store computed values in state
 * - Use useMemo for expensive calculations
 * - Keep state minimal and derive the rest
 */
export const FilteredToDoList: React.FC = () => {
  // TODO: Implement the FilteredToDoList component
  // 
  // Requirements:
  // 1. Display a list of todos with add functionality
  // 2. Add filter buttons: "All", "Active", "Completed"
  // 3. Filter todos based on selected filter
  // 4. Use derived state for filtered results
  // 5. Add complete functionality for todos
  // 
  // Example implementation:
  // const [todos, setTodos] = useState<Todo[]>([]);
  // const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  // 
  // const filteredTodos = todos.filter(todo => {
  //   if (filter === 'active') return !todo.completed;
  //   if (filter === 'completed') return todo.completed;
  //   return true; // 'all' case
  // });

    const [todos, setTodos] = useState<Todo[]>([]);
    const [input, setInput] = useState('');
    const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

    const handleClick = (id: number)=> {
        setTodos(
            todos.map((todo) =>
                todo.id === id ? {...todo, completed: !todo.completed} : todo)
        );
    };

    const filteredTodos = todos.filter(todo => {
          if (filter === 'active') return !todo.completed;
          if (filter === 'completed') return todo.completed;
          return true;
        });

  return (
    <div>
      {/* TODO: Replace this with your implementation */}
      {/*<h4>Filtered ToDo List Component</h4>*/}
      {/*<p>Implement derived state and filtering here</p>*/}
        <form onSubmit={(e) => {
            e.preventDefault()
            if (!input.trim()) {
                return;
            }

            const newTodo: Todo = {
                id:Date.now(),
                title: input,
                completed: false,
            }

            setTodos([...todos, newTodo]);
            setInput('');

        }}>
            <label>
                <input type="text" placeholder="Add Todo" value={input} onChange={(e) => setInput(e.target.value)} />
            </label>
            <button type="submit">Add</button>
        </form>
        <button onClick={() => setFilter('all')}>All</button>
        <button onClick={() => setFilter('active')}>Active</button>
        <button onClick={() => setFilter('completed')}>Completed</button>
        <ul>
            {filteredTodos.map((todo) =>(
                <li key={todo.id}>
                    {todo.title} - {todo.completed ? 'Completed' : 'Not Completed'}
                    <button onClick={() => handleClick(todo.id)}>
                        {todo.completed ? 'Undo' : 'Complete'}
                    </button>
                </li>
            ))}
        </ul>
    </div>
  );
}; 