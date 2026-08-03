import { PrismaClient } from "@prisma/client";
import { randomBytes, scryptSync } from "crypto";

const prisma = new PrismaClient();

function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");

  return `scrypt:${salt}:${hash}`;
}

async function main() {
  if (
    process.env.NODE_ENV === "production" &&
    process.env.ALLOW_PRODUCTION_SEED !== "true"
  ) {
    throw new Error(
      "Refusing to seed production. Set ALLOW_PRODUCTION_SEED=true only for an intentional controlled seed.",
    );
  }

  const demoPasswordHash = hashPassword("Password123!");

  const organization = await prisma.organization.upsert({
    where: { slug: "fslabs-demo" },
    update: {
      name: "FSLabs Demo Organization",
      status: "ACTIVE",
    },
    create: {
      name: "FSLabs Demo Organization",
      slug: "fslabs-demo",
      status: "ACTIVE",
    },
  });

  const platformAdmin = await prisma.user.upsert({
    where: { email: "platform.admin@fslabs.tech" },
    update: {
      name: "Platform Admin",
      isPlatformAdmin: true,
      passwordHash: demoPasswordHash,
      emailVerified: new Date(),
    },
    create: {
      email: "platform.admin@fslabs.tech",
      name: "Platform Admin",
      isPlatformAdmin: true,
      passwordHash: demoPasswordHash,
      emailVerified: new Date(),
    },
  });

  const companyAdmin = await prisma.user.upsert({
    where: { email: "company.admin@fslabs-demo.test" },
    update: {
      name: "Company Admin",
      passwordHash: demoPasswordHash,
      emailVerified: new Date(),
    },
    create: {
      email: "company.admin@fslabs-demo.test",
      name: "Company Admin",
      passwordHash: demoPasswordHash,
      emailVerified: new Date(),
    },
  });

  const companyAdminMember = await prisma.organizationMember.upsert({
    where: {
      organizationId_userId: {
        organizationId: organization.id,
        userId: companyAdmin.id,
      },
    },
    update: {
      role: "ADMIN",
      title: "Company Administrator",
      joinedAt: new Date(),
    },
    create: {
      organizationId: organization.id,
      userId: companyAdmin.id,
      role: "ADMIN",
      title: "Company Administrator",
      joinedAt: new Date(),
    },
  });

  const department = await prisma.department.upsert({
    where: {
      organizationId_code: {
        organizationId: organization.id,
        code: "OPS",
      },
    },
    update: {
      name: "Operations",
      description: "Demo department for tenant-scoped HR workflows.",
    },
    create: {
      organizationId: organization.id,
      name: "Operations",
      code: "OPS",
      description: "Demo department for tenant-scoped HR workflows.",
    },
  });

  const employee = await prisma.employee.upsert({
    where: {
      organizationId_employeeNumber: {
        organizationId: organization.id,
        employeeNumber: "FSL-0001",
      },
    },
    update: {
      departmentId: department.id,
      organizationMemberId: companyAdminMember.id,
      firstName: "Ada",
      lastName: "Okafor",
      workEmail: "ada.okafor@fslabs-demo.test",
      jobTitle: "HR Operations Lead",
      employmentType: "FULL_TIME",
      status: "ACTIVE",
    },
    create: {
      organizationId: organization.id,
      departmentId: department.id,
      organizationMemberId: companyAdminMember.id,
      employeeNumber: "FSL-0001",
      firstName: "Ada",
      lastName: "Okafor",
      workEmail: "ada.okafor@fslabs-demo.test",
      jobTitle: "HR Operations Lead",
      employmentType: "FULL_TIME",
      status: "ACTIVE",
      hireDate: new Date("2026-01-15T00:00:00.000Z"),
    },
  });

  const inviteReadyEmployee = await prisma.employee.upsert({
    where: {
      organizationId_employeeNumber: {
        organizationId: organization.id,
        employeeNumber: "FSL-0002",
      },
    },
    update: {
      departmentId: department.id,
      firstName: "Samuel",
      lastName: "Bello",
      workEmail: "samuel.bello@fslabs-demo.test",
      jobTitle: "Operations Associate",
      employmentType: "FULL_TIME",
      status: "ACTIVE",
    },
    create: {
      organizationId: organization.id,
      departmentId: department.id,
      employeeNumber: "FSL-0002",
      firstName: "Samuel",
      lastName: "Bello",
      workEmail: "samuel.bello@fslabs-demo.test",
      jobTitle: "Operations Associate",
      employmentType: "FULL_TIME",
      status: "ACTIVE",
      hireDate: new Date("2026-02-01T00:00:00.000Z"),
    },
  });

  await prisma.auditLog.create({
    data: {
      organizationId: organization.id,
      actorUserId: platformAdmin.id,
      action: "seed.completed",
      entityType: "Organization",
      entityId: organization.id,
      metadata: {
        departmentId: department.id,
        employeeId: employee.id,
        inviteReadyEmployeeId: inviteReadyEmployee.id,
        companyAdminUserId: companyAdmin.id,
      },
    },
  });

  console.log("Seed completed:", {
    organization: organization.slug,
    platformAdmin: platformAdmin.email,
    companyAdmin: companyAdmin.email,
    department: department.code,
    employee: employee.employeeNumber,
    inviteReadyEmployee: inviteReadyEmployee.employeeNumber,
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
