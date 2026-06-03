/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 * @typedef {import('typeorm').QueryRunner} QueryRunner
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
export default class NouveauMovie1780478976926 {
    name = 'NouveauMovie1780478976926'

    /**
     * @param {QueryRunner} queryRunner
     */
    async up(queryRunner) {
        await queryRunner.query(`
            CREATE TABLE "temporary_movie" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "release_date" varchar NOT NULL,
                "title" varchar NOT NULL,
                "original_language" varchar,
                "overview" varchar,
                "poster_path" varchar,
                "vote_average" float,
                "vote_count" integer
            )
        `);
        await queryRunner.query(`
            INSERT INTO "temporary_movie"("id", "release_date", "title")
            SELECT "id",
                "release_date",
                "title"
            FROM "movie"
        `);
        await queryRunner.query(`
            DROP TABLE "movie"
        `);
        await queryRunner.query(`
            ALTER TABLE "temporary_movie"
                RENAME TO "movie"
        `);
    }

    /**
     * @param {QueryRunner} queryRunner
     */
    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE "movie"
                RENAME TO "temporary_movie"
        `);
        await queryRunner.query(`
            CREATE TABLE "movie" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "release_date" varchar NOT NULL,
                "title" varchar NOT NULL
            )
        `);
        await queryRunner.query(`
            INSERT INTO "movie"("id", "release_date", "title")
            SELECT "id",
                "release_date",
                "title"
            FROM "temporary_movie"
        `);
        await queryRunner.query(`
            DROP TABLE "temporary_movie"
        `);
    }
}
