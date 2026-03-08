import { Module } from '@nestjs/common';
import { FoundPetsController } from './found-pets.controller';
import { FoundPetsService } from './found-pets.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FoundPet } from 'src/core/entities/found-pet.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FoundPet])],
  controllers: [FoundPetsController],
  providers: [FoundPetsService]
})
export class FoundPetsModule {}
