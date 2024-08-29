import { Body, Controller, Delete, Get, Param, Post, Put, Request, UseGuards } from "@nestjs/common";
import { TodosService } from "./todos.service";
import { CreateTodoDTO } from "./dto/create-todo.dto";
import { AuthGuard } from "src/guards/auth.guard";

@UseGuards(AuthGuard)
@Controller('todos')
export class TodosController{
    constructor(
        private readonly todosService: TodosService
    ){}

    @Post()
    create(@Body() todo: CreateTodoDTO, @Request() req) {
        // Adiciona o userId do payload ao novo todo
        todo.userId = req.user.id;
        return this.todosService.createTodo(todo);
    }

    @Get()
    findAll(){
        return this.todosService.findAll()
    }

    @Get(":id")
    findById(@Param("id") id: number){
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