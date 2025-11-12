"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  guest?: { firstName: string; lastName: string } | null;
  saving?: boolean;
  onConfirm: () => void;
};

export function DeleteGuestDialog({ open, onOpenChange, guest, saving = false, onConfirm }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Obriši gosta</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onConfirm();
          }}
          className="space-y-4"
        >
          <p className="text-sm text-muted-foreground">
            {guest
              ? `Jeste li sigurni da želite obrisati ${guest.firstName} ${guest.lastName}?`
              : "Jeste li sigurni da želite obrisati ovog gosta?"}
          </p>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Odustani
            </Button>
            <Button type="submit" variant="destructive" disabled={saving}>
              {saving ? "Brisanje…" : "Obriši"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
