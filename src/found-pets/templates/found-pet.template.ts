import { LostPet } from "src/core/entities/lost-pet.entity";
import { FoundPetCDto } from "src/core/models/found-pet.model";
import { generateMapBoxStaticImage } from "../utils/utils";

export const generateFoundPetEmailTemplate = (
  foundPet: FoundPetCDto,
  lostPet: LostPet,
): string => {
  const imageUrl = generateMapBoxStaticImage(
    foundPet.latitude,
    foundPet.longitude,
    (lostPet.location as any).coordinates[1],
    (lostPet.location as any).coordinates[0],
  );

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      
      <h2 style="color: #e67e22;">¡Hola ${lostPet.owner_name}!</h2>
      <p>
        Alguien encontró una mascota cerca de donde perdiste a 
        <strong>${lostPet.name}</strong>. ¡Puede ser ella!
      </p>

      <hr style="border: 1px solid #eee;" />

      <h3 style="color: #2c3e50;">Mapa de ubicaciones:</h3>
      <img 
        src="${imageUrl}" 
        alt="Mapa de ubicación" 
        style="width: 100%; border-radius: 8px; margin-bottom: 12px;" 
      />
      <p>📍 <b>Pin rojo:</b> Donde fue encontrada — ${foundPet.address}</p>
      <p>📍 <b>Pin azul:</b> Donde se perdió — ${lostPet.address}</p>

      <hr style="border: 1px solid #eee;" />

      <h3 style="color: #2c3e50;">Descripción de la mascota encontrada:</h3>
      <ul>
        <li><b>Especie:</b> ${foundPet.species}</li>
        <li><b>Raza:</b> ${foundPet.breed ?? 'No identificada'}</li>
        <li><b>Color:</b> ${foundPet.color}</li>
        <li><b>Tamaño:</b> ${foundPet.size}</li>
        <li><b>Descripción:</b> ${foundPet.description}</li>
        <li><b>Fecha:</b> ${new Date(foundPet.found_date).toLocaleDateString('es-MX')}</li>
      </ul>

      ${foundPet.photo_url
        ? `<img src="${foundPet.photo_url}" alt="Foto mascota" style="max-width: 100%; border-radius: 8px;" />`
        : ''
      }

      <hr style="border: 1px solid #eee;" />

      <h3 style="color: #2c3e50;">Contacto de quien la encontró:</h3>
      <ul>
        <li><b>Nombre:</b> ${foundPet.finder_name}</li>
        <li><b>Email:</b> <a href="mailto:${foundPet.finder_email}">${foundPet.finder_email}</a></li>
        <li><b>Teléfono:</b> <a href="tel:${foundPet.finder_phone}">${foundPet.finder_phone}</a></li>
      </ul>

      <hr style="border: 1px solid #eee;" />
      <p style="color: #7f8c8d; font-size: 12px;">
        Este mensaje fue enviado automáticamente por <strong>PetRadar</strong>.
        ¡Esperamos que sea tu mascota!
      </p>

    </div>
  `;
};