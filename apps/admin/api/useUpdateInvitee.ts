import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/api";
import { apiRoutes } from "@/routes";
import type { Patient, UpdatePatientDto } from "@/types/_patient";

type UpdatePatientInput = {
  id: string;
  data: UpdatePatientDto;
};

const updatePatient = ({ id, data }: UpdatePatientInput) =>
  api.patch<Patient, UpdatePatientDto>(apiRoutes.PATIENT(id), data);

export function useUpdatePatient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePatient,
    onSuccess: () => {
      toast.success("Pacijent uspješno ažuriran");
      void queryClient.invalidateQueries({ queryKey: ["patients"] });
    },
    onError: () => {
      toast.error("Greška pri ažuriranju pacijenta");
    },
  });
}
