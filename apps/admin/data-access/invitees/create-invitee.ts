// /data-access/invitees/create-invitee.ts
"use server";
import { prisma } from "../../../../packages/db/src/index";
import { v4 as uuidv4 } from "uuid";

interface CreateInviteeDto {
  projectId: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  tag?: string;
}

export async function createInviteeAction(data: CreateInviteeDto) {
  const { projectId, firstName, lastName, email, phone, tag } = data;

  if (!projectId || !firstName || !lastName) {
    throw new Error("projectId, firstName, and lastName are required");
  }

  const token = uuidv4();
  const invitationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/invite/${token}`;

  return prisma.invitee.create({
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
}
