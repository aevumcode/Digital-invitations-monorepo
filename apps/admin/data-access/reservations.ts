import "server-only";
import { prisma } from "@digital-inv/db";

export async function getReservationById(id: number) {
  return prisma.reservation.findUnique({
    where: { id },
    include: { guests: true },
  });
}

export async function listReservationsForTemplate(userTemplateId: string) {
  return prisma.reservation.findMany({
    where: { userTemplateId },
    include: { guests: true },
    orderBy: { date: "asc" },
  });
}
