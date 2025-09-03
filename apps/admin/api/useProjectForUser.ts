import { api } from "@/api";
import { apiRoutes } from "@/routes";
import { useFetchQuery } from "@/hooks/useFetchQuery";
import type { InvitationProject } from "@/types/_project";

const fetchProjectForUser = async (
  userId: string
): Promise<InvitationProject> => {
  const response = await api.get(apiRoutes.PROJECT_FOR_USER(userId));
  return response.data;
};

export const useProjectForUser = (
  userId: string,
  options?: { enabled?: boolean }
) => {
  return useFetchQuery<InvitationProject>({
    queryKey: ["project", userId],
    queryFn: () => fetchProjectForUser(userId),
    enabled: !!userId && options?.enabled,
  });
};
