import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/api";
import { apiRoutes } from "@/routes";

const deleteInvitee = (inviteeId: string) => api.delete<void, never>(apiRoutes.INVITEE(inviteeId));

export function useDeleteInvitee(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteInvitee,
    onSuccess: () => {
      toast.success("Gost je uspješno obrisan.");
      // invalidate only that project's invitees
      void queryClient.invalidateQueries({ queryKey: ["invitees", projectId] });
    },
    onError: (error) => {
      toast.error("Došlo je do pogreške prilikom brisanja gosta.");
      console.error(error);
    },
  });
}
