import { Module } from '@nestjs/common';
import { LostPetsController } from './lost-pets.controller';
import { LostPetsService } from './lost-pets.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LostPet } from 'src/core/entities/lost-pet.entity';
import { CacheModule } from 'src/cache/cache.module';

@Module({
  imports: [TypeOrmModule.forFeature([LostPet]), CacheModule],
  controllers: [LostPetsController],
  providers: [LostPetsService]
})
export class LostPetsModule {}
