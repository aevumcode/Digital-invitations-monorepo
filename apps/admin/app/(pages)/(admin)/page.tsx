import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { routes } from "@/routes";
import { getUserAndPurchasedTemplates } from "@/data-access/templates";
import TemplatesFlow from "@/components/templates-flow";

export default async function AdminHomePage() {
  const sessionUser = await getSession();
  if (!sessionUser) redirect(routes.LOGIN);

  const userId = typeof sessionUser.id === "string" ? Number(sessionUser.id) : sessionUser.id;

  const { user, purchases } = await getUserAndPurchasedTemplates(userId);

  return <TemplatesFlow userId={user.id} purchases={purchases} />;
}
