"use server";

import { cookies } from "next/headers";
import { prisma } from "@digital-inv/db";
import { verifyPassword, hashPassword, createToken } from "@/lib/auth";
import * as Yup from "yup";
import { routes } from "@/routes";
import { revalidatePath } from "next/cache";
// --- SCHEMA (Yup) ---
const changePasswordSchema = Yup.object({
  userId: Yup.number().required(),
  currentPassword: Yup.string().required("Current password is required"),
  newPassword: Yup.string()
    .required("New password is required")
    .min(8, "Password must be at least 8 characters"),
  // po želji pojačaj politiku:
  // .matches(/[A-Z]/, "Add at least one uppercase letter")
  // .matches(/[0-9]/, "Add at least one number")
  confirmNewPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Passwords do not match")
    .required("Please confirm your new password"),
});

interface ChangePasswordRequest {
  userId: number;
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export async function updateProfileAction(input: {
  userId: number;
  name: string;
  email: string;
  phone: string;
}) {
  await prisma.user.update({
    where: { id: input.userId },
    data: {
      name: input.name,
      email: input.email,
      phone: input.phone,
    },
  });
  revalidatePath(routes.SETTINGS);
}

export async function changePasswordAction(payload: ChangePasswordRequest) {
  try {
    // 1) Validacija inputa
    await changePasswordSchema.validate(payload, { abortEarly: false });

    const { userId, currentPassword, newPassword } = payload;

    // 2) Dohvati usera
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, password: true },
    });
    if (!user) {
      throw new Error("User not found");
    }
    if (!user.password) {
      throw new Error("User has no password set");
    }

    // 3) Provjeri current lozinku
    const ok = await verifyPassword(currentPassword, user.password);
    if (!ok) {
      throw new Error("Invalid current password");
    }

    // 4) Spriječi istu lozinku
    const sameAsOld = await verifyPassword(newPassword, user.password);
    if (sameAsOld) {
      throw new Error("New password must be different from the current password");
    }

    // 5) Hash + update
    const nextHash = await hashPassword(newPassword);
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: nextHash,
        // (opcionalno) passwordUpdatedAt: new Date(),
      },
    });

    // 6) (Opcionalno) rotiraj session token kao kod login/register
    const token = await createToken(user.id, user.email);
    (await cookies()).set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    // isti pattern kao login/register — vrati redirect s FE-a ili samo success
    return { ok: true as const };
  } catch (err) {
    if (err instanceof Yup.ValidationError) {
      const field = err.inner[0]?.path || "form";
      const message = err.errors[0];
      throw new Error(JSON.stringify({ field, message }));
    }
    throw err;
  }
}
