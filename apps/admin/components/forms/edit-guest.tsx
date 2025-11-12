"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export type EditGuestPayload = { firstName: string; lastName: string };

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  guest?: { firstName: string; lastName: string } | null;
  saving?: boolean;
  onSubmit: (data: EditGuestPayload) => void;
};

export function EditGuestDialog({ open, onOpenChange, guest, saving = false, onSubmit }: Props) {
  const [first, setFirst] = React.useState("");
  const [last, setLast] = React.useState("");

  React.useEffect(() => {
    setFirst(guest?.firstName ?? "");
    setLast(guest?.lastName ?? "");
  }, [guest, open]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onSubmit({ firstName: first.trim(), lastName: last.trim() });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Uredi gosta</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-5">
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium">Ime</Label>
              <Input value={first} onChange={(e) => setFirst(e.target.value)} required />
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium">Prezime</Label>
              <Input value={last} onChange={(e) => setLast(e.target.value)} required />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Odustani
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Spremanje…" : "Spremi"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
