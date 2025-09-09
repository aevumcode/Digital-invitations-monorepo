"server-only";

import { prisma } from "../../../../packages/db/src/index";
import { RsvpStatus } from "@prisma/client";

export async function getInviteeStats({ projectId }: { projectId: string }) {
  if (!projectId) throw new Error("projectId is required");

  // group counts by RSVP enum
  const grouped = await prisma.invitee.groupBy({
    by: ["rsvpStatus"],
    where: { projectId },
    _count: { _all: true },
  });

  const counts: Record<RsvpStatus, number> = {
    ACCEPTED: 0,
    DECLINED: 0,
    PENDING: 0,
  };

  for (const row of grouped) {
    counts[row.rsvpStatus] = row._count._all;
  }

  const total = await prisma.invitee.count({ where: { projectId } });

  return {
    total,
    accepted: counts.ACCEPTED,
    pending: counts.PENDING,
    declined: counts.DECLINED,
  };
}

export type InviteeStats = Awaited<ReturnType<typeof getInviteeStats>>;
