"use server";

import { prisma } from "@digital-inv/db";

export async function incrementPublicView(publicSlug: string) {
  if (!publicSlug) return { ok: false };

  await prisma.userTemplate.update({
    where: { id: publicSlug },
    data: {
      numberOfGuestsSeen: { increment: 1 },
    },
  });

  return { ok: true };
}
