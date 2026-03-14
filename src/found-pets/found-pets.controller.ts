import { Body, Controller, Post } from '@nestjs/common';
import { FoundPetsService } from './found-pets.service';
import type { FoundPetCDto } from 'src/core/models/found-pet.model';

@Controller('found-pets')
export class FoundPetsController {
  constructor(private readonly foundPetsService: FoundPetsService) {}

  @Post()
  create(@Body() dto: FoundPetCDto): Promise<boolean> {
    return this.foundPetsService.create(dto);
  }
}