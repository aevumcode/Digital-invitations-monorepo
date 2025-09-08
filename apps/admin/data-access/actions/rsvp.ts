"use server";

import * as yup from "yup";
import { prisma } from "@digital-inv/db";
import { randomBytes } from "crypto";
import { revalidatePath } from "next/cache";
import { routes } from "@/routes";

// ✅ shared server-side validation
const rsvpSchema = yup.object({
  publicSlug: yup.string().required(),
  firstName: yup.string().max(80).required(),
  lastName: yup.string().max(80).required(),
  email: yup.string().email().required(),
  phone: yup.string().max(40).nullable(),
  attending: yup.boolean().required(),
  adults: yup.number().min(0).max(20).required(),
  children: yup.number().min(0).max(20).required(),
  dietary: yup.string().max(200).nullable(),
  songRequest: yup.string().max(200).nullable(),
  message: yup.string().max(500).nullable(),
});

export type RsvpPayload = yup.InferType<typeof rsvpSchema>;

export async function submitRsvp(formData: FormData) {
  // Pull values safely from FormData
  const data: RsvpPayload = {
    publicSlug: String(formData.get("publicSlug") || ""),
    firstName: String(formData.get("firstName") || ""),
    lastName: String(formData.get("lastName") || ""),
    email: String(formData.get("email") || ""),
    phone: (formData.get("phone") || "") as string,
    attending: String(formData.get("attending") || "yes") === "yes",
    adults: Number(formData.get("adults") || 1),
    children: Number(formData.get("children") || 0),
    dietary: (formData.get("dietary") || "") as string,
    songRequest: (formData.get("songRequest") || "") as string,
    message: (formData.get("message") || "") as string,
  };

  // Validate on the server too
  const payload = await rsvpSchema.validate(data, { abortEarly: false });

  // Find project by the public slug from the URL the guest is on
  const project = await prisma.invitationProject.findUnique({
    where: { publicSlug: payload.publicSlug },
    select: { id: true },
  });

  if (!project) {
    return { ok: false, error: "This invitation is no longer available." };
  }

  // Reuse your existing schema: upsert an Invitee for this project (by email if present)
  // Then track the detailed RSVP in InvitationEvent.meta (JSON) so you keep all fields.
  const existing = payload.email
    ? await prisma.invitee.findFirst({
        where: { projectId: project.id, email: payload.email },
        select: { id: true },
      })
    : null;

  const token = randomBytes(6).toString("hex");

  const invitee = existing
    ? await prisma.invitee.update({
        where: { id: existing.id },
        data: {
          firstName: payload.firstName,
          lastName: payload.lastName,
          phone: payload.phone || null,
          rsvpStatus: payload.attending ? "ACCEPTED" : "DECLINED",
        },
        select: { id: true },
      })
    : await prisma.invitee.create({
        data: {
          projectId: project.id,
          firstName: payload.firstName,
          lastName: payload.lastName,
          email: payload.email,
          phone: payload.phone || null,
          token,
          invitationUrl: `/v/${payload.publicSlug}`,
          rsvpStatus: payload.attending ? "ACCEPTED" : "DECLINED",
        },
        select: { id: true },
      });

  // Store full RSVP detail as an InvitationEvent (meta JSON)
  await prisma.invitationEvent.create({
    data: {
      inviteeId: invitee.id,
      channel: "WEB",
      status: "SUBMITTED",
      meta: {
        type: "RSVP_SUBMISSION",
        attending: payload.attending,
        counts: { adults: payload.adults, children: payload.children },
        dietary: payload.dietary || null,
        songRequest: payload.songRequest || null,
        message: payload.message || null,
        submittedAt: new Date().toISOString(),
      },
    },
  });

  return { ok: true };
}
