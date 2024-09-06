import { BadRequestException, Injectable } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import { CreateMarcaDTO } from './dto/marca.dto';
import { LogomarcaDTO } from './dto/logomarca.dto';
import { MarcaEntity } from './entity/marca.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class MarcaService {
    constructor(
        @InjectRepository(MarcaEntity)
        private readonly todoRepository: Repository<MarcaEntity>
    ) { }

    supabaseURL = process.env.SUPABASE_URL;
    supabaseKEY = process.env.SUPABASE_KEY;

    async createMarca(marca: CreateMarcaDTO, file: LogomarcaDTO) {

        // Verifica se já existe uma marca com o mesmo nome
        const existingMarca = await this.todoRepository.findOne({ where: { name: marca.name } });

        if (existingMarca) {
            throw new BadRequestException('Uma marca com este nome já está cadastrada.');
        }

        const supabase = createClient(this.supabaseURL, this.supabaseKEY, {
            auth: {
                persistSession: false
            }
        });

        //salva a imagem no supabase
        const newLogomarca = await supabase.storage
            .from('upload')
            .upload(file.originalname, file.buffer, {
                upsert: true
            });

        //passa os valores para as propriedades
        const newMarca: CreateMarcaDTO = {
            name: marca.name,
            categorias: marca.categorias,
            logomarca: newLogomarca.data.fullPath,
            userId: marca.userId
        }

        const resp = this.todoRepository.create(newMarca);

        return await this.todoRepository.save(resp);
    }

    async getMarcas() {
        const marcas = await this.todoRepository.find();
        return marcas
    }
}
