import { prisma } from "@digital-inv/db";
import { getSession } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import { routes } from "@/routes";
import Image from "next/image";
import type { TemplateConfig } from "@/types/_template-config";

export default async function PreviewPage({ params }: { params: { slug: string } }) {
  const user = await getSession();
  if (!user) redirect(routes.LOGIN);

  const project = await prisma.invitationProject.findUnique({
    where: { slug: params.slug },
    include: { template: true },
  });

  if (!project || project.userId !== user.id) return notFound();

  const cfg = project.configJson as TemplateConfig;

  return (
    <main className="mx-auto max-w-2xl p-6 space-y-4">
      <h1 className="text-2xl font-semibold">{project.title}</h1>
      <p>
        {cfg.groomName} & {cfg.brideName}
      </p>
      <p>
        {cfg.date} {cfg.time ? `• ${cfg.time}` : ""} — {cfg.venue}, {cfg.city}
      </p>

      {cfg.heroImage ? (
        <div className="relative w-full h-64">
          <Image
            src={cfg.heroImage}
            alt={`${cfg.groomName} & ${cfg.brideName} preview`}
            fill
            className="rounded-lg object-cover"
            priority={false}
          />
        </div>
      ) : null}

      <div className="text-sm text-muted-foreground">Template: {project.template.name}</div>
    </main>
  );
}
