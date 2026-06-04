/*
  Warnings:

  - Added the required column `gameUid` to the `TournamentEntry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ign` to the `TournamentEntry` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TournamentEntry" ADD COLUMN     "gameUid" TEXT NOT NULL,
ADD COLUMN     "ign" TEXT NOT NULL;
