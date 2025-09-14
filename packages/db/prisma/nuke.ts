import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("⚠️ Nuking database…");

  await prisma.guest.deleteMany();
  await prisma.reservation.deleteMany();
  await prisma.userTemplate.deleteMany();
  await prisma.template.deleteMany();
  await prisma.user.deleteMany();

  console.log("💣 All data deleted successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
