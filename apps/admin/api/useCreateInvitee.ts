import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api";
import { apiRoutes } from "@/routes";
import type { Invitee, CreateInviteeDto } from "@/types/_invitee";
import { renderLoadingToast } from "@/lib/api";
import { toast } from "sonner";

const createInvitee = async (data: CreateInviteeDto) => {
  const response = await api.post<Invitee>(apiRoutes.INVITEES, data);
  return response.data;
};

export const useCreateInvitee = () => {
  const queryClient = useQueryClient();

  return useMutation<Invitee, Error, CreateInviteeDto, { toastId?: string | number }>({
    mutationFn: createInvitee,

    onMutate: renderLoadingToast("Dodavanje gosta..."),

    onSuccess: (_data, variables, context) => {
      toast.success("Gost uspješno dodan", { id: context?.toastId });
      void queryClient.invalidateQueries({
        queryKey: ["invitees", variables.projectId],
      });
    },

    onError: () => toast.error("Nije uspješno dodan"),
  });
};
