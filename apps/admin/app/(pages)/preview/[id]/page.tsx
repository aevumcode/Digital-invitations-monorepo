import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getTemplateById } from "@/constants/template-data";
import InvitationMain from "@/components/template-pages/invitation-main";
import { getUserTemplateById } from "@/data-access/user-template";

export default async function PreviewPage({ params }: { params: { id: string } }) {
  const user = await getSession();
  if (!user) redirect("/login");

  const userTemplate = await getUserTemplateById(params.id);

  if (!userTemplate || userTemplate.userId !== Number(user.id)) return notFound();

  const meta = getTemplateById(userTemplate.templateId);
  if (!meta) return notFound();

  // customData može biti plain {title, ...} ili wrapped { v, template, fields:{...} }
  const raw = (userTemplate.customData as Record<string, unknown> | null) ?? {};
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = (raw as any)?.fields ?? raw;

  const cfg = meta.buildConfig({
    ...data,
    userTemplateKey: userTemplate.id,
    mode: "preview",
  });

  return <InvitationMain config={cfg} />;
}
