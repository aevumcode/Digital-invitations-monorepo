"server-only";

import { prisma } from "../../../packages/db/src/index";
import type { TemplateLiteDB, PurchaseLiteDB } from "@/types/_template";
import { routes } from "@/routes";
import { redirect } from "next/dist/client/components/navigation";

type PurchasedTemplate = Pick<TemplateLiteDB, "id" | "name" | "price" | "fullPrice">;

export async function getUserAndPurchasedTemplates(userId: string | number): Promise<{
  user: {
    id: number;
    name: string | null;
    email: string;
    role: "ADMIN" | "CUSTOMER";
    createdAt: Date;
  };
  templates: PurchasedTemplate[];
  purchases: PurchaseLiteDB[];
}> {
  const uid = typeof userId === "string" ? Number(userId) : userId;
  if (!uid || Number.isNaN(uid)) throw new Error("valid userId required");

  const [user, userTemplates] = await Promise.all([
    prisma.user.findUnique({
      where: { id: uid },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    }),
    prisma.userTemplate.findMany({
      where: { userId: uid },
      select: {
        id: true,
        price: true,
        quantity: true,
        customData: true, // Prisma.JsonValue
        template: {
          select: {
            id: true,
            name: true,
            price: true,
            fullPrice: true,
          },
        },
      },
      orderBy: { id: "desc" },
    }),
  ]);

  if (!user) redirect(routes.LOGIN);

  // Distinct templates
  const tmap = new Map<number, PurchasedTemplate>();
  for (const ut of userTemplates) {
    if (ut.template) {
      tmap.set(ut.template.id, {
        id: ut.template.id,
        name: ut.template.name,
        price: ut.template.price,
        fullPrice: ut.template.fullPrice,
      });
    }
  }
  const templates = Array.from(tmap.values());

  const purchases: PurchaseLiteDB[] = userTemplates.map((ut) => ({
    id: String(ut.id),
    templateId: ut.template?.id ?? 0,
    customData: ut.customData == null ? null : structuredClone(ut.customData),
    // publicSlug/previewSlug možeš dodati kad ih dodaš u shemu
  }));

  return { user, templates, purchases };
}

export async function getDefaultUserTemplateForUser(userId: number) {
  // pick the newest template for the logged-in user
  return prisma.userTemplate.findFirst({
    where: { userId },
    orderBy: { id: "desc" },
    select: { id: true, templateId: true, price: true, quantity: true },
  });
}
