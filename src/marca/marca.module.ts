import { forwardRef, MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { MarcaController } from "./marca.controller";
import { MarcaService } from "./marca.service";
import { MarcaIdCheckMiddleware } from "src/middlewares/marca-id-check-middleware";
import { UserModule } from "src/user/user.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "src/user/entity/user.entity";
import { MarcaEntity } from "./entity/marca.entity";
import { AuthModule } from "src/auth/auth.module";

@Module({
    imports: [
        AuthModule,
        forwardRef(() => UserModule),
        TypeOrmModule.forFeature(
            [MarcaEntity, UserEntity]
        ),
    ],
    controllers: [MarcaController],
    providers: [MarcaService],
    exports: [MarcaService]
})
export class MarcaModule {

    configure(consumer: MiddlewareConsumer) {
        consumer.apply(MarcaIdCheckMiddleware).forRoutes({
            path: 'marcas/:id',
            method: RequestMethod.ALL
        })
    }
    
}