// data-access/guest.ts
import "server-only";
import { prisma } from "@digital-inv/db";
import { Prisma } from "@prisma/client";

/** Table row type the UI expects */
export type GuestRow = {
  id: number; // Guest.id
  firstName: string;
  lastName: string;
  reservationId: number; // Reservation.id
  reservationDate: string; // ISO
  attending: boolean; // Reservation.isAttending
  note: string | null; // Reservation.note
};

export type GuestStats = {
  totalReservations: number;
  attendingReservations: number;
  notAttendingReservations: number;
  totalGuests: number;
};

/** Optional attending filter */
export type AttendingFilter = boolean | undefined;

/** Paged fetch + search + (optional) attending filter */
export async function fetchGuestsAction(args: {
  userTemplateId: string;
  q?: string;
  page?: number; // 1-based
  pageSize?: number; // default 10
  attending?: AttendingFilter;
}): Promise<{ items: GuestRow[]; pageCount: number }> {
  const { userTemplateId, q, attending, page = 1, pageSize = 10 } = args;

  // Build where clause on Guest with relational filter on Reservation
  const where = {
    reservation: {
      userTemplateId,
      ...(typeof attending === "boolean" ? { isAttending: attending } : {}),
    },
    ...(q
      ? {
          OR: [
            { firstName: { contains: q, mode: Prisma.QueryMode.insensitive } },
            { lastName: { contains: q, mode: Prisma.QueryMode.insensitive } },
          ],
        }
      : {}),
  } as const;

  const [total, guests] = await Promise.all([
    prisma.guest.count({ where }),
    prisma.guest.findMany({
      where,
      orderBy: [{ reservation: { date: "asc" } }, { id: "asc" }],
      include: {
        reservation: {
          select: { id: true, date: true, isAttending: true, note: true },
        },
      },
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
    note: g.reservation.note,
  }));

  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  return { items, pageCount };
}

/** KPI cards for toolbar */
export async function fetchGuestStatsAction(args: { userTemplateId: string }): Promise<GuestStats> {
  const { userTemplateId } = args;

  const [totalReservations, attendingReservations, notAttendingReservations, totalGuests] =
    await Promise.all([
      prisma.reservation.count({ where: { userTemplateId } }),
      prisma.reservation.count({ where: { userTemplateId, isAttending: true } }),
      prisma.reservation.count({ where: { userTemplateId, isAttending: false } }),
      prisma.guest.count({ where: { reservation: { userTemplateId } } }),
    ]);

  return {
    totalReservations,
    attendingReservations,
    notAttendingReservations,
    totalGuests,
  };
}

/** (Optional) lightweight list of reservations for a selector in the “Add Guest” dialog */
export async function listReservationsLite(userTemplateId: string) {
  const reservations = await prisma.reservation.findMany({
    where: { userTemplateId },
    orderBy: { date: "asc" },
    select: {
      id: true,
      date: true,
      isAttending: true,
      totalGuests: true,
      note: true,
    },
  });

  return reservations.map((r) => ({
    id: r.id,
    date: r.date.toISOString(),
    isAttending: r.isAttending,
    totalGuests: r.totalGuests,
    note: r.note,
  }));
}

export async function listGuestsForTemplate(userTemplateId: string) {
  const reservations = await prisma.reservation.findMany({
    where: { userTemplateId },
    include: { guests: true },
    orderBy: { date: "asc" },
  });

  // Flatten rows for a table
  return reservations.flatMap((r) =>
    r.guests.map((g) => ({
      guestId: g.id,
      firstName: g.firstName,
      lastName: g.lastName,
      reservationId: r.id,
      date: r.date,
      isAttending: r.isAttending,
      reservationNote: r.note,
      totalGuestsOnReservation: r.totalGuests,
    })),
  );
}

export async function listGuestsByReservation(reservationId: number) {
  return prisma.guest.findMany({
    where: { reservationId },
    orderBy: { id: "asc" },
  });
}

export async function countGuests(reservationId: number) {
  return prisma.guest.count({ where: { reservationId } });
}
