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
