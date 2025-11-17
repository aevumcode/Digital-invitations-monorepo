"use server";

import { routes } from "@/routes";
import { prisma } from "@digital-inv/db";
import type { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

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

  await prisma.userTemplate.update({
    where: { id: userTemplateId },
    data: { isActive: true },
  });

  if (!ut || ut.userId !== userId) throw new Error("Not allowed");

  // MVP: javni ključ == cuid
  const publicKey = userTemplateId;

  revalidatePath(routes.LANDING);

  // Preview page
  revalidatePath(`/preview/${userTemplateId}`);

  // Public page
  revalidatePath(`/public/${publicKey}`);

  return { publicKey };
}

export async function unpublishUserTemplateAction(userTemplateId: string, userId: number) {
  const ut = await prisma.userTemplate.findUnique({
    where: { id: userTemplateId },
  });

  if (!ut || ut.userId !== userId) throw new Error("Unauthorized");

  // remove publicSlug + deactivate
  await prisma.userTemplate.update({
    where: { id: userTemplateId },
    data: { isActive: false },
  });

  revalidatePath(routes.LANDING);

  return { ok: true };
}

export async function buildWhatsAppLink(message: string, url: string) {
  const text = [message?.trim(), url?.trim()].filter(Boolean).join(" ");
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}
