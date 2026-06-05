/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 * @typedef {import('typeorm').QueryRunner} QueryRunner
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
export default class AddRatingTable1780607949150 {
    name = 'AddRatingTable1780607949150'

    /**
     * @param {QueryRunner} queryRunner
     */
    async up(queryRunner) {
        await queryRunner.query(`
            CREATE TABLE "rating" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "userId" integer NOT NULL,
                "movieId" integer NOT NULL,
                "rating" integer NOT NULL
            )
        `);
    }

    /**
     * @param {QueryRunner} queryRunner
     */
    async down(queryRunner) {
        await queryRunner.query(`
            DROP TABLE "rating"
        `);
    }
}
