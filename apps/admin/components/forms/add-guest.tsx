import { ReservationLite } from "@/types/_reservation";
import React from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Button } from "../ui/button";

// ---------- Helpers ----------
export const fmtDate = (iso: string) =>
  new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(iso));

// ---------- Inline Add Guest Form ----------
export function AddGuestForm({
  reservations,
  onSubmit,
  pending,
}: {
  reservations: ReservationLite[];
  onSubmit: (payload: {
    firstName: string;
    lastName: string;
    reservationId: number | null;
  }) => void;
  pending: boolean;
}) {
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [reservationId, setReservationId] = React.useState<number | null>(
    reservations[0]?.id ?? null,
  );

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ firstName, lastName, reservationId });
      }}
      className="grid gap-3"
    >
      <div>
        <Label className="mb-1 block text-sm">Ime</Label>
        <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
      </div>
      <div>
        <Label className="mb-1 block text-sm">Prezime</Label>
        <Input value={lastName} onChange={(e) => setLastName(e.target.value)} required />
      </div>
      <div>
        <Label className="mb-1 block text-sm">Rezervacija</Label>
        <Select
          value={reservationId != null ? String(reservationId) : ""}
          onValueChange={(v) => setReservationId(v ? Number(v) : null)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Odaberite rezervaciju" />
          </SelectTrigger>
          <SelectContent>
            {reservations.map((r) => (
              <SelectItem key={r.id} value={String(r.id)}>
                {fmtDate(r.date)} {r.isAttending ? "• Dolazi" : "• Ne dolazi"}
              </SelectItem>
            ))}
            {!reservations.length && (
              <div className="px-3 py-2 text-sm text-muted-foreground">Još nema rezervacija</div>
            )}
          </SelectContent>
        </Select>
      </div>

      <div className="mt-2 flex justify-end gap-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Dodavanje…" : "Dodaj"}
        </Button>
      </div>
    </form>
  );
}
