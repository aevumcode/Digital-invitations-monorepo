import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/api";
import { apiRoutes } from "@/routes";
import type { Invitee, UpdateInviteeDto } from "@/types/_invitee";

type UpdateInviteeInput = {
  id: string;
  data: UpdateInviteeDto;
};

const updateInvitee = ({ id, data }: UpdateInviteeInput) =>
  api.patch<Invitee, UpdateInviteeDto>(apiRoutes.INVITEE(id), data);

export function useUpdateInvitee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateInvitee,
    onSuccess: () => {
      toast.success("Invitee uspješno ažuriran");
      void queryClient.invalidateQueries({ queryKey: ["invitees"] });
    },
    onError: () => {
      toast.error("Greška pri ažuriranju invitee-a");
    },
  });
}
