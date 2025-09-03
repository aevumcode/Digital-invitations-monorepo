import { useQuery } from "@tanstack/react-query";
import { api } from "@/api";
import { apiRoutes } from "@/routes";
import type { Invitee } from "@/types/_invitee";

const fetchInvitee = async (id: string) => {
  return api.get<Invitee>(apiRoutes.INVITEE(id));
};

export function useFetchInvitee(id: string) {
  return useQuery({
    queryKey: ["invitee", id],
    queryFn: () => fetchInvitee(id),
    enabled: Boolean(id),
  });
}
