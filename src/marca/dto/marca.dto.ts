import { IsArray, IsNumber, IsString } from "class-validator";

export class CreateMarcaDTO{

    @IsString()
    name: string;

    @IsArray()
    categorias: string[];

    @IsString()
    logomarca: string;

    @IsNumber()
    userId:number
}