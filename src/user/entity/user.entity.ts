import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { TodoEntity } from "src/todos/todo.entity";
import { Role } from "src/enums/role.enum";

@Entity({
    name: 'users'
})
export class UserEntity{

    @PrimaryGeneratedColumn()
    id?: number;

    @Column({
        length: 63,
        nullable: false
    })
    name: string;

    @Column({
        length: 127,
        unique: true,
        nullable: false
    })
    email: string;

    @Column({
        length: 127,
        nullable: false
    })
    password: string;

    @CreateDateColumn()
    createdAt: string;

    @UpdateDateColumn()
    updatedAt: string;

    @Column({
        default: Role.User
    })
    role: number;

    @OneToMany(() => TodoEntity, (todo) => todo.user)
    todos?: TodoEntity[];

}