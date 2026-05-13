import { Module } from '@nestjs/common';
import { LostPetsController } from './lost-pets.controller';
import { LostPetsService } from './lost-pets.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LostPet } from 'src/core/entities/lost-pet.entity';
import { CacheModule } from 'src/cache/cache.module';
import { FoundPet } from 'src/core/entities/found-pet.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LostPet, FoundPet]), CacheModule],
  controllers: [LostPetsController],
  providers: [LostPetsService]
})
export class LostPetsModule {}
