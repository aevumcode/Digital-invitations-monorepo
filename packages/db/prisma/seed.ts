import { prisma } from "../lib/prisma.js";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";

async function main() {
  console.log("🌱 Seeding database...");

  // 1. Create Template (upsert avoids duplicate slug)
  const template = await prisma.invitationTemplate.upsert({
    where: { slug: "classic-wedding" },
    update: {},
    create: {
      slug: "classic-wedding",
      name: "Classic Wedding",
      priceCents: 2999,
      schemaJson: {
        fields: [
          { key: "coupleName", type: "text" },
          { key: "date", type: "date" },
          { key: "venue", type: "text" },
        ],
        theme: { colors: ["#3F3FF3", "#FFD700"] },
      },
      previewUrl: "/images/templates/classic-wedding.png",
    },
  });

  // 2. Seed Users
  const usersData = [
    {
      email: "admin@example.com",
      password: "admin123",
      role: "ADMIN" as const,
      name: "Main Admin",
    },
    {
      email: "customer1@example.com",
      password: "password1",
      role: "CUSTOMER" as const,
      name: "Customer One",
    },
    {
      email: "customer2@example.com",
      password: "password2",
      role: "CUSTOMER" as const,
      name: "Customer Two",
    },
  ];

  for (const u of usersData) {
    const hashedPassword = await bcrypt.hash(u.password, 10);

    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: {}, // don’t overwrite password every time
      create: {
        email: u.email,
        password: hashedPassword,
        role: u.role,
        name: u.name,
        isActive: true,
        lastLogin: u.role === "ADMIN" ? new Date() : null,
      },
    });

    if (u.role === "CUSTOMER") {
      // Order (1 per customer)
      await prisma.order.upsert({
        where: { stripeId: `test_${user.id}` },
        update: {},
        create: {
          userId: user.id,
          templateId: template.id,
          status: "PAID",
          stripeId: `test_${user.id}`,
        },
      });

      // Project (1 per customer)
      const project = await prisma.invitationProject.upsert({
        where: { userId: user.id }, // userId unique in your schema
        update: {},
        create: {
          userId: user.id,
          templateId: template.id,
          title: `Wedding Project for ${u.email}`,
          configJson: {
            coupleName: "Ana & Marko",
            date: "2025-09-20",
            venue: "Villa Dalmacija",
          },
          status: "READY",
        },
      });

      // Invitees (only if none exist yet for that project)
      const existingInvitees = await prisma.invitee.count({
        where: { projectId: project.id },
      });

      if (existingInvitees === 0) {
        for (let i = 1; i <= 10; i++) {
          const token = randomBytes(6).toString("hex");
          await prisma.invitee.create({
            data: {
              projectId: project.id,
              firstName: `Guest${i}`,
              lastName: "Test",
              email: `guest${i}@example.com`,
              phone: `+38591123456${i}`,
              tag: i % 2 === 0 ? "Family" : "Friend",
              token,
              invitationUrl: `/i/${token}`,
              rsvpStatus: "PENDING",
            },
          });
        }
      }
    }
  }

  console.log("✅ Database seeded successfully");
}

main()
  .catch((e) => {
    console.error("❌ Error while seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
