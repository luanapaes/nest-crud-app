import { Body, Controller, Delete, Get, Param, Patch, Post, Put, UseGuards } from "@nestjs/common";
import { CreateUserDTO } from "./dto/create-user.dto";
import { UpdatePatchUserDTO } from "./dto/update-patch-user.dto";
import { UpdatePutUserDTO } from "./dto/update-put-user.dto";
import { UserService } from "./user.service";
import { AuthGuard } from "src/guards/auth.guard";

@UseGuards(AuthGuard)
@Controller('users')
export class UserController{
    
    constructor(private readonly userService: UserService) { }

    @Post()
    async create(@Body() data: CreateUserDTO) {
        return this.userService.create(data)
    }

    @Get()
    async read() {
        return this.userService.list()
    }


    @Get(':userId')
    async getUserById(@Param('userId') userId:number){
        return this.userService.getUserByIdUsingRelations(userId)
    }

    @Put(':id')
    async update(@Body() data: UpdatePutUserDTO, @Param("id") id: number) {
        return this.userService.update(id, data)
    }

    @Patch(':id')
    async updatePartial(@Body() data: UpdatePatchUserDTO, @Param("id") id: number) {
        return this.userService.updatePartial(id, data)
    }

    @Delete(':id')
    async delete(@Param("id") id: number) {
        return this.userService.delete(id)
    }

}