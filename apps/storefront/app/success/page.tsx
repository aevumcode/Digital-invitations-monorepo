export default function SuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6 py-12">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-md p-10 text-center border">
        {/* Green Check Icon */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
          <svg
            className="h-12 w-12 text-green-600"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold mb-3 text-gray-800">Hvala na kupnji!</h1>
        <p className="text-gray-600 mb-6">Vaša narudžba je uspješno obrađena.</p>

        {/* Admin Info */}
        <p className="text-gray-700 mb-8">
          Možete se sada odmah prijaviti u <strong>Admin Panel</strong> koristeći isti račun (e-mail
          i lozinku) s kojim ste obavili kupnju.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/shop"
            className="px-6 py-3 rounded-lg bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300 transition"
          >
            Natrag u Shop
          </a>
          <a
            href="/admin"
            className="px-6 py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition"
          >
            Idi u Admin Panel
          </a>
        </div>
      </div>
    </div>
  );
}
