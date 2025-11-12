import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("⚠️ Nuking database…");

  await prisma.$executeRawUnsafe(`
    TRUNCATE TABLE
      "Guest",
      "Reservation",
      "UserTemplate",
      "Template",
      "User"
    RESTART IDENTITY CASCADE
  `);

  console.log("💣 All data deleted successfully");
}

main()
  .catch((e) => {
    console.error("Nuke failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
