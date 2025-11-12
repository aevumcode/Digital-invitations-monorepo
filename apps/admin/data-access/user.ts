"server only";

import { prisma } from "../../../packages/db/src/index";

export async function getUserInfo(userId: number) {
  if (!userId) return null;

  const user = prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, name: true },
  });

  if (!user) return null;

  return user;
}

export async function getUserSettings(userId: number) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      name: true,
      email: true,
      phone: true,
    },
  });
}
