// NestJS DTO class for ToDo
import {
    IsNumber,
    IsString,
    MinLength,
    MaxLength,
    IsBoolean } from 'class-validator'

export class ToDoDto {
  // TODO: implement fields: id, title, completed

    @IsNumber()
    id!: number;

    @IsString()
    @MinLength(5)
    @MaxLength(150)
    title!: string;

    @IsBoolean()
    completed: boolean = false;
} 