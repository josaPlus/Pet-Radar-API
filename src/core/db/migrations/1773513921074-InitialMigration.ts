import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1773513921074 implements MigrationInterface {
    name = 'InitialMigration1773513921074'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "found_pets" ("id" SERIAL NOT NULL, "species" character varying NOT NULL, "breed" character varying, "color" character varying NOT NULL, "size" character varying NOT NULL, "description" text NOT NULL, "photo_url" character varying, "finder_name" character varying NOT NULL, "finder_email" character varying NOT NULL, "finder_phone" character varying NOT NULL, "location" geometry(Point,4326) NOT NULL, "address" character varying NOT NULL, "found_date" TIMESTAMP NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_1e8aeb0b37dd97bfce972552b8d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "lost_pets" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "species" character varying NOT NULL, "breed" character varying NOT NULL, "color" character varying NOT NULL, "size" character varying NOT NULL, "description" text NOT NULL, "photo_url" character varying, "owner_name" character varying NOT NULL, "owner_email" character varying NOT NULL, "owner_phone" character varying NOT NULL, "location" geometry(Point,4326) NOT NULL, "address" character varying NOT NULL, "lost_date" TIMESTAMP NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_4ba852a354b48000bcb3faaaea5" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "lost_pets"`);
        await queryRunner.query(`DROP TABLE "found_pets"`);
    }

}
