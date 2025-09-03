// prisma/nuke.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("⚠️ Nuking database…");

  // Delete in dependency order (children -> parents)
  await prisma.invitationEvent.deleteMany();
  await prisma.invitationBatch.deleteMany();
  await prisma.invitee.deleteMany();
  await prisma.invitationProject.deleteMany();
  await prisma.order.deleteMany();
  await prisma.invitationTemplate.deleteMany();
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
