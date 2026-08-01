// NestJS Service for ToDos
import {Injectable} from "@nestjs/common";

@Injectable()
export class TodosService {
    // TODO: implement todos storage and methods (getTodos, addTodo,
    //  markCompleted)
    private todos = [
        { id: 1, title: 'Learn React', completed: false },
        { id: 2, title: 'Build Todo App', completed: true },
        { id: 3, title: 'Write Tests', completed: false }
    ]

    addTodo(title: string) {

        const newTodo = {
            id: Date.now(),
            title: title,
            completed: false
        }

        this.todos.push(newTodo);
        return newTodo;
    }

    getTodos() {
        return this.todos;
    }

    markCompleted(id: number) {
        const todo = this.todos
            .find(t => t.id === id);

        if (!todo) {
            return null;
        }

        todo.completed = true;

        return todo;
    }
} 