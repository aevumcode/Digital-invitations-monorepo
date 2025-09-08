"server only";

import { prisma } from "../../../packages/db/src/index";

export async function getProjectForUser(userId: string) {
  if (!userId) return null;

  return prisma.invitationProject.findUnique({
    where: { userId },
    include: { guests: true },
  });
}
