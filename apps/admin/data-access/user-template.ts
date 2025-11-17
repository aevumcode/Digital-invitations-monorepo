"server only";

import { prisma } from "../../../packages/db/src/index";

export async function getUserTemplateById(id: string) {
  if (!id) return null;

  const ut = await prisma.userTemplate.findUnique({
    where: { id: id },
    select: { id: true, userId: true, templateId: true, customData: true, isActive: true },
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

export async function checkUsage(userTemplateId: string) {
  const ut = await prisma.userTemplate.findUnique({
    where: { id: userTemplateId },
    select: {
      quantity: true,
      numberOfGuestsSeen: true,
    },
  });

  if (!ut) return null;

  const limit = ut.quantity * 1.3;
  const isExceeded = ut.numberOfGuestsSeen > limit;

  return {
    isExceeded,
    current: ut.numberOfGuestsSeen,
    limit,
  };
}

export async function trackAndCheckUsage(userTemplateId: string) {
  const updated = await prisma.userTemplate.update({
    where: { id: userTemplateId },
    data: {
      numberOfGuestsSeen: { increment: 1 },
    },
    select: {
      id: true,
      quantity: true,
      numberOfGuestsSeen: true,
    },
  });

  const limit = updated.quantity * 1.5;
  const isExceeded = updated.numberOfGuestsSeen > limit;

  return {
    isExceeded,
    current: updated.numberOfGuestsSeen,
    limit,
  };
}
