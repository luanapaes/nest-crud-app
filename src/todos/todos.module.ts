import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Todo } from "./todo.entity";
import { TodosController } from "./todos.controller";
import { TodosService } from "./todos.service";
import { TodoIdCheckMiddleware } from "src/middlewares/todo-id-check.middleware";


@Module({
    imports: [
        TypeOrmModule.forFeature(
            [Todo]
        )
    ],
    controllers: [TodosController],
    providers: [TodosService]
})
export class TodosModule{

    configure(consumer: MiddlewareConsumer){
        consumer.apply(TodoIdCheckMiddleware).forRoutes({
            path: 'todos/:id',
            method: RequestMethod.ALL
        })
    }
    

}