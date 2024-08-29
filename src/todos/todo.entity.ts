import { UserEntity } from "src/user/entity/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({
    name: 'todos'
})
export class TodoEntity {

    @PrimaryGeneratedColumn()
    id?: number;

    @Column({
        name: 'user_id',
        nullable: false
    })
    userId: number;

    @Column({
        nullable: false
    })
    title: string;

    @Column({
        nullable: false
    })
    description: string;

    @ManyToOne(() => UserEntity, (user) => user.todos)
    @JoinColumn({
        name: 'user_id', 
        referencedColumnName: 'id'
    })
    user?: UserEntity

}