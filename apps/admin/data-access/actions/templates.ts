"use server";

import { prisma } from "@digital-inv/db";
import { randomUUID } from "crypto";
import { Prisma } from "@prisma/client"; // 👈 import Prisma types

type SavePayload = {
  userId: string;
  templateId: string;
  title: string;
  config: Prisma.InputJsonValue; // 👈 use InputJsonValue for "writes"
  projectId?: string; // if editing existing draft
};

export async function saveProjectAction(payload: SavePayload) {
  const { userId, templateId, title, config, projectId } = payload;

  if (!userId || !templateId || !title) {
    throw new Error("Missing required fields");
  }

  if (projectId) {
    return prisma.invitationProject.update({
      where: { id: projectId, userId },
      data: {
        title,
        configJson: config, // ✅ correct type
        status: "DRAFT",
      },
      select: { id: true, slug: true, isPublished: true, publicSlug: true },
    });
  }

  const slug = `prj_${randomUUID().slice(0, 8)}`;
  return prisma.invitationProject.upsert({
    where: { userId },
    update: {
      title,
      configJson: config,
      status: "DRAFT",
    },
    create: {
      userId,
      templateId,
      title,
      slug,
      configJson: config,
      status: "DRAFT",
    },
    select: { id: true, slug: true, isPublished: true, publicSlug: true },
  });
}

export async function buildWhatsAppLink(message: string, url: string) {
  const text = encodeURIComponent(`${message}\n\n${url}`);
  return `https://wa.me/?text=${text}`;
}

export async function publishProjectAction(projectId: string, userId: string) {
  if (!projectId || !userId) {
    throw new Error("Missing projectId or userId");
  }

  const publicSlug = `live_${randomUUID().slice(0, 10)}`;
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://your-production-domain.com");

  const project = await prisma.invitationProject.update({
    where: { id: projectId, userId },
    data: {
      isPublished: true,
      publicSlug,
      status: "READY",
    },
    select: { id: true, title: true, publicSlug: true },
  });

  return {
    ...project,
    url: `${baseUrl}/v/${project.publicSlug}`,
  };
}
