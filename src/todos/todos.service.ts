import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { TodoEntity } from "./todo.entity";
import { CreateTodoDTO } from "./dto/create-todo.dto";
import { NotFoundException } from "@nestjs/common";


export class TodosService {
    constructor(
        @InjectRepository(TodoEntity)
        private readonly todoRepository: Repository<TodoEntity>,

    ) { }

    async createTodo(todo: CreateTodoDTO) {

        const newTodo = this.todoRepository.create(todo);

        return await this.todoRepository.save(newTodo);

    }

    async findAll() {
        const todos = await this.todoRepository.find();
        return todos;
    }

    async findById(id: number) {

        await this.exists(id);

        const todoById = await this.todoRepository.findOneBy({
            id
        });

        return todoById;
    }

    async update(id: number, todo: CreateTodoDTO) {

        await this.exists(id);

        const updatedTodo = await this.todoRepository.findOne({
            where: {
                id
            }
        });

        // verifica se existe - compara id do banco e id do param
        Object.assign(updatedTodo, todo);

        return await this.todoRepository.save(updatedTodo);

    }

    async delete(id: number) {
        
        await this.exists(id);

        //verifica se o todo existe
        const todo = await this.todoRepository.findOne({
            where: {
                id
            }
        });

        return await this.todoRepository.remove(todo)

    }

    async exists(id: number){

        if(!(await this.todoRepository.exists({
            where: {
                id
            }
        }))) {
            throw new NotFoundException(`Todo com id ${id} não encontrado.`)
        }
    }
}