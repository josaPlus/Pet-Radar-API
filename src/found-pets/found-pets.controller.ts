import { Body, Controller, Get, Post } from '@nestjs/common';
import { FoundPetsService } from './found-pets.service';
import type { FoundPetCDto } from 'src/core/models/found-pet.model';
import { logger } from 'src/config/logger';

@Controller('found-pets')
export class FoundPetsController {
  constructor(private readonly foundPetsService: FoundPetsService) {}

  @Post()
  async create(@Body() dto: FoundPetCDto): Promise<boolean> {
    logger.info(`[FoundPetsController] POST crear mascota: ${dto.species}, ${dto.breed || 'N/A'}, ${dto.color}`);
    return await this.foundPetsService.create(dto);
  }

  @Get()
  async findAll() {
    logger.info('[FoundPetsController] GET listar mascotas');
    return await this.foundPetsService.findAll();
  }  
}