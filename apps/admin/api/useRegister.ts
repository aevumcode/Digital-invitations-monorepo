import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { api } from "@/api";
import { apiRoutes, routes } from "@/routes";

interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

interface RegisterResponse {
  user: { id: string; email: string };
}

export const useRegister = () => {
  const router = useRouter();

  return useMutation<RegisterResponse, Error, RegisterRequest>({
    mutationFn: async (data) => {
      const res = await api.post(apiRoutes.REGISTER, data);
      return res.data;
    },
    onSuccess: () => {
      toast("Account created successfully", {
        description: "You can now log in to your dashboard.",
      });
      router.push(routes.LANDING);
    },
    onError: () => {
      toast("Registration failed", {
        description: "Try again later.",
      });
    },
  });
};
