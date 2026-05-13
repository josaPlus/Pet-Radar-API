import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { FoundPetsService } from './found-pets.service';
import type { FoundPetCDto } from 'src/core/models/found-pet.model';
import { logger } from 'src/config/logger';
import { FoundPet } from 'src/core/entities/found-pet.entity';

@Controller('found-pets')
export class FoundPetsController {
  constructor(private readonly foundPetsService: FoundPetsService) {}

  @Post()
  async create(@Body() dto: FoundPetCDto): Promise<boolean> {
    logger.info(`[FoundPetsController] POST crear mascota`);
    return await this.foundPetsService.create(dto);
  }

  @Get('search/nearby')
  async searchByRadius(
    @Query('latitude') latitude: string,
    @Query('longitude') longitude: string,
    @Query('radius') radius?: string,
  ): Promise<{ success: boolean; data: FoundPet[]; message: string }> {
    try {
      const lat = parseFloat(latitude);
      const lng = parseFloat(longitude);
      const radiusInMeters = radius ? parseInt(radius) : 500;

      if (isNaN(lat) || isNaN(lng)) {
        return {
          success: false,
          data: [],
          message: 'Coordenadas inválidas',
        };
      }

      logger.info(
        `[FoundPetsController] GET buscar mascotas cercanas - Lat: ${lat}, Lng: ${lng}, Radio: ${radiusInMeters}m`
      );

      const foundPets = await this.foundPetsService.findByRadius(lat, lng, radiusInMeters);

      return {
        success: true,
        data: foundPets,
        message: `Se encontraron ${foundPets.length} mascotas en un radio de ${radiusInMeters} metros`,
      };
    } catch (error) {
      logger.info('[FoundPetsController] Error en búsqueda por radio');
      return {
        success: false,
        data: [],
        message: 'Error al buscar mascotas por radio',
      };
    }
  }

  // ⭐ ÚLTIMO: Listar todas (genérico)
  @Get()
  async findAll() {
    logger.info('[FoundPetsController] GET listar mascotas encontradas');
    return await this.foundPetsService.findAll();
  }
}