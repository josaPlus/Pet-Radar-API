import 'dotenv/config';
import * as env from 'env-var';

export const envs = {
    PORT: env.get('PORT').required().asPortNumber(),
    MAILER_EMAIL: env.get('MAILER_EMAIL').required().asString(),
    MAILER_PASWORD: env.get('MAILER_PASWORD').required().asString(),
    MAILER_SERVICE: env.get('MAILER_SERVICE').required().asString(),
    MAPBOX_TOKEN: env.get('MAPBOX_TOKEN').required().asString(),
    DB_HOST: env.get('DB_HOST').required().asString(),
    DB_NAME: env.get('DB_NAME').required().asString(),
    DB_PORT: env.get('DB_PORT').required().asPortNumber(),
    DB_PASSWORD: env.get('DB_PASSWORD').required().asString(),
    DB_USER: env.get('DB_USER').required().asString(),
}