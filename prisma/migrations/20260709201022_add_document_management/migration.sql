/*
  Warnings:

  - The `category` column on the `Document` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('CV', 'CONTRACT', 'OFFER_LETTER', 'ID_CARD', 'CERTIFICATE', 'PAYSLIP', 'OTHER');

-- AlterTable
ALTER TABLE "Document" DROP COLUMN "category",
ADD COLUMN     "category" "DocumentType" NOT NULL DEFAULT 'OTHER';

-- CreateIndex
CREATE INDEX "Document_organizationId_category_idx" ON "Document"("organizationId", "category");
