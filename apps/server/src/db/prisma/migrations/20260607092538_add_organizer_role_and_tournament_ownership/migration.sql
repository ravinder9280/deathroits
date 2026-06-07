-- AlterEnum
ALTER TYPE "UserRole" ADD VALUE 'ORGANIZER';

-- AlterTable
ALTER TABLE "Tournament" ADD COLUMN     "organizerId" TEXT;

-- CreateIndex
CREATE INDEX "Tournament_organizerId_idx" ON "Tournament"("organizerId");

-- AddForeignKey
ALTER TABLE "Tournament" ADD CONSTRAINT "Tournament_organizerId_fkey" FOREIGN KEY ("organizerId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
