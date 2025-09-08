"use server";

import { prisma } from "../../../../packages/db/src/index";
import { revalidateTag } from "next/cache";

export async function deleteInviteeAction(inviteeId: string) {
  if (!inviteeId) throw new Error("inviteeId is required");

  try {
    await prisma.invitee.delete({ where: { id: inviteeId } });

    revalidateTag("invitees");

    return { success: true };
  } catch (err) {
    console.error("Failed to delete invitee:", err);
    throw new Error("Failed to delete invitee");
  }
}
