import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Must match FE TEMPLATE_REGISTRY ids & names exactly
const TEMPLATE_FE = [
  { id: 1, name: "Cocktail Party", price: 2000, fullPrice: 3000 },
  { id: 2, name: "Wedding Classic", price: 3000, fullPrice: 4500 },
  { id: 3, name: "Wedding Floral", price: 3200, fullPrice: 4800 },
  { id: 4, name: "Wedding Elegant", price: 3500, fullPrice: 5000 },
  { id: 5, name: "Wedding Branch", price: 2900, fullPrice: 4300 },
  { id: 6, name: "Event Poster", price: 1800, fullPrice: 2600 },
  { id: 7, name: "Event Cocktail 2", price: 1900, fullPrice: 2700 },
  { id: 8, name: "Event Retro", price: 2100, fullPrice: 2900 },
  { id: 9, name: "Birthday Thirty", price: 1700, fullPrice: 2400 },
  { id: 10, name: "Birthday Cake", price: 1600, fullPrice: 2300 },
  { id: 11, name: "Birthday Arcane", price: 2200, fullPrice: 3100 },
  { id: 12, name: "Birthday FIFA", price: 2000, fullPrice: 2800 },
  { id: 13, name: "Birthday Fortnite", price: 2000, fullPrice: 2800 },
] as const;

// choose which template the user "bought" on the storefront
const DEFAULT_TEMPLATE_ID = 2; // Wedding Classic

async function main() {
  console.log("🌱 Seeding (single user, single empty purchase)…");

  // --- Templates (IDs fixed to match FE) ---
  await prisma.$transaction(async (tx) => {
    for (const t of TEMPLATE_FE) {
      await tx.template.upsert({
        where: { id: t.id },
        update: {
          name: t.name,
          price: t.price,
          fullPrice: t.fullPrice,
        },
        create: {
          id: t.id, // keep parity with FE registry
          name: t.name,
          price: t.price,
          fullPrice: t.fullPrice,
        },
      });
    }
  });

  // --- Single customer user ---
  const customer = await prisma.user.upsert({
    where: { email: "customer@example.com" },
    update: {},
    create: {
      email: "customer@example.com",
      password: await bcrypt.hash("password", 10),
      role: UserRole.CUSTOMER,
      name: "Customer One",
      phone: "+1234567890",
    },
  });

  // Resolve template to "buy"
  const tpl = TEMPLATE_FE.find((x) => x.id === DEFAULT_TEMPLATE_ID);
  if (!tpl) throw new Error(`Template id ${DEFAULT_TEMPLATE_ID} not found in TEMPLATE_FE`);

  // --- One purchase with EMPTY customData ---
  const ut = await prisma.userTemplate.create({
    data: {
      userId: customer.id,
      templateId: tpl.id,
      price: tpl.price, // price at purchase time
      quantity: 1,
      customData: {}, // <-- empty so FE form starts blank
    },
  });

  console.log("✅ Seed done.", {
    customer: customer.email,
    purchasedTemplateId: ut.templateId,
    userTemplateId: ut.id,
  });
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
