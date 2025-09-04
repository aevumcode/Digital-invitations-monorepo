import { GuestTable } from "@/components/tables/data-table";
import { getCurrentUser } from "@/data-access/auth/me";
import { getProjectByUserId } from "@/data-access/projects/projext-data-access";
import { routes } from "@/routes";
import { redirect } from "next/navigation";

export default async function Page() {
  const user = await getCurrentUser();
  if (!user) redirect(routes.LOGIN);

  const project = await getProjectByUserId(user.id);

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          {project && <GuestTable projectId={project.id} />}
        </div>
      </div>
    </div>
  );
}
