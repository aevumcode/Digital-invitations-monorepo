import { notFound } from "next/navigation";
import { getTemplateById } from "@/constants/template-data";
import InvitationMain from "@/components/template-pages/invitation-main";
import { checkUsage, getUserTemplateById } from "@/data-access/user-template";
import PublicViewLocal from "@/components/public-view-local";

function LimitExceeded() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-10 bg-gray-50">
      <div className="max-w-md bg-white shadow-lg rounded-xl p-8 text-center border">
        <h1 className="text-2xl font-semibold text-red-600 mb-4">Ograničenje prekoračeno</h1>

        <p className="text-gray-700 mb-6">
          Autor ove pozivnice je dosegnuo maksimalan broj pregleda uključen u njegov paket.
        </p>

        <p className="text-sm text-gray-500">
          Ako ste autor ove pozivnice, prijavite se na svoj račun kako biste nadogradili paket ili
          ponovno omogućili pristup.
        </p>
      </div>
    </div>
  );
}

export default async function LivePage({ params }: { params: Promise<{ publicSlug: string }> }) {
  const { publicSlug } = await params;

  const userTemplate = await getUserTemplateById(publicSlug);
  if (!userTemplate) return notFound();
  if (!userTemplate.isActive) return notFound();

  const usage = await checkUsage(publicSlug);
  if (!usage || usage.isExceeded) return <LimitExceeded />;

  const meta = getTemplateById(userTemplate.templateId);
  if (!meta) return notFound();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const raw = (userTemplate.customData as any) ?? {};
  const data = raw?.fields ?? raw;

  const cfg = meta.buildConfig({
    ...data,
    userTemplateKey: userTemplate.id,
    mode: "public",
    usage,
  });

  return (
    <>
      {/* FE only: radi localStorage check + server action call */}
      <PublicViewLocal publicSlug={publicSlug} />

      <InvitationMain config={cfg} />
    </>
  );
}
