import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { routes } from "@/routes";
import { GuestTable } from "@/components/tables/guest-table";

import { getDefaultUserTemplateForUser } from "@/data-access/templates";
import { listGuestsForTemplate } from "@/data-access/guest";
import { getInviteeStatsByTemplate } from "@/data-access/invitees";
import { listReservationsForTemplate } from "@/data-access/reservations";

export default async function Page() {
  const user = await getSession();
  if (!user) redirect(routes.LOGIN);

  const userTemplate = await getDefaultUserTemplateForUser(+user.id);
  if (!userTemplate) {
    redirect(routes.STORE ?? routes.LOGIN);
  }

  const [initialRows, initialStats, reservations] = await Promise.all([
    listGuestsForTemplate(userTemplate.id),
    getInviteeStatsByTemplate(userTemplate.id),
    listReservationsForTemplate(userTemplate.id),
  ]);

  const initialData = {
    items: initialRows.map((r) => ({
      id: r.guestId, // Guest.id
      firstName: r.firstName,
      lastName: r.lastName,
      reservationId: r.reservationId, // Reservation.id
      reservationDate: r.date.toISOString(), // ISO string
      attending: r.isAttending, // Reservation.isAttending
      note: r.reservationNote ?? null, // Reservation.note
    })),
    pageCount: 1,
  };

  const initialReservations = reservations.map((r) => ({
    id: r.id,
    date: r.date.toISOString(),
    isAttending: r.isAttending,
    totalGuests: r.totalGuests,
    note: r.note ?? null,
  }));

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <GuestTable
            userTemplateId={userTemplate.id}
            initialData={initialData}
            initialStats={initialStats}
            initialReservations={initialReservations}
          />
        </div>
      </div>
    </div>
  );
}
