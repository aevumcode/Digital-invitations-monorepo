"server only";

import { User } from "@digital-inv/types";
import { prisma } from "../../../packages/db/src/index";

export async function getProjectForUser(userId: string) {
  if (!userId) return null;

  return prisma.invitationProject.findUnique({
    where: { userId },
    include: { guests: true },
  });
}

export async function getUserInfo(userId: string): Promise<User | null> {
  if (!userId) return null;

  return prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, name: true },
  });
}
