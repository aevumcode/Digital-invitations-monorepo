import { fetchGuestStatsAction } from "@/data-access/actions/guest-list";
import { routes } from "@/routes";
import Link from "next/link";

export async function GuestStatsWrapper({ userTemplateId }: { userTemplateId: string }) {
  const stats = await fetchGuestStatsAction({ userTemplateId });

  let alertMessage: string | null = null;
  let alertColor = "";

  if (stats.remaining <= 0) {
    alertMessage = "Iskoristili ste sve pozivnice! Kupite još da biste primali nove goste.";
    alertColor = "bg-red-100 text-red-800 border-red-300";
  } else if (stats.remaining <= 5) {
    alertMessage = `Imate još samo ${stats.remaining} pozivnica — kupite još!`;
    alertColor = "bg-red-100 text-red-800 border-red-300";
  } else if (stats.remaining <= 10) {
    alertMessage = `Imate još ${stats.remaining} pozivnica.`;
    alertColor = "bg-yellow-100 text-yellow-800 border-yellow-300";
  }

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
      {alertMessage && (
        <div className={`w-full rounded-md p-3 mb-4 border text-sm font-medium ${alertColor}`}>
          {alertMessage}
          <Link href={routes.STORE} className="underline font-semibold ml-10">
            Kupi još →
          </Link>
        </div>
      )}
    </div>
  );
}
