import { Body, Controller, Post } from '@nestjs/common';
import { LostPetsService } from './lost-pets.service';
import type { LostPetCDto } from 'src/core/models/lost-pet.model';

@Controller('lost-pets')
export class LostPetsController {
    constructor(private readonly lostPetsService: LostPetsService) {}

    @Post()
  create(@Body() dto: LostPetCDto): Promise<boolean> {
    return this.lostPetsService.createLostPet(dto);
  }
}
