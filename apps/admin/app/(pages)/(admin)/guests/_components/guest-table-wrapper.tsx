import { listGuestsForTemplate } from "@/data-access/guest";
import { getInviteeStatsByTemplate } from "@/data-access/invitees";
import { listReservationsForTemplate } from "@/data-access/reservations";
import { GuestTable } from "@/components/tables/guest-table";

export async function GuestTableWrapper({ userTemplateId }: { userTemplateId: string }) {
  const [initialRows, initialStats, reservations] = await Promise.all([
    listGuestsForTemplate(userTemplateId),
    getInviteeStatsByTemplate(userTemplateId),
    listReservationsForTemplate(userTemplateId),
  ]);

  const initialData = {
    items: initialRows.map((r) => ({
      id: r.guestId,
      firstName: r.firstName,
      lastName: r.lastName,
      reservationId: r.reservationId,
      reservationDate: r.date.toISOString(),
      attending: r.isAttending,
      note: r.reservationNote ?? null,
    })),
    pageCount: 1,
  };

  const initialReservations = reservations.map((r) => ({
    id: r.id,
    date: r.date.toISOString(),
    isAttending: r.isAttending,
    totalGuests: r.totalGuests,
    note: r.note,
  }));

  return (
    <GuestTable
      userTemplateId={userTemplateId}
      initialData={initialData}
      initialStats={initialStats}
      initialReservations={initialReservations}
    />
  );
}
