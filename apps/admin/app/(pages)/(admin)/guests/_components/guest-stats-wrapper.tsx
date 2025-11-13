import { fetchGuestStatsAction } from "@/data-access/actions/guest-list";

export async function GuestStatsWrapper({ userTemplateId }: { userTemplateId: string }) {
  const stats = await fetchGuestStatsAction({ userTemplateId });

  return (
    <div className="hidden md:flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-600">
      <div className="flex items-center gap-2">
        <span className="inline-block h-2 w-2 rounded-full bg-green-500" />
        <span>{stats.attendingReservations} Rezervacija: dolazi</span>
      </div>

      <div className="flex items-center gap-2">
        <span className="inline-block h-2 w-2 rounded-full bg-red-500" />
        <span>{stats.notAttendingReservations} Rezervacija: ne dolazi</span>
      </div>

      <div className="flex items-center gap-2 text-gray-500">
        <span className="text-xs">Ukupno gostiju:</span>
        <span className="font-medium">{stats.totalGuests}</span>
      </div>
    </div>
  );
}
