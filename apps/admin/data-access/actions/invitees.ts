"use server";

import { getInvitees } from "../invitees/get-invitee";

export async function fetchInviteesAction(params: {
  projectId: string;
  q?: string;
  status?: string;
  gender?: string;
  page?: number;
  pageSize?: number;
}) {
  return getInvitees(params);
}
