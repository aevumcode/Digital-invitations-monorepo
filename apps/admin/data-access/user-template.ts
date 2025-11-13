"server only";

import { prisma } from "../../../packages/db/src/index";

export async function getUserTemplateById(id: string) {
  if (!id) return null;

  const ut = await prisma.userTemplate.findUnique({
    where: { id: id },
    select: { id: true, userId: true, templateId: true, customData: true },
  });

  if (!ut) return null;

  return ut;
}

export async function getRsvpUsage(userTemplateId: string) {
  const template = await prisma.userTemplate.findUnique({
    where: { id: userTemplateId },
    select: {
      quantity: true,
      reservations: {
        select: { id: true },
      },
    },
  });

  if (!template) return null;

  return {
    quantity: template.quantity,
    used: template.reservations.length,
  };
}
