import { UserEntity } from "src/user/entity/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({
    name: 'marcas'
})
export class MarcaEntity {

    @PrimaryGeneratedColumn()
    id?: number;

    @Column({
        name: 'user_id',
        nullable: false
    })
    userId: number;

    @Column({
        length: 127,
        unique: true,
        nullable: false
    })
    name: string;

    @Column('simple-array', {
        nullable: true
    })
    categorias: string | string[];

    @Column({
        nullable: false
    })
    logomarca: string;

    @ManyToOne(() => UserEntity, (user) => user.marcas)
    @JoinColumn({
        name: 'user_id',
        referencedColumnName: 'id'
    })
    user?: UserEntity
    
}