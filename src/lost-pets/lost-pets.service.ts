import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CacheService } from 'src/cache/cache.service';
import { LostPet } from 'src/core/entities/lost-pet.entity';
import { LostPetCDto } from 'src/core/models/lost-pet.model';
import { Repository } from 'typeorm';

const CACHE_KEY_ALL_LOST_PETS = "pet-radar:all-lost-pets";

@Injectable()
export class LostPetsService {
    constructor(
        @InjectRepository(LostPet)
        private readonly lostPetRepository: Repository<LostPet>,
        private readonly cacheService: CacheService,
    ) { }

    async findAllLostPets(): Promise<LostPet[]> {
        try {
            console.log('[LostPetsService] Ejecutando query de todas las mascotas perdidas...');
            const cachedLostPets = await this.cacheService.get<LostPet[]>(CACHE_KEY_ALL_LOST_PETS);
            
            if (cachedLostPets && cachedLostPets.length > 0) {
                return cachedLostPets;
            }

            const lostPets = await this.lostPetRepository.find();
            console.log(`[LostPetsService] Se encontraron ${lostPets.length} mascotas perdidas`);

            await this.cacheService.set(CACHE_KEY_ALL_LOST_PETS, lostPets);
            return lostPets;
        } catch (error) {
            console.error('[LostPetsService] Error al obtener mascotas perdidas:');
            console.error(error);
            return [];
        }
    }

    async createLostPet(dto: LostPetCDto): Promise<boolean> {
        try {
            const newLostPet = this.lostPetRepository.create({
                ...dto,
                location: {
                    type: 'Point',
                    coordinates: [dto.longitude, dto.latitude],
                },
            });

            const savedLostPet = await this.lostPetRepository.save(newLostPet);
            console.log(`[LostPetsService] Mascota perdida guardada con ID: ${savedLostPet.id}`);

            // ⭐ Esto faltaba
            await this.cacheService.delete(CACHE_KEY_ALL_LOST_PETS);

            return true;
        } catch (error) {
            console.error('[LostPetsService] Error al crear mascota perdida:');
            console.error(error);
            return false;
        }
    }
}