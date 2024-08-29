import { forwardRef, MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TodoEntity } from "./todo.entity";
import { TodosController } from "./todos.controller";
import { TodosService } from "./todos.service";
import { TodoIdCheckMiddleware } from "src/middlewares/todo-id-check.middleware";
import { UserEntity } from "src/user/entity/user.entity";
import { AuthModule } from "src/auth/auth.module";
import { AuthService } from "src/auth/auth.service";
import { JwtService } from "@nestjs/jwt";
import { UserModule } from "src/user/user.module";


@Module({
    imports: [
        forwardRef(() => UserModule),
        forwardRef(() => AuthModule),
        TypeOrmModule.forFeature(
            [TodoEntity, UserEntity]
        )
    ],
    controllers: [TodosController],
    providers: [TodosService, TodoEntity, AuthService, JwtService]
})
export class TodosModule{

    configure(consumer: MiddlewareConsumer){
        consumer.apply(TodoIdCheckMiddleware).forRoutes({
            path: 'todos/:id',
            method: RequestMethod.ALL
        })
    }
    

}