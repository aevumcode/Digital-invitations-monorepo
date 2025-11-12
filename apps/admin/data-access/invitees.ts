import "server-only";
import { listReservationsForTemplate } from "./reservations";

export async function getInviteeStatsByTemplate(userTemplateId: string) {
  const reservations = await listReservationsForTemplate(userTemplateId);
  const totalReservations = reservations.length;
  const attendingReservations = reservations.filter((r) => r.isAttending).length;
  const totalGuests = reservations.reduce((s, r) => s + r.totalGuests, 0);

  return {
    totalReservations,
    attendingReservations,
    notAttendingReservations: totalReservations - attendingReservations,
    totalGuests,
  };
}
