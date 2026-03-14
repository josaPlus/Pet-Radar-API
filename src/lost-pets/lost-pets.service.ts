import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LostPet } from 'src/core/entities/lost-pet.entity';
import { LostPetCDto } from 'src/core/models/lost-pet.model';
import { Repository } from 'typeorm';

@Injectable()
export class LostPetsService {
    constructor(
        @InjectRepository(LostPet)
        private readonly lostPetRepository: Repository<LostPet>,
    ) { }

    async createLostPet(dto: LostPetCDto): Promise<boolean> {
        const newLostPet = this.lostPetRepository.create({
            ...dto,
            location: {
                type: 'Point',
                coordinates: [dto.longitude, dto.latitude],
            },
        });

        await this.lostPetRepository.save(newLostPet);
        return true;
    }
}
