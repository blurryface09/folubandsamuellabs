-- CreateEnum
CREATE TYPE "DocumentStorageProvider" AS ENUM ('LOCAL', 'S3');

-- CreateEnum
CREATE TYPE "InviteDeliveryStatus" AS ENUM ('PENDING', 'SENT', 'FAILED');

-- AlterTable
ALTER TABLE "Document" ADD COLUMN     "bucket" TEXT,
ADD COLUMN     "storageProvider" "DocumentStorageProvider" NOT NULL DEFAULT 'LOCAL';

-- AlterTable
ALTER TABLE "EmployeeInvite" ADD COLUMN     "deliveryError" TEXT,
ADD COLUMN     "deliveryProvider" TEXT,
ADD COLUMN     "deliveryStatus" "InviteDeliveryStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "sentAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "Document_organizationId_storageProvider_idx" ON "Document"("organizationId", "storageProvider");

-- CreateIndex
CREATE INDEX "EmployeeInvite_organizationId_deliveryStatus_idx" ON "EmployeeInvite"("organizationId", "deliveryStatus");
