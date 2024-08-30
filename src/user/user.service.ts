import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateUserDTO } from "./dto/create-user.dto";
import { UserEntity } from "./entity/user.entity";
import { UpdatePutUserDTO } from "./dto/update-put-user.dto";
import * as bcrypt from "bcrypt"
import { UpdatePatchUserDTO } from "./dto/update-patch-user.dto";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private usersRepository: Repository<UserEntity>,
    ) { }

    async create(data: CreateUserDTO) {
        if (await this.usersRepository.exists({
            where: {
                email: data.email
            }
        })) {
            throw new BadRequestException("Este e-mail já está cadastrado.");
        }

        const salt = await bcrypt.genSalt();

        data.password = await bcrypt.hash(data.password, salt);

        const user = this.usersRepository.create(data);

        return this.usersRepository.save([user]);
    }

    async getUserByIdUsingRelations(userId: number): Promise<UserEntity>{
        return this.usersRepository.findOne({
            where: {
                id: userId
            },
            relations: ['todos']
        })
    }

    async list() {
        return this.usersRepository.find();

    }

    async listOne(id: number) {
        await this.exists(id)

        return this.usersRepository.findOneBy({
            id
        })

    }

    async update(id: number, { name, email, password, role }: UpdatePutUserDTO) {

        await this.exists(id)


        const salt = await bcrypt.genSalt();
        password = await bcrypt.hash(password, salt);

        await this.usersRepository.update(id, {
            name,
            email,
            password,
            role
        });

        return this.listOne(id);
    }

    async updatePartial(id: number, { name, email, password, role }: UpdatePatchUserDTO) {

        await this.exists(id)

        const data: any = {};

        if (name) {
            data.name = name
        }

        if (email) {
            data.email = email;
        }

        if (password) {
            const salt = await bcrypt.genSalt();
            data.password = await bcrypt.hash(password, salt);
        }

        if (role) {
            data.role = role;
        }

        await this.usersRepository.update(id, data);
        return this.listOne(id)
    }

    async delete(id: number) {

        await this.exists(id)

        return this.usersRepository.delete(id);
    }

    async exists(id: number) {

        if (!(await this.usersRepository.exists({
            where: {
                id
            }
        }))) {
            throw new NotFoundException(`Usuário ${id} não encontrado.`)
        }
    }
}