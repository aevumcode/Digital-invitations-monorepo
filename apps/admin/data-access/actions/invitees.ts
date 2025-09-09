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

import { getInviteeStats } from "@/data-access/invitees/get-status-stats";

export async function fetchInviteeStatsAction(args: { projectId: string }) {
  return getInviteeStats(args);
}
