"use server";

import "server-only";
import { prisma } from "@digital-inv/db";
import { z } from "zod";

const CreateReservationSchema = z.object({
  userTemplateId: z.string().cuid(),
  date: z.preprocess((v) => (typeof v === "string" ? new Date(v) : v), z.date()),
  note: z.string().max(500).nullable().optional(),
  isAttending: z.boolean().optional().default(true),
  userId: z.number().int().positive().optional(),
});

const UpdateReservationSchema = z.object({
  id: z.number().int().positive(),
  date: z.preprocess((v) => (typeof v === "string" ? new Date(v) : v), z.date()).optional(),
  note: z.string().max(500).nullable().optional(),
  isAttending: z.boolean().optional(),
});

export async function createReservationAction(input: z.infer<typeof CreateReservationSchema>) {
  const data = CreateReservationSchema.parse(input);

  const ut = await prisma.userTemplate.findUnique({
    where: { id: data.userTemplateId },
    select: { id: true, userId: true },
  });
  if (!ut) return { ok: false as const, error: "UserTemplate not found." };
  if (data.userId && ut.userId !== data.userId) {
    return { ok: false as const, error: "Not allowed to modify this template." };
  }

  const reservation = await prisma.reservation.create({
    data: {
      userTemplateId: ut.id,
      date: data.date,
      note: data.note ?? null,
      isAttending: data.isAttending ?? true,
      totalGuests: 0,
    },
  });

  return { ok: true as const, reservation };
}

export async function updateReservationAction(input: z.infer<typeof UpdateReservationSchema>) {
  const data = UpdateReservationSchema.parse(input);

  const updated = await prisma.reservation.update({
    where: { id: data.id },
    data: {
      ...(data.date ? { date: data.date } : {}),
      ...(data.note !== undefined ? { note: data.note } : {}),
      ...(data.isAttending !== undefined ? { isAttending: data.isAttending } : {}),
    },
  });

  return { ok: true as const, reservation: updated };
}
