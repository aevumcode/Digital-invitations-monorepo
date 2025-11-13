"use server";
import { prisma } from "@digital-inv/db";
import { Prisma } from "@prisma/client";

type AttendingFilter = boolean | undefined;

export type GuestRow = {
  id: number;
  firstName: string;
  lastName: string;
  reservationId: number;
  reservationDate: string;
  attending: boolean;
  note: string | null;
};

export type GuestStats = {
  totalReservations: number;
  attendingReservations: number;
  notAttendingReservations: number;
  totalGuests: number;
  quantity: number; // user purchased limit
  remaining: number; // how many are left
  used: number;
};

export async function fetchGuestsAction(args: {
  userTemplateId: string;
  q?: string;
  page?: number;
  pageSize?: number;
  attending?: AttendingFilter;
}) {
  const { userTemplateId, q, page = 1, pageSize = 10, attending } = args;

  const where: Prisma.GuestWhereInput = {
    reservation: {
      userTemplateId,
      ...(typeof attending === "boolean" ? { isAttending: attending } : {}),
    },
    ...(q?.trim()
      ? {
          OR: [
            { firstName: { contains: q, mode: "insensitive" } },
            { lastName: { contains: q, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const [total, guests] = await Promise.all([
    prisma.guest.count({ where }),
    prisma.guest.findMany({
      where,
      orderBy: [{ reservation: { date: "asc" } }, { id: "asc" }],
      include: { reservation: { select: { id: true, date: true, isAttending: true, note: true } } },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  const items: GuestRow[] = guests.map((g) => ({
    id: g.id,
    firstName: g.firstName,
    lastName: g.lastName,
    reservationId: g.reservationId,
    reservationDate: g.reservation.date.toISOString(),
    attending: g.reservation.isAttending,
    note: g.reservation.note ?? null,
  }));

  return { items, pageCount: Math.max(1, Math.ceil(total / pageSize)) };
}

export async function fetchGuestStatsAction(args: { userTemplateId: string }): Promise<GuestStats> {
  const { userTemplateId } = args;

  const [totalReservations, attendingReservations, notAttendingReservations, totalGuests, tpl] =
    await Promise.all([
      prisma.reservation.count({ where: { userTemplateId } }),
      prisma.reservation.count({ where: { userTemplateId, isAttending: true } }),
      prisma.reservation.count({ where: { userTemplateId, isAttending: false } }),
      prisma.guest.count({ where: { reservation: { userTemplateId } } }),
      prisma.userTemplate.findUnique({
        where: { id: userTemplateId },
        select: { quantity: true },
      }),
    ]);

  const quantity = tpl?.quantity ?? 0;
  const used = totalReservations;
  const remaining = Math.max(0, quantity - used);

  return {
    totalReservations,
    attendingReservations,
    notAttendingReservations,
    totalGuests,

    quantity,
    used,
    remaining,
  };
}
