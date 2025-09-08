"use client";

import * as React from "react";
import { useTransition, useState } from "react";
import * as yup from "yup";
import { useRouter } from "next/navigation";
import { submitRsvp } from "@/data-access/actions/rsvp";

const clientSchema = yup.object({
  firstName: yup.string().max(80).required("First name is required"),
  lastName: yup.string().max(80).required("Last name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup.string().max(40).nullable(),
  attending: yup.string().oneOf(["yes", "no"]).required(),
  adults: yup.number().min(0).max(20).required("Adults required"),
  children: yup.number().min(0).max(20).required("Children required"),
  dietary: yup.string().max(200).nullable(),
  songRequest: yup.string().max(200).nullable(),
  message: yup.string().max(500).nullable(),
});

type Props = { publicSlug: string };

export default function RsvpForm({ publicSlug }: Props) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [ok, setOk] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    attending: "yes",
    adults: 1,
    children: 0,
    dietary: "",
    songRequest: "",
    message: "",
  });

  function onChange<K extends keyof typeof form>(key: K, val: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr(null);
    setOk(false);

    try {
      await clientSchema.validate(form, { abortEarly: false });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      setErr(e?.errors?.[0] || "Please check the form.");
      return;
    }

    start(async () => {
      const fd = new FormData();
      fd.set("publicSlug", publicSlug);
      Object.entries(form).forEach(([k, v]) => fd.set(k, String(v)));

      const res = await submitRsvp(fd);
      if (!res.ok) {
        setErr(res.error || "Something went wrong. Please try again.");
        return;
      }

      // Optional optimistic flag; we redirect immediately after.
      setOk(true);

      router.push(`/v/${publicSlug}/thanks`);
    });
  }

  return (
    <section className="px-8 pb-12 pt-20">
      <h2
        className="mb-3 text-3xl text-center text-gray-800"
        style={{ fontFamily: "'Great Vibes', cursive" }}
      >
        Attendance
      </h2>

      <div className="mx-auto max-w-2xl rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        {ok && (
          <div className="mb-4 rounded-md bg-green-50 p-3 text-sm text-green-800">
            Thank you! Your RSVP has been recorded.
          </div>
        )}
        {err && <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-800">{err}</div>}

        <form onSubmit={onSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-1">
            <label className="mb-1 block text-sm text-gray-700">First name</label>
            <input
              className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-purple-400"
              value={form.firstName}
              onChange={(e) => onChange("firstName", e.target.value)}
              required
            />
          </div>

          <div className="sm:col-span-1">
            <label className="mb-1 block text-sm text-gray-700">Last name</label>
            <input
              className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-purple-400"
              value={form.lastName}
              onChange={(e) => onChange("lastName", e.target.value)}
              required
            />
          </div>

          <div className="sm:col-span-1">
            <label className="mb-1 block text-sm text-gray-700">Email</label>
            <input
              type="email"
              className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-purple-400"
              value={form.email}
              onChange={(e) => onChange("email", e.target.value)}
              required
            />
          </div>

          <div className="sm:col-span-1">
            <label className="mb-1 block text-sm text-gray-700">Phone (optional)</label>
            <input
              className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-purple-400"
              value={form.phone}
              onChange={(e) => onChange("phone", e.target.value)}
              placeholder="+385..."
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm text-gray-700">Will you attend?</label>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="attending"
                  checked={form.attending === "yes"}
                  onChange={() => onChange("attending", "yes")}
                />
                Yes, we will be there
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="attending"
                  checked={form.attending === "no"}
                  onChange={() => onChange("attending", "no")}
                />
                No, sadly can’t make it
              </label>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm text-gray-700">Adults</label>
            <input
              type="number"
              min={0}
              className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-purple-400"
              value={form.adults}
              onChange={(e) => onChange("adults", Number(e.target.value))}
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-gray-700">Children</label>
            <input
              type="number"
              min={0}
              className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-purple-400"
              value={form.children}
              onChange={(e) => onChange("children", Number(e.target.value))}
              required
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm text-gray-700">
              Dietary requirements (optional)
            </label>
            <input
              className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-purple-400"
              value={form.dietary}
              onChange={(e) => onChange("dietary", e.target.value)}
              placeholder="Vegetarian, gluten-free, allergies…"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm text-gray-700">Song request (optional)</label>
            <input
              className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-purple-400"
              value={form.songRequest}
              onChange={(e) => onChange("songRequest", e.target.value)}
              placeholder="We’ll ask the DJ 🎶"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm text-gray-700">Message (optional)</label>
            <textarea
              rows={4}
              className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-purple-400"
              value={form.message}
              onChange={(e) => onChange("message", e.target.value)}
              placeholder="Anything else we should know?"
            />
          </div>

          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={pending}
              className="inline-flex items-center rounded-md bg-purple-600 px-4 py-2 text-white shadow transition hover:bg-purple-700 disabled:opacity-60"
            >
              {pending ? "Submitting…" : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
