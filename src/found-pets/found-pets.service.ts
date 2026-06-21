import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FoundPet } from 'src/core/entities/found-pet.entity';
import { LostPet } from 'src/core/entities/lost-pet.entity';
import { FoundPetCDto } from 'src/core/models/found-pet.model';
import { EmailService } from 'src/email/email.service';
import { Repository } from 'typeorm';
import { generateFoundPetEmailTemplate } from './templates/found-pet.template';
import { EmailOptions } from 'src/core/models/email-options.model';
import { CacheService } from 'src/cache/cache.service';

const CACHE_KEY_ALL_FOUND_PETS = "pet-radar:all-found-pets";

@Injectable()
export class FoundPetsService {
  constructor(
    @InjectRepository(FoundPet)
    private readonly foundPetRepository: Repository<FoundPet>,
    @InjectRepository(LostPet)
    private readonly lostPetRepository: Repository<LostPet>,
    private readonly emailService: EmailService,
    private readonly cacheService: CacheService,
  ) { }

  async findAll(): Promise<FoundPet[]> {
    try {
      console.log('[FoundPetsService] Ejecutando query de todas las mascotas encontradas...');
      const cachedFoundPets = await this.cacheService.get<FoundPet[]>(CACHE_KEY_ALL_FOUND_PETS);

      if (cachedFoundPets && cachedFoundPets.length > 0) {
        return cachedFoundPets;
      }

      const foundPets = await this.foundPetRepository.find();
      console.log(`[FoundPetsService] Se encontraron ${foundPets.length} mascotas`);

      await this.cacheService.set(CACHE_KEY_ALL_FOUND_PETS, foundPets);
      return foundPets;
    } catch (error) {
      console.error('[FoundPetsService] Error al obtener mascotas encontradas:');
      console.error(error);
      return [];
    }
  }

  async create(dto: FoundPetCDto): Promise<boolean> {
  try {
    console.log('[FoundPetsService] Iniciando creación de mascota encontrada...');

    // 1. Guardar mascota encontrada
    const newFoundPet = this.foundPetRepository.create({
      ...dto,
      location: {
        type: 'Point',
        coordinates: [dto.longitude, dto.latitude],
      },
    });

    const savedFoundPet = await this.foundPetRepository.save(newFoundPet);
    console.log(`[FoundPetsService] ✅ Mascota encontrada guardada con ID: ${savedFoundPet.id}`);

    // 2. Buscar mascotas perdidas en radio de 500 metros
    const nearbyLostPets = await this.lostPetRepository
      .createQueryBuilder('lp')
      .addSelect(
        `ST_Distance(
          lp.location::geography,
          ST_SetSRID(ST_MakePoint(:lng, :lat), 4326)::geography
        )`,
        'distance'
      )
      .where(
        `ST_DWithin(
          lp.location::geography,
          ST_SetSRID(ST_MakePoint(:lng, :lat), 4326)::geography,
          :radius
        )`,
        { lng: dto.longitude, lat: dto.latitude, radius: 500 },
      )
      .andWhere('lp.is_active = true')
      .orderBy('distance', 'ASC')
      .getMany();

    console.log(`[FoundPetsService] Se encontraron ${nearbyLostPets.length} mascotas perdidas cercanas`);

    // 3. Enviar email a cada dueño de mascota perdida cercana
    // for (const lostPet of nearbyLostPets) {
    //   try {
    //     const template = generateFoundPetEmailTemplate(dto, lostPet);
    //     const options: EmailOptions = {
    //       to: lostPet.owner_email,
    //       cc: 'josafat061@gmail.com',
    //       subject: `Posible avistamiento de ${lostPet.name}`,
    //       htmlBody: template,
    //     };
    //     await this.emailService.sendEmail(options);
    //     console.log(`[FoundPetsService] 📧 Email enviado a ${lostPet.owner_email}`);
    //   } catch (error) {
    //     console.error(`[FoundPetsService] Error enviando email a ${lostPet.owner_email}:`);
    //     console.error(error);
    //   }
    // }

    // 4. Invalidar caché
    await this.cacheService.delete(CACHE_KEY_ALL_FOUND_PETS);

    return true;

  } catch (error) {
    console.error('[FoundPetsService] ❌ ERROR al crear mascota encontrada:');
    console.error(error instanceof Error ? error.message : JSON.stringify(error));
    console.error(error);
    return false;
  }
}

  async findByRadius(
    latitude: number,
    longitude: number,
    radiusInMeters: number = 500,
  ): Promise<FoundPet[]> {
    try {
      console.log(`[FoundPetsService] Buscando mascotas en radio de ${radiusInMeters}m desde (${latitude}, ${longitude})`);

      const foundPets = await this.foundPetRepository
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
          { lng: longitude, lat: latitude, radius: radiusInMeters },
        )
        .orderBy('distance', 'ASC')
        .getMany();

      console.log(`[FoundPetsService] Se encontraron ${foundPets.length} mascotas en el radio`);
      return foundPets;
    } catch (error) {
      console.error('[FoundPetsService] Error al buscar mascotas por radio:');
      console.error(error);
      return [];
    }
  }
}