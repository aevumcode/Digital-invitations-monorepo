import * as React from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DialogMode } from "@/types/_dialog-mode";

type DialogFormaProps = {
  trigger: React.ReactNode;
  title: string;
  description?: string;
  children: React.ReactNode;
  submitLabel?: string;
  cancelLabel?: string;
  mode?: DialogMode;
  isLoading?: boolean;
  isOpen?: boolean;
  setIsOpen?: (open: boolean) => void;
  onSubmit?: React.FormEventHandler<HTMLFormElement>; // DODAJ OVO
};
export function FormDialog({
  trigger,
  title,
  description,
  children,
  submitLabel = "Spremi",
  cancelLabel = "Odustani",
  mode = DialogMode.EDIT,
  isLoading = false,
  isOpen,
  setIsOpen,
  onSubmit,
}: DialogFormaProps) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={onSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            {description && <DialogDescription>{description}</DialogDescription>}
          </DialogHeader>
          <div className="grid gap-4 py-4">{children}</div>
          {mode !== DialogMode.PREVIEW && (
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  {cancelLabel}
                </Button>
              </DialogClose>
              <Button type="submit" variant="default" disabled={isLoading}>
                {isLoading ? "Spremanje..." : submitLabel}
              </Button>
            </DialogFooter>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
