import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Todo } from "./todo.entity";
import { CreateTodoDTO } from "./dto/create-todo.dto";

export class TodosService {
    constructor(
        @InjectRepository(Todo)
        private readonly todoRepository: Repository<Todo>
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

        const todoById = await this.todoRepository.findOneBy({
            id
        });

        return todoById;
    }

    async update(id: number, todo: CreateTodoDTO) {

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

        //verifica se o todo existe
        const todo = await this.todoRepository.findOne({
            where: {
                id
            }
        });

        return await this.todoRepository.remove(todo)

    }
}