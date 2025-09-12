import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAccountIdAndCurrencyFields1757529650699 implements MigrationInterface {
    name = 'AddAccountIdAndCurrencyFields1757529650699'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transactions" ADD "account_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD "currency" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transactions" DROP COLUMN "currency"`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP COLUMN "account_id"`);
    }

}
