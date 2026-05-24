-- AlterTable
ALTER TABLE "user" ADD COLUMN     "gameId" TEXT,
ADD COLUMN     "onboarded" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "user_gameId_key" ON "user"("gameId");
