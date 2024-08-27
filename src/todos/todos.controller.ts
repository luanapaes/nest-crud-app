import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { TodosService } from "./todos.service";
import { CreateTodoDTO } from "./dto/create-todo.dto";

@Controller('todos')
export class TodosController{
    constructor(
        private readonly todosService: TodosService
    ){}

    @Post()
    create(@Body() todo: CreateTodoDTO){
        return this.todosService.createTodo(todo);
    }

    @Get()
    findAll(){
        return this.todosService.findAll()
    }

    @Get(":id")
    findById(id: number){
        return this.todosService.findById(id)
    }

    @Put(":id")
    async updateTodo(@Param('id') id: number ,@Body() todo: CreateTodoDTO){

        return await this.todosService.update(id, todo)
    }

    @Delete(":id")
    deleteTodo(@Param("id") id: number){
        return this.todosService.delete(id)
    }

}