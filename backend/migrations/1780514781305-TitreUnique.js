/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 * @typedef {import('typeorm').QueryRunner} QueryRunner
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
export default class TitreUnique1780514781305 {
    name = 'TitreUnique1780514781305'

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
            INSERT INTO "temporary_movie"(
                    "id",
                    "release_date",
                    "title",
                    "original_language",
                    "overview",
                    "poster_path",
                    "vote_average",
                    "vote_count"
                )
            SELECT "id",
                "release_date",
                "title",
                "original_language",
                "overview",
                "poster_path",
                "vote_average",
                "vote_count"
            FROM "movie"
        `);
        await queryRunner.query(`
            DROP TABLE "movie"
        `);
        await queryRunner.query(`
            ALTER TABLE "temporary_movie"
                RENAME TO "movie"
        `);
        await queryRunner.query(`
            CREATE TABLE "temporary_movie" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "release_date" varchar NOT NULL,
                "title" varchar NOT NULL,
                "original_language" varchar,
                "overview" varchar,
                "poster_path" varchar,
                "vote_average" float,
                "vote_count" integer,
                CONSTRAINT "UQ_0e6a6ae9cd0961d172d4eaec9ce" UNIQUE ("title")
            )
        `);
        await queryRunner.query(`
            INSERT INTO "temporary_movie"(
                    "id",
                    "release_date",
                    "title",
                    "original_language",
                    "overview",
                    "poster_path",
                    "vote_average",
                    "vote_count"
                )
            SELECT "id",
                "release_date",
                "title",
                "original_language",
                "overview",
                "poster_path",
                "vote_average",
                "vote_count"
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
                "title" varchar NOT NULL,
                "original_language" varchar,
                "overview" varchar,
                "poster_path" varchar,
                "vote_average" float,
                "vote_count" integer
            )
        `);
        await queryRunner.query(`
            INSERT INTO "movie"(
                    "id",
                    "release_date",
                    "title",
                    "original_language",
                    "overview",
                    "poster_path",
                    "vote_average",
                    "vote_count"
                )
            SELECT "id",
                "release_date",
                "title",
                "original_language",
                "overview",
                "poster_path",
                "vote_average",
                "vote_count"
            FROM "temporary_movie"
        `);
        await queryRunner.query(`
            DROP TABLE "temporary_movie"
        `);
        await queryRunner.query(`
            ALTER TABLE "movie"
                RENAME TO "temporary_movie"
        `);
        await queryRunner.query(`
            CREATE TABLE "movie" (
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
            INSERT INTO "movie"(
                    "id",
                    "release_date",
                    "title",
                    "original_language",
                    "overview",
                    "poster_path",
                    "vote_average",
                    "vote_count"
                )
            SELECT "id",
                "release_date",
                "title",
                "original_language",
                "overview",
                "poster_path",
                "vote_average",
                "vote_count"
            FROM "temporary_movie"
        `);
        await queryRunner.query(`
            DROP TABLE "temporary_movie"
        `);
    }
}
