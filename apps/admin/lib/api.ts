// lib/api.ts
import { toast } from "sonner";

export function renderLoadingToast(message: string) {
  return () => {
    // Sonner returns either string or number
    const toastId = toast.loading(message);
    return { toastId }; // keep native type (string | number)
  };
}

export function removeLoadingToast(
  _error: unknown,
  _variables: unknown,
  context?: { toastId?: string | number },
) {
  if (!context?.toastId) return;
  toast.dismiss(context.toastId);
}
