-- CreateTable
CREATE TABLE "EmployeeInvite" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "invitedByMemberId" TEXT,
    "email" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "acceptedAt" TIMESTAMP(3),
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmployeeInvite_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EmployeeInvite_tokenHash_key" ON "EmployeeInvite"("tokenHash");

-- CreateIndex
CREATE INDEX "EmployeeInvite_organizationId_idx" ON "EmployeeInvite"("organizationId");

-- CreateIndex
CREATE INDEX "EmployeeInvite_organizationId_employeeId_idx" ON "EmployeeInvite"("organizationId", "employeeId");

-- CreateIndex
CREATE INDEX "EmployeeInvite_organizationId_email_idx" ON "EmployeeInvite"("organizationId", "email");

-- CreateIndex
CREATE INDEX "EmployeeInvite_expiresAt_idx" ON "EmployeeInvite"("expiresAt");

-- CreateIndex
CREATE INDEX "EmployeeInvite_acceptedAt_idx" ON "EmployeeInvite"("acceptedAt");

-- AddForeignKey
ALTER TABLE "EmployeeInvite" ADD CONSTRAINT "EmployeeInvite_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeInvite" ADD CONSTRAINT "EmployeeInvite_employeeId_organizationId_fkey" FOREIGN KEY ("employeeId", "organizationId") REFERENCES "Employee"("id", "organizationId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeInvite" ADD CONSTRAINT "EmployeeInvite_invitedByMemberId_organizationId_fkey" FOREIGN KEY ("invitedByMemberId", "organizationId") REFERENCES "OrganizationMember"("id", "organizationId") ON DELETE NO ACTION ON UPDATE CASCADE;
