import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminRole = await prisma.role.upsert({
    where: { name: "ADMIN" },
    update: {},
    create: { name: "ADMIN", permissions: { "*": ["*"] } },
  });

  const staffRole = await prisma.role.upsert({
    where: { name: "WAREHOUSE_STAFF" },
    update: {},
    create: {
      name: "WAREHOUSE_STAFF",
      permissions: {
        product: ["read", "write"],
        inbound: ["read", "write"],
        outbound: ["read", "write"],
        inventory: ["read"],
        report: ["read"],
      },
    },
  });

  await prisma.role.upsert({
    where: { name: "ACCOUNTANT" },
    update: {},
    create: {
      name: "ACCOUNTANT",
      permissions: { report: ["read", "export"] },
    },
  });

  await prisma.user.upsert({
    where: { email: "admin@wms.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@wms.com",
      password: await bcrypt.hash("Admin@123", 12),
      roleId: adminRole.id,
    },
  });

  await prisma.user.upsert({
    where: { email: "staff@wms.com" },
    update: {},
    create: {
      name: "Nhân viên kho",
      email: "staff@wms.com",
      password: await bcrypt.hash("Staff@123", 12),
      roleId: staffRole.id,
    },
  });

  for (const name of [
    "Điện tử",
    "Điện lạnh",
    "Gia dụng",
    "Văn phòng phẩm",
    "Khác",
  ]) {
    await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  console.log("✅ Seed completed");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
