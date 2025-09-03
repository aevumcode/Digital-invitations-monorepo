// src/api/useFetchInvitees.ts
import { api } from "@/api";
import { apiRoutes } from "@/routes";
import { useFetchQuery } from "@/hooks/useFetchQuery";
import type { GenderFilter, Invitee, RSVPFilter } from "@/types/_invitee";

export type PaginatedInvitees = {
  items: Invitee[];
  total: number;
  page: number; // 1-based (BE)
  pageSize: number;
  pageCount: number;
};

const fetchInvitees = async (
  projectId: string,
  q: string,
  page: number, // 0-based (FE)
  pageSize: number,
  status: RSVPFilter,
  gender: GenderFilter
): Promise<PaginatedInvitees> => {
  const { data } = await api.get(apiRoutes.INVITEES, {
    params: {
      projectId,
      q: q?.trim() || undefined,
      page: page + 1, // FE 0-based -> BE 1-based
      pageSize,
      status: status !== "ANY" ? status : undefined,
      gender: gender !== "ANY" ? gender : undefined,
    },
  });
  return data;
};

export const useFetchInvitees = (
  projectId: string,
  q: string,
  page: number,
  pageSize: number,
  status: RSVPFilter = "ANY",
  gender: GenderFilter = "ANY"
) => {
  return useFetchQuery<PaginatedInvitees>({
    queryKey: ["invitees", projectId, q, page, pageSize, status, gender],
    queryFn: () => fetchInvitees(projectId, q, page, pageSize, status, gender),
    enabled: !!projectId,
  });
};
