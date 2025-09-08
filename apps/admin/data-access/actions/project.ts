"use server";

import { prisma } from "@digital-inv/db";
import { randomUUID } from "crypto";

export async function publishProjectAction(projectId: string, userId: string) {
  if (!projectId || !userId) throw new Error("Missing");

  const publicSlug = `live_${randomUUID().slice(0, 10)}`;

  return prisma.invitationProject.update({
    where: { id: projectId, userId },
    data: {
      isPublished: true,
      publicSlug,
      status: "READY",
    },
    select: { publicSlug: true },
  });
}
