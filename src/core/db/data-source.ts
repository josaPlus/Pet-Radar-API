import { envs } from "src/config/envs";
import { DataSource, DataSourceOptions } from "typeorm";
import { FoundPet } from "../entities/found-pet.entity";
import { LostPet } from "../entities/lost-pet.entity";


export const dataSourceOptions : DataSourceOptions = {
    host: envs.DB_HOST,
    database: envs.DB_NAME,
    username: envs.DB_USER,
    password: envs.DB_PASSWORD,
    port: envs.DB_PORT,
    type: 'postgres',
    entities: [FoundPet, LostPet],
    synchronize: false,
    migrations: ["dist/core/db/migrations/*"]
}

export const dataSource = new DataSource(dataSourceOptions)