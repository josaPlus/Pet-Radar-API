# PetRadar

PetRadar es una **API REST desarrollada con NestJS** que permite registrar **mascotas perdidas y mascotas encontradas**.

Cuando se registra una mascota encontrada, el sistema realiza una búsqueda automática de mascotas perdidas cercanas y envía una **notificación por correo electrónico** a los dueños.

---

# Objetivo del proyecto

Desarrollar una API REST que permita:

* Registrar mascotas perdidas
* Registrar mascotas encontradas
* Buscar automáticamente coincidencias geográficas
* Notificar a los dueños cuando una mascota encontrada podría coincidir con una mascota perdida

---

# Tecnologías utilizadas

* **Node.js**
* **NestJS**
* **TypeScript**
* **PostgreSQL**
* **PostGIS**
* **Nodemailer** (para envío de correos)
* **Mapbox Static Maps API**

---

# Base de datos

La base de datos utiliza **PostgreSQL con PostGIS** para manejar datos geoespaciales.

## Tabla: lost_pets (Mascotas perdidas)

| Campo       | Tipo                 | Descripción            |
| ----------- | -------------------- | ---------------------- |
| id          | int                  | Identificador único    |
| name        | varchar              | Nombre de la mascota   |
| species     | varchar              | Especie                |
| breed       | varchar              | Raza                   |
| color       | varchar              | Color principal        |
| size        | varchar              | Tamaño                 |
| description | text                 | Señales particulares   |
| photo_url   | varchar              | URL de la foto         |
| owner_name  | varchar              | Nombre del dueño       |
| owner_email | varchar              | Email del dueño        |
| owner_phone | varchar              | Teléfono del dueño     |
| location    | geometry(Point,4326) | Coordenadas            |
| address     | varchar              | Dirección aproximada   |
| lost_date   | timestamp            | Fecha en que se perdió |
| is_active   | boolean              | Si sigue perdida       |
| created_at  | timestamp            | Fecha de creación      |
| updated_at  | timestamp            | Fecha de actualización |

---

## Tabla: found_pets (Mascotas encontradas)

| Campo        | Tipo                 | Descripción          |
| ------------ | -------------------- | -------------------- |
| id           | int                  | Identificador        |
| species      | varchar              | Especie              |
| breed        | varchar              | Raza                 |
| color        | varchar              | Color                |
| size         | varchar              | Tamaño               |
| description  | text                 | Descripción          |
| photo_url    | varchar              | Foto                 |
| finder_name  | varchar              | Persona que encontró |
| finder_email | varchar              | Email                |
| finder_phone | varchar              | Teléfono             |
| location     | geometry(Point,4326) | Coordenadas          |
| address      | varchar              | Dirección            |
| found_date   | timestamp            | Fecha encontrada     |
| created_at   | timestamp            | Fecha creación       |
| updated_at   | timestamp            | Fecha actualización  |

---

# Endpoints

## Registrar mascota perdida

```
POST /lost-pets
```

Ejemplo de body:

```json
{
  "name": "Max",
  "species": "perro",
  "breed": "labrador",
  "color": "café",
  "size": "mediano",
  "description": "Tiene un collar rojo",
  "owner_name": "Juan Pérez",
  "owner_email": "juan@example.com",
  "owner_phone": "4771234567",
  "lat": 21.15,
  "lng": -101.71,
  "address": "Parque central",
  "lost_date": "2026-03-01"
}
```

---

## Registrar mascota encontrada

```
POST /found-pets
```

Ejemplo de body:

```json
{
  "species": "perro",
  "breed": "labrador",
  "color": "café",
  "size": "mediano",
  "description": "Perro tranquilo con collar rojo",
  "finder_name": "Carlos López",
  "finder_email": "carlos@example.com",
  "finder_phone": "4779876543",
  "lat": 21.1505,
  "lng": -101.7102,
  "address": "Cerca del parque central",
  "found_date": "2026-03-08"
}
```

---

# Búsqueda por radio (500 metros)

Cuando se registra una mascota encontrada, el sistema ejecuta una búsqueda automática en la tabla **lost_pets** para encontrar mascotas perdidas activas dentro de **500 metros** utilizando **PostGIS**.

Consulta utilizada:

```sql
SELECT *,
  ST_Distance(
    location,
    ST_SetSRID(ST_MakePoint(:lng, :lat), 4326)::geography
  ) AS distance
FROM lost_pets
WHERE is_active = true
  AND ST_DWithin(
    location,
    ST_SetSRID(ST_MakePoint(:lng, :lat), 4326)::geography,
    500
  )
ORDER BY distance ASC;
```

---

# Notificación por correo

Si se encuentran coincidencias dentro del radio de búsqueda, el sistema envía un **correo electrónico** al dueño con la siguiente información:

* Datos de la mascota encontrada
* Información de contacto de quien la encontró
* Mapa estático mostrando:

  * Ubicación donde se perdió
  * Ubicación donde se encontró

El mapa se genera utilizando **Mapbox Static Maps API**.

---

# Instalación

Clonar repositorio:

```bash
git clone https://github.com/tu-usuario/petradar.git
```

Entrar al proyecto:

```bash
cd petradar
```

Instalar dependencias:

```bash
npm install
```

---

# Ejecutar el proyecto

Modo desarrollo:

```bash
npm run start:dev
```

---

# Autor

Josafat Aguirre
