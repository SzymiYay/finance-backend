import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTransactions1757086624389 implements MigrationInterface {
    name = 'CreateTransactions1757086624389'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."transactions_type_enum" AS ENUM('BUY', 'SELL')`);
        await queryRunner.query(`CREATE TABLE "transactions" ("id" SERIAL NOT NULL, "xtb_id" integer NOT NULL, "symbol" character varying NOT NULL, "type" "public"."transactions_type_enum" NOT NULL, "volume" double precision NOT NULL, "open_time" TIMESTAMP NOT NULL, "open_price" double precision NOT NULL, "market_price" double precision NOT NULL, "purchase_value" double precision NOT NULL, "commission" double precision, "swap" double precision, "rollover" double precision, "gross_pl" double precision, "comment" text, "created_at" TIMESTAMP DEFAULT now(), CONSTRAINT "PK_a219afd8dd77ed80f5a862f1db9" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "transactions"`);
        await queryRunner.query(`DROP TYPE "public"."transactions_type_enum"`);
    }

}
