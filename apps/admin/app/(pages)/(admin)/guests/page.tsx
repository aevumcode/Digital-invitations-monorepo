import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { routes } from "@/routes";
import { Suspense } from "react";

import { getDefaultUserTemplateForUser } from "@/data-access/templates";

import { GuestTableWrapper } from "./_components/guest-table-wrapper";
import { GuestTableSkeleton } from "./_components/guest-table-skeleton";

import { GuestStatsWrapper } from "./_components/guest-stats-wrapper";
import { GuestStatsSkeleton } from "./_components/guest-stats-skeleton";

export default async function Page() {
  const user = await getSession();
  if (!user) redirect(routes.LOGIN);

  const userTemplate = await getDefaultUserTemplateForUser(+user.id);
  if (!userTemplate) redirect(routes.STORE);

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <Suspense fallback={<GuestStatsSkeleton />}>
          <GuestStatsWrapper userTemplateId={userTemplate.id} />
        </Suspense>

        <Suspense fallback={<GuestTableSkeleton />}>
          <GuestTableWrapper userTemplateId={userTemplate.id} />
        </Suspense>
      </div>
    </div>
  );
}
