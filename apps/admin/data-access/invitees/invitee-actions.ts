"use server";

import { prisma } from "@digital-inv/db";
import { v4 as uuidv4 } from "uuid";

export async function createInviteeAction(formData: FormData) {
  const projectId = formData.get("projectId")?.toString();
  const firstName = formData.get("firstName")?.toString();
  const lastName = formData.get("lastName")?.toString();
  const email = formData.get("email")?.toString() || null;
  const phone = formData.get("phone")?.toString() || null;
  const tag = formData.get("tag")?.toString() || null;

  if (!projectId || !firstName || !lastName) {
    throw new Error("projectId, firstName, and lastName are required");
  }

  const token = uuidv4();
  const invitationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/invite/${token}`;

  const invitee = await prisma.invitee.create({
    data: {
      projectId,
      firstName,
      lastName,
      email,
      phone,
      tag,
      token,
      invitationUrl,
    },
  });

  return invitee;
}
