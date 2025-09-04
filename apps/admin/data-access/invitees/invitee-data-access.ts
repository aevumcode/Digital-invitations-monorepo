"server only";

import { prisma } from "@digital-inv/db";
import { Prisma, Gender, RsvpStatus } from "@prisma/client";

export async function getInvitees(params: {
  projectId: string;
  q?: string;
  status?: string;
  gender?: string;
  page?: number;
  pageSize?: number;
}) {
  const { projectId, q, status, gender, page = 1, pageSize = 10 } = params;

  const skip = (page - 1) * pageSize;
  const take = pageSize;

  const where: Prisma.InviteeWhereInput = { projectId };

  if (q) {
    where.OR = [
      { firstName: { contains: q, mode: "insensitive" } },
      { lastName: { contains: q, mode: "insensitive" } },
      { email: { contains: q, mode: "insensitive" } },
      { phone: { contains: q, mode: "insensitive" } },
      { tag: { contains: q, mode: "insensitive" } },
    ];
  }

  if (status && (Object.values(RsvpStatus) as string[]).includes(status)) {
    where.rsvpStatus = status as RsvpStatus;
  }

  if (gender && (Object.values(Gender) as string[]).includes(gender)) {
    where.gender = gender as Gender;
  }

  const [items, total] = await Promise.all([
    prisma.invitee.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: "desc" },
    }),
    prisma.invitee.count({ where }),
  ]);

  return {
    items,
    total,
    page,
    pageSize,
    pageCount: Math.ceil(total / pageSize),
  };
}
