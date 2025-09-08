// /data-access/invitees/get-invitee.ts
"use server";

import { prisma } from "../../../../packages/db/src/index";
import { Gender, RsvpStatus, Prisma } from "@prisma/client";
import { unstable_cache } from "next/cache";

interface GetInviteesOptions {
  projectId: string;
  q?: string;
  status?: string;
  gender?: string;
  page?: number;
  pageSize?: number;
}

async function _getInvitees({
  projectId,
  q = "",
  status,
  gender,
  page = 1,
  pageSize = 10,
}: GetInviteesOptions) {
  if (!projectId) throw new Error("projectId is required");

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

  if (status && Object.values(RsvpStatus).includes(status as RsvpStatus)) {
    where.rsvpStatus = status as RsvpStatus;
  }
  if (gender && Object.values(Gender).includes(gender as Gender)) {
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

// ✅ Wrap with unstable_cache and tag with "invitees"
export const getInvitees = unstable_cache(_getInvitees, ["invitees"], { tags: ["invitees"] });
