/*
  Warnings:

  - The values [FULL] on the enum `TournamentStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "TournamentStatus_new" AS ENUM ('DRAFT', 'REGISTRATION_OPEN', 'REGISTRATION_CLOSED', 'ONGOING', 'COMPLETED', 'CANCELLED');
ALTER TABLE "public"."Tournament" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Tournament" ALTER COLUMN "status" TYPE "TournamentStatus_new" USING ("status"::text::"TournamentStatus_new");
ALTER TYPE "TournamentStatus" RENAME TO "TournamentStatus_old";
ALTER TYPE "TournamentStatus_new" RENAME TO "TournamentStatus";
DROP TYPE "public"."TournamentStatus_old";
ALTER TABLE "Tournament" ALTER COLUMN "status" SET DEFAULT 'DRAFT';
COMMIT;
