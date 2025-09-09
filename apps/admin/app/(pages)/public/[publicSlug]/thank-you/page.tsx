// app/v/[publicSlug]/thanks/page.tsx
import Link from "next/link";

export default async function ThanksPage({ params }: { params: Promise<{ publicSlug: string }> }) {
  const { publicSlug } = await params;

  return (
    <main className="min-h-screen w-full  bg-gradient-to-b from-purple-50 to-white">
      <section className="mx-auto flex max-w-3xl flex-col items-center px-6 py-26 md:py-40 text-center">
        <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-purple-600 text-white shadow-lg">
          <span className="text-2xl">💌</span>
        </div>

        <h1 className="text-3xl font-semibold text-gray-900 md:text-4xl">
          Hvala na potvrdi dolaska! 💜
        </h1>
        <p className="mt-4 max-w-2xl text-balance text-gray-700">
          Vaš RSVP je uspješno zabilježen. Jedva čekamo proslaviti s vama na događaju! Ako trebate
          promijeniti informacije ili imate pitanja, javite nam se u bilo kojem trenutku.
        </p>

        <div className="mt-8 grid w-full gap-3 sm:grid-cols-2">
          <Link
            href={`/v/${publicSlug}`}
            className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            ← Povratak na pozivnicu
          </Link>
          <a
            href="https://digital-invitations.example" // optional: your homepage
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-purple-700"
          >
            Posjetite Digital Invitations
          </a>
        </div>

        <div className="mt-10 w-full rounded-2xl border border-purple-100 bg-purple-50 px-6 py-5 text-left">
          <p className="text-sm text-purple-900">
            Hvala što koristite <span className="font-semibold">Digital Invitations</span> — brze,
            elegantne i dijeljive digitalne pozivnice. Želimo vam nezaboravnu proslavu! ✨
          </p>
        </div>
      </section>
    </main>
  );
}
