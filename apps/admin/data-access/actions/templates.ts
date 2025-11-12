"use server";

import { prisma } from "@digital-inv/db";
import type { Prisma } from "@prisma/client";

export async function saveUserTemplateConfigAction(args: {
  userId: number;
  userTemplateId: string;
  title?: string;
  // npr. { v:1, templateId, template:'wedding-classic', fields:{...} }
  config: Record<string, unknown>;
}) {
  const { userId, userTemplateId, title, config } = args;

  // ownership check
  const ut = await prisma.userTemplate.findUnique({
    where: { id: userTemplateId },
    select: { userId: true },
  });
  if (!ut || ut.userId !== userId) throw new Error("Not allowed");

  const payload: Prisma.InputJsonValue =
    title && typeof title === "string" ? { ...config, title } : (config as Prisma.InputJsonValue);

  await prisma.userTemplate.update({
    where: { id: userTemplateId },
    data: { customData: payload },
  });

  // (ako ćeš kasnije imati previewSlug/publicSlug, vrati ih)
  return { id: userTemplateId, previewSlug: null, publicSlug: null };
}

export async function publishUserTemplateAction(userTemplateId: string, userId: number) {
  const ut = await prisma.userTemplate.findUnique({
    where: { id: userTemplateId },
    select: { userId: true },
  });
  if (!ut || ut.userId !== userId) throw new Error("Not allowed");

  // MVP: javni ključ == cuid
  const publicKey = userTemplateId;
  return { publicKey };
}

export async function buildWhatsAppLink(message: string, url: string) {
  const text = [message?.trim(), url?.trim()].filter(Boolean).join(" ");
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}
