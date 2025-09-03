"use client";

import { useProjectForUser } from "@/api/useProjectForUser";
import { GuestTable } from "@/components/tables/data-table";
import { useSession } from "@/hooks/useSession";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { routes } from "@/routes";

export default function Page() {
  const router = useRouter();
  const { data: user, isLoading } = useSession();
  const { data: project } = useProjectForUser(user?.id ?? "");

  useEffect(() => {
    if (!isLoading && !user) {
      router.push(routes.LANDING);
    }
  }, [isLoading, user, router]);

  if (isLoading) return <p>Loading...</p>;
  if (!user) return null;

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
