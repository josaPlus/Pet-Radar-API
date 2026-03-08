import { Module } from '@nestjs/common';
import { LostPetsController } from './lost-pets.controller';
import { LostPetsService } from './lost-pets.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LostPet } from 'src/core/entities/lost-pet.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LostPet])],
  controllers: [LostPetsController],
  providers: [LostPetsService]
})
export class LostPetsModule {}
