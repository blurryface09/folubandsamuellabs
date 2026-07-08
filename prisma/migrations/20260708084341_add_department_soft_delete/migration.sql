-- AlterTable
ALTER TABLE "Department" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- CreateIndex
CREATE INDEX "Department_organizationId_isActive_idx" ON "Department"("organizationId", "isActive");
