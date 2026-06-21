import { DataSource, DataSourceOptions } from "typeorm";
import { FoundPet } from "../entities/found-pet.entity";
import { LostPet } from "../entities/lost-pet.entity";
import { envs } from "src/config/envs";

const databaseUrl = new URL(envs.DATABASE_URL);

export const dataSourceOptions : DataSourceOptions = {
    type: 'postgres',
    host: databaseUrl.hostname,
    port: parseInt(databaseUrl.port || '5432'),
    username: databaseUrl.username,
    password: databaseUrl.password,
    database: databaseUrl.pathname.slice(1),
    entities: [FoundPet, LostPet],
    synchronize: false,
    migrations: ["dist/core/db/migrations/*"],
    ssl: true
}

export const dataSource = new DataSource(dataSourceOptions)