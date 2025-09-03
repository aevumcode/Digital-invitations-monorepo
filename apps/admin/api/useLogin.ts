import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { login } from "@/api/auth";
import type { LoginRequest } from "@/api/auth";
import { routes } from "@/routes";

interface LoginResponse {
  user: { id: string; email: string };
}

export const useLogin = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation<LoginResponse, Error, LoginRequest>({
    mutationFn: async (data) => {
      return await login(data);
    },
    onSuccess: async () => {
      toast.success("Uspješna prijava");

      await queryClient.invalidateQueries({ queryKey: ["session"] });

      router.push(routes.LANDING);
    },
    onError: () => {
      toast.error("Greška pri prijavi");
    },
  });
};
