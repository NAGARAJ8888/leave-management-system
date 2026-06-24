import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("password123", 10);

  await prisma.user.createMany({
    data: [
      {
        name: "Admin User",
        email: "admin@test.com",
        password,
        role: "ADMIN",
      },
      {
        name: "Employee User",
        email: "employee@test.com",
        password,
        role: "EMPLOYEE",
      },
    ],
  });

  console.log("Seed completed");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });