import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FoundPet } from 'src/core/entities/found-pet.entity';
import { LostPet } from 'src/core/entities/lost-pet.entity';
import { FoundPetCDto } from 'src/core/models/found-pet.model';
import { EmailService } from 'src/email/email.service';
import { Repository } from 'typeorm';
import { generateFoundPetEmailTemplate } from './templates/found-pet.template';
import { EmailOptions } from 'src/core/models/email-options.model';

@Injectable()
export class FoundPetsService {
    constructor(
    @InjectRepository(FoundPet)
    private readonly foundPetRepository: Repository<FoundPet>,
    @InjectRepository(LostPet)
    private readonly lostPetRepository: Repository<LostPet>,
    private readonly emailService: EmailService,
  ) {}

  async create(dto: FoundPetCDto): Promise<boolean> {
    // 1. Guardar mascota encontrada
    const newFoundPet = this.foundPetRepository.create({
      ...dto,
      location: {
        type: 'Point',
        coordinates: [dto.longitude, dto.latitude],
      },
    });
    const savedFoundPet = await this.foundPetRepository.save(newFoundPet);

    // 2. Buscar mascotas perdidas en radio de 500 metros
    const nearbyLostPets = await this.lostPetRepository
      .createQueryBuilder('lp')
      .where(
        `ST_DWithin(
          lp.location::geography,
          ST_SetSRID(ST_MakePoint(:lng, :lat), 4326)::geography,
          :radius
        )`,
        {
          lng: dto.longitude,
          lat: dto.latitude,
          radius: 500,
        },
      )
      .andWhere('lp.is_active = true')
      .getMany();

    // 3. Enviar email a cada dueño de mascota perdida cercana
    for (const lostPet of nearbyLostPets) {
      const template = generateFoundPetEmailTemplate(dto, lostPet);

      const options: EmailOptions = {
        to: lostPet.owner_email,
        subject: `Posible avistamiento de ${lostPet.name}`,
        htmlBody: template,
      };

      await this.emailService.sendEmail(options);
    }

    return true;
  }
}
