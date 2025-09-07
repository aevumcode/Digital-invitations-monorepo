import { prisma } from "../src/index";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";

async function main() {
  console.log("🌱 Seeding database...");

  // 1. Categories
  const categoriesData = [
    { slug: "wedding", name: "Wedding Invitations", description: "Elegant wedding invites" },
    { slug: "birthday", name: "Birthday Invitations", description: "Fun birthday party invites" },
    { slug: "bachelor", name: "Bachelor Party Invitations", description: "Party hard invites" },
  ];

  const categories: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    createdAt: Date;
    updatedAt: Date;
  }[] = [];
  for (const c of categoriesData) {
    const category = await prisma.category.upsert({
      where: { slug: c.slug },
      update: { name: c.name, description: c.description },
      create: c,
    });
    categories.push(category);
  }

  // 2. Templates for each category
  const templatesData = [
    {
      slug: "classic-wedding",
      name: "Classic Wedding",
      priceCents: 2999,
      previewUrl: "/templates/weddings/wedding-inv-1.png",
      category: "wedding",
    },
    {
      slug: "modern-wedding",
      name: "Modern Wedding",
      priceCents: 3499,
      previewUrl: "/templates/weddings/wedding-inv-2.png",
      category: "wedding",
    },
    {
      slug: "fun-birthday",
      name: "Fun Birthday",
      priceCents: 1999,
      previewUrl: "/templates/birthdays/birthday-inv-1.png",
      category: "birthday",
    },
    {
      slug: "kids-birthday",
      name: "Kids Birthday",
      priceCents: 1799,
      previewUrl: "/templates/birthdays/birthday-inv-2.png",
      category: "birthday",
    },
    {
      slug: "bachelor-night",
      name: "Bachelor Night",
      priceCents: 2599,
      previewUrl: "/templates/bachelors/bachelor-inv-1.png",
      category: "bachelor",
    },
  ];

  const templates: {
    id: string;
    name: string;
    slug: string;
    priceCents: number;
    schemaJson: any;
    previewUrl: string;
    categoryId: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  }[] = [];
  for (const t of templatesData) {
    const template = await prisma.invitationTemplate.upsert({
      where: { slug: t.slug },
      update: {},
      create: {
        slug: t.slug,
        name: t.name,
        priceCents: t.priceCents,
        schemaJson: {
          fields: [
            { key: "title", type: "text" },
            { key: "date", type: "date" },
            { key: "venue", type: "text" },
          ],
          theme: { colors: ["#3F3FF3", "#FFD700"] },
        },
        previewUrl: t.previewUrl,
        categoryId: categories.find((c) => c.slug === t.category)?.id,
      },
    });
    templates.push(template);
  }

  // 3. Users
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
      update: {},
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
      // pick a random template
      const template = templates[Math.floor(Math.random() * templates.length)];

      // Order
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

      // Project
      const project = await prisma.invitationProject.upsert({
        where: { userId: user.id }, // userId is unique in schema
        update: {},
        create: {
          userId: user.id,
          templateId: template.id,
          title: `${template.name} Project for ${u.email}`,
          configJson: {
            title: "Sample Invitation",
            date: "2025-09-20",
            venue: "Villa Dalmacija",
          },
          status: "READY",
        },
      });

      // Invitees
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
