import { api } from "@/api";
import { apiRoutes } from "@/routes";
import { useFetchQuery } from "@/hooks/useFetchQuery";
import { useQueryClient } from "@tanstack/react-query";

export interface SessionUser {
  id: string;
  email: string;
  role: "ADMIN" | "CUSTOMER";
  name?: string | null;
}

const fetchSession = async (): Promise<SessionUser | null> => {
  const response = await api.get<{ user: SessionUser | null }>(apiRoutes.ME, {
    withCredentials: true,
  });
  return response.data.user;
};

export const useSession = () => {
  const queryClient = useQueryClient();

  const query = useFetchQuery<SessionUser | null>({
    queryKey: ["session"],
    queryFn: fetchSession,
  });

  const clearSession = () => {
    queryClient.setQueryData(["session"], null);
  };

  return {
    ...query,
    clearSession,
  };
};
