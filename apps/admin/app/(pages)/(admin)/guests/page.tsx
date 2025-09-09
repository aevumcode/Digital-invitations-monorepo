import { GuestTable } from "@/components/tables/guest-table";
import { getInvitees } from "@/data-access/invitees/get-invitee";
import { getInviteeStats } from "@/data-access/invitees/get-status-stats";
import { getProjectForUser } from "@/data-access/project";
import { getSession } from "@/lib/auth";
import { routes } from "@/routes";
import { redirect } from "next/navigation";

export default async function Page() {
  const user = await getSession();

  if (!user) {
    redirect(routes.LOGIN);
  }

  const project = await getProjectForUser(user.id);
  //makni me
  console.log("Project:", project);
  console.log("User:", user);

  if (!project) {
    redirect(routes.LOGIN);
  }

  const [initialData, initialStats] = await Promise.all([
    getInvitees({ projectId: project.id }),
    getInviteeStats({ projectId: project.id }),
  ]);

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <GuestTable
            projectId={project.id}
            initialData={initialData}
            initialStats={initialStats}
          />
        </div>
      </div>
    </div>
  );
}
