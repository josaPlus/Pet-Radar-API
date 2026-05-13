import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CacheService } from 'src/cache/cache.service';
import { FoundPet } from 'src/core/entities/found-pet.entity';
import { LostPet } from 'src/core/entities/lost-pet.entity';
import { LostPetCDto } from 'src/core/models/lost-pet.model';
import { Repository } from 'typeorm';

const CACHE_KEY_ALL_LOST_PETS = "pet-radar:all-lost-pets";

@Injectable()
export class LostPetsService {
    constructor(
        @InjectRepository(LostPet)
        private readonly lostPetRepository: Repository<LostPet>,
        @InjectRepository(FoundPet)
        private readonly foundPetRepository: Repository<FoundPet>,
        private readonly cacheService: CacheService,
    ) { }

    async findAllLostPets(): Promise<LostPet[]> {
        try {
            console.log('[LostPetsService] Ejecutando query de todas las mascotas perdidas...');
            const cachedLostPets = await this.cacheService.get<LostPet[]>(CACHE_KEY_ALL_LOST_PETS);
            
            if (cachedLostPets && cachedLostPets.length > 0) {
                console.log('[LostPetsService] Retornando mascotas perdidas desde caché');
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
            // Guardar mascota perdida
            const newLostPet = this.lostPetRepository.create({
                ...dto,
                location: {
                    type: 'Point',
                    coordinates: [dto.longitude, dto.latitude],
                },
            });

            const savedLostPet = await this.lostPetRepository.save(newLostPet);
            console.log(`[LostPetsService] Mascota perdida guardada con ID: ${savedLostPet.id}`);

            // Buscar mascotas ENCONTRADAS en radio de 500 metros
            const nearbyFoundPets = await this.foundPetRepository
                .createQueryBuilder('fp')
                .addSelect(
                    `ST_Distance(
                        fp.location::geography,
                        ST_SetSRID(ST_MakePoint(:lng, :lat), 4326)::geography
                    )`,
                    'distance'
                )
                .where(
                    `ST_DWithin(
                        fp.location::geography,
                        ST_SetSRID(ST_MakePoint(:lng, :lat), 4326)::geography,
                        :radius
                    )`,
                    { lng: dto.longitude, lat: dto.latitude, radius: 500 },
                )
                .orderBy('distance', 'ASC')
                .getMany();

            console.log(`[LostPetsService] Se encontraron ${nearbyFoundPets.length} mascotas encontradas cercanas`);
            
            // notificar al dueño de la mascota perdida sobre las posibles coincidencias
            if (nearbyFoundPets.length > 0) {
                console.log(`[LostPetsService] Hay ${nearbyFoundPets.length} posibles coincidencias para la mascota perdida`);
                // Opcionalmente: await this.notificationService.notifyFoundPets(savedLostPet, nearbyFoundPets);
            }

            // Invalidar caché
            await this.cacheService.delete(CACHE_KEY_ALL_LOST_PETS);
            console.log('[LostPetsService] Caché invalidado');

            return true;
        } catch (error) {
            console.error('[LostPetsService] Error al crear mascota perdida:');
            console.error(error);
            return false;
        }
    }
}