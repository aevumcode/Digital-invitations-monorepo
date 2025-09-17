import { prisma } from "@digital-inv/db";
import { notFound } from "next/navigation";
import type { TemplateConfig } from "@/types/_template-config";
import InvitationTemplate from "@/components/template-pages/templates/invitation-template-1";

export default async function LivePage({ params }: { params: { publicSlug: string } }) {
  const project = await prisma.invitationProject.findUnique({
    where: { publicSlug: params.publicSlug },
    include: { template: true },
  });

  if (!project || !project.isPublished) return notFound();

  const cfg = project.configJson as TemplateConfig;

  return <InvitationTemplate publicSlug={params.publicSlug} />;
}
