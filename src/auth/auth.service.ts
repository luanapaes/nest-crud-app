import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "src/user/entity/user.entity";
import { UserService } from "src/user/user.service";
import { Repository } from "typeorm";
import * as bcrypt from "bcrypt";
import { AuthRegisterDTO } from "./dto/auth-register.dto";

@Injectable()
export class AuthService {
    private audience = "audience";
    private issuer = "issuer";

    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UserService,
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>
    ){}

    createToken(user) {
        return {
            accessToken: this.jwtService.sign({
                id: user.id,
                name: user.username,
                email: user.email
            }, {
                secret: process.env.JWT_SECRET,
                expiresIn: "7 days",
                subject: String(user.id),
                issuer: this.issuer,
                audience: this.audience
            })
        }
    }

    checkToken(token: string){
        
        try{
            const data = this.jwtService.verify(token, {
                secret: process.env.JWT_SECRET,
                issuer: this.issuer,
                audience: this.audience
            });
            return data
        } catch (e){
            throw new BadRequestException(e.message);
        }

    }

    isValidToken(token: string){
        
        try {
            this.checkToken(token);
            return true;
        } catch (e) {
            return false;
        }

    }

    async login(email: string, password: string){
        
        const user = await this.userRepository.findOneBy({
            email
        })

        if(!user){
            throw new UnauthorizedException("Email ou senha incorretos.");
        }

        if(! await bcrypt.compare(password, user.password)){
            throw new UnauthorizedException("Email ou senha incorretos.");
        }

        return this.createToken(user);
    }

    async forget(email: string) {
        const user = await this.userRepository.findOneBy({
            email
        })

        if (!user) {
            throw new UnauthorizedException("E-mail incorreto.")
        }

        //To do: enviar email de recuperação

        return true;

    }

    async reset(password: string, token: string) {
        try {
            const data: any = this.jwtService.verify(token, {
                issuer: 'forget',
                audience: 'users',
            })

            if (isNaN(Number(data.id))) {
                throw new BadRequestException("Token não é válido")
            }

            const salt = await bcrypt.genSalt();
            password = await bcrypt.hash(password, salt)

            await this.userRepository.update(Number(data.id), {
                password
            });

            const user = await this.userService.listOne(data.id);

            return this.createToken(user)
        } catch (e) {
            throw new BadRequestException(e)
        }
    }

    async register(data: AuthRegisterDTO) {

        const user = await this.userService.create(data);
        
        // return this.createToken(user)
        const token = this.createToken(user);
        return {
            token: token,
            user: user.map((user) => user.id)
        };
    }
}