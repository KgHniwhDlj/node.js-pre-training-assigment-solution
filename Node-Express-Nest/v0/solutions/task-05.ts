// NestJS Controller for /todos
import {Body, Controller, Get, Param, Patch, Post} from '@nestjs/common';
import {TodosService} from "./task-06";

@Controller('todos')
export class TodosController {
    constructor(private readonly todosService: TodosService) {}

  @Get()
  getTodos() {
    // TODO: implement
    // return [
    //     { id: 1, title: 'Learn React', completed: false },
    //     { id: 2, title: 'Build Todo App', completed: true },
    //     { id: 3, title: 'Write Tests', completed: false }
    // ]
      return this.todosService.getTodos();
  }

  @Post()
    addTodo(@Body('title') title: string) {
        return this.todosService.addTodo(title);
  }

  @Patch(':id/complete')
    updateTodo(@Param('id') id: string) {
        return this.todosService.markCompleted(Number(id));
  }
} 