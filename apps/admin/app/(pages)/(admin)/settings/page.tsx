import { redirect } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileTab from "@/components/settings/profile-tab";
import SecurityTab from "@/components/settings/security-tab";

import { getSession } from "@/lib/auth";
import { getUserSettings } from "@/data-access/user";
import { routes } from "@/routes";
// import { getBillingSummary, getInvoices, getPaymentMethod } from "@/data-access/billing";

export default async function Page() {
  const session = await getSession();
  if (!session) redirect(routes.LOGIN);

  // const [user, billing, invoices, paymentMethod] = await Promise.all([
  // getUserSettings(+session.id),
  // getBillingSummary(+session.id),
  // getInvoices(+session.id),
  // getPaymentMethod(+session.id),
  // ]);

  const user = await getUserSettings(+session.id);
  if (!user) redirect(routes.LOGIN);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Postavke</h1>
          <p className="text-gray-600 mt-1">Upravljajte svojim računom i konfiguracijom.</p>
        </div>
      </div>

      <Tabs defaultValue="profil" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profil">Profil</TabsTrigger>
          <TabsTrigger value="sigurnost">Sigurnost</TabsTrigger>
          <TabsTrigger value="naplata">Naplata</TabsTrigger>
        </TabsList>

        <TabsContent value="profil">
          <ProfileTab
            userId={+session.id}
            initial={{
              name: user.name ?? "",
              email: user.email ?? "",
              phone: user.phone ?? "",
            }}
          />
        </TabsContent>

        <TabsContent value="sigurnost">
          <SecurityTab userId={+session.id} />
        </TabsContent>

        {/* <TabsContent value="naplata">
          <BillingTab
            userId={+session.id}
            summary={billing}
            invoices={invoices}
            paymentMethod={paymentMethod}
          />
        </TabsContent> */}
      </Tabs>
    </div>
  );
}
