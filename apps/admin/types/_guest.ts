// ---------- Types ----------
type GuestRow = {
  id: number; // Guest.id
  firstName: string;
  lastName: string;
  reservationId: number; // Reservation.id
  reservationDate: string; // ISO string
  attending: boolean; // Reservation.isAttending
  note: string | null; // Reservation.note
};

type GuestStats = {
  totalReservations: number;
  attendingReservations: number;
  notAttendingReservations: number;
  totalGuests: number;
};

export type { GuestRow, GuestStats };
