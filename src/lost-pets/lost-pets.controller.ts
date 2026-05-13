import { Body, Controller, Get, Post } from '@nestjs/common';
import { LostPetsService } from './lost-pets.service';
import type { LostPetCDto } from 'src/core/models/lost-pet.model';
import { logger } from 'src/config/logger';

@Controller('lost-pets')
export class LostPetsController {
    constructor(private readonly lostPetsService: LostPetsService) {}

    @Post()
    async create(@Body() dto: LostPetCDto): Promise<boolean> {
      logger.info(`[LostPetsController] POST crear mascota perdida: ${dto.name}, ${dto.breed || 'N/A'}, ${dto.color}`);
      return await this.lostPetsService.createLostPet(dto);
    }

    @Get()
    async findAll() {
      logger.info('[LostPetsController] GET listar mascotas perdidas');
      return await this.lostPetsService.findAllLostPets();
    }
}