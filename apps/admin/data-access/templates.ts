"server-only";

import { prisma } from "../../../packages/db/src/index";
export async function getPurchasedTemplates(userId: string) {
  if (!userId) throw new Error("userId required");

  const orders = await prisma.order.findMany({
    where: { userId, status: "PAID" },
    select: {
      template: {
        select: { id: true, name: true, slug: true, previewUrl: true, priceCents: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // flatten templates, unique by id
  const map = new Map<
    string,
    { id: string; name: string; slug: string; previewUrl: string; priceCents: number }
  >();
  for (const o of orders) map.set(o.template.id, o.template);
  return Array.from(map.values());
}
