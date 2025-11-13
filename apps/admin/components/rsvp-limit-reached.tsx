"use client";

export function RsvpLimitReached() {
  return (
    <div className="text-center py-16 px-6">
      <h2 className="text-2xl font-bold text-red-600 mb-4">RSVP Limit Reached</h2>

      <p className="text-gray-800 mb-8 max-w-md mx-auto">
        The host has reached the maximum number of allowed RSVPs for this invitation. Unfortunately,
        no more submissions can be accepted.
      </p>

      <a
        href="/storefront"
        className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg shadow hover:bg-purple-700 transition"
      >
        Buy More Invitations
      </a>
    </div>
  );
}
