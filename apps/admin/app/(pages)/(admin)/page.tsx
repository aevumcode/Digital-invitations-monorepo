// app/(pages)/admin/page.tsx
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { routes } from "@/routes";
import { getPurchasedTemplates } from "@/data-access/templates";
import TemplatesFlow from "@/components/templates-flow";
import { getUserInfo } from "@/data-access/project";

export default async function AdminHomePage() {
  const user = await getSession();
  if (!user) redirect(routes.LOGIN);

  const templates = await getPurchasedTemplates(user.id);

  const userInfo = await getUserInfo(user.id);
  console.log("User Info:", userInfo);

  return <TemplatesFlow userId={user.id} templates={templates} />;
}
