"use client";

import * as React from "react";
import { useTransition, useState, useMemo } from "react";
import * as yup from "yup";
import { useRouter } from "next/navigation";
import { createGuestAction as submitRsvp } from "@/data-access/actions/guest";

// Small stepper input
function Stepper({
  value,
  onChange,
  min = 0,
  max = 20,
  disabled,
  label,
  id,
}: {
  value: number;
  onChange: (n: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
  label?: string;
  id?: string;
}) {
  const dec = () => onChange(Math.max(min, value - 1));
  const inc = () => onChange(Math.min(max, value + 1));
  return (
    <div className="flex items-stretch gap-2">
      <button
        type="button"
        onClick={dec}
        disabled={disabled || value <= min}
        className="rounded-md border px-3 py-2 text-sm disabled:opacity-50"
        aria-label={`Decrease ${label ?? id ?? "value"}`}
      >
        –
      </button>
      <input
        id={id}
        inputMode="numeric"
        className="w-20 rounded-md border px-3 py-2 text-center"
        value={value}
        onChange={(e) => {
          const n = Number(e.target.value);
          onChange(Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : value);
        }}
        disabled={disabled}
      />
      <button
        type="button"
        onClick={inc}
        disabled={disabled || value >= max}
        className="rounded-md border px-3 py-2 text-sm disabled:opacity-50"
        aria-label={`Increase ${label ?? id ?? "value"}`}
      >
        +
      </button>
    </div>
  );
}

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

type Props = { publicSlug: string; mode?: "preview" | "live" };

export default function RsvpForm({ publicSlug, mode }: Props) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [ok, setOk] = useState(false);
  const [errSummary, setErrSummary] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    attending: "yes" as "yes" | "no",
    adults: 1,
    children: 0,
    dietary: "",
    songRequest: "",
    message: "",
  });

  // Auto-zero guests if not attending
  React.useEffect(() => {
    if (form.attending === "no") {
      setForm((f) => ({ ...f, adults: 0, children: 0 }));
    } else if (form.attending === "yes" && form.adults === 0) {
      setForm((f) => ({ ...f, adults: 1 })); // sensible default
    }
  }, [form.attending]);

  function onChange<K extends keyof typeof form>(key: K, val: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: val }));
    setFieldErrors((fe) => ({ ...fe, [String(key)]: "" }));
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrSummary(null);
    setFieldErrors({});

    try {
      await clientSchema.validate(form, { abortEarly: false });
    } catch (e: unknown) {
      const y = e as yup.ValidationError;
      const fe: Record<string, string> = {};
      y.inner?.forEach((err) => {
        if (err.path && !fe[err.path]) fe[err.path] = err.message;
      });
      setFieldErrors(fe);
      setErrSummary(y.errors?.[0] ?? "Please check the form.");
      return;
    }

    start(async () => {
      const payload = {
        userTemplateId: publicSlug,
        firstName: form.firstName,
        lastName: form.lastName,
        isAttending: form.attending === "yes",
        userId: undefined,
        date: undefined,
        note: form.message,
        reservationId: undefined,
      };

      const res = await submitRsvp(payload);
      if (!res.ok) {
        setErrSummary(res.error || "Something went wrong. Please try again.");
        return;
      }
      setOk(true);
      router.push(`/public/${publicSlug}/thank-you`);
    });
  }

  const countersDisabled = form.attending === "no";

  // Compute a tiny total preview
  const totalGuests = useMemo(
    () => (form.attending === "yes" ? form.adults + form.children : 0),
    [form.attending, form.adults, form.children],
  );

  return (
    <section className="md:px-8 pb-12 pt-16">
      <div className="mx-auto w-full max-w-2xl rounded-xl bg-white/60 p-6 shadow-sm ring-1 ring-black/5">
        {/* <h2 className="mb-6 text-center text-2xl font-semibold">Attendance</h2> */}
        {mode === "preview" && (
          <div className="mb-4 rounded-md bg-yellow-50 p-3 text-sm text-red-800">
            Ovo je pregled RSVP forme. Da biste testirali slanje, objavite pozivnicu i otvorite je u
            live načinu
          </div>
        )}

        {ok && (
          <div className="mb-4 rounded-md bg-green-50 p-3 text-sm text-green-800">
            Thank you! Your RSVP has been recorded.
          </div>
        )}
        {errSummary && (
          <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-800">{errSummary}</div>
        )}

        <form onSubmit={onSubmit} noValidate className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* names */}
          <div className="sm:col-span-1">
            <label htmlFor="firstName" className="mb-1 block text-sm text-gray-700">
              First name
            </label>
            <input
              id="firstName"
              autoComplete="given-name"
              className={`w-full rounded-md border px-3 py-2 outline-none focus:ring-2 ${
                fieldErrors.firstName
                  ? "border-red-400 focus:ring-red-400"
                  : "border-gray-300 focus:ring-purple-400"
              }`}
              value={form.firstName}
              onChange={(e) => onChange("firstName", e.target.value)}
              required
              disabled={mode === "preview"}
            />
            {fieldErrors.firstName && (
              <p className="mt-1 text-xs text-red-600">{fieldErrors.firstName}</p>
            )}
          </div>

          <div className="sm:col-span-1">
            <label htmlFor="lastName" className="mb-1 block text-sm text-gray-700">
              Last name
            </label>
            <input
              id="lastName"
              autoComplete="family-name"
              className={`w-full rounded-md border px-3 py-2 outline-none focus:ring-2 ${
                fieldErrors.lastName
                  ? "border-red-400 focus:ring-red-400"
                  : "border-gray-300 focus:ring-purple-400"
              }`}
              value={form.lastName}
              onChange={(e) => onChange("lastName", e.target.value)}
              required
              disabled={mode === "preview"}
            />
            {fieldErrors.lastName && (
              <p className="mt-1 text-xs text-red-600">{fieldErrors.lastName}</p>
            )}
          </div>

          {/* contact */}
          <div className="sm:col-span-1">
            <label htmlFor="email" className="mb-1 block text-sm text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              className={`w-full rounded-md border px-3 py-2 outline-none focus:ring-2 ${
                fieldErrors.email
                  ? "border-red-400 focus:ring-red-400"
                  : "border-gray-300 focus:ring-purple-400"
              }`}
              value={form.email}
              onChange={(e) => onChange("email", e.target.value)}
              required
              disabled={mode === "preview"}
            />
            {fieldErrors.email && <p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p>}
          </div>

          <div className="sm:col-span-1">
            <label htmlFor="phone" className="mb-1 block text-sm text-gray-700">
              Phone (optional)
            </label>
            <input
              id="phone"
              inputMode="tel"
              autoComplete="tel"
              placeholder="+385…"
              className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-purple-400"
              value={form.phone}
              onChange={(e) => onChange("phone", e.target.value)}
              disabled={mode === "preview"}
            />
          </div>

          {/* Attendance */}
          <div className="sm:col-span-2">
            <fieldset>
              <legend className="mb-2 block text-sm text-gray-700">Will you attend?</legend>
              <div className="flex flex-wrap gap-4">
                <label className="inline-flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="attending"
                    checked={form.attending === "yes"}
                    onChange={() => onChange("attending", "yes")}
                    disabled={mode === "preview"}
                  />
                  Yes, we will be there
                </label>
                <label className="inline-flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="attending"
                    checked={form.attending === "no"}
                    onChange={() => onChange("attending", "no")}
                    disabled={mode === "preview"}
                  />
                  No, sadly can’t make it
                </label>
              </div>
            </fieldset>
          </div>

          {/* Guests */}
          <div className="sm:col-span-1">
            <label htmlFor="adults" className="mb-1 block text-sm text-gray-700">
              Adults
            </label>
            <Stepper
              id="adults"
              label="Adults"
              value={form.adults}
              onChange={(n) => onChange("adults", n)}
              min={0}
              max={20}
              disabled={countersDisabled}
            />
            {fieldErrors.adults && (
              <p className="mt-1 text-xs text-red-600">{fieldErrors.adults}</p>
            )}
          </div>

          <div className="sm:col-span-1">
            <label htmlFor="children" className="mb-1 block text-sm text-gray-700">
              Children
            </label>
            <Stepper
              id="children"
              label="Children"
              value={form.children}
              onChange={(n) => onChange("children", n)}
              min={0}
              max={20}
              disabled={countersDisabled}
            />
            {fieldErrors.children && (
              <p className="mt-1 text-xs text-red-600">{fieldErrors.children}</p>
            )}
          </div>

          {/* Dietary */}
          <div className="sm:col-span-2">
            <label htmlFor="dietary" className="mb-1 block text-sm text-gray-700">
              Dietary requirements (optional)
            </label>
            <input
              id="dietary"
              className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-purple-400"
              value={form.dietary}
              onChange={(e) => onChange("dietary", e.target.value)}
              placeholder="Vegetarian, gluten-free, allergies…"
              disabled={mode === "preview"}
            />
          </div>

          {/* Song */}
          <div className="sm:col-span-2">
            <label htmlFor="songRequest" className="mb-1 block text-sm text-gray-700">
              Song request (optional)
            </label>
            <input
              id="songRequest"
              className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-purple-400"
              value={form.songRequest}
              onChange={(e) => onChange("songRequest", e.target.value)}
              placeholder="We’ll ask the DJ 🎶"
              disabled={mode === "preview"}
            />
          </div>

          {/* Message */}
          <div className="sm:col-span-2">
            <label htmlFor="message" className="mb-1 block text-sm text-gray-700">
              Message (optional)
            </label>
            <textarea
              id="message"
              rows={4}
              className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-purple-400"
              value={form.message}
              onChange={(e) => onChange("message", e.target.value)}
              placeholder="Anything else we should know?"
              disabled={mode === "preview"}
            />
          </div>

          {/* Footer / totals */}
          <div className="sm:col-span-2 flex items-center justify-between text-sm text-gray-600">
            <span>
              Total guests: <strong>{totalGuests}</strong>
            </span>
            <button
              type="submit"
              disabled={pending || mode === "preview"}
              className="inline-flex items-center gap-2 rounded-md bg-purple-600 px-4 py-2 text-white shadow transition hover:bg-purple-700 disabled:opacity-60"
            >
              {pending && (
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="none"
                    opacity="0.25"
                  />
                  <path
                    d="M22 12a10 10 0 0 1-10 10"
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="none"
                  />
                </svg>
              )}
              {pending ? "Submitting…" : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
