import { Body, Controller, Get, Post, UploadedFile, UseGuards, UseInterceptors, Request } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MarcaService } from './marca.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { CreateMarcaDTO } from './dto/marca.dto';

@UseGuards(AuthGuard)
@Controller('marcas')
export class MarcaController {
    constructor(
        private readonly marcaService: MarcaService
    ) { }

    @Post()
    @UseInterceptors(FileInterceptor('logomarca'))
    async create(@Body() marca: CreateMarcaDTO, @UploadedFile() logomarca, @Request() req) {
        
        //pega o id da request e passa para a propriedade.
        marca.userId = req.user.id;

        return await this.marcaService.createMarca(marca, logomarca);
    }

    @Get()
    async getMarcas() {
        return this.marcaService.getMarcas()
    }

}
