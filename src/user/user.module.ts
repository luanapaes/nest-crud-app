import { forwardRef, MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "./entity/user.entity";
import { AuthModule } from "src/auth/auth.module";
import { UserIdCheckMiddleware } from "src/middlewares/user-id-check.middleware";


@Module({
    imports: [
        forwardRef(() => AuthModule),
        TypeOrmModule.forFeature([UserEntity]),
    ],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService]
})
export class UserModule {

    configure(consumer: MiddlewareConsumer) {
        consumer.apply(UserIdCheckMiddleware).forRoutes({
            path: 'users/:id',
            method: RequestMethod.ALL
        })
    }


}

