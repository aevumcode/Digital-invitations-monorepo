import { notFound } from "next/navigation";
import { getTemplateById } from "@/constants/template-data";
import InvitationMain from "@/components/template-pages/invitation-main";
import { getUserTemplateById } from "@/data-access/user-template";

export default async function LivePage({ params }: { params: { publicSlug: string } }) {
  const userTemplate = await getUserTemplateById(params.publicSlug);

  if (!userTemplate) return notFound();

  const meta = getTemplateById(userTemplate.templateId);
  if (!meta) return notFound();

  const raw = (userTemplate.customData as Record<string, unknown> | null) ?? {};
  interface CustomData {
    fields?: Record<string, unknown>;
  }

  const data = (raw as CustomData)?.fields ?? raw;

  const cfg = meta.buildConfig({
    ...data,
    userTemplateKey: userTemplate.id,
  });

  return <InvitationMain config={cfg} />;
}
