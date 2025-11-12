type ReservationLite = {
  id: number;
  date: string; // ISO
  isAttending: boolean;
  totalGuests: number;
  note: string | null;
};

export type { ReservationLite };
