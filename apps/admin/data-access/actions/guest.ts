"use server";

import { routes } from "@/routes";
import { prisma } from "@digital-inv/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";

/** Validation */
const CreateGuestSchema = z.object({
  userTemplateId: z.string().cuid(),
  reservationId: z.number().int().positive().optional(),
  firstName: z.string().min(1).max(80),
  lastName: z.string().min(1).max(80),
  date: z.preprocess((v) => (typeof v === "string" ? new Date(v) : v), z.date().optional()),
  note: z.string().max(500).optional(),
  isAttending: z.boolean().optional().default(true),
  userId: z.number().int().positive().optional(),
});

// 👇 Use z.input so callers can omit fields that have defaults
type CreateGuestInput = z.input<typeof CreateGuestSchema>;
type CreateGuestData = z.output<typeof CreateGuestSchema>;

const UpdateGuestSchema = z.object({
  id: z.number().int().positive(),
  firstName: z.string().min(1).max(80).optional(),
  lastName: z.string().min(1).max(80).optional(),
});

const DeleteGuestSchema = z.object({
  id: z.number().int().positive(),
});

/** Create a guest and keep reservation.totalGuests in sync */
export async function createGuestAction(input: CreateGuestInput) {
  // data now has defaults applied (isAttending = true if omitted)
  const data: CreateGuestData = CreateGuestSchema.parse(input);

  const ut = await prisma.userTemplate.findUnique({
    where: { id: data.userTemplateId },
    select: { id: true, userId: true },
  });
  if (!ut) return { ok: false as const, error: "UserTemplate not found." };
  if (data.userId && ut.userId !== data.userId) {
    return { ok: false as const, error: "Not allowed to modify this template." };
  }

  let reservationId = data.reservationId ?? null;
  if (reservationId) {
    const r = await prisma.reservation.findUnique({
      where: { id: reservationId },
      select: { userTemplateId: true },
    });
    if (!r || r.userTemplateId !== ut.id) {
      return { ok: false as const, error: "Reservation does not belong to this template." };
    }
  } else {
    const created = await prisma.reservation.create({
      data: {
        userTemplateId: ut.id,
        date: data.date ?? new Date(),
        note: data.note ?? null,
        isAttending: data.isAttending ?? true,
        totalGuests: 0,
      },
      select: { id: true },
    });
    reservationId = created.id;
  }

  const { guest, reservation } = await prisma.$transaction(async (tx) => {
    const guest = await tx.guest.create({
      data: {
        reservationId: reservationId!,
        firstName: data.firstName,
        lastName: data.lastName,
      },
    });

    const cnt = await tx.guest.count({ where: { reservationId: reservationId! } });
    const reservation = await tx.reservation.update({
      where: { id: reservationId! },
      data: { totalGuests: cnt },
      include: { guests: true },
    });

    return { guest, reservation };
  });

  revalidatePath(routes.GUESTS);

  return { ok: true as const, guest, reservation };
}

export async function updateGuestAction(input: z.infer<typeof UpdateGuestSchema>) {
  const data = UpdateGuestSchema.parse(input);
  const updated = await prisma.guest.update({
    where: { id: data.id },
    data: {
      ...(data.firstName ? { firstName: data.firstName } : {}),
      ...(data.lastName ? { lastName: data.lastName } : {}),
    },
  });
  return { ok: true as const, guest: updated };
}

export async function deleteGuestAction(input: z.infer<typeof DeleteGuestSchema>) {
  const { id } = DeleteGuestSchema.parse(input);
  const existing = await prisma.guest.findUnique({
    where: { id },
    select: { reservationId: true },
  });
  if (!existing) return { ok: false as const, error: "Guest not found." };

  await prisma.$transaction(async (tx) => {
    await tx.guest.delete({ where: { id } });
    const cnt = await tx.guest.count({ where: { reservationId: existing.reservationId } });
    await tx.reservation.update({
      where: { id: existing.reservationId },
      data: { totalGuests: cnt },
    });
  });

  return { ok: true as const };
}

/** Optional: FormData wrapper */
export async function createGuestFromForm(formData: FormData) {
  const toNum = (v: FormDataEntryValue | null) =>
    typeof v === "string" && v.trim() ? Number(v) : undefined;

  return createGuestAction({
    userTemplateId: String(formData.get("userTemplateId") ?? ""),
    reservationId: toNum(formData.get("reservationId")),
    firstName: String(formData.get("firstName") ?? ""),
    lastName: String(formData.get("lastName") ?? ""),
    date: formData.get("date") ? new Date(String(formData.get("date"))) : undefined,
    note: formData.get("note") ? String(formData.get("note")) : undefined,
    isAttending: String(formData.get("isAttending") ?? "true").toLowerCase() === "true",
    userId: toNum(formData.get("userId")),
  });
}
